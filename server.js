const express = require('express')
const app = express()
const path = require('path');

// app.use(function (req, res, next) {
//     var filename = path.basename(req.url);
//     var extension = path.extname(filename);
//     if (extension === '.css')
//         console.log("The file " + filename + " was requested.");
//     next();
// });
// app.use(express.static(__dirname));

app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets')))

app.use(express.json());

app.get('/', function(req, res){
    res.sendFile('editor.html', { root: path.join(__dirname, 'dist') });
  })

  app.post('/api/saveCode', function(req, res){
    console.log("catch", req);
    res.send('code is saving!');
  })


app.listen(3000, () => console.log('Example app listening on port 3000!'))