import mongoose from "mongoose";

const MessageShema = new mongoose.Schema(
    {
        coversationId: {
            type: Array
        },
        sender: {
            type: String
        },
        text: {
            type: String
        },
        url: {
            type: String
        },
        img: {
            type: String,
        },
        video: {
            type: String
        },
        giph: {
            type: String,

        }


    },

    { timestamps: true })



export default mongoose.model('Message', MessageShema);