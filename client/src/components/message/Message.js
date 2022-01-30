import "./message.scss";
import { format } from "timeago.js";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useState } from "react";
import Modal from 'react-modal';
import RemoveSound from "../../assets/sounds/remove.mp3"
import MessageSounds from "../../assets/sounds/messenger.mp3"
import useSound from "use-sound";
import { Link } from "react-router-dom";



export default function Message({ sender, message, own, currentChat }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [userData, setUserData] = useState("")
  const [friendData, setFriendData] = useState("")
  const [modalImg, setModalImg] = useState(false)
  const { user } = useContext(AuthContext)
  const [show, setShow] = useState(false)
  const [removeSound] = useSound(RemoveSound)
  const [messageSound] = useSound(MessageSounds)

  const friendId = currentChat.members.find((m) => m !== user._id)

  useEffect(() => {

    const getUser = async () => {
      const res = await axios.get('/api/users/?userId=' + user._id)
      return setUserData(res.data)

    }
    getUser()

  }, [user._id])


  useEffect(() => {
    const sender = async () => {
      const res = await axios.get('/api/users/?userId=' + message.sender)
      return setFriendData(res.data)

    }
    sender()

  }, [message])


  useEffect(() => {
    message.sender !== user._id && messageSound()

  }, [messageSound, user?._id, message?.sender])

  //modal-style


  const customStylesImg = {
    content: {
      overflowY: "scroll",
      top: '50%',
      left: '50%',
      right: '10%',
      bottom: '0%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: "white",
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.91)',


    }
  };


  //REMOVE-MESSAGE

  const removeMessage = async (message) => {

    try {
      removeSound()
      await axios.delete("api/messages/" + message._id + "/" + friendId + "/" + user._id)

    } catch (error) {
      console.log(error)
    }

    setTimeout(() => { window.location.reload() }, 300)

  }

  return (

    <div className={own ? "message own" : "message"}>
      <Modal isOpen={modalImg} onRequestClose={modalImg ? false : null} style={customStylesImg}>
        <div className="modal_div">
          <img className="modal-img" src={PF + "/message/" + message.img} alt="cover" />
          <button onClick={() => setModalImg(!modalImg)}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
        </div>
      </Modal>
      <div className="messageTop">

        {own ? <img
          className="messageImg"
          src={userData.profilePicture ? PF + "/person/" + userData.profilePicture : userData.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"}
          alt=""
        /> : <Link to={"/profile/" + friendData?.username} > <img
          className="messageImg"
          src={friendData?.profilePicture ? PF + "/person/" + friendData.profilePicture : friendData.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"}
          alt="friend-img" />
        </Link>}

        <div style={{ height: (message.img && !message.img.includes("mp3")) && message.giph ? 320 : null }} className="messageText">

          {message.url ? <a style={{ marginRight: 18 }} target="_blank" rel="noreferrer" href={`https://www.google.ru/maps/@${message.url},15z`}> <i className="fa fa-location-arrow" aria-hidden="true"></i> </a> : null}
          {message?.text?.length > 80 && !show ? <>{message.text.substring(0, 80)}......</> : message.text}  {message.text && message.text.length > 60 ? <button onClick={() => setShow(!show)}>{show ? "less" : "show"}</button> : null}
          {message.img?.includes(".mp3") ? <div className="audio"><audio controls src={PF + "/message/" + message.img}></audio> </div>
            : message.img?.includes(".jpg", ".png", ".jpeg", ".webp", ".svg", "media")
              ? <div className="messages-div">
                <img onClick={() => setModalImg(!modalImg)} src={PF + "/message/" + message.img} alt="message-img" />
              </div>
              : message.img?.includes("mp4")
                ? <div className="messages-div"><video className="message-video" controls src={PF + "/message/" + message.img}></video></div>
                : null}
          {message.video ? <div className="video"><video style={{ height: "200px", width: "100%" }} autoPlay="true" play="true" controls src={message.video}></video> </div> : null}
          {message.giph ? <div className="giph"><img style={{ height: "200px", width: "100%" }} src={message.giph} alt="gihpi-img" /> </div> : null}
        </div>
        <span className="delete-sms"><i onClick={() => removeMessage(message)} className="fa fa-trash-o" aria-hidden="true"></i></span>
      </div>
      <div className="messageBottom">
        {format(message.createdAt)}<i className="fa fa-check" aria-hidden="true"></i>
      </div>
    </div>

  );
}

