const express = require("express");
const Router = express.Router();

// ======== Router Web =============
const User = require("./web/User");

const { jwtAuthenticate } = require("../middlewares/auth");


//=========Path Web=============
Router.use("/user",User)






Router.get("/", (req, res) => {
  res.send("Server union menyala");
});
module.exports = Router;
