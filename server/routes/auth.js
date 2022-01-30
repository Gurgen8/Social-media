import express from "express";
import UserController from "../controller/UsersControoler"

const router = express.Router();

//auth (users) - REGISTRATION and LOGIN-varification

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/verification', UserController.getQrCode)
router.post('/varify', UserController.varification)




export default router
