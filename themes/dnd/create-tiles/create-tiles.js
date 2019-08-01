const Jimp = require('jimp');
const {resolve} = require('path');

const config = [
    {
        source: 'tookania.png',
        zoom: 2,
        scale: 4,
    },
    {
        source: 'tookania.png',
        zoom: 1,
        scale: 2,
    },
    {
        source: 'tookania.png',
        zoom: 0,
        scale: 1,
    },
    {
        source: 'tookania.png',
        zoom: -1,
        scale: 0.5,
    },
    {
        source: 'tookania.png',
        zoom: -2,
        scale: 0.25,
    },
];

async function tiles(config) {
    return Promise.all(config.map(async level => {
        const image = await Jimp.read(resolve(__dirname, level.source));

        const scaled = await image
            .clone()
            .scale(level.scale);

        const {width, height} = scaled.bitmap;
        const size = 256;
        for (let x = 0; x < width; x += size)
            for (let y = 0; y < height; y += size) {
                const cropped = scaled
                    .clone()
                    .crop(x, y, Math.min(size, width - x), Math.min(size, height - y));

                const tile = new Jimp(256, 256)
                    .composite(cropped, 0, 0);

                const filename = `${level.zoom}/${x / size}/${y / size}.png`;

                await tile.writeAsync(resolve(__dirname, '..', 'source', 'tiles', filename));
            }
    }));
}

tiles(config)
    .catch(e => console.error(e));

module.exports = {
    tiles,
};
