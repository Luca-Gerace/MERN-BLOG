import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthDate: { type: String, required: true },
  avatar: { type: String }
}, {
  timestamps: true,
  collection: "authors"
});

export default mongoose.model("Author", authorSchema);
