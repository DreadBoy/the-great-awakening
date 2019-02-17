declare const $: any;

class Awakening {

    private readonly overlay: HTMLElement;

    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('image-preview');
        document.body.append(this.overlay);
    }

    public toggleImage(src?: string, alt?: string) {
        if (this.overlay.classList.contains('opened')) {
            this.closeImage();
        } else {
            this.overlay.innerHTML = `<div class="wrapper"><img src="${src}" alt="${alt}"></div>`;
            this.overlay.classList.add('opened');
            document.body.classList.add('no-scroll');
        }
    }

    public closeImage() {
        this.overlay.classList.remove('opened');
        document.body.classList.remove('no-scroll');
    }

}

declare const awakening: Awakening;
(window as any).awakening = new Awakening();

$(document).on('click', '.img-center.resizable', (event: MouseEvent) => {
    const image = (event.target as HTMLImageElement);
    awakening.toggleImage(image.src, image.alt);
});

$(document).on('click', '.image-preview', () => {
    awakening.toggleImage();
});
