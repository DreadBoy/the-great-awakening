import {CRS, map, Map, tileLayer, LatLng as _LatLng} from 'leaflet';

class LatLng extends _LatLng {
    public static toUrl(latLng: _LatLng): string {
        return `${Math.floor(latLng.lat)},${Math.floor(latLng.lng)}`
    }

    public static fromUrl(url: string): LatLng {
        const [lat, lng] = url.split(',').map(n => parseInt(n));
        return new LatLng(lat, lng);
    }
}

class WorldMap {

    private readonly popup: JQuery;
    public readonly map: Map;

    constructor() {
        this.popup = $('<div class="world-map"><div class="leaflet"></div></div>');
        $(document.body).append(this.popup);

        const tiles = tileLayer('/the-great-awakening/tiles/{z}/{x}/{y}.png', {
            minZoom: -2,
            maxZoom: 2,
        });
        const hash = this.readHash();
        this.map = map(
            this.popup.find('.leaflet').get(0),
            {
                crs: CRS.Simple,
                ...hash,
                zoomControl: false,
                layers: [tiles],
            },
        );

        $(document).on('keyup', (e) => {
            if (e.which === 27 && this.isOpened)
                WorldMap.toggle();
        });

        this.map.on('zoomend', () => {
            this.updateHashFromMap();
        });

        this.map.on('moveend ', () => {
            this.updateHashFromMap();
        });

        $(window)
            .on('hashchange', this.updateMapFromHash.bind(this))
            .trigger('hashchange');
        this.updateHashFromMap();
    }

    private updateMapFromHash() {
        const shouldBeOpened = location.hash.startsWith('#world-map');

        if (shouldBeOpened && !this.isOpened)
            this.open();
        else if (!shouldBeOpened && this.isOpened)
            this.close();

        const hash = this.readHash();
        this.map.setZoom(hash.zoom);
        this.map.panTo(hash.center);

    }

    private readHash() {
        const ret = {
            zoom: 0,
            center: new LatLng(-2005, 2593),
        };
        location.hash
            .replace('#world-map?', '')
            .replace('#world-map', '')
            .split('&')
            .map(arg => {
                    const args = arg.split('=');
                    return {
                        name: args[0],
                        value: args[1],
                    }
                },
            )
            .forEach(arg => {
                if (arg.name === 'z')
                    ret.zoom = parseInt(arg.value);
                if (arg.name === 'p')
                    ret.center = LatLng.fromUrl(arg.value);
            });
        return ret;
    }

    private updateHashFromMap() {
        const shouldBeOpened = location.hash.startsWith('#world-map');
        if (!shouldBeOpened)
            return;
        history.replaceState(null, '', `${document.location.pathname}#world-map?z=${this.map.getZoom()}&p=${LatLng.toUrl(this.map.getCenter())}`);
    }

    private get isOpened() {
        return this.popup.hasClass('opened');
    }

    public static toggle() {
        if (location.hash.startsWith('#world-map'))
            location.hash = '';
        else
            location.hash = '#world-map';
    }

    private open() {
        this.popup.addClass('opened');
        $(document.body).addClass('no-scroll');
    }

    private close() {
        this.popup.removeClass('opened');
        $(document.body).removeClass('no-scroll');
    }
}

(window as any).worldMap = new WorldMap();

$('.open-map').on('click', function () {
    WorldMap.toggle()
});
