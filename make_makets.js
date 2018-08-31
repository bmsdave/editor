const fs = require('fs');
const Differencify = require('differencify');
const differencify = new Differencify({
  saveDifferencifiedImage: true,
  imageSnapshotPath: "img"
});


const compare = async (file, content) => {
    await differencify
      .init()
      .launch()
      .newPage()
      .setViewport({ width: 1200, height: 800 })
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
  }

module.exports = compare
