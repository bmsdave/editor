const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs');
const compare = require('./make_makets');
const puppeteer = require('puppeteer');
const imageDiff = require('image-diff');
const maketName = "1"

const pathToMaketHTML = path.join(__dirname, "makets", `${maketName}.html`);
const maketContent = fs.readFileSync(pathToMaketHTML, "utf8");
const screenshoter = require('./screenshoter.js');
const getImagesDiff = require('./getImagesDiff.js');
const Stream = require('stream');
const Minio = require('minio');

var minioClient = new Minio.Client({
    endPoint: 'minio.piterjs.org',
    port: 443,
    useSSL: true,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.SECRETKEY
  });

const pathToMaket = path.join(__dirname, "dist", "assets", "page.png");

function toMinio(filename, data) {
  minioClient.putObject('piterjs', `cid/${filename}`, data, function(e) {
    if (e) {
      return console.log(e)
    }
    console.log(`Successfully uploaded ${filename}`)
  })
}

screenshoter(maketContent, path.join(__dirname, "dist", "assets", "page.png")).then((maketScreenshotUint8Array) => {

  app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets')))
  app.use(express.json());

  app.get('/', function (req, res) {
    res.sendFile('editor.html', { root: path.join(__dirname, 'dist') });
  })

  app.get('/result', function (req, res) {

    res.sendFile('results.html', { root: path.join(__dirname, 'dist') });
  })

    app.get('/api/result', function (req, res) {

    const stream = minioClient.listObjects("piterjs", "cid/", false)

    const result = [];
    stream.on('data', function(obj){
      console.log("obj", obj)
      result.push(obj);
    })
    stream.on('error', function(err){
      res.send(err);
    })
    stream.on('end', function(err){
      res.send(result);
    })
  })

  app.post('/api/saveCode', async function (req, res) {

    const filename = `${req.body.name}-${maketName}-${req.body.time}.png`;
    const file = path.join(__dirname, 'solution', filename);
    const solutionScreenshotUint8Array = await screenshoter(req.body.code);
    
    toMinio(filename, solutionScreenshotUint8Array)

    const diffResult = await getImagesDiff(maketScreenshotUint8Array, solutionScreenshotUint8Array);
    
    const filenameResultDiff = `${req.body.name}-${maketName}-${req.body.time}-${diffResult.diffPercentage.toFixed(5)}.diff.png`
    toMinio(filenameResultDiff, diffResult.diffBuffer);

    res.send('code is saving to file ${file}!');
  })

  const server = app.listen(3000, () => console.log('Example app listening on port 3000!'))

})
