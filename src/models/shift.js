const mongoose = require("mongoose");
const { hashPass } = require("../helpers/hashPass");

const userSchema = new mongoose.Schema(
  {
    idCabang: {
      type: String,
      required: [true, "ID Cabang user harus di isi!"],
    },
    namaShift: {
      type: String,
    },
    durasi:{
        type:Number,
        required:[true,"Durasi waktu harus di isi!"]
    },
    patroli: {
      type: Number,
      required: [true, "Patroli harus di isi!"],
    },
    jam: {
      type: Number,
      required: [true, "Jam harus di isi!"],
    },
    status: {
      type: Boolean,
      required: [true, "Status harus di isi!"],
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);



const shift = mongoose.model("Shift", userSchema);
module.exports = shift;