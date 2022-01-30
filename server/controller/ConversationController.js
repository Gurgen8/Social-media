import Conversation from "../models/Conversation"

class Conversations {

  static createConversation = async (req, res) => {
    try {

      const conversation = await new Conversation({
        members: [req.body.senderId, req.body.receiverId]
      }).save()
      res.status(200).json(conversation)
    } catch (error) {
      res.status(500).json(error)
    }
  };


  static getConversations = async (req, res) => {
    try {
      const conversations = await Conversation.find({
        members: { $in: [req.params.userId] }
      });
      res.status(200).json(conversations)
    } catch (error) {
      res.status(500).json(error)
    }
  };

  static findUserId = async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firsUserId, req.params.secondUserId] }
      })
      res.status(200).json(conversation)
    } catch (error) {

      res.status(500).json(error)

    }
  };


  static removeConvert = async (req, res) => {
    try {
      const conversations = await Conversation.deleteOne({
        members: { $in: [req.params.userId] }
      });
      res.status(200).json("sucsses")
    } catch (error) {

      res.status(500).json(error)
    };
  };
}

export default Conversations