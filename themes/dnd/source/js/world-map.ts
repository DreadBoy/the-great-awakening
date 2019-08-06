import {
    control,
    CRS,
    icon,
    LatLng as _LatLng,
    LatLngTuple,
    layerGroup,
    LeafletMouseEvent,
    map,
    Map,
    marker,
    tileLayer,
} from 'leaflet';

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
        const tpCircle = (pos: LatLngTuple) =>
            marker(pos, {
                icon: icon({
                    iconUrl: '/the-great-awakening/tiles/icons/maze-cornea-blue.png',
                    iconSize: [28, 28],
                }),
            });
        const blockedTeleportationCircle = (pos: LatLngTuple) =>
            marker(pos, {
                icon: icon({
                    iconUrl: '/the-great-awakening/tiles/icons/maze-cornea-red.png',
                    iconSize: [28, 28],
                }),
            });
        const barrel = (pos: LatLngTuple, quantity: number, quality: number, price: number, buyer: String) => {
            const type = quality < 10 ? 'common' : quality < 15 ? 'uncommon' : quality < 20 ? 'rare' : quality < 25 ? 'legendary': 'epic';

            return marker(pos, {
                icon: icon({
                    iconUrl: `/the-great-awakening/tiles/icons/barrel-${type}.png`,
                    iconSize: [32, 32]
                })
            }).bindPopup(`
                        <div>${buyer}</div>
                        <div>Quantity: ${quantity} per week</div>
                        <div>Quality: ${quality-5} - ${quality+5}</div>
                        <div>Price: ${price}gp</div>`)
        };
        const circles = layerGroup([
            tpCircle([-2289, 2508]),
            tpCircle([-1498, 3479]),
            tpCircle([-1822, 1928]),//aa
            tpCircle([-2065, 2248]),
            tpCircle([-2072, 3277]),
            tpCircle([-2763, 2209]),
            tpCircle([-1945, 2590]),
            tpCircle([-1547, 2114]),
            tpCircle([-1618, 2034]),
            tpCircle([-1986, 2929]),
            tpCircle([-1480, 1875]),
            blockedTeleportationCircle([-3184, 2838]),
            blockedTeleportationCircle([-1692, 3681]),
        ]);

        const barrels = layerGroup([
            barrel([-1978, 2935], 10, 16, 7, 'Broken Candle Inn'),
            barrel([-1800, 3006], 6, 16, 8, 'Old Crossing Inn'),
            barrel([-2407, 3047], 2, 10, 3, 'Silverpine Express'),
            barrel([-2407, 3079], 5, 10, 3, 'Silverpine Turbo'),
        ]);

        const hash = this.readHash();
        this.map = map(
            this.popup.find('.leaflet').get(0),
            {
                crs: CRS.Simple,
                ...hash,
                zoomControl: false,
                layers: [tiles, circles],
            },
        );
        control.layers(undefined, {'TP circles': circles, 'Barrels': barrels}).addTo(this.map);

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

        this.map.on('click ', e => {
            const {lat, lng} = (e as LeafletMouseEvent).latlng;
            console.log('You clicked the map at latitude: ' + lat + ' and longitude: ' + lng);
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
