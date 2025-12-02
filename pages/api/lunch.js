import mongoose from 'mongoose';
import Lunch from "../../models/Lunch";


const connectToDatabase = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "lunch"
    });
};

export default async function handler(req, res) {
    try {
        await connectToDatabase();

        if (req.method === "POST") {
            const { name, description } = req.body;
            const item = await Lunch.create({ name, description });
            return res.status(201).json(item);
        }

        if (req.method === "GET") {
            const items = await Lunch.find();
            return res.status(200).json(items);
        }

        if (req.method === "DELETE") {
            const { id } = req.body;
            try {
                await Lunch.findByIdAndDelete(id);
                return res.status(200).json({ message: "Obed vymazaný" });
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
        }

        return res.status(405).end();

    } catch (err) {
        console.error("API ERROR:", err);
        return res.status(500).json({ error: "Server error", detail: err.message });
    }
}