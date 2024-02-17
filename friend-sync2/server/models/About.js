const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AboutSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  city: {type: String},
  workplace: { type: String}, 
  school: {type: String},
  relationship: {type: String}
});

// Export model
module.exports = mongoose.model("About", AboutSchema);