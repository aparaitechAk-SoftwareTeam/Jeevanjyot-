const mongoose = require("mongoose");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
};

module.exports = { isValidObjectId };
