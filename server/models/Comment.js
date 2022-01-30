import mongoose from "mongoose";

const CommentShema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    author: {
        type: String
    },
    comment: {
        type: String

    },
    img: {
        type: String
    },
    male: {
        type: String
    }
},

    {
        timestamps: true
    })


export default mongoose.model('Comment', CommentShema);