const fs = require('fs');
const path = require('path');
const Differencify = require('differencify');
const differencify = new Differencify({
  saveDifferencifiedImage: true,
  imageSnapshotPath: "img"
});


const compare = async (file, content) => {
    fs.readFile(path.join(__dirname, 'makets',  "1.html"), async (cont) => {

      await differencify
      .init()
      .launch()
      .newPage()
      .setViewport({ width: 1200, height: 800 })
      .setContent(cont)
      .waitFor(1000)
      .screenshot()
      .setContent(content)
      .waitFor(1000)
      .screenshot()
      .toMatchSnapshot((resultDetail) => {
        fs.appendFile(file, JSON.stringify(resultDetail, null, '    '), function (err) {
          if (err) {
              return console.log(err);
          }

          console.log("The JSON with difference was saved!");
        });
      })
      .close()
      .end();

    })


  }

module.exports = compare
