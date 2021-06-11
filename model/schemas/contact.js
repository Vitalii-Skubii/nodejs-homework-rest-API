const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: mongoose.Mixed,
      required: [true, "Phone is required"],
    },

    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },

  { versionKey: false }
);

contactSchema.path("name").validate((value) => {
  const re = /[A-Z]\w+/;
  return re.test(String(value));
});

contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model("contact", contactSchema);
module.exports = Contact;
