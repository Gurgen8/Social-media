import Post from "../models/Post";
import Comment from "../models/Comment"
import Users from "../models/Users";


class CommentsController {


  static createComment = (req, res) => {
    try {
      new Comment({
        userId:req.body.userId,
        author: req.body.author,
        img: req.body.img,
        comment: req.body.comment,
        male: req.body.male
      }).save((err, result) => {
        if (err) {
          console.log(err)
        } else {
          const post = Post.findById(req.params.id, (err, post) => {
            if (err) {
              console.log(err)
            } else {
              post.comments.push(result)
              if (post.userId !== req.params.userId)
                post.notificationComments.push(result)
              post.save()
            }
          })

        }
      })


      res.status(200).json("your comment has been succesfuly")

    } catch (error) {
      console.log(error)

    }

  };


  static getComments = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('comments');
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err)
    }
  };







  static deleteComments = async (req, res) => {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $pull: { comments: req.params.commentId, notificationComments: req.params.commentId },
        },
        { new: true }
      );

      if (!post) {
        return res.status(400).send("Post not found");
      } else {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ statsus: comment });

      }

    } catch (error) {
      res.status(500).json(error)
    }



  };


  static getCommnetsNotificationList = async (req, res) => {

    try {

      const post = await Post.findById(req.params.id).populate('notificationComments');

      if (post.userId === req.params.userId) {
        await post.updateOne({ notificationComments: [] })

      }

      res.status(200).json(post);


    } catch (error) {
      res.status(500).json(error)

    }
  }




}

export default CommentsController;
