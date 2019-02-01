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
            this.overlay.innerHTML = `<img src="${src}" alt="${alt}" image-preview>`;
            this.overlay.classList.add('opened');
        }
    }

    public closeImage() {
        this.overlay.classList.remove('opened');
    }

}


declare const awakening: Awakening;
(window as any).awakening = new Awakening();

document.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement);

    const hasClass = (classname: string, t = target) => t.classList.contains(classname);
    const hasAttribute = (attribute: string, t = target) => t.hasAttribute(attribute);

    if (hasClass('img-center') && hasClass('resizable')) {
        const image = (event.target as HTMLImageElement);
        awakening.toggleImage(image.src, image.alt);
    }
    if ((hasAttribute('image-preview')))
        awakening.toggleImage();
});
