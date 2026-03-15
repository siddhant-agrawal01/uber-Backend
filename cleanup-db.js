import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function cleanIndexes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const User = mongoose.model('User', new mongoose.Schema({}));
        
        // List indexes
        const indexes = await User.collection.indexes();
        console.log("Current indexes:", indexes.map(i => i.name));

        if (indexes.find(i => i.name === 'username_1')) {
            await User.collection.dropIndex('username_1');
            console.log("Dropped index: username_1");
        } else {
            console.log("Index username_1 not found, nothing to drop.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

cleanIndexes();
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjY0Zjc1NmE2YzBjNWYyMTliNWIzYSIsImlhdCI6MTc3MzU1NTYyNywiZXhwIjoxNzczNTU5MjI3fQ.eiehPMsu1q1Ej85VTGB8peIT9XzcyVfl91wqD5mDR4w