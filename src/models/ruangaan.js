const mongoose = require("mongoose");
const { hashPass } = require("../helpers/hashPass");

const userSchema = new mongoose.Schema(
  {
    idCabang: {
      type: String,
      required: [true, "idCabang harus di isi!"],
    },
    ruangan: {
      type: String,
      required: [true, "Ruangan harus di isi!"],
    },
    idClient: {
      type: String,
      required: [true, "idClient harus di isi!"],
    },
    kodeRuangan:{
        type:String,
    },
    status: {
      type:Boolean,
      default:true
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// ruanganSchema.pre("save", function (next) {
//   let newPass = hashPass(this.password);
//   this.password = newPass;
//   next();
// });

const ruangan = mongoose.model("Ruangaan", userSchema);
module.exports = ruangan;