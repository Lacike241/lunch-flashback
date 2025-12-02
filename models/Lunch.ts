import mongoose from "mongoose";

const lunchSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: { type: Date, default: Date.now }
});

export default mongoose.models.Lunch ||
mongoose.model("Lunch", lunchSchema, "lunches");