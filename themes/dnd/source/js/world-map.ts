import {CRS, map, Map, tileLayer} from 'leaflet';

class WorldMap {

    private readonly popup: JQuery;
    public readonly map: Map;

    constructor() {
        this.popup = $('<div class="world-map"><div class="leaflet"></div></div>');
        $(document.body).append(this.popup);

        const layer = tileLayer('/the-great-awakening/tiles/{z}/{x}/{y}.png', {
            minZoom: -2,
            maxZoom: 2,
        });
        this.map = map(
            this.popup.find('.leaflet').get(0),
            {
                crs: CRS.Simple,
                center: [-1727, 2556],
                zoom: -2,
                zoomControl: false,
                layers: [layer],
            },
        );

        $(document).on('keyup', (e) => {
            if (e.which === 27 && this.isOpened)
                WorldMap.toggle();
        });

        $(window)
            .on('hashchange', this.updateMapFromHash.bind(this))
            .trigger('hashchange');
    }

    private updateMapFromHash() {
        const shouldBeOpened = location.hash.startsWith('#world-map');
        if (shouldBeOpened && !this.isOpened)
            this.open();
        else if (!shouldBeOpened && this.isOpened)
            this.close();
        const args = location.hash
            .replace('#world-map', '')
            .split('&')
            .map(arg => {
                    const args = arg.split('=');
                    return {
                        name: args[0],
                        value: args[1],
                    }
                },
            );
        args.forEach(arg => {
            if (arg.name === 'z')
                this.map.setZoom(parseInt(arg.value));
        })

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
