const mongoose = require("mongoose");
const { hashPass } = require("../helpers/hashPass");

const userSchema = new mongoose.Schema(
    {
        idClient: {
            type: String,
            required: [true, "ID client harus di isi!"]
        },
        namaClient: {
            type: String,
            required: [true, "Nama client harus di isi!"]
        },
    },
    {
        versionKey: false,
        timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
      }
    );
    
    
    const client = mongoose.model("Client", userSchema);
    module.exports = client;