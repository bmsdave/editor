const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs');
const compare = require('./make_makets');
const puppeteer = require('puppeteer');
const imageDiff = require('image-diff');
const maketName = "1"

const pathToMaket = path.join(__dirname, "makets", `${maketName}.html`);
const maketContent = fs.readFileSync(pathToMaket, "utf8");
const screenshoter = require('./screenshoter.js');
const getImagesDiff = require('./getImagesDiff.js');

const Minio = require('minio');

var minioClient = new Minio.Client({
    endPoint: 'minio.piterjs.org',
    port: 443,
    useSSL: true,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.SECRETKEY
  });

screenshoter(maketContent, path.join(__dirname, "dist", "assets", "page.png")).then(() => {

  app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets')))
  app.use(express.json());

  app.get('/', function (req, res) {
    res.sendFile('editor.html', { root: path.join(__dirname, 'dist') });
  })

  app.post('/api/saveCode', async function (req, res) {

    const filename = `${req.body.name}-${maketName}-${req.body.time}.png`;
    const filenameDiff = `${req.body.name}-${maketName}-${req.body.time}.diff.png`;
    const file = path.join(__dirname, 'solution', filename);
    await screenshoter(req.body.code, file);

    minioClient.fPutObject('piterjs-cid', filename, file, function(e) {
      if (e) {
        return console.log(e)
      }
      console.log("Successfully uploaded the stream")
    })

    const diffResult = await getImagesDiff(pathToMaket, file, filenameDiff);
    
    const filenameResultDiff = `${diffResult.diffPercentage.toFixed(5)}-${req.body.name}-${maketName}-${req.body.time}.diff.png`
    minioClient.fPutObject('piterjs-cid', filenameResultDiff, file, function(e) {
      if (e) {
        return console.log(e)
      }
      console.log("Successfully uploaded the stream")
    })


    res.send('code is saving to file ${file}!');
  })

  const server = app.listen(3000, () => console.log('Example app listening on port 3000!'))

})
