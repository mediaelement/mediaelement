import fs from 'node:fs';
import path from 'node:path';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';

import { promises as fsPromises } from 'node:fs';
import { promisify } from 'node:util';

const writeFile = promisify(fs.writeFile);

const srcdir = path.resolve('src', 'images');
const distImageDir = path.resolve('dist', 'images');

if (!fs.existsSync(distImageDir)) {
  fs.mkdirSync(distImageDir, { recursive: true });
}

(async () => {
  // await imagemin([path.join(srcdir, 'icons', 'svg') + '**/*.svg']), {
  await imagemin([path.resolve(srcdir, '**/*.svg')], {
    destination: distImageDir,
    plugins: [
      imageminSvgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
        ],
      }),
    ],
  }).catch((e) => {
    console.error(e);
  });

  console.log('Icons optimized');
})();

(async () => {
  await imagemin([path.resolve(srcdir, '**/*.png')], {
    plugins: [
      imageminPngquant({
        speed: 4,
        quality: [0.65, 0.9],
      }),
    ],
  })
    .then((files) => {
      files.forEach(async (v) => {
        const source = path.parse(v.sourcePath);
        v.destinationPath = path.join(distImageDir, source.name + source.ext);
        await fsPromises.mkdir(path.dirname(v.destinationPath), {
          recursive: true,
        });
        await writeFile(v.destinationPath, v.data);
      });
    })
    .catch((e) => {
      console.error(e);
    });
})();