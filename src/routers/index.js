const express = require("express");
const Router = express.Router();
const { jwtAuthenticate } = require("../middlewares/auth");


// ======== Router Web =============
const User = require("./web/User");
const Visit = require("./web/visit");
const Client = require("./web/client");
const Cabang = require("./web/cabang");
const Ruangan = require("./web/ruangan");
const Shift = require("./web/shift");
const Training = require("./web/training");
const Patrol = require("./web/patrol");


// ======== Router Mobile ==========
const UserMobile = require("./mobile/User");
const PatrolMobile = require("./mobile/patrol");
const VisitMobile = require("./mobile/visit");
const TrainingMobile = require("./mobile/training");
const CabangMobile = require("./mobile/cabang");
const ClientMobile = require("./mobile/client");
const RuanganMobile = require("./mobile/ruangan");
const ShiftMobile = require("./mobile/shift");


//=========Path Web=============
Router.use("/user",User)
Router.use("/visit", jwtAuthenticate, Visit)
Router.use("/client", jwtAuthenticate, Client)
Router.use("/cabang", jwtAuthenticate,Cabang)
Router.use("/ruangan",jwtAuthenticate, Ruangan)
Router.use("/shift", jwtAuthenticate, Shift)
Router.use("/training", jwtAuthenticate, Training)
Router.use("/patrol", jwtAuthenticate, Patrol)

// ========= Path Mobile ========
Router.use("/usermobile",UserMobile)
Router.use("/patrolmobile",jwtAuthenticate,PatrolMobile)
Router.use("/visitmobile",jwtAuthenticate,VisitMobile)
Router.use("/trainingmobile",jwtAuthenticate,TrainingMobile)
Router.use("/clientmobile",jwtAuthenticate,ClientMobile)
Router.use("/cabangmobile",jwtAuthenticate,CabangMobile)
Router.use("/ruanganmobile",jwtAuthenticate,RuanganMobile)
Router.use("/shiftmobile",jwtAuthenticate,ShiftMobile)






Router.get("/", (req, res) => {
  res.send("Server union menyala");
});
module.exports = Router;
