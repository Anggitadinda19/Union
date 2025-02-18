require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const router = require("./src/routers/index");
const PORT = process.env.PORT;
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const { socketHandler } = require("./socket");

socketHandler(io);

require("./db.connect")();
// require("./cj")();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: "PHP 7.4.11" }));

app.use("/dokumentasi", express.static("./imageLaporan"));
// app.use("/formRegister", express.static("./formRegister"));
// app.use("/formPengajuan", express.static("./formPengajuan"));

app.use("/", router);

app.use(require("./src/middlewares/errHandlers"));

server.listen(PORT, () => {
  console.log(`Current PORT: ${PORT}`);
});
