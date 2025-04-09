import mongoose from "mongoose";


const favouriteSongSchema = new mongoose.Schema({
    userId: String,
    songId: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date,
    
},
{
    timestamps: true
})

const favouriteSong = mongoose.model("favouriteSong", favouriteSongSchema, "favourite-songs");
export default favouriteSong;