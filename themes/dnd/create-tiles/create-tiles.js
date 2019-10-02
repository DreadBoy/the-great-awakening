const Jimp = require('jimp');
const chalk = require('chalk');
const {resolve} = require('path');
const Promise = require("bluebird");

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
    console.log(chalk.magenta(' _____            _               _         _   _ _                                        _             \r\n\/__   \\___   ___ | | ____ _ _ __ (_) __ _  | |_(_) | ___    __ _  ___ _ __   ___ _ __ __ _| |_ ___  _ __ \r\n  \/ \/\\\/ _ \\ \/ _ \\| |\/ \/ _` | \'_ \\| |\/ _` | | __| | |\/ _ \\  \/ _` |\/ _ \\ \'_ \\ \/ _ \\ \'__\/ _` | __\/ _ \\| \'__|\r\n \/ \/ | (_) | (_) |   < (_| | | | | | (_| | | |_| | |  __\/ | (_| |  __\/ | | |  __\/ | | (_| | || (_) | |   \r\n \\\/   \\___\/ \\___\/|_|\\_\\__,_|_| |_|_|\\__,_|  \\__|_|_|\\___|  \\__, |\\___|_| |_|\\___|_|  \\__,_|\\__\\___\/|_|   \r\n                                                           |___\/                                         '))
    return Promise.reduce(config, async (_, level) => {
        const image = await Jimp.read(resolve(__dirname, level.source));

        const scaled = await image
            .clone()
            .scale(level.scale);

        const {width, height} = scaled.bitmap;
        const size = 256;
        console.log(chalk.blue(`Starting zoom level ${level.scale} at resolution ${width}x${height} (${Math.floor(width / size)}x${Math.floor(height / size)}):`))

        for (let x = 0; x < width; x += size)
            for (let y = 0; y < height; y += size) {
                const cropped = scaled
                    .clone()
                    .crop(x, y, Math.min(size, width - x), Math.min(size, height - y));

                const tile = new Jimp(256, 256)
                    .composite(cropped, 0, 0);

                const filename = `${level.zoom}/${x / size}/${y / size}.png`;

                await tile.writeAsync(resolve(__dirname, '..', 'source', 'tiles', filename));
                console.log(chalk.green(`Wrote tile ${level.zoom}/${x / size}/${y / size}.png`))
            }
    });
}

tiles(config)
    .catch(e => console.error(e));

module.exports = {
    tiles,
};
