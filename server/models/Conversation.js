import mongoose from "mongoose";

const ConversationShema = new mongoose.Schema({

    members: {
        type: Array
    }
},
    { timestamps: true }
)


export default mongoose.model('Conversation', ConversationShema);