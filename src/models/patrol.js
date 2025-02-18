const mongoose = require("mongoose");
const { hashPass } = require("../helpers/hashPass");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new mongoose.Schema(
    {
        idCabang: {
            type: String,
            required: [true, "ID Cabang harus di isi!"]
        },
        idClient: {
            type: String,
            required: [true, "ID Client harus di isi!"]
        },
        idRuangan: {
            type: mongoose.Schema.Types.ObjectId, ref:"Ruangan",
        },
        idShift: {
            type: mongoose.Schema.Types.ObjectId, ref:"Shift",
        },
        namaCabang: {
            type: String,
            // required: [true, "Nama cabang harus di isi!"]
        },
        namaClient: {
            type: String,
            // required: [true, "Nama client harus di isi!"]
        },
        namaRuangan: {
            type: String,
            required: [true, "Nama ruangan harus di isi!"]
        },
        namaShift: {
            type: String,
            required: [true, "Nama shift harus di isi!"]
        },
        dilaporkanOleh: {
            type: String,
            required: [true, "Nama pelapor harus di isi!"]
        },
        tglLaporan: {
            type: Date,
        },
        dateString: {
            type: String,
        },
        status: {
            type: String,
            required: [true, "Status harus di isi!"]
        },
        deskripsi: {
            type: String,
            required: [true, "Deskripsi harus di isi!"]
        },
        nfc: {
            type: Boolean,
            required: [true, "nfc harus di isi!"]
        },
        temuan: {
            type: Boolean,
            required: [true, "Temuan harus di isi!"]
        },
        dokumentasi: [String],
    },
    {
        versionKey: false,
        timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
      }
    );
    
    userSchema.plugin(aggregatePaginate);
    const patrol = mongoose.model("LaporanPatroli", userSchema);
    module.exports = patrol;