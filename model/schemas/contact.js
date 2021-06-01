const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: mongoose.Mixed,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

contactSchema.path("name").validate((value) => {
  const regular = /[A-Z]\w+/;
  return regular.test(String(value));
});

const Contact = mongoose.model("contact", contactSchema);
module.exports = Contact;
