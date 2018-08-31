const express = require('express')
const app = express()
const path = require('path');
const compare = require('./make_makets');

app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets')))

app.use(express.json());

app.get('/', function (req, res) {
  res.sendFile('editor.html', { root: path.join(__dirname, 'dist') });
})

const server = app.listen(3000, () => console.log('Example app listening on port 3000!'))

app.post('/api/saveCode', function (req, res) {
  res.send('code is saving!');

  const file = path.join(__dirname, 'img',  req.body.name + req.body.time + ".json");
  compare(file, req.body.code);

  // minioClient.putObject("piterjs-cid", req.body.name + req.body.time, req.body.code, (e) => { console.log("tadam!!", e) });


    server.close()
})
