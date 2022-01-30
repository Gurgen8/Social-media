import express from "express";
import PostsController from "../controller/PostsController";
import CommentController from "../controller/CommentsController"

const router = express.Router();

//post create

router.post('/', PostsController.postCreate)

//post-update

router.put("/:id", PostsController.postUpdate)

//post-deleted

router.delete("/:id", PostsController.postDelete)

//post-liked--disliked

router.put("/:id/like", PostsController.postIsLiked)

//post-liked--disliked

router.get("/:id/likelist", PostsController.getPostLikesList)

//post-heart inheart

router.put("/:id/heart", PostsController.reacted)

//post-heart inheart

router.get("/:id/heartlist", PostsController.getPostHeartList)

//post-get

router.get("/:id", PostsController.getPost)

//get timeline posts

router.get("/timeline/:userId", PostsController.timelinePost)

//get users  all posts

router.get("/profile/:username", PostsController.timelineAllPost)

//search posts

router.get("/search/:id", PostsController.searchPost)

//comment-post

router.post('/:id/comments/:userId', CommentController.createComment)

//get-comments-post

router.get('/comments/:id', CommentController.getComments)

//delete-posts-comments

router.delete('/comments/:postId/:commentId', CommentController.deleteComments)


//get notification comments

router.get('/comments/notification/:id/:userId', CommentController.getCommnetsNotificationList)

//delete location

router.delete('/location/:id', PostsController.removeLocation)

//get user allPosts

router.get('/user/:id', PostsController.getUserPosts)

//get likes-notificationlist

router.get('/likenotification/:id', PostsController.getlikesNotificationList)

//get hearte-notification

router.get("/heartenotification/:id", PostsController.getHearteNotificationList)

//pull-one likes-notificationlist

router.delete('/likenotification/:id/:userId', PostsController.pullNotificationLikes)

//pull -one hearte-notification

router.delete('/heartnotification/:id/:userId', PostsController.pullNotificationHeartes)

//remove all posts-notification

router.delete('/removeall/:id', PostsController.removeAllNotifications)

//like notification--length

router.get('/notificationlength/:id', PostsController.getNotificationLength)


export default router