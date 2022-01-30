import mongoose from "mongoose";
import Comment from "./Comment"

const PostShema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String,


    },
    likes: {
        type: Array,
        default: []
    },
    heartes: {
        type: Array,
        default: []
    },
    url: {
        type: String,
        default: ""

    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Comment
        }
    ],

    notificationComments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Comment
        }
    ],
    notificationLikes: {
        type: Array,
        default: []
    },
    notificationHeartes: {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    })


export default mongoose.model('Post', PostShema);