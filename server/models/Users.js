import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        minlength: 2,
        unique: true
    },
    lastname: {
        type: String,
        minlength: 3

    },
    email: {
        type: String,
        reqiur: true,
        maxlength: 30,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    profilePicture: {
        type: String,
        default: ""

    },
    coverePicture: {
        type: String,
        default: ""

    },
    followers: {
        type: Array,
        default: []

    },
    followins: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,
        default: "",
        maxlength: 50
    },
    city: {
        type: String,
        default: "",
        maxlength: 25
    },
    from: {
        type: String,
        default: "",
        maxlength: 30
    },
    age: {
        type: Number,
        default: "",
        max: 100,
        maxlength: 3,
        minlength: 0
    },
    phone: {
        type: Number,
        default: "",

    },
    job: {
        type: String,
        default: "",
        maxlength: 50

    },
    scool: {
        type: String,
        default: "",
        maxlength: 40

    },
    male: {
        type: String,
        required: true,
        default: "",


    },
    single: {
        type: String,
        default: "",

    },
    birthDay: {
        type: Date,
        default: ""

    },
    passwordAgain: {
        type: String,
        required: true,
        minlength: 6

    },
    spam: {
        type: Array,
        default: []
    },
    notificationFriends: {
        type: Array,
        default: []
    },
    notificationMessages: {
        type: Array,
        default: []
    },
    notificationBirthday: {
        type: Date,
        default: ""
    },
    notificationCalling: {
        type: Array,
        default: []

    },

    videoConenctId: {
        type: String,
        default: ""
    },
    token: {
        type: String,
        default: null
    },
    varification: {
        type: Boolean,
        default: false
    },



}, {
    timestamps: true
})


export default mongoose.model('User', UserSchema);