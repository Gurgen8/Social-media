import mongoose from "mongoose";


const StoriShema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },

    author: {
        type: String,

    },
    authorImg: {
        type: String,

    },
    male: {

        type: String,

    },
    watchers: {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    })


export default mongoose.model('Stori', StoriShema);