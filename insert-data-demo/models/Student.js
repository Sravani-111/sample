const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({
    name: String,
    role: String,
    salary: Number,
    sno: Number
});

const Developer = mongoose.model("Developer", developerSchema, "developers");

module.exports = Developer;