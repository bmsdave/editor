const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const path = require('path');

const pathToMaket = path.join(__dirname, 'dist', 'assets', 'page.png');
const pathToSolution = path.join(__dirname, 'solution', 'bmsdave-1-1535752115289.png');

function getImagesDiff(maketBuffer, solutionBuffer) {
  let diffPixels;
  const maketPNG = PNG.sync.read(maketBuffer);
  const solutionPNG = PNG.sync.read(solutionBuffer);

  const diff = new PNG({ width: maketPNG.width, height: maketPNG.height });

  diffPixels = pixelmatch(
    maketPNG.data,
    solutionPNG.data,
    diff.data,
    maketPNG.width,
    maketPNG.height,
    { threshold: 0.1 },
  );

  const diffBuffer = PNG.sync.write(diff);
  console.log(1 - diffPixels / (1200 * 800));
  return {
    diffPercentage: 1 - diffPixels / (1200 * 800),
    diffBuffer,
  };
}

module.exports = getImagesDiff;
