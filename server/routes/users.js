import express from "express";
import UsersController from "../controller/UsersControoler";
import verifyToken from "../validator/Authentication";

const router = express.Router();


//user-update 

router.put("/:id", UsersController.userUpdate)

//user-delete

router.delete("/:id", UsersController.userDelete)

//user-get

router.get("/", verifyToken, UsersController.getUser)

//user-get-friends

router.get("/friends/:userId", UsersController.getFriends)
router.get("/profile/friends/:username", UsersController.getFriendsByname)

//user-get-followers

router.get("/followers/:userId", UsersController.getFollowers)
router.get("/profile/followers/:username", UsersController.getFollowersByname)

///user-follow

router.put("/:id/follow", UsersController.usersFollow)

///unfollow-user

router.put("/:id/unfollow", UsersController.usersUnFollow)
router.put("/:id/removefollow", UsersController.deleteFollowers)

//getall - users

router.get("/getallusers", UsersController.getAllUsers)

//create spam

router.post('/spam/:username', UsersController.createSpam)

//get spamlist

router.get('/spam/:username', UsersController.getSpamList)

//delete userbyspam

router.delete('/spam/:id', UsersController.userdelSpam)

//get-friendsNotificationLIst

router.get('/friendnotification/:userId', UsersController.getFollowersNotification)

//clear -friendsNotificationList

router.delete('/friendnotification/:userId', UsersController.removeFriendsNotificationList)

//pullbyId -friendsNotificationList

router.put('/friendnotification/:userId/:friendId', UsersController.pullFriendNotificationList)




export default router