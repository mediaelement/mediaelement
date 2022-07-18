const fs = require('fs');
const path = require('path');
const glob = require('glob');
const postcss = require('postcss');
const config = require('./postcss.config');
const cssnano = require('cssnano')(config.plugins.cssnano);
const sort = require('postcss-sorting')(config.plugins.sorting);
const reporter = require('postcss-reporter')(config.plugins.reporter);
const autoprefixer = require('autoprefixer')(config.plugins.autoprefixer);
const stylelint = require('stylelint')(config.plugins.stylelint);

const distDir = path.resolve(__dirname, '..', '..', 'dist', 'css');

const err = (e, callback) => {
  if (e) {
    console.error(`\nEROR: ${e}\n`);
  } else {
    callback();
  }
};

const mincss = async (asset) => {
  const srcFile = `${path.resolve(distDir, asset)}`;
  const distFile = `${path.resolve(distDir, asset.replace(/.css/, '.min.css')  )}`;

  try {
    await fs.readFile(srcFile, (error, css) => {
      postcss([cssnano])
        .process(css, {
          from: srcFile,
        })
        .then((result) => {
          fs.writeFile(distFile, result.css, () => true);
          if (result.map) {
            fs.writeFile(`${distFile}.map`, result.map.toString(), () => true);
          }
        });
    });
  } catch (e) {
    err(e);
  }
};

const processCss = async (asset) => {
  const srcFile = `${path.resolve(distDir, asset)}`;
  await fs.readFile(srcFile, (e, css) => {
    postcss([autoprefixer, sort, reporter])
      .process(css, {
        from: srcFile,
      })
      .then((result) => {
        fs.writeFile(srcFile, result.css, () => true);
        if (result.map) {
          fs.writeFile(`${srcFile}.map`, result.map.toString(), () => true);
        }
      })
      .then(mincss(asset))
      .catch((e) => err(e));
  });
};

glob(
  '**/*.css',
  {
    cwd: distDir,
    noext: 'min.css',
  },
  (e, files) => {
    err(e, () => {
      files.forEach((stylesheet) => {
        processCss(stylesheet);
      });
    });
  },
);
