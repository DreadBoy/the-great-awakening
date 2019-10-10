"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var leaflet_1 = require("leaflet");
var LatLng = /** @class */ (function (_super) {
    __extends(LatLng, _super);
    function LatLng() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LatLng.toUrl = function (latLng) {
        return Math.floor(latLng.lat) + "," + Math.floor(latLng.lng);
    };
    LatLng.fromUrl = function (url) {
        var _a = url.split(',').map(function (n) { return parseInt(n); }), lat = _a[0], lng = _a[1];
        return new LatLng(lat, lng);
    };
    return LatLng;
}(leaflet_1.LatLng));
var WorldMap = /** @class */ (function () {
    function WorldMap() {
        var _this = this;
        this.popup = $('<div class="world-map"><div class="leaflet"></div></div>');
        $(document.body).append(this.popup);
        var tiles = leaflet_1.tileLayer('/the-great-awakening/tiles/{z}/{x}/{y}.png', {
            minZoom: -2,
            maxZoom: 2,
        });
        var tpCircle = function (pos) {
            return leaflet_1.marker(pos, {
                icon: leaflet_1.icon({
                    iconUrl: '/the-great-awakening/tiles/icons/maze-cornea-blue.png',
                    iconSize: [28, 28],
                }),
            });
        };
        var blockedTeleportationCircle = function (pos) {
            return leaflet_1.marker(pos, {
                icon: leaflet_1.icon({
                    iconUrl: '/the-great-awakening/tiles/icons/maze-cornea-red.png',
                    iconSize: [28, 28],
                }),
            });
        };
        var barrel = function (pos, quantity, quality, price, buyer) {
            var type = quality < 10 ? 'common' : quality < 15 ? 'uncommon' : quality < 20 ? 'rare' : quality < 25 ? 'legendary' : 'epic';
            return leaflet_1.marker(pos, {
                icon: leaflet_1.icon({
                    iconUrl: "/the-great-awakening/tiles/icons/barrel-" + type + ".png",
                    iconSize: [32, 32]
                })
            }).bindPopup("\n                        <div>" + buyer + "</div>\n                        <div>Quantity: " + quantity + " per week</div>\n                        <div>Quality: " + (quality - 5) + " - " + (quality + 5) + "</div>\n                        <div>Price: " + price + "gp</div>");
        };
        var circles = leaflet_1.layerGroup([
            tpCircle([-2289, 2508]),
            tpCircle([-1498, 3479]),
            tpCircle([-1822, 1928]),
            tpCircle([-2065, 2248]),
            tpCircle([-2072, 3277]),
            tpCircle([-2763, 2209]),
            tpCircle([-1945, 2590]),
            tpCircle([-1547, 2114]),
            tpCircle([-1618, 2034]),
            tpCircle([-1986, 2929]),
            tpCircle([-1480, 1875]),
            tpCircle([-2403, 3069]),
            blockedTeleportationCircle([-3184, 2838]),
            blockedTeleportationCircle([-1692, 3681]),
        ]);
        var barrels = leaflet_1.layerGroup([
            barrel([-1978, 2935], 10, 16, 7, 'Broken Candle Inn'),
            barrel([-1800, 3006], 6, 16, 8, 'Old Crossing Inn'),
            barrel([-2407, 3047], 2, 10, 3, 'Silverpine Express'),
            barrel([-2407, 3079], 5, 10, 3, 'Silverpine Turbo'),
        ]);
        var hash = this.readHash();
        this.map = leaflet_1.map(this.popup.find('.leaflet').get(0), __assign(__assign({ crs: leaflet_1.CRS.Simple }, hash), { zoomControl: false, layers: [tiles, circles] }));
        leaflet_1.control.layers(undefined, { 'TP circles': circles, 'Barrels': barrels }).addTo(this.map);
        $(document).on('keyup', function (e) {
            if (e.which === 27 && _this.isOpened)
                WorldMap.toggle();
        });
        this.map.on('zoomend', function () {
            _this.updateHashFromMap();
        });
        this.map.on('moveend ', function () {
            _this.updateHashFromMap();
        });
        this.map.on('click ', function (e) {
            var _a = e.latlng, lat = _a.lat, lng = _a.lng;
            console.log('You clicked the map at latitude: ' + lat + ' and longitude: ' + lng);
        });
        $(window)
            .on('hashchange', this.updateMapFromHash.bind(this))
            .trigger('hashchange');
        this.updateHashFromMap();
    }
    WorldMap.prototype.updateMapFromHash = function () {
        var shouldBeOpened = location.hash.startsWith('#world-map');
        if (shouldBeOpened && !this.isOpened)
            this.open();
        else if (!shouldBeOpened && this.isOpened)
            this.close();
        var hash = this.readHash();
        this.map.setZoom(hash.zoom);
        this.map.panTo(hash.center);
    };
    WorldMap.prototype.readHash = function () {
        var ret = {
            zoom: 0,
            center: new LatLng(-2005, 2593),
        };
        location.hash
            .replace('#world-map?', '')
            .replace('#world-map', '')
            .split('&')
            .map(function (arg) {
            var args = arg.split('=');
            return {
                name: args[0],
                value: args[1],
            };
        })
            .forEach(function (arg) {
            if (arg.name === 'z')
                ret.zoom = parseInt(arg.value);
            if (arg.name === 'p')
                ret.center = LatLng.fromUrl(arg.value);
        });
        return ret;
    };
    WorldMap.prototype.updateHashFromMap = function () {
        var shouldBeOpened = location.hash.startsWith('#world-map');
        if (!shouldBeOpened)
            return;
        history.replaceState(null, '', document.location.pathname + "#world-map?z=" + this.map.getZoom() + "&p=" + LatLng.toUrl(this.map.getCenter()));
    };
    Object.defineProperty(WorldMap.prototype, "isOpened", {
        get: function () {
            return this.popup.hasClass('opened');
        },
        enumerable: true,
        configurable: true
    });
    WorldMap.toggle = function () {
        if (location.hash.startsWith('#world-map'))
            location.hash = '';
        else
            location.hash = '#world-map';
    };
    WorldMap.prototype.open = function () {
        this.popup.addClass('opened');
        $(document.body).addClass('no-scroll');
    };
    WorldMap.prototype.close = function () {
        this.popup.removeClass('opened');
        $(document.body).removeClass('no-scroll');
    };
    return WorldMap;
}());
window.worldMap = new WorldMap();
$('.open-map').on('click', function () {
    WorldMap.toggle();
});
