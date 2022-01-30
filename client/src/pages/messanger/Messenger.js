import "./messenger.scss";
import React from "react"
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversations";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Emoji from "emoji-picker-react"
import { io } from "socket.io-client";
import Modal from "react-modal";
import { useReactMediaRecorder } from "react-media-recorder";
import useSound from "use-sound";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom"
import ChatSound from "../../assets/sounds/comment.mp3"
import KeypressSound from "../../assets/sounds/keypress.wav"
import MessengerSounds from "../../assets/sounds/messenger.mp3"
import { GiphyFetch } from '@giphy/js-fetch-api'
import { CSSTransition } from "react-transition-group";
import { searchGifs } from "../../helpers/GiphCall/SearchGiphs";
import Calling from "../../assets/img/calling.png"


export const Messenger = () => {

  const [conversations, setConversations] = useState();
  const [chatSound] = useSound(ChatSound)
  let [num, setNum] = useState(0)
  const [press] = useSound(KeypressSound)
  const [messengerSound] = useSound(MessengerSounds)
  const [convert, setConvert] = useState(false)
  const [checked, setChecked] = useState(false)
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [url, setUrl] = useState("")
  const [openModal, setOPenModal] = useState(false)
  const socket = useRef();
  let { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const [img, setImg] = useState()
  const [video, setVideo] = useState([])
  const [videoUrl, setVideoUrl] = useState()
  const [typing, setTyping] = useState("")
  const [myFile, setMyFile] = useState()
  const [giphImg, setGiphImg] = useState("")
  const [giph, setGiph] = useState([]);
  const [openGips, setOpenGifs] = useState(false);
  const [calling, setCalling] = useState()

  let {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ video: true });



  ///caling and typing stoped


  const callingStop = () => {

    return setCalling("")
  }

  const typingStop = () => {
    return setTyping("")
  }





  ///giphy search
  const [data, setData] = useState([]);
  const [inputKeyword, setInputKeyword] = useState();

  const fetchData = async (inputKeyword, limit, offset) => {
    const res = await searchGifs(inputKeyword, limit, offset);
    console.log(res);
    setData(res.data);
  };

  const onSearch = () => {
    fetchData(inputKeyword, 50);
    setData([])
  };


  useEffect(() => {
    const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY)
    const setTrandingGiphy = async () => {

      const res = await gf.trending({ limit: 100 })
      return setGiph(res.data)

    }
    setTrandingGiphy()

  }, [])

  //sendvideo

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(stream => {
        document.getElementById("video").srcObject = stream;
        video.onloadedmetadata = function (e) { video.play() }
      })
      .catch(setVideo(video))
  }

  //emoji-picker-hooks

  const [showEmojis, setShowEmojis] = useState()
  const [cursorPosition, setCursorPosition] = useState()
  const pickEmojis = useRef()


  //get-your-url

  const getGeolocation = async () => {

    if (window.location.href.includes('localhost')) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUrl("" + position.coords.latitude + "," + position.coords.longitude)
      })
    } else {

      const res = await axios.get("https://ipinfo.io/geo")
      setUrl(res.data.loc)

    }
  }






  //emoji-show

  const pickEmoji = (e, { emoji }) => {
    const ref = pickEmojis.current
    ref.focus()
    const start = newMessage.substring(0, ref.selectionStart)
    const end = newMessage.substring(ref.selectionStart)
    const text = start + emoji + end
    pickEmojis.current.selectionEnd = start.length + emoji.length
    setNewMessage(text)
    setCursorPosition(start.length + emoji.length)
  }

  const handelChange = (e) => {
    setNewMessage(e.target.value)
  }

  const handelShowEmojis = () => {
    pickEmojis.current.focus()
    setOpenGifs(false)
    setShowEmojis(!showEmojis)
  }

  useEffect(() => {
    showEmojis && (pickEmojis.current.selectionEnd = cursorPosition)
  }, [cursorPosition, showEmojis])




  ///socket-connext-message

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    socket.current.on("getMessage", (data) => {

      return (

        setArrivalMessage({
          sender: data.senderId,
          recevier: data.receiverId,
          text: data.text,
          url: data.url,
          img: data.img,
          giph: giphImg,
          video: data.video,
          createdAt: Date.now(),
        })
      )
    });

  }, [giphImg]);



  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);

  }, [arrivalMessage, currentChat]);




  ///SOCKET-addUser-ONLINE

  useEffect(() => {

    const getUser = async () => {
      const res = await axios.get('api/users/?userId=' + user._id)
      socket.current.emit("addUser", user._id);
      socket.current.on("typing", (data) => { setTyping(`${data} is a typing ...`) })
      socket.current.on("calling", (data) => { setCalling(data) })
      socket.current.on("stopTyping", (data) => { alert(data) })

      socket.current.on("getUsers", (users) => {
        messengerSound()
        setOnlineUsers(
          res.data?.followins?.filter((f) => users.some((u) => u.userId === f))
        );
      });

    }
    getUser()



  }, [user, messengerSound]);



  /// get converts
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("api/conversation/" + user._id);
        setConversations(res.data)

      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);





  ///get messages

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("api/messages/" + currentChat?._id);
        setMessages(res.data);


      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    const message = {
      sender: user._id,
      text: newMessage,
      url: url,
      img: img?.name,
      video: videoUrl,
      giph: giphImg,
      coversationId: currentChat._id,
      receiverId: receiverId ? receiverId : "",


    };


    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: message.receiverId,
      url: url,
      img: img?.name,
      video: videoUrl,
      text: message.text,
      giph: giphImg
    });

    try {
      await axios.put("api/messages/notification/" + user._id + "/" + receiverId)
      const res = await axios.post("/api/messages", message);

      typingStop()
      setMessages([...messages, res.data]);
      setTyping(null)
      setNewMessage("");
      setUrl(null)
      setImg("")
      setVideoUrl(null)
      setChecked(false)
      chatSound()
      setNum(0)
      setGiphImg(null)
      setMyFile()


    } catch (err) {
      console.log(err);
    }
  };


  //scroll 
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);



  //sendphoto


  const sendPhoto = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      url: url,
      video: myFile?.name,
      giph: giphImg
    };

    if (img) {

      const data = new FormData();
      const fileName = img.name;
      data.append("file", img);
      data.append("name", fileName);
      newPost.img = fileName;
      console.log(newPost)


      try {
        await axios.post("/api/messagepicture/upload", data).catch(e => console.log(e))


      } catch (err) {
        console.log(err)
      }
    }

    else if (myFile) {
      const data = new FormData();
      const fileName = myFile.name;
      data.append("file", myFile);
      data.append("name", fileName);
      newPost.video = fileName;

      console.log(newPost)


      try {
        await axios.post("/api/messagepicture/upload", data).catch(e => console.log(e))

      } catch (err) {
        console.log(err)
      }
    }

    try {
      await axios.post("/api/messages", newPost);

    } catch (err) {
      console.log(err)
    }

  }

  //recording

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


  ///currentchat-filter-friendId

  const receiverId = currentChat?.members?.find(
    (member) => member !== user._id
  );

  useEffect(() => {
    const deleteNotificationMessages = async () => {
      await axios.delete('/api/messages/notification/' + user._id + "/" + receiverId);
      await axios.put('/api/messages/videochat/' + receiverId + "/" + user._id)

    }

    deleteNotificationMessages()

  }, [receiverId, user?._id])



  return (

    <div className={localStorage.getItem("mode") === "dark" ? "root" : null}>
      <Topbar calling={calling} />
      <div className="messenger">
        <div className={convert ? "cahtMenu-open" : "chatMenuWrapper"}>
          <div className="chatMenu">
            <h2 className="conv-title">My Friends</h2>
            {conversations ? conversations.map((c) => {

              return (
                <div key={c?._id} id="convert"
                  onDoubleClick={() => setCurrentChat(c)}
                  onClick={() => {
                    axios.delete('/api/messages/notification/' + user._id + "/" + receiverId);
                    if (receiverId) {
                      return axios.put('/api/messages/videochat/' + receiverId + "/" + user._id)
                    };

                  }}
                >

                  <Conversation typingStop={typingStop} callingStop={callingStop} typing={typing} conversation={c} currentUser={user} calling={calling} />
                </div>
              )
            }) : <Spinner animation="border" variant="primary" />}
          </div>
        </div>
        <button onClick={() => setConvert(!convert)} className="convert-button"> <i className="fa fa-envelope-open" aria-hidden="true"></i>  </button>
        <div id="mes"></div>
        <div className="chatBox">
          <div className="chatBoxWrapper">

            {currentChat ?
              <>
                <div className="chatBoxTop">

                  {messages.map((m) => (
                    <div key={m?._id} ref={scrollRef}>
                      <Message typing={typing} currentChat={currentChat} sender={m} message={m} own={m.sender === user._id} />
                    </div>
                  ))}

                </div>
                {giphImg ?
                  <div className="shareImgContainer">
                    <img className="shareImg" src={giphImg} alt="giph" />
                    <button className="shareCancelImg" onClick={() => setGiphImg(null)} > <i className="fa fa-minus-square" aria-hidden="true"></i> </button>
                  </div>
                  : null}
                {img?.type?.includes("image") ? (
                  <div className="shareImgContainer">
                    <img className="shareImg" src={URL.createObjectURL(img)} alt="" />
                    <button className="shareCancelImg" onClick={() => setImg(null)} > <i className="fa fa-minus-square" aria-hidden="true"></i> </button>
                  </div>
                ) : null}
                {img?.name?.includes(".mp3") ?
                  (<div className="shareImgContainer">
                    <audio controls src={URL.createObjectURL(img)}></audio>
                    <button className="shareCancemuzik" onClick={() => setImg(null)} >
                      <i className="fa fa-minus-square" aria-hidden="true"></i>
                    </button>
                  </div>) :
                  null}
                {img?.type?.includes("video") ? (
                  <div className="shareImgContainer">
                    <video controls className="shareVideo" src={URL.createObjectURL(img)} alt="" />
                    <button className="shareCancelImg" onClick={() => setImg(null)} > <i className="fa fa-minus-square" aria-hidden="true"></i> </button>
                  </div>
                ) : null}
                {videoUrl && !img ? <div className="shareVideoContainer"> <video controls src={mediaBlobUrl} width={400} height={400} /> <button onClick={() => setVideoUrl(null)}> <i className="fa fa-minus-square" aria-hidden="true"></i></button> </div> : null}
                <div className="chatBoxBottom">
                  {url ?
                    <div className="location-div"> <i className="fa fa-map-marker" aria-hidden="true"></i>  <span onClick={() => setUrl(null)}><i className="fa fa-times" aria-hidden="true"></i></span> </div>
                    :
                    null}
                  <textarea
                    maxLength={200}
                    onKeyPress={(e) => {
                      press()
                      socket.current.emit("typing", user.username)

                      setNum(e.target.value.length)
                    }}
                    onKeyDown={(e) => {
                      setNum(e.target.value.length)
                    }}
                    ref={pickEmojis}
                    className="chatMessageInput"
                    placeholder="write something..."

                    onChange={(e) => { setNewMessage(e.target.value); return handelChange(e) }}
                    value={newMessage}
                    onBlur={() => {
                      socket.current.emit("stopTyping", typingStop())
                    }}
                    id="message"

                  ></textarea>
                  <span className="word-length"><b style={{ color: num > 150 && num <= 190 ? "orange" : num > 190 ? "brown" : null }}>{num}</b>/200</span>
                  <form className="send-form" onSubmit={sendPhoto}>
                    <input onChange={(e) => { setImg(e.target.files[0]) }} accept=".png,.jpeg,.jpg,.webp,.svg,.mp3,.mp4,pdf" style={{ display: "none" }} type="file" id="file" />
                    <label onClick={() => { setChecked(false); return setGiphImg(null) }} htmlFor="file"> <i className="fa fa-file-image-o" aria-hidden="true"></i> </label>
                    <Link to={`/videochat/` + receiverId}>
                      <img onClick={async () => {

                        socket.current.emit("calling", ({ userId: user._id, friendId: receiverId })); return await axios.get('/api/messages/videochat/' + user.username + "/" + receiverId)
                      }}
                        className="callicon" src={Calling} alt="call" />
                    </Link>
                    {img ? <button onClick={() => setChecked(true)} className="photo-ok" type="submit"> <i style={{ color: checked ? "green" : "black" }} className="fa fa-check-square" aria-hidden="true"></i></button> : null}
                    {img ? <button disabled={!checked ? true : false} onKeyPress={() => socket.current.emit("getMessage")} className="chatSubmitButton" onClick={handleSubmit}> Send </button> : <button className="chatSubmitButton" onClick={handleSubmit} > Send <i className="fa fa-paper-plane-o" aria-hidden="true"></i> </button>}

                  </form >
                  <div className="file-send">
                    <span> <i style={{ color: openGips ? "blue" : null }} onClick={() => { setOpenGifs(!openGips); return setShowEmojis(false) }} className="fa fa-gift" aria-hidden="true"></i> </span>
                    <CSSTransition in={openGips} timeout={500} classNames="spamlist" unmountOnExit >
                      <div className="gift-section">
                        <input placeholder="search giph..." type="text" onChange={e => setInputKeyword(e.target.value)} />
                        <button onClick={onSearch}><i className="fa fa-search"></i></button>
                        <div className="gift-row">
                          {data.map((d, idx) => (
                            <img onClick={() => { setVideoUrl("");; setGiphImg(d.images.downsized.url); return setImg(null) }} className="giphy" key={idx} src={d.images.original.url} alt="gif" />
                          ))}
                          {giph.map(g => {
                            return (
                              <div key={g?.id}><img onClick={() => { setVideoUrl(""); setGiphImg(g.images.downsized.url); return setImg(null) }} className="giphy" src={g.images.downsized.url} alt="gif" /> </div>
                            )
                          })}
                        </div>
                      </div>
                    </CSSTransition>
                    <span> <i onClick={handelShowEmojis} style={{ color: showEmojis ? "green" : null }} className="fa fa-smile-o" aria-hidden="true"></i> </span>
                    {showEmojis ? <><Emoji onEmojiClick={pickEmoji} /> </> : null}
                    <span> <i onClick={getGeolocation} class="fa fa-map-marker" aria-hidden="true"></i>  </span>
                    <span id="video-recording" onClick={() => { setOPenModal(!openModal); return setGiphImg(null) }} ><i className="fa fa-video-camera" aria-hidden="true"></i>  </span>
                    <Modal style={customStylesImg} isOpen={openModal}>
                      <div className="videorecord">
                        <video id="video" ref={video} controls autoPlay loop />
                        <p>{status}...</p>
                        {!window.location.href.includes("localhost") ? <button onClick={function () { alert("The video recording feature is blocked by the server !") }} style={{ width: 120, height: 45, position: "absolute", bottom: "-75%", right: "-85%" }} className="start" > Start video  </button> : null}
                        <div className="videorecord-button">
                          {window.location.href.includes("localhost") ? <button onClick={function () { startVideo(); startRecording() }} className="start" > Start video  </button> : null}
                          <button className="stop" onClick={stopRecording} >Stop </button>
                          <button className="close" onClick={() => {
                            setVideoUrl(mediaBlobUrl);
                            setOPenModal(!openModal)
                          }}>Close</button>
                        </div>
                        {videoUrl ? <video className="record-video" src={mediaBlobUrl} controls autoPlay loop /> : null}
                      </div>
                    </Modal>
                  </div>
                </div>
              </>
              :
              <span className="noConversationText">
                Open a conversation communicate with your friends
              </span>}

          </div>
        </div>
        <div className="chatOnline-menu">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
        <Link to={'/'}><button className="go-back">Go back <i className="fa fa-arrow-left" aria-hidden="true"></i></button></Link>
        <Link className="back" to={'/'}><span ><i className="fa fa-arrow-left" aria-hidden="true"></i></span></Link>
      </div>
    </div>
  )
}