const express = require('express')
const app = express()
const path = require('path');
var fs = require('fs');
var Minio = require('minio')

var minioClient = new Minio.Client({
  endPoint: 'minio.piterjs.org',
  port: 443,
  useSSL: true,
  accessKey: process.env.ACCESSKEY,
  secretKey: process.env.SECRETKEY
});

const Differencify = require('differencify');
const differencify = new Differencify({
  saveDifferencifiedImage: true,
  imageSnapshotPath: "img"
});


app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets')))

app.use(express.json());

app.get('/', function (req, res) {
  res.sendFile('editor.html', { root: path.join(__dirname, 'dist') });
})

app.post('/api/saveCode', function (req, res) {
  res.send('code is saving!');

  fs.appendFile(path.join(__dirname, 'img',  req.body.name + req.body.time + ".html"), req.body.code, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");

  });

  (async () => {
    const result = await differencify
      .init({})
      .launch()
      .newPage()
      .setViewport({ width: 1600, height: 1200 })
      .goto("file://" + path.join(__dirname, 'img', req.body.name + req.body.time + ".html"))
      .waitFor(1000)
      .screenshot()
      .toMatchSnapshot()
      .result((result) => {
        console.log(result); // Prints true or false
      })
      .close()
      .end();
  })();

  // minioClient.putObject("piterjs-cid", req.body.name + req.body.time, req.body.code, (e) => { console.log("tadam!!", e) });

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))