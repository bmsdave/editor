const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const path = require('path');  

const pathToMaket = path.join(__dirname, "dist", "assets", "page.png")
const pathToSolution = path.join(__dirname, "solution", "bmsdave-1-1535752115289.png")

function getImagesDiff(pathToMaket, pathToSolution, filenameDiff) {
    let diffPixels;
    const pathToDiff = path.join(__dirname, "solution", filenameDiff)


    const promise = new Promise(function(resolve, reject) {

        function doneReading() {
            if (++filesRead < 2) return;
            var diff = new PNG({width: img1.width, height: img1.height});
        
            diffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});
        
            console.log(1 - diffPixels/(1200*800)); 
            const diffStream = diff.pack()
            const writeStream = diffStream.pipe(fs.createWriteStream(pathToDiff));
            writeStream.end();
        
            resolve({
                diffPercentage: 1 - diffPixels/(1200*800),
                pathToDiff: pathToDiff
            })
            return diff;
        }

        var img1 = fs.createReadStream(pathToMaket).pipe(new PNG()).on('parsed', doneReading),
        img2 = fs.createReadStream(pathToSolution).pipe(new PNG()).on('parsed', doneReading),
        filesRead = 0;

      })

    return promise;
}

module.exports = getImagesDiff;