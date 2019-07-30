import {CRS, imageOverlay, LatLngBoundsLiteral, map, Map} from 'leaflet';

class WorldMap {

    private readonly popup: JQuery;
    private readonly map: Map;

    constructor() {
        this.popup = $('<div class="world-map"><div class="leaflet"></div></div>');
        $(document.body).append(this.popup);

        const bounds: LatLngBoundsLiteral = [[0, 0], [3508, 4961]];
        this.map = map(this.popup.find('.leaflet').get(0), {
            crs: CRS.Simple,
            minZoom: -2,
            maxZoom: 2,
            zoomControl: false,
            maxBoundsViscosity: 1.0,
        });
        imageOverlay('Tookania.png', bounds).addTo(this.map);
        this.map.setMaxBounds(bounds);
        this.map.fitBounds(bounds);

        $(document).on('keyup', (e) => {
            if (e.which === 27 && this.popup.hasClass('opened'))
                this.toggle();
        });

    }

    public toggle() {
        this.popup.toggleClass('opened');
        $(document.body).toggleClass('no-scroll');
    }
}

const worldMap = new WorldMap();

$('.open-map').on('click', function () {
    worldMap.toggle()
});
