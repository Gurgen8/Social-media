import express from "express";
import ConversationController from "../controller/ConversationController";

const router = express.Router();

//create new conversations

router.post('/', ConversationController.createConversation)

//get-user convertasions

router.get('/:userId', ConversationController.getConversations)

/// get -conversation includes  two userId 

router.get('/find/:firsUserId/:secondUserId', ConversationController.findUserId)

/// remove-convert

router.delete('/:userId', ConversationController.removeConvert)


export default router