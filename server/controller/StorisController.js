import User from "../models/Users"
import Stori from "../models/Stori";


class StorisController {

  //post-create-update-delete

  static storisCreate = async (req, res) => {

    const newStori = new Stori(req.body);

    try {

      const savedStori = await newStori.save();

      res.status(200).json(savedStori)

    } catch (error) {
      res.status(500).json(error)
    }

  };


  static getStorisById = async (req, res) => {

    try {

      const stori = await Stori.findOne({ _id: req.params.id });

      res.status(200).json(stori)


    } catch (error) {

      res.status(500).json(error)

    }
  }



  static getStoriesAll = async (req, res) => {

    try {

      const currentUser = await User.findById(req.params.userId);
      const userStoris = await Stori.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(

        currentUser.followins.map((friendId) => {
          return Stori.find({ userId: friendId });
        })
      );


      const allStorisUsers = userStoris.concat(...friendPosts);
      res.status(200).json(allStorisUsers)

    } catch (err) {
      res.status(500).json(err);
    }


  };

  static getStories = async (req, res) => {

    try {

      const userStories = await Stori.find({ userId: req.params.id })

      res.status(200).json(userStories)



    } catch (error) {

      res.status(500).json(error)

    }
  };

  static deleteStories = async (req, res) => {

    try {

      await Stori.findByIdAndRemove({ _id: req.params.id }).exec()
      res.status(200).json("your storis has been deleted")


    } catch (error) {

      res.status(500).json(error)

    }
  };


  static watchStory = async (req, res) => {


    try {
      const stori = await Stori.findById({ _id: req.params.storisId }).exec()

      if (!stori.watchers.includes(req.params.userId)) {

        await stori.updateOne({ $push: { watchers: req.params.userId } })
      }

      res.status(200).json(stori)

    } catch (error) {

      res.status(500).json(error)

    }
  };



  static getWatchingList = async (req, res) => {

    try {

      let arr = [];
      const stori = await Stori.findById({ _id: req.params.storisId }).exec()
      const users = await User.find({})

      users.map(m => {
        return arr.push(m._id)

      })

      const watchingList = await Promise.all(
        stori.watchers.map(n => {
          if (arr.toString().split(",").includes(n)) {

            return User.findById(n)
          } else {
            return stori.updateOne({ $pull: { watchers: n } })
          }
        })
      )

      res.status(200).json(watchingList)


    } catch (error) {

      res.status(500).json(error)

    }
  };


  static storisData = async (req, res) => {

    try {
      let data = []
      const userStories = await Stori.find({ userId: req.params.userId })
      userStories.map(u => {

        if (((new Date().toISOString().split('T')[0]) === u.createdAt.toISOString().split('T')[0]))
          data.push((new Date().toISOString().split('T')[0]) === u.createdAt.toISOString().split('T')[0]);


      })

      res.status(200).json(data)



    } catch (error) {

      res.status(200).json(error)

    }
  }

}

export default StorisController;



