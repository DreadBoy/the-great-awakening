document.addEventListener('click', (event) => {
    const classList = (event.target as HTMLElement).classList;
    if (classList.contains('img-center') &&
        classList.contains('resizable')) {
        classList.toggle('fullscreen');
    }
});