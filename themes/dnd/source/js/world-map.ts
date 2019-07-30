interface JQuery {
    worldMap(): WorldMap;
}

class WorldMap {

    private readonly element: JQuery;

    constructor() {
        this.element = $('<div class="world-map"><div class="leaflet"></div></div>');
        $(document.body).append(this.element);
    }

    public toggle() {
        this.element.toggleClass('opened');
        $(document.body).toggleClass('no-scroll');
    }
}

const worldMap = new WorldMap();

$('.open-map').on('click', function () {
    worldMap.toggle()
});
