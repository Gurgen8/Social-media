import express from "express";
import MessagesController from "../controller/MessageController";

const router = express.Router();

//create new message

router.post('/', MessagesController.createMessage)

//get-message

router.get('/:coversationId', MessagesController.getMessages)

//update-message

router.put('/:id', MessagesController.updateMessage)

//delete-message

router.delete('/:messageId/:id/:userId', MessagesController.removeMessage)

//notification-message

router.put('/notification/:userId/:friendId', MessagesController.setMessagesNotification)

//remove-notification-message

router.put('/notification/:userId', MessagesController.removeMessagesNotification)


///remove all messages

router.delete('/message/:senderId/:userId/:friendId', MessagesController.removeAllMessage)


//remove-notification-message

router.get('/notification/:userId', MessagesController.getMessagesNotification)

//pull-one-notification-messages

router.delete('/notification/:userId/:friendId', MessagesController.pullNotificationMessages)

//conect videochat

router.post('/videochat/:friendid', MessagesController.getVideochatConnected)

//get--videochat-notifications

router.get('/videochat/:username/:friendid', MessagesController.videochatNotification)


//delete--videochat-notification

router.put('/videochat/:friendId/:userId', MessagesController.removeVideochatNotification)


//delete-videochat-notifications by-name

router.delete('/videochat/notification/:userId/:username', MessagesController.removeVideochatNotificationByname)


//delete-conectId

router.put("/videochatconnect/removeid/:userId/:id", MessagesController.removeConectId)


export default router