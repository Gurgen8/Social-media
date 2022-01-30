import User from "../models/Users"
import Conversation from "../models/Conversation";
import bcrypt from "bcrypt";
import authSchem from "../validator/Validate"
import jwt from "jsonwebtoken"
import qrcode from "qrcode"
import speakeasy from "speakeasy"

const secret = speakeasy.generateSecret();



class UsersController {

  static register = async (req, res, next) => {
    try {
      const { username, email, password, lastname, job, scool, age, phone, birthDay, from, city, male, single } = req.body;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const result = await authSchem.validateAsync(req.body)
      const newUser = new User({
        username: username,
        lastname: lastname,
        scool: scool,
        age: age,
        phone: phone,
        birthDay: birthDay,
        email: email,
        from: from,
        male: male,
        single: single,
        city: city,
        job: job,
        notificationBirthday: birthDay,
        password: passwordHash,
        passwordAgain: passwordHash,
      });

      const user = await newUser.save();





      res.status(200).json(user)


    } catch (error) {

      if (error.isJoi === true) {
        error.status = 422
        next(error.message)



      }
      res.status(500).json(error)

    }

  };

  static login = async (req, res) => {


    try {
      const user = await User.findOne({ email: req.body.email });
      const { email } = req.body


      if (!user) {
        res.status(404).json("invalid email or password");
      }
      else {
        const validPassword = await bcrypt.compare(req.body.password, user.password)

        if (validPassword) {

          // const token = jwt.sign(
          //   { user_id: user._id, email },
          //   process.env.ACCESS_TOKEN_SECRET,
          //   {
          //     expiresIn: "2h",
          //   }
          // );   

          // user.token = token;
          // res.status(200).json(user)
          res.status(200).json({ username: user.username })

        } else {
          res.status(404).json("invalid password or email");
        }

      }


    } catch (err) {
      res.status(500).json(err)
    }

  };

  static getQrCode = async (req, res) => {

    try {
      qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
        res.json(data_url);
      })



    } catch (error) {

      res.status(200).json(error)
    }
  }

  static varification = async (req, res) => {

    try {
      const user = await User.findOne({ email: req.body.email });
      const { email } = req.body
      const token = req.body.varificationNumber;
      const verfied = speakeasy.totp.verify({ secret: secret.base32, encoding: 'base32', token: token });
      const validPassword = await bcrypt.compare(req.body.password, user.password)

      if (!user || !verfied || !validPassword) {
        res.status(404).json("invalid varification number");
      } else {

        const authtoken = jwt.sign(
          { user_id: user._id, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "2h",
          }
        );

        user.token = authtoken;

        res.status(200).json(user)
      }

    } catch (error) {

      res.status(200).json(error)

    }
  }

  static userUpdate = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id,
        {
          $set: req.body,
          age: req.body.age
        })

      res.status(200).json(user)


    } catch (error) {
      res.status(500).json("info not updated ")

    }

  };


  static userDelete = async (req, res) => {

    try {

      await Conversation.deleteOne({ members: { $in: [req.params.id] } })
      await User.findByIdAndDelete(req.params.id)
      res.status(200).json("Acount has been deleted")

    } catch (err) {
      return res.status(500).json(err);
    }
  };



  static getUser = async (req, res) => {
    const userId = req.query.userId
    const username = req.query.username

    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username })

      res.status(200).json(user)

    } catch (error) {

      res.status(500).json(error)
    }

  };

  static getFriends = async (req, res) => {
    try {

      const users = await User.find({})
      let arr = []
      users.map(m => {
        return arr.push(m._id)

      })

      const user = await User.findById(req.params.userId)
      const friends = await Promise.all(
        user.followins.map(async (friendId) => {
          if (arr.toString().split(",").includes(friendId)) {
            return await User.findById(friendId)
          } else {

            return (await Conversation.deleteOne({ members: { $in: [friendId] } }),
              await user.updateOne({ $pull: { followins: friendId } })

            )


          }
        }))

      let friendList = [];

      friends.map((friend) => {
        const { _id, username, profilePicture, male } = friend
        friendList.push({ _id, username, profilePicture, male })


      })

      res.status(200).json(friendList)




    } catch (error) {

      res.status(500).json(error)
    }


  };

  static getFollowers = async (req, res) => {
    try {
      const users = await User.find({})
      let arr = []
      users.map(m => {
        return arr.push(m._id)

      })

      const user = await User.findById(req.params.userId)


      const friends = await Promise.all(

        user.followers.map(async (friendId) => {
          if (arr.toString().split(",").includes(friendId)) {
            return await User.findById(friendId)

          } else {
            return (await user.updateOne({ $pull: { followers: friendId } }),
              await Conversation.deleteOne({ members: { $in: [friendId] } }))
          }
        })
      )
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture, male } = friend
        friendList.push({ _id, username, profilePicture, male })
      })

      res.status(200).json(friendList)
    } catch (error) {

      res.status(500).json(error)
    }

  }

  static usersFollow = async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {

        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)
        await user.updateOne({ $pull: { notificationMessages: req.body.userId } })

        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } })
          await currentUser.updateOne({ $push: { followins: req.params.id } })
          await user.updateOne({ $push: { notificationFriends: req.body.userId } })


          const conversation = await new Conversation({ members: [req.body.userId, req.params.id] }).save()


          res.status(200).json({ conversation })
          if ((user.followins.includes(currentUser._id) && currentUser.followers.includes(user._id)) || currentUser.followins.includes(currentUser._id) && user.followers.includes(user._id)) {
            await Conversation.deleteOne({ members: [req.body.userId, req.params.id] });
            res.json({ status: "ok" })

          }

        } else {
          await currentUser.updateOne({ $pull: { notificationMessages: req.params.id } })
          await user.updateOne({ $pull: { followers: req.body.userId } })
          await currentUser.updateOne({ $pull: { followins: req.params.id } })
          await user.updateOne({ $pull: { notificationMessages: req.params.id } })
          await user.updateOne({ $pull: { notificationFriends: req.body.userId } })

          res.status(200).json(currentUser)

          await Conversation.deleteOne({ members: [req.body.userId, req.params.id] });
        }
      } catch (error) {
        res.status(500).json(error)
      }
    } else {
      res.status(500).json("You can not log in to your personal page")
    }
  };

  static usersUnFollow = async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)
        await user.updateOne({ $pull: { notificationMessages: req.body.userId } })
        await user.updateOne({ $pull: { notificationFriends: req.body.userId } })
        await currentUser.updateOne({ $pull: { notificationFriends: req.body.userId } })

        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } })
          await Conversation.deleteOne({ members: [req.body.userId, req.params.id] });
          await currentUser.updateOne({ $pull: { followins: req.params.id } })

        } else {

          res.status(403).json("user allready a unfollowrd")
        }

        res.status(200).json(user)

      } catch (error) {
        res.status(500).json(error)
      }
    }
  };

  static getAllUsers = async (req, res) => {

    try {

      const users = await User.find({})
      res.status(200).json(users)

    } catch (error) {

      res.status(500).json("users not found")
    }

  };

  static getFriendsByname = async (req, res) => {
    try {

      const user = await User.findOne({ username: req.params.username })
      const friends = await Promise.all(
        user.followins.map(friendId => {
          return User.findById(friendId)
        })
      )
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture, male } = friend
        friendList.push({ _id, username, profilePicture, male })
      })

      res.status(200).json(friendList)



    } catch (error) {
      res.status(500).json(error)

    }

  };

  static getFollowersByname = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username })
      const friends = await Promise.all(
        user.followers.map(friendId => {
          return User.findById(friendId)
        })
      )
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture, male } = friend
        friendList.push({ _id, username, profilePicture, male })
      })

      res.status(200).json(friends)
    } catch (error) {

      res.status(500).json(error)
    }

  };

  static deleteFollowers = async (req, res) => {

    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      await user.updateOne({ $pull: { notificationMessages: req.body.userId } })
      await currentUser.updateOne({ $pull: { followins: req.params.id } })
      await user.updateOne({ $pull: { followers: req.body.userId } })
      await Conversation.deleteOne({ members: [req.body.userId, req.params.id] });
      await user.updateOne({ $pull: { notificationFriends: req.body.userId } })


      res.json(user)
    } catch (error) {
      res.status(500).json(error)

    }

  };


  static createSpam = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user.spam.includes(req.body.userId)) {
        await user.updateOne({ $push: { spam: req.body.userId } });
        res.status(200).json("The user has been diseliked");
      } else {
        await user.updateOne({ $pull: { spam: req.body.userId } });
        res.status(200).json("The user  remove disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  static getSpamList = async (req, res) => {
    try {
      let arr = []
      const users = await User.find({})
      users.map(u => {
        arr.push(u._id)
      })
      console.log(arr.toString().split(","))

      const user = await User.findOne({ username: req.params.username });
      const spamlist = await Promise.all(
        user.spam.map(s => {
          if (arr.toString().split(",").includes(s)) {
            return User.findById(s)
          } else {
            return user.updateOne({ $pull: { spam: s } })
          }

        })
      )
      res.status(200).json(spamlist)

    } catch (err) {
      res.status(500).json(err);
    }
  };



  static userdelSpam = async (req, res) => {

    try {
      const user = await User.findById(req.params.id)

      if (user.spam.length > 2) {
        await user.delete()
        res.status(200).json("user deleted")

      } else {
        res.status(200).json("warning:spam")

      }
    } catch (err) {
      return res.status(500).json(err);
    }

  };



  static getFollowersNotification = async (req, res) => {
    try {
      const users = await User.find({})
      let arr = [];
      let friendList = [];
      users.map(m => {
        return arr.push(m._id)

      })

      const user = await User.findById(req.params.userId)

      const friendsNotification = await Promise.all(

        user.notificationFriends.map((friendId) => {
          if (arr.toString().split(",").includes(friendId)) {
            return User.findById(friendId)

          } else {
            return user.updateOne({ $pull: { notificationFriends: friendId } })
          }
        })
      )

      friendsNotification.map((friend) => {
        const { _id, username, profilePicture, male } = friend
        friendList.push({ _id, username, profilePicture, male })
      })

      res.status(200).json(friendList)
    } catch (error) {

      res.status(500).json(error)
    }

  };


  static pullFriendNotificationList = async (req, res) => {

    try {

      const user = await User.findById(req.params.userId);
      const friend = await User.findById(req.params.friendId)
      const newUser = await Promise.all(
        user.notificationFriends.map((n) => {
          if (n === req.params.friendId) {
            return user.updateOne({ $pull: { notificationFriends: n } })
          } else {
            return user
          }
        }))


      res.status(200).json(newUser)


    } catch (error) {
      res.status(500).json(error)

    }
  };



  static removeFriendsNotificationList = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId,
        {
          $set: req.body,
          notificationFriends: []

        })
      res.status(200).json(user)


    } catch (error) {
      res.status(500).json(error)

    }
  };




}


export default UsersController;
