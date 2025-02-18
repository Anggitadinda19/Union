const mongoose = require("mongoose");
const { hashPass } = require("../helpers/hashPass");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new mongoose.Schema(
    {
        idCabang: {
            type: String,
            required: [true, "ID cabang harus di isi!"]
        },
        idClient: {
            type: String,
            required: [true, "ID client di isi!"]
        },
        namaCabang: {
            type: String,
            required: [true, "Nama cabang harus di isi!"]
        },
        namaClient: {
            type: String,
            required: [true, "Nama client harus di isi!"]
        },
        judul: {
            type: String,
            required: [true, "Judul harus di isi!"]
        },
        dilaporkanOleh: {
            type: String,
            required: [true, "Nama pelapor harus di isi!"]
        },
        tglPelaksanaan: {
            type: Date,
            required: [true, "Tanggal pelaksanaan harus di isi!"]
        },
        status: {
            type: String,
            required: [true, "Status harus di isi!"]
        },
        deskripsi: {
            type: String,
            required: [true, "Deskripsi harus di isi!"]
        },
        dokumentasi: [String],
    },
    {
        versionKey: false,
        timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
      }
    );
    
        userSchema.plugin(aggregatePaginate);
    
    const visit = mongoose.model("Visit", userSchema);
    module.exports = visit;