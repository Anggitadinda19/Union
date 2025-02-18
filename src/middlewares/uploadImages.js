const multer = require("multer");
const { Random } = require("random-js");

let angkaRandom = new Random().integer(0, 99999999);
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "imageLaporan");
  },
  filename: function (req, file, cb) {
    // console.log('YIHAAAAA')
    // let filename = req.decoded.cabang + "-" + Date.now() + ".jpg";
    let filename = "Union" + "-" + Date.now() + ".jpg";
    // console.log('ANJENGGG')

    console.log('YUHUUUU MASUK GANICHHH')
    console.log('anjayyyy mabar >>>>>',req.body.foto)
    console.log('anjinggg >>>>', file)
    if (!req.body.foto) {
      req.body.foto = [];
      // req.body.foto.push("http://localhost:9030/dokumentasi/" + filename);
      req.body.foto.push("https://s0z1w6cq-9030.asse.devtunnels.ms/dokumentasi/" + filename);

    } else {
      // req.body.foto.push("http://localhost:9030/dokumentasi/" + filename);
      req.body.foto.push("https://s0z1w6cq-9030.asse.devtunnels.ms/dokumentasi/" + filename);
    }

    cb(null, filename);
  },
});
var upload = multer({ storage: storage });

module.exports = { upload };