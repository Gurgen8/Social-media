import axios from "axios";
import { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./share.scss";
import Emoji from "emoji-picker-react"
import GeoLocation from "../../helpers/Geo/GeoLocation";
import useSound from "use-sound";
import KeypressSound from "../../assets/sounds/keypress.wav";
import PostSounds from "../../assets/sounds/post.mp3"



export default function Share() {

  //usesounds
  const [postSound] = useSound(PostSounds)
  const [press] = useSound(KeypressSound)

  //usestate
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [fileShare, setFileShare] = useState(null)
  const [users, setUsers] = useState([])
  //emoji-state
  const [message, setMessage] = useState("")
  const [showEmojis, setShowEmojis] = useState()
  const [cursorPosition, setCursorPosition] = useState()
  //geolocation
  const [openMap, setOpenMap] = useState(false)
  const [url, setUrl] = useState("")
  const [lat, setLat] = useState()
  const [long, setLong] = useState()

  //useContext
  const { user } = useContext(AuthContext)

  //ref
  const desc = useRef()


  //emoji--share-post////


  const pickEmoji = (e, { emoji }) => {
    const ref = desc.current
    ref.focus()
    const start = message.substring(0, ref.selectionStart)
    const end = message.substring(ref.selectionStart)
    const text = start + emoji + end
    desc.current.selectionEnd = start.length + emoji.length
    setMessage(text)
    setCursorPosition(start.length + emoji.length)
  }

  const handelChange = (e) => {
    setMessage(e.target.value)

  }

  const handelShowEmojis = () => {
    desc.current.focus()
    setShowEmojis(!showEmojis)
  }

  useEffect(() => {
    desc.current.selectionEnd = cursorPosition
  }, [cursorPosition])


  ///useEffects


  useEffect(() => {
    const fetchAllUsers = async () => {
      const res = await axios.get(`/api/users/getallusers`)
      setUsers(res.data)

    }
    fetchAllUsers()

  }, [user._id])



  //sumbithandler-form-share-post
  const submitHandler = async (e) => {
    e.preventDefault();
    postSound()
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
      url: url
    };

    const config = {
      onUploadProgress: function (progressEvent) {
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      }
    }

    if (fileShare) {

      const data = new FormData();
      const fileName = fileShare.name;
      data.append("file", fileShare);
      data.append("name", fileName);
      newPost.img = fileName;

      try {
        await axios.post("/api/upload", data, config);

      } catch (err) {
        console.log(err)
      }
    }

    try {
      await axios.post("/api/post", newPost);
      setTimeout(() => {
        window.location.reload()
      }, 800)

    } catch (err) {
      console.log(err)
    }
  }

  //openmap

  const isOpenMap = () => {

    setOpenMap(!openMap)
  }

  //get-geolocation

  const getGeolocation = async () => {
    if (window.location.href.includes("localhost")) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
        setUrl("" + position.coords.latitude + "," + position.coords.longitude)
      })
    } else {
      const res = await axios.get("https://ipinfo.io/geo")
      console.log(res.data.loc)
      setLat(res.data.loc.substring(7, 0))
      console.log(res.data.loc)
      setLong(res.data.loc.substring(8, 15))
      setUrl(res.data.loc)
    }
  }
  return (
    <div style={{ height: fileShare?.type.includes("image") || openMap || fileShare?.type.includes("video") ? 715 : url ? 300 : fileShare?.type.includes("audio") ? 250 : 170 }} className="share">
      <div style={{ height: openMap ? 726 : null }} className="shareWrapper">
        <div className="shareTop">

          {users.map(u => {
            if (user._id === u._id) {
              return <img key={u?._id} src={u.profilePicture ? PF + "person/" + u.profilePicture : u.male === "man" ? PF + `person/noAvatar.png` : PF + 'person/woman.png'} alt="user_icon" className="topbarImg" />
            } else {
              return <div key={u._id} > </div>
            }
          })}
          <textarea
            id="share-textarea"
            placeholder={`Whats is your mind  ${user.username}  ?...`}
            className="shareInput"
            ref={desc}
            onChange={handelChange}
            value={message}
            onKeyPress={() => press()}
          />
        </div>
        {url ?
          <div className="corrd_section">
            <i style={{ color: "red" }} className="fa fa-map-marker" aria-hidden="true"></i>
            <div>
              <div>
                <li className="position"> <b>lat: </b>{lat} <i className="fa fa-map-pin" aria-hidden="true"></i> </li>
                <li className="position"> <b> long: </b>{long} <i className="fa fa-map-pin" aria-hidden="true"></i></li>
              </div>
            </div>
            <button onClick={() => setUrl(null)}><i className="fa fa-window-close" aria-hidden="true"></i></button>
          </div>
          : null}
        <hr className="shareHr" />
        {fileShare?.name.includes('.mp4') ?
          <div className="shareImgContainer">
            <video controls className="shareImg" src={URL.createObjectURL(fileShare)} alt="video" />
            <button id="shareCancel" className="shareCancelImg" onClick={() => setFileShare(null)} > <i className="fa fa-minus-circle" aria-hidden="true"></i> </button>
          </div>
          : null}
        {fileShare?.name.includes('.mp3') ?
          <div className="audio-share" >
            <audio controls src={URL.createObjectURL(fileShare)} alt="audio" />
            <button id="shareCancel" className="shareCancelImg" onClick={() => setFileShare(null)} > <i className="fa fa-minus-circle" aria-hidden="true"></i> </button>
          </div>
          : null}
        {fileShare?.type.includes("image") ? <div className="shareImgContainer">
          <img className="shareImg" src={URL.createObjectURL(fileShare)} alt="" />
          <button id="shareCancel" className="shareCancelImg" onClick={() => setFileShare(null)} > <i className="fa fa-minus-circle" aria-hidden="true"></i> </button>
        </div> : null
        }
        {openMap ? (
          <div style={{ display: fileShare ? "none" : null }} className="shareImgContainer">
            <GeoLocation />
            <button className="shareCancelbtn" onClick={() => setOpenMap(null)} > <i className="fa fa-minus-circle" aria-hidden="true"></i> </button>
          </div>
        ) : null}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div style={{ marginTop: fileShare ? 10 : null }} className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <i className="fa fa-photo"></i>
              <span style={{ textDecoration: fileShare ? "overline red 2px" : null }} className="shareOptionText">Photo or Video (audio)</span>
              <input
                type="file"
                style={{ display: "none" }}
                id="file"
                accept=".png,.jpeg,.jpg,.webp,.svg,.mp4,.mp3"
                onChange={(e) => {
                  setFileShare(e.target.files[0])
                }} />
            </label>

            <div onClick={getGeolocation} className="shareOption">
              <i onClick={isOpenMap} className="fa fa-map-marker" aria-hidden="true"></i>
              <span style={{ textDecoration: openMap ? "overline red 2px" : null }} onClick={isOpenMap} id="location-share" className="shareOptionText">Location </span>
            </div>

            <div className="shareOption">
              <i onClick={handelShowEmojis} style={{ color: showEmojis ? "green" : null }} className="fa fa-smile-o" aria-hidden="true"></i>
              <span style={{ textDecoration: showEmojis ? "overline red 2px" : null }} onClick={handelShowEmojis} className="shareOptionText">Feelings</span>
              {showEmojis ? <><Emoji onEmojiClick={pickEmoji} /> </> : null}

            </div>
          </div>
          <button type="submit" className="rainbow rainbow-5">Share</button>
        </form>
      </div>
    </div>
  );
}