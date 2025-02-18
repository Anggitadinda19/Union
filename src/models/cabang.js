const mongoose = require("mongoose");
const { hashPass } = require("../helpers/hashPass");

const userSchema = new mongoose.Schema(
    {
        idCabang: {
            type: String,
            required: [true, "ID cabang harus di isi!"]
        },
        namaCabang: {
            type: String,
            required: [true, "Nama cabang harus di isi!"]
        },
        idClient: {
            type: String,
            required: [true, "ID Client harus di isi!"]
        },
    },
    {
        versionKey: false,
        timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
      }
    );
    
    
    const cabang = mongoose.model("Cabang", userSchema);
    module.exports = cabang;