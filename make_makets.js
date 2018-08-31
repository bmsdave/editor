const path = require('path');
const Differencify = require('differencify');
const differencify = new Differencify({
  saveDifferencifiedImage: true,
  imageSnapshotPath: "img"
});


(async () => {
    const result = await differencify
      .init({})
      .launch()
      .newPage()
      .setViewport({ width: 1200, height: 800 })
      .goto("file://" + path.join(__dirname, "makets", "1.html"))
      .waitFor(1000)
      .screenshot()
      .toMatchSnapshot()
      .result((result) => {
        console.log(result); // Prints true or false
      })
      .close()
      .end();
  })();