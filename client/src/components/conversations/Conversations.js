import axios from "axios";
import { useEffect, useState } from "react";
import "./conversations.scss";
import Calling from "../../assets/img/calling.png"
import { Link } from "react-router-dom";
import CallingSound from "../../assets/sounds/calling.mp3"
import NoCalling from "../../assets/img/nocalling.png"
import RemoveSound from "../../assets/sounds/remove.mp3"
import useSound from "use-sound";



export default function Conversation({ callingStop, conversation, currentUser, typing, calling }) {
  const [user, setUser] = useState(null);
  const [removeSound] = useSound(RemoveSound)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const friendId = conversation.members.find((m) => m !== currentUser._id)
  const userId = conversation.members.find((m) => m === currentUser._id)
  const [audio, setAudio] = useState(new Audio(CallingSound))


  const stop = () => {
    audio.pause()
    return setAudio(new Audio(CallingSound))

  }


  //delete all-messages

  const deleteAllMessages = async (convert) => {

    await axios.delete('/api/messages/message/' + convert._id + "/" + friendId + "/" + userId)

    removeSound()

    setTimeout(() => {
      window.location.reload()
    }, (800))
  }



  useEffect(() => {

    calling?.userId === friendId && calling?.friendId === userId && audio.play();
    (!calling || !(calling?.userId === friendId && calling?.friendId === userId)) && audio.pause()
  }, [calling, friendId, userId, audio])




  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id)
    const getUser = async () => {
      try {
        const res = await axios("api/users?userId=" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);


  return (
    <>
      <div className="conversation">
        {(calling?.userId === userId || calling?.friendId === friendId) || (calling?.userId === friendId) ? <i style={{ marginRight: "5px", fontSize: "20px" }} className="fa fa-video-camera" aria-hidden="true"></i> : null}
        <img

          className="conversationImg" ss
          src={
            user?.profilePicture
              ? PF + "/person/" + user.profilePicture
              : user?.male === "man"
                ? PF + "person/noAvatar.png"
                : PF + "/person/woman.png"
          }
          alt=""
        />
        <div className="convert-typing">
          <span className="conversationName">
            {user?.username}
            <span> <i onClick={() => deleteAllMessages(conversation)} className="fa fa-eraser" aria-hidden="true"></i> </span>
            {calling?.userId === friendId && calling?.friendId === userId ?
              <div style={{ display: !calling ? "none" : "flex" }} >
                <img onClick={async () => { stop(); callingStop(); return await axios.put("/api/messages/videochat/" + friendId + "/" + userId) }} className="callicon" src={NoCalling} alt="nocalling" />
                <div className="message-loader">
                  <div className="loader-bar"></div>
                </div>
                <Link onClick={async () => { return await axios.put("/api/messages/videochat/" + friendId + "/" + userId) }} to={`/videochat/` + friendId}> <img onClick={() => { stop(); return callingStop() }} className="callicon" src={Calling} alt="call" /> </Link>
              </div>
              : null}
          </span>

          <b className="typing">  <div style={{ visibility: !calling && typing && typing?.includes(user?.username) ? "visible" : 'hidden', margin: 0, background: "none" }} className="col-3">
            <div className="snippet" data-title=".dot-typing">
              <div className="stage">
                <div className="dot-typing">
                  {/* {typing && typing.includes(user?.username)?typingSound():null} */}
                </div>
              </div>
            </div>
          </div>
          </b>
        </div>

      </div>

    </>

  );
}