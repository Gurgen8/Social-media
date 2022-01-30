import express from "express";
import mongoose from "mongoose";
import helmet from "helmet"
import morgan from "morgan";
import dotenv from "dotenv";
import userRoute from "./routes/users"
import authRoute from "./routes/auth"
import postRoute from "./routes/posts";
import messageRoute from "./routes/messages"
import conversRoute from "./routes/conversations"
import storisRoute from "./routes/storis"
import multer from "multer"
import path from "path";

dotenv.config()
const app = express();


//middlewares


app.use('/images', express.static(path.join(__dirname, "public/images")))
app.use(express.json());
app.use(helmet());
app.use(morgan("refreshing sucsessfuled!!"));
app.use('/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/post', postRoute);
app.use('/api/conversation', conversRoute);
app.use('/api/messages', messageRoute)
app.use('/api/storis', storisRoute)


///multer uploaded--post

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/post")

    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },

})
const upload = multer({ storage })

app.post('/api/upload', upload.single('file'), (req, res) => {
    try {


        res.status(200).json("this file is uploaded")

    } catch (error) {
        res.status(500).json("file upload is failed")
    }
})


///multer-upload-profileimg

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/person")

    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const imgupload = multer({ storage: profileStorage })


app.post('/api/profileimg/upload', imgupload.single('file'), (req, res) => {

    try {
        res.status(200).json("this file is uploaded")

    } catch (error) {
        res.status(500).json("file upload is failed")
    }
})


///multer-upload-covereimg

const covereStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/cover")

    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const bgimgupload = multer({ storage: covereStorage })


app.post('/api/coverimg/upload', bgimgupload.single('file'), (req, res) => {

    try {
        res.status(200).json("this file is uploaded")

    } catch (error) {
        res.status(500).json("file upload is failed")
    }
})


///,ulter-upload-message-file

const messageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/message")

    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const messageimgupload = multer({ storage: messageStorage })


app.post('/api/messagepicture/upload', messageimgupload.single('file'), (req, res) => {

    try {
        res.status(200).json("this file is uploaded")

    } catch (error) {
        res.status(500).json("file upload is failed")
    }
})


///multer-create-stories

const storisStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/storis")

    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const storisUpload = multer({ storage: storisStorage })


app.post('/api/storiespicture/upload', storisUpload.single('file'), (req, res) => {

    try {
        res.status(200).json("this file is uploaded")

    } catch (error) {
        res.status(500).json("file upload is failed")
    }
})



//mongodb connection

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() =>
        console.log("Database connected!"))
    .catch(err => console.log(err));

//bacend server connection

app.listen(8800, () => {
    console.log("bacend server is running!")

})

