import Message from "../models/Message"
import User from "../models/Users"


class Messages {

    static createMessage = async (req, res) => {
        try {

            const newMessage = await new Message(req.body).save()

            res.status(200).json(newMessage)

        } catch (error) {

            res.status(500).json(error)

        }
    };


    static getMessages = async (req, res) => {
        try {
            const messages = await Message.find({
                coversationId: req.params.coversationId
            })

            res.status(200).json(messages)

        } catch (error) {

            res.status(500).json(error)

        }
    };


    static removeMessage = async (req, res) => {

        try {

            const message = await Message.findByIdAndRemove(req.params.messageId)
            const user = await User.findById(req.params.id)
            await user.updateOne({ $pull: { notificationMessages: req.params.userId } })
            console.log(req.body.userId)


            res.status(200).json(user)

        } catch (error) {
            res.status(500).json(error)

        }

    }


    static removeAllMessage = async (req, res) => {

        try {


            const messages = await Message.deleteMany({
                coversationId: { $in: [req.params.senderId] }
            });

            const friend = await User.findOne({ _id: req.params.friendId })
            const user = await User.findOne({ _id: req.params.userId })



            friend.notificationMessages.map(async (n) => {
                return await friend.updateOne({ $pull: { notificationMessages: req.params.userId } })
            })

            user.notificationMessages.map(async (n) => {
                return await User.updateOne({ $pull: { notificationMessages: req.params.friendId } })
            })


            res.status(200).json(friend)


        } catch (error) {
            res.status(500).json(error)

        }

    };

    static updateMessage = async (req, res) => {
        try {

            const message = await Message.findById(req.params.id)
            await message.updateOne({ $set: req.body })

            res.status(200).json()


        } catch (error) {
            res.status(500).json(error)

        }
    };


    ///notifications

    static setMessagesNotification = async (req, res) => {

        try {
            const user = await User.findById(req.params.userId)
            const chatFriend = await User.findById(req.params.friendId)
            if (!chatFriend.notificationMessages.includes(user._id)) {
                await chatFriend.updateOne({ $push: { notificationMessages: req.params.userId } })
            }


            res.status(200).json(chatFriend)

        } catch (error) {

            res.status(500).json(error)

        }
    };





    static removeMessagesNotification = async (req, res) => {

        try {
            const user = await User.findByIdAndUpdate(req.params.userId,
                {
                    $set: req.body,
                    notificationMessages: []
                })

            res.status(200).json(user)

        } catch (error) {


            res.status(500).json(error)

        }
    };




    static getMessagesNotification = async (req, res) => {

        try {

            const users = await User.find({})
            let arr = []
            users.map(u => {
                arr.push(u._id)
            })

            const user = await User.findById(req.params.userId);

            const messagesList = await Promise.all(
                user.notificationMessages.map(n => {
                    if (arr.toString().split(",").includes(n)) {
                        return User.findById(n)
                    } else {
                        return user.updateOne({ $pull: { notificationMessages: n } })
                    }
                })
            )

            res.status(200).json(messagesList)


        } catch (error) {

            res.status(500).json(error)

        }
    };


    static pullNotificationMessages = async (req, res) => {

        try {

            const user = await User.findById(req.params.userId);
            const newUser = await Promise.all(
                user.notificationMessages.map((n) => {
                    if (n === req.params.friendId) {
                        return user.updateOne({ $pull: { notificationMessages: n } })
                    } else {

                        return user
                    }
                }))


            res.status(200).json(newUser)

        } catch (error) {

            res.status(500).json(error)
        }
    };



    ///videochat 


    static getVideochatConnected = async (req, res) => {

        try {
            const friend = await User.findById(req.params.friendid)
            await friend.updateOne({ videoConenctId: req.body.videochatId })

            res.status(200).json(friend)

        } catch (error) {


            res.status(500).json(error)

        }
    }

    static videochatNotification = async (req, res) => {

        try {

            const user = await User.findOne({ username: req.params.username })
            const friend = await User.findById(req.params.friendid)

            await friend.updateOne({ $push: { notificationCalling: req.params.username } })


            res.status(200).json(friend)



        } catch (error) {


            res.status(500).json(error)

        }

    };

    static removeVideochatNotification = async (req, res) => {
        try {

            const friend = await User.findById(req.params.friendId)
            const name = friend.username
            const user = await User.findById(req.params.userId)

            const newUser = await Promise.all(
                user.notificationCalling.map(n => {
                    return user.updateOne({ $pull: { notificationCalling: name } })
                })
            )

            res.status(200).json(user)


        } catch (error) {

            res.status(500).json(error)

        }
    };


    static removeVideochatNotificationByname = async (req, res) => {

        try {


            const user = await User.findById(req.params.userId)
            const newUser = await Promise.all(
                user.notificationCalling.map(n => {
                    return user.updateOne({ $pull: { notificationCalling: req.params.username } })
                })
            )
            res.status(200).json(user)


        } catch (error) {

            res.status(500).json(error)

        }
    }


    static removeConectId = async (req, res) => {

        try {

            const currentUser = await User.findById(req.params.userId)
            const user = await User.findById(req.params.id)
            await user.updateOne({ videoConenctId: "" })
            await currentUser.updateOne({ videoConenctId: "" })

            res.status(200).json(user)


        } catch (error) {

            res.status(500).json(error)

        }


    }

}



export default Messages