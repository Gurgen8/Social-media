import express from "express";
import StorisController from "../controller/StorisController";

const router = express.Router();

///create-stori

router.post('/', StorisController.storisCreate)


//get stories -by user

router.get('/userstoris/:id', StorisController.getStories)


///get storis-all

router.get('/:userId', StorisController.getStoriesAll)


///delete-stories

router.delete('/:id', StorisController.deleteStories)


///get-stori by id

router.get('/stori/:id', StorisController.getStorisById)


///watching-story

router.post('/:storisId/:userId', StorisController.watchStory)


///get-watching-list of story

router.get('/watchinglist/:storisId', StorisController.getWatchingList)


///get-storis-date

router.get('/data/:userId', StorisController.storisData)




export default router