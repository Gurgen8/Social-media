import Post from "../models/Post";
import User from "../models/Users"


class PostsController {

  //post-create-update-delete

  static postCreate = async (req, res) => {
    const newPost = new Post(req.body);

    try {

      const savedPost = await newPost.save();
      res.status(200).json(savedPost)
    } catch (error) {
      res.status(500).json(error)
    }

  };

  static postUpdate = async (req, res) => {

    try {
      const post = await Post.findById(req.params.id)

      await post.updateOne({ $set: req.body })
      res.status(200).json(post)

    } catch (error) {
      res.status(500).json(error)
    }
  };

  static postDelete = async (req, res) => {

    try {



      await Post.findByIdAndRemove({ _id: req.params.id }).exec()
      res.status(200).json("post in deleted")

    } catch (error) {
      res.status(500).json(error)
    }

  };

  //post-liked-reacted

  static postIsLiked = async (req, res) => {

    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        if (post.userId !== req.body.userId) {
          await post.updateOne({ $push: { notificationLikes: req.body.userId } })
        }
        res.status(200).json("The post has been liked");

      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        if (post.userId !== req.body.userId) {
          await post.updateOne({ $pull: { notificationLikes: req.body.userId } })
        }
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }

  };

  static reacted = async (req, res) => {

    try {
      const post = await Post.findById(req.params.id);
      if (!post.heartes.includes(req.body.userId)) {
        await post.updateOne({ $push: { heartes: req.body.userId } });
        if (post.userId !== req.body.userId) {
          await post.updateOne({ $push: { notificationHeartes: req.body.userId } })
        }
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { heartes: req.body.userId } });
        if (post.userId !== req.body.userId) {
          await post.updateOne({ $pull: { notificationHeartes: req.body.userId } })
        }
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }

  };


  ///get-post-searchpost

  static getPost = async (req, res) => {

    try {
      const post = await Post.findById(req.params.id);

      res.status(200).json(post);
    } catch (err) {

      res.status(500).json(err)

    }

  };

  static searchPost = async (req, res) => {
    try {
      const post = await Post.find({ desc: req.params.id })
      res.status(200).json(post)

    } catch (err) {

      res.status(500).json(err)

    }
  };

  static getUserPosts = async (req, res) => {
    try {

      const posts = await Post.find({ userId: req.params.id })
      res.status(200).json(posts)

    } catch (error) {
      res.status(500).json("not posts")

    }
  };



  ///timeline-friend-post--allpost-friends

  static timelinePost = async (req, res) => {

    try {

      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followins.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );

      const allPostUsers = userPosts.concat(...friendPosts)
      console.log(allPostUsers)
      res.status(200).json(allPostUsers)
    } catch (err) {
      res.status(500).json(err);
    }


  };

  static timelineAllPost = async (req, res) => {
    try {

      let arr = [];
      const post = await Post.find({})
      const users = await User.find({})
      users.map(u => {
        return arr.push(u._id)
      })
      await Promise.all(
        post.map(p => {

          p.notificationLikes.map(async (n) => {

            if (arr.toString().split(",").includes(n)) {
              await User.findById(n)
            } else {

              return await p.updateOne({ $pull: { notificationLikes: n } })
            }

          })
          p.notificationHeartes.map(async (n) => {

            if (arr.toString().split(",").includes(n)) {
              await User.findById(n)
            } else {

              return await p.updateOne({ $pull: { notificationHeartes: n } })
            }

          })
        })
      )

      const user = await User.findOne({ username: req.params.username })
      const posts = await Post.find({ userId: user._id })
      res.status(200).json(posts)

    } catch (err) {
      res.status(500).json(err);
    }


  };


  //remove-location-post


  static removeLocation = async (req, res) => {
    try {

      const post = await Post.findById(req.params.id)

      await post.updateOne({ url: null })
      res.status(200).json(post)

    } catch (error) {
      res.status(500).json("location not found")

    }
  };



  ///getlikelist--getreactedList


  static getPostLikesList = async (req, res) => {

    try {
      const post = await Post.findById(req.params.id)


      const likeslist = await Promise.all(

        post.likes.map(likeId => {

          return User.findById(likeId)

        })
      )
      res.status(200).json(likeslist)

    } catch (error) {
      res.status(500).json(error)

    }
  };

  static getPostHeartList = async (req, res) => {

    try {
      const post = await Post.findById(req.params.id)

      const hearteslist = await Promise.all(
        post.heartes.map(likeId => {
          return User.findById(likeId)

        })
      )
      res.status(200).json(hearteslist)

    } catch (error) {
      res.status(500).json(error)
    }
  };




  //notification-likes-


  static getlikesNotificationList = async (req, res) => {

    try {
      const users = await User.find({});
      const post = await Post.findById(req.params.id);

      let arr = [];
      users.map(m => {
        return arr.push(m._id)

      })

      const likeNotificationList = await Promise.all(
        post.notificationLikes.map(n => {
          if (arr.toString().split(",").includes(n)) {
            return User.findById(n)
          } else {
            return post.updateOne({ $pull: { notificationLikes: n } })
          }
        })
      )



      res.status(200).json(likeNotificationList)

    } catch (error) {

      res.status(500).json(error)

    }
  };



  static pullNotificationLikes = async (req, res) => {

    try {

      const post = await Post.findById(req.params.id)


      if (req.params.userId === post.userId) {
        await post.updateOne({ notificationLikes: [] })
      }


      res.status(200).json(post)


    } catch (error) {

      res.status(500).json(error)

    }
  };


  static removeAllNotifications = async (req, res) => {

    try {
      const post = await Post.find({ userId: req.params.id })
      const user = await User.findById(req.params.id)
      await user.updateOne({ notificationBirthday: null })
      await user.updateOne({ notificationCalling: [] })
      const newPost = await Promise.all(
        post.map(p => {

          return p.updateOne({ notificationLikes: [], notificationHeartes: [], notificationComments: [] })
        })
      )

      res.status(200).json(newPost)


    } catch (error) {

      res.status(500).json(error)

    }
  };


  static getNotificationLength = async (req, res) => {

    try {

      let count = []
      let arr = []
      let comment = []
      const users = await User.find({})
      const post = await Post.find({ userId: req.params.id })
      const user = await User.findById(req.params.id)

      users.map(u => {
        arr.push(u._id)
      })


      await Promise.all(
        post.map(p => {
          p.notificationLikes.map((n) => {
            if (arr.toString().split(",").includes(n)) {
              return count.push(n)
            } else {
              return p.updateOne({ $pull: { notificationLikes: n } })
            }
          })
          p.notificationHeartes.map((n) => {
            if (arr.toString().split(",").includes(n)) {
              return count.push(n)
            } else {
              return p.updateOne({ $pull: { notificationHeartes: n } })
            }
          })

          p.notificationComments.map(n => {
            return count.push(n)

          })
        }))

      await Promise.all(
        user.notificationCalling.map(n => {
          return count.push(n)
        })
      )

      res.status(200).json(count.length)

    } catch (error) {

      res.status(500).json(error)
    }
  };
  //notification-heart

  static getHearteNotificationList = async (req, res) => {

    try {
      const users = await User.find({});
      const post = await Post.findById(req.params.id);

      let arr = [];
      users.map(m => {
        return arr.push(m._id)

      })

      const heartNotificationList = await Promise.all(
        post.notificationHeartes.map(n => {
          if (arr.toString().split(",").includes(n)) {
            return User.findById(n)
          } else {
            return post.updateOne({ $pull: { notificationHeartes: n } })
          }
        })
      )

      res.status(200).json(heartNotificationList)

    } catch (error) {

      res.status(500).json(error)

    }
  };


  static pullNotificationHeartes = async (req, res) => {

    try {

      const post = await Post.findById(req.params.id)

      if (req.params.userId === post.userId) {
        await post.updateOne({ notificationHeartes: [] })
      }
      res.status(200).json(post)

    } catch (error) {

      res.status(500).json(error)

    }
  };


}

export default PostsController;



