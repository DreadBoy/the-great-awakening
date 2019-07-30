import $ from 'jquery';
import './world-map';

class Awakening {

    private readonly overlay: HTMLElement;

    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('image-preview');
        this.overlay.setAttribute('image-preview', '');
        document.body.append(this.overlay);
    }

    public toggleImage(src?: string, alt?: string) {
        if (this.overlay.classList.contains('opened')) {
            this.closeImage();
        } else {
            this.overlay.innerHTML = `<img src='${src}' alt='${alt}' image-preview>`;
            this.overlay.classList.add('opened');
        }
    }

    public closeImage() {
        this.overlay.classList.remove('opened');
    }

}


declare const awakening: Awakening;
(window as any).awakening = new Awakening();

$('.img-center.resizable').on('click', function () {
    const image = this as HTMLImageElement;
    awakening.toggleImage(image.src, image.alt);
});
$('.image-preview').on('click', function () {
    awakening.toggleImage();
});
