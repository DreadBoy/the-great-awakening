"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jquery_1 = require("jquery");
require("./world-map");
var Awakening = /** @class */ (function () {
    function Awakening() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('image-preview');
        this.overlay.setAttribute('image-preview', '');
        document.body.append(this.overlay);
    }
    Awakening.prototype.toggleImage = function (src, alt) {
        if (this.overlay.classList.contains('opened')) {
            this.closeImage();
        }
        else {
            this.overlay.innerHTML = "<img src='" + src + "' alt='" + alt + "' image-preview>";
            this.overlay.classList.add('opened');
        }
    };
    Awakening.prototype.closeImage = function () {
        this.overlay.classList.remove('opened');
    };
    return Awakening;
}());
window.awakening = new Awakening();
jquery_1.default('.img-center.resizable').on('click', function () {
    var image = this;
    awakening.toggleImage(image.src, image.alt);
});
jquery_1.default('.image-preview').on('click', function () {
    awakening.toggleImage();
});
