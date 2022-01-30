import "./topbar.scss";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios"
import SearchFilter from "../../helpers/Search/SearchFilter";
import Logo from "../../assets/img/darklogo.png"
import useSound from "use-sound";
import UpdateSound from "../../assets/sounds/notification.mp3";
import { CSSTransition } from "react-transition-group";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BirhdaySound from "../../assets/sounds/birthday.mp3";
import BirtIcon from "../../assets/img/gift.png";
import Modal from 'react-modal';
import Desc from "../../assets/img/desc.jpg";
import Muzikimg from '../../assets/img/muzik.png';
import Likeimg from "../../assets/img/like.png"
import Heart from "../../assets/img/heart.png";
import Comment from "../../assets/img/commet.png";
import { format } from "timeago.js"
import firebase from '../../helpers/Firebase/firebase'
import MissedCall from "../../assets/img/missedcall.jpg"
import MissedCall2 from "../../assets/img/missedcall.png"


export default function Topbar() {

  const { user } = useContext(AuthContext);
  const [followSound] = useSound(UpdateSound)
  const [users, setUsers] = useState([])
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [timer, setTime] = useState()
  const [updateUser, setUpdateUser] = useState()
  const [listFollow, setListFollow] = useState([])
  const [openNotificationFollow, setOpenNotificationFollow] = useState(false)
  const [openNotificationMessage, setNotifiationMessage] = useState(false)
  const [openNotificationLikes, setOpenNotficationLikes] = useState(false)
  const [hideNotification, setHideNotification] = useState(false)
  const [hideNotificationMessages, setHideNotificationMessages] = useState(false)
  const [hideNotificationLikes, setHideNotificationLikes] = useState(false)
  const [play, { stop }] = useSound(BirhdaySound)
  const [messagesList, setMessagesList] = useState([])
  const [allPosts, setAllPostst] = useState([])
  const [modalCover, setModalcover] = useState(false)
  const [likesNotificationList, setLikesNotificationList] = useState([])
  const [heartNotificationList, setHeartNotificationList] = useState([])
  const [openModalHeart, setOpenModalHeart] = useState(false)
  const [modalLikeList, setModalLikeList] = useState(false)
  const [countNotification, setCountNotification] = useState()
  const [openCommentsList, setOpenCommentsList] = useState(false);
  const [getComments, setGetComments] = useState([])
  const [post, setPost] = useState([])

  axios.interceptors.request.use(config => {
    config.headers.token = `${user.token}`;

    return config
  },
    error => {
      return Promise.reject(error)
    }
  )




  //get posts

  useEffect(() => {
    const postsProfile = async () => {
      const res = await axios.get('/api/post/profile/' + user?.username)
      return setPost(res.data)

    }
    postsProfile()

  }, [user])


  //sounds-of notifications

  const notify = () => {
    return toast("new notification!")
  };


  useEffect(() => {
    updateUser?.notificationFriends?.length
      && followSound();

  }, [followSound, updateUser?.notificationFriends?.length]);

  useEffect(() => {
    updateUser?.notificationMessages?.length
      && followSound();
  }, [followSound, updateUser?.notificationMessages?.length]);

  useEffect(() => {
    updateUser?.notificationBirthday
      && followSound();

  }, [followSound, updateUser?.notificationBirthday]);


  useEffect(() => {
    updateUser?.notificationCalling.length
      && followSound();
  }, [followSound, updateUser?.notificationCalling.length]);



  useEffect(() => {
    post.map(p => {
      if (p.notificationLikes.length > 0) {
        return followSound()
      } else {
        return <div key={p?._id}> </div>
      }
    })
  }, [followSound, post]);


  useEffect(() => {
    post.map(p => {
      if (p.notificationHeartes.length > 0) {
        return followSound()
      } else {
        return <div key={p?._id}> </div>
      }
    })
  }, [followSound, post]);


  useEffect(() => {
    post.map(p => {
      if (p.notificationComments.length > 0) {
        return followSound()
      } else {
        return <div key={p?._id}> </div>
      }
    })
  }, [followSound, post]);





  useEffect(() => {
    setInterval(() => {
      const time = new Date()
      setTime(time.toLocaleTimeString())
    }, 1000)
  }, [])



  //user-all-posts


  useEffect(() => {

    const postProfileAll = async () => {
      const res = await axios.get("/api/post/profile/" + user.username)
      return setAllPostst(res.data)

    }
    postProfileAll()
  }, [user])



  //allusers
  useEffect(() => {

    const fetchAllUsers = async () => {
      const res = await axios.get(`/api/users/getallusers`)
      setUsers(res.data)

    }
    fetchAllUsers()

  }, [user._id])



  //update-user-info

  useEffect(() => {

    const getUser = async () => {
      const res = await axios.get(`/api/users?userId=${user._id}`)
      return setUpdateUser(res.data)

    }
    getUser()


  }, [user])

  useEffect(() => {
    const getNotificationList = async () => {
      const res = await axios.get("/api/users/friendnotification/" + user?._id)
      res.data.length && notify()
      return setListFollow(res.data)

    }

    getNotificationList()



  }, [user])



  //get messsgaes-list

  useEffect(() => {

    const getNotification = async () => {
      const res = await axios.get("/api/messages/notification/" + user._id)
      res.data.length && notify()
      return setMessagesList(res.data)

    }

    getNotification()



  }, [user])


  //remove-friens-follow-notification

  const removeNotification = async (friend) => {
    await axios.put('/api/users/friendnotification/' + user._id + "/" + friend._id)

  }

  //remover-messgaes-notification

  const removeNotificationMessage = async () => {
    await axios.put("/api/messages/notification/" + user._id)
    setHideNotificationMessages(!hideNotificationMessages)
  }


  //remove--all-notification(like,comment,hearte)

  const removeAllnotifications = async () => {

    await axios.delete('/api/post/removeall/' + user._id)
    setHideNotificationLikes(!hideNotificationLikes)


  }
  ///getLIKENOTIFICATIONLIST


  const getLikeNotificationList = async (post) => {
    try {
      const res = await axios.get("/api/post/likenotification/" + post._id)
      await axios.delete('/api/post/likenotification/' + post._id + "/" + user._id)
      setLikesNotificationList(res.data)
      setModalLikeList(!modalLikeList)

    } catch (error) {
      console.log(error)
    }
  }


  ///get-heart-NOTIFICATIONLIST
  const getHeartNotificationList = async (post) => {
    try {
      const res = await axios.get("/api/post/heartenotification/" + post._id)
      await axios.delete('/api/post/heartnotification/' + post._id + "/" + user._id)
      setHeartNotificationList(res.data)
      setOpenModalHeart(!openModalHeart)

    } catch (error) {

      console.log(error)

    }
  }

  //getNotification-likes-length

  useEffect(() => {

    const getNotification = async () => {
      const res = await axios.get('/api/post/notificationlength/' + user._id)
      res.data > 0 && notify()
      return setCountNotification(res.data)

    }
    getNotification()



  }, [user])




  ///removemessagesnotification


  const removeMessagesNotification = async (friend) => {

    await axios.delete('/api/messages/notification/' + user._id + "/" + friend._id)

  }



  //opencommentsList

  const openComment = async (post) => {

    const res = await axios.get('/api/post/comments/notification/' + post._id + "/" + user._id)

    setGetComments(res.data.notificationComments)

    setOpenCommentsList(!openCommentsList)

  }

  //customstyles

  const customStylesImg = {
    content: {
      overflowY: "scroll",
      top: '50%',
      left: '50%',
      right: '10%',
      bottom: '0%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: "black",

    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.91)',


    }
  };


  ///firebase-notification


  useEffect(() => {

    const msg = firebase.messaging();
    msg.requestPermission().then(() => {
      return msg.getToken();
    }).then((data) => {
      console.log("token", data)
    })

    msg.onMessage(function (payload) {
      console.log(payload);
      const notificationOption = {
        body: payload.notification.body,
        icon: payload.notification.icon
      };

      if (Notification.permission === "granted") {
        var notification = new Notification(payload.notification.title, notificationOption);
        

        notification.onclick = function (ev) {
          ev.preventDefault();
          window.open(payload.notification.click_action, '_blank');
          notification.close();
        }
      }
    });
    msg.onTokenRefresh(function () {
      msg.getToken()
        .then(function (newtoken) {
          console.log("New Token : " + newtoken);
        })
        .catch(function (reason) {
          console.log(reason);
        })
    })
  }, [])



  return (

    <div className="topbarContainer">
      <Modal
        isOpen={openCommentsList}
        onRequestClose={openCommentsList ? false : null}
        style={customStylesImg} >
        <div className="modal_div" >
          <ul>
            {getComments ?
              getComments.map(l => {

                return (
                  <div key={l.id} className="comment-list">

                    <li >
                      <Link to={"/profile/" + l.author}>   <img className="comment-person" src={l.img ? PF + "/person/" + l.img : l.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} alt="likelist" />    </Link>
                      <span className="comment-span"> {l.author} </span>
                      <img className="comment-image" src={Comment} alt="likeimage" />

                    </li>
                    <div>
                      <p> <i className="fa fa-clock-o" aria-hidden="true"></i> : {format(l.createdAt)} </p>
                      <p> <i className="fa fa-comments-o" aria-hidden="true"></i> : {l.comment} </p>
                    </div>
                  </div>
                )
              })
              : null}
          </ul>
          <button className="quit-btn" onClick={() => setOpenCommentsList(!openCommentsList)}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
        </div>
      </Modal>
      <Modal
        isOpen={openModalHeart}
        onRequestClose={openModalHeart ? false : null}
        style={customStylesImg} >
        <div className="modal_div" >
          <ul>
            {heartNotificationList ?
              heartNotificationList.map(l => {
                return (<Link key={l.id} to={"/profile/" + l.username}>
                  <li  className="likelist-li">
                    <img className="likelist-person" src={l.profilePicture ? PF + "/person/" + l.profilePicture : l.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} alt="likelist" />
                    <span className="likelist-span"> {l.username} </span>
                    <img className="like-image" src={Heart} alt="likeimage" />
                  </li>
                </Link>
                )
              })
              : null}
          </ul>
          <button className="quit-btn" onClick={() => setOpenModalHeart(!openModalHeart)}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
        </div>


      </Modal>
      <Modal
        isOpen={modalLikeList}
        onRequestClose={modalLikeList ? false : null}
        style={customStylesImg} >
        <div className="modal_div" >
          <ul>
            {likesNotificationList ?
              likesNotificationList.map(l => {
                return (<Link key={l.id} to={"/profile/" + l.username}>
                  <li className="likelist-li">
                    <img className="likelist-person" src={l.profilePicture ? PF + "/person/" + l.profilePicture : l.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} alt="likelist" />
                    <span className="likelist-span"> {l.username} </span>
                    <img className="like-image" src={Likeimg} alt="likeimage" />
                  </li>
                </Link>
                )
              })
              : null}

          </ul>
          <button className="quit-btn" onClick={() => setModalLikeList(!modalLikeList)}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
        </div>
      </Modal>
      <Modal
        isOpen={modalCover}
        onRequestClose={modalCover ? false : null}
        style={customStylesImg} >
        <div className="modal_div">
          {post?.img?.includes("jpg" || "png" || "svg" || "webp" || "jpeg") ?

            <img style={{ height: !post?.desc && !post?.url ? "100%" : "80%" }} className="post-modal-img" src={post?.img ? PF + "post/" + post?.img : PF + "person/nocover.jpg"} alt="cover" />

            : null}

          {post?.img?.includes("mp4") ?
            <>
              <video style={{ height: !post?.desc && !post?.url ? "100%" : "80%", width: "100%" }} className="video-post" controls src={PF + '/post/' + post?.img} />


            </>
            : null}
          {post?.img?.includes("mp3") ?
            <div style={{ height: post?.img?.includes("mp3") ? "100%" : !post?.desc && !post?.url ? 0 : null }} className="desc" >
              {post?.url ?
                <a className="location" href={`https://www.google.ru/maps/@${post?.url},13z`} target="_blank" rel="noreferrer">
                  <b> URL -- </b> <i style={{ color: "red" }} className="fa fa-map-marker" aria-hidden="true"></i>
                </a>
                : null}
              {post?.desc ?
                <div className="desc-post">
                  <b style={{ color: "green" }}> DESC -- </b> {post.desc}
                </div>
                : null}
              <audio controls src={PF + "/post/" + post?.img} />
            </div>
            : null}

          <div style={{ height: !post?.img ? "100%" : 0 }} className="desc-status">
            {post?.url ?
              <div style={{ height: post?.img?.includes("jpeg" ? "20%" : "100%") }} >
                <b style={{ color: "violet" }}>LOCATION </b> --  <a class="location" href={`https://www.google.ru/maps/@${post?.url},13z`} target="_blank" rel="noreferrer">
                  <i id="loc" className="fa fa-map-marker" aria-hidden="true"></i>
                </a>
              </div>
              : null}
            {post?.desc ?
              <div style={{ height: post?.img?.includes("jpeg" ? "20%" : "100%") }}>
                <b style={{ color: "gold" }}> Description </b>-- {post.desc}
              </div>
              : null}
          </div>
          <button className="quit-btn" onClick={() => setModalcover(!modalCover)}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
        </div>

      </Modal>
      <div style={{ justifyContent: "center" }} className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          {/* {calling?.includes(user?._id)?<h1 className="call-desc"> zffffffffffffffffffffffzange </h1>:null}     */}
          <span className="logo">FaceContact</span>
          <img src={Logo} style={{ margin: window.location.href.includes("allusers") ? 0 : null }} className="logo-img-topbar" alt="logo" />
        </Link>
      </div>
      <div className={!window.location.href.includes("messenger") ? "topbarCenter" : "topbar-none"}>
        <SearchFilter />
      </div>
      <div className="topbarRight">
        <ToastContainer />
        <div className="topbarLinks">
          <Link to="/"><span className="topbarLink">Homepage </span></Link>
          <span className="topbarLink">{timer}</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <i style={{ color: openNotificationFollow ? "black" : null }} id="friend-notification" onClick={() => { setOpenNotficationLikes(false); setNotifiationMessage(false); return setOpenNotificationFollow(!openNotificationFollow) }} className="fa fa-user"></i>
            {!hideNotification && updateUser?.notificationFriends?.length ? <span className="topbarIconBadge">{updateUser?.notificationFriends?.length} </span> : null}

            <CSSTransition in={openNotificationFollow} timeout={500} classNames="notification" unmountOnExit >
              <div className="notifications-div">
                <div className="notification-title"><h3>New Friends</h3> </div>
                <div className="notification-content">
                  {listFollow.length > 0 ? listFollow.map(f => {

                    return (
                      <Link key={f.id} onClick={() => removeNotification(f)} to={"/profile/" + f.username}>
                        <div style={{ display: hideNotification ? "none" : null }} className="notification-follow-div">
                          {f?.profilePicture ? <img className="friend-img" src={f.profilePicture ? PF + "/person/" + f.profilePicture : f.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} alt="person-avatar" /> : <img src={PF + "/person/noAvatar.png"} className="friend-img" alt='person-avatar' />}
                          <span>{f.username || <>user deleted <i className="fa fa-exclamation-circle" aria-hidden="true"></i></>}</span>
                          <i className="fa fa-users" aria-hidden="true"></i>
                        </div>
                      </Link>

                    )
                  }) : ""}
                </div>
                <div className="clear-div">
                  <div className="svg">
                    <span onClick={async () => { setHideNotification(!hideNotification); return await axios.delete('api/users/friendnotification/' + user._id) }}
                      className="button" >
                      <svg>
                        <rect height="40" width="130" fill="transparent" />
                      </svg>
                      <span>{!hideNotification ? "Clear" : "Restore"}</span>
                    </span>
                  </div>
                </div>
              </div>

            </CSSTransition>


          </div>
          <div className="topbarIconItem">
            <i style={{ color: openNotificationMessage ? "black" : null }} id="message-notification" onClick={() => { setOpenNotficationLikes(false); setNotifiationMessage(!openNotificationMessage); return setOpenNotificationFollow(false) }} className="fa fa-comment"></i>
            {!hideNotificationMessages && messagesList?.length ? <span className="topbarIconBadge">{updateUser?.notificationMessages?.length}</span> : null}
            <CSSTransition in={openNotificationMessage} timeout={500} classNames="notification" unmountOnExit >
              <div className="notifications-div">
                <div className="notification-title"><h3>New Message</h3> </div>
                <div className="notification-content">
                  {messagesList.length > 0 ? messagesList.map(m => {
                    return (
                      <Link key={m.id} onClick={() => removeMessagesNotification(m)} to="/messenger" >
                        <div style={{ display: hideNotificationMessages ? "none" : null }} className="notification-follow-div">
                          {m?.profilePicture ? <img className="friend-img" src={m.profilePicture ? PF + "/person/" + m.profilePicture : m.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} alt="person-avatar" /> : <img src={PF + "/person/noAvatar.png"} className="friend-img" alt="person-avatar" />}
                          <span>{m.username || <>user deleted <i className="fa fa-exclamation-circle" aria-hidden="true"></i></>}</span>
                          <i className="fa fa-envelope-open-o" aria-hidden="true"></i>
                        </div>
                      </Link>
                    )
                  }) : null}
                </div>
                <div className="clear-div">
                  <div className="svg">
                    <span id="msg-btn" onClick={removeNotificationMessage} className="button" >
                      <svg>
                        <rect height="40" width="130" fill="transparent" />
                      </svg>
                      <span>{!hideNotificationMessages ? "Clear" : "Restore"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </CSSTransition>
          </div>
          <div className="topbarIconItem">
            <i style={{ color: openNotificationLikes ? "black" : null }} id="all-notification" onClick={() => { setOpenNotificationFollow(false); setNotifiationMessage(false); return setOpenNotficationLikes(!openNotificationLikes) }} className="fa fa-bell"></i>
            {((((updateUser?.notificationBirthday + "").split('T')[0]) === (new Date().toISOString().split('T')[0])) || countNotification) && !hideNotificationLikes ?
              <span className="topbarIconBadge">
                {((updateUser?.notificationBirthday + "").split('T')[0]) === (new Date().toISOString().split('T')[0]) ? 1 + countNotification : countNotification}

              </span>
              : null}
            <CSSTransition in={openNotificationLikes} timeout={500} classNames="notification" unmountOnExit >
              <div className="notifications-div">
                <div className="notification-title"><h3>New Notification</h3> </div>
                <div className="notification-content">
                  {updateUser?.notificationCalling ?
                    updateUser?.notificationCalling.map(u => {
                      return (
                        <Link key={u._id} to="/messenger">
                          <div onClick={async () => { await axios.delete('/api/messages/videochat/notification/' + user._id + "/" + u) }} style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                            <img className="post-img-call" src={localStorage.getItem("mode") === "dark" ? MissedCall : MissedCall2} alt="desc" />
                            <span>   Missed call  from` < br />  <b style={{ color: "red" }}>  {u}   </b></span>
                          </div>
                        </Link>
                      )
                    })

                    : null}
                  {((updateUser?.notificationBirthday + "").split('T')[0]) === (new Date().toISOString().split('T')[0]) && !hideNotificationLikes ? <div className="like-notification-div"> <img onMouseEnter={() => play()} onMouseLeave={() => stop()} className="birthdayImg" src={BirtIcon} alt="happy-birhday" /><span>happy Birthday !!!</span></div> : null}
                  {allPosts.map(a => {

                    if (a?.img?.includes("mp4")) {
                      return (
                        a.notificationLikes.length > 0 && a.notificationHeartes.length > 0 ?
                          <div key={a._id}>
                            <div key={a._id} style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <video onClick={() => { setPost(a); return setModalcover(!modalCover) }} src={PF + "/post/" + a.img} className="post-img-notification" alt="notiication" />
                              <span> <b onClick={() => getLikeNotificationList(a)} style={{ color: "red" }}>  {a.notificationLikes.length} people  </b>  liked <br /> your video  </span>
                            </div>
                            <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <video onClick={() => { setPost(a); return setModalcover(!modalCover) }} src={PF + "/post/" + a.img} className="post-img-notification" alt="notiication" />
                              <span> <b onClick={() => getHeartNotificationList(a)} style={{ color: "red" }}>  {a.notificationHeartes.length} people  </b>  reacted <br /> your video  </span>
                            </div>
                          </div>
                          : a.notificationLikes.length > 0 ?
                            <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <video onClick={() => { setPost(a); return setModalcover(!modalCover) }} src={PF + "/post/" + a.img} className="post-img-notification" alt="notiication" />
                              <span> <b onClick={() => getLikeNotificationList(a)} style={{ color: "red" }}>  {a.notificationLikes.length} people  </b>  liked <br /> your video  </span>
                            </div>
                            : a.notificationHeartes.length > 0 ?
                              <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                                <video onClick={() => { setPost(a); return setModalcover(!modalCover) }} src={PF + "/post/" + a.img} className="post-img-notification" alt="notiication" />
                                <span> <b onClick={() => getHeartNotificationList(a)} style={{ color: "red" }}>  {a.notificationHeartes.length} people  </b>  reacted <br /> your video  </span>
                              </div>
                              : null


                      )
                    } else if (!a.img) {

                      return (
                        a.notificationLikes.length > 0 && a.notificationHeartes.length ?
                          <div key={a._id}>
                            <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} className="post-img-notification" src={Desc} alt="desc" />
                              <span>  <b onClick={() => getLikeNotificationList(a)} style={{ color: "red" }}> {a.notificationLikes.length} people  </b> liked <br /> your status  </span>
                            </div>
                            <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} className="post-img-notification" src={Desc} alt="desc" />
                              <span>  <b onClick={() => getHeartNotificationList(a)} style={{ color: "red" }}> {a.notificationHeartes.length} people  </b> reacted <br /> your status  </span>
                            </div>
                          </div> :
                          a.notificationLikes.length > 0 ?

                            <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} className="post-img-notification" src={Desc} alt="desc" />
                              <span>  <b onClick={() => getLikeNotificationList(a)} style={{ color: "red" }}> {a.notificationLikes.length} people  </b> liked <br /> your status  </span>
                            </div>
                            : a.notificationHeartes.length ?
                              <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                                <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} className="post-img-notification" src={Desc} alt="desc" />
                                <span>  <b onClick={() => getHeartNotificationList(a)} style={{ color: "red" }}> {a.notificationHeartes.length} people  </b> reacted <br /> your status  </span>
                              </div> : null
                      )


                    } else if (a?.img?.includes("mp3")) {
                      return (
                        a.notificationLikes.length > 0 && a.notificationHeartes.length ?
                          <div key={a._id}>
                            <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} className="post-img-notification" src={Muzikimg} alt="desc" />
                              <span>  <b onClick={() => getLikeNotificationList(a)} style={{ color: "red" }}> {a.notificationLikes.length} people  </b> liked <br /> your song  </span>
                            </div>
                            <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} className="post-img-notification" src={Muzikimg} alt="desc" />
                              <span>  <b onClick={() => getHeartNotificationList(a)} style={{ color: "red" }}> {a.notificationHeartes.length} people  </b> reacted <br /> your song  </span>
                            </div>

                          </div> : a.notificationLikes.length > 0 ?
                            <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} className="post-img-notification" src={Muzikimg} alt="desc" />
                              <span>  <b onClick={() => getLikeNotificationList(a)} style={{ color: "red" }}> {a.notificationLikes.length} people  </b> liked <br /> your song  </span>
                            </div>
                            : a.notificationHeartes.length ?
                              <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                                <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} className="post-img-notification" src={Muzikimg} alt="desc" />
                                <span>  <b onClick={() => getHeartNotificationList(a)} style={{ color: "red" }}> {a.notificationHeartes.length} people  </b> reacted <br /> your song  </span>
                              </div> : null

                      )
                    }
                    else if (a.img) {
                      return (
                        a.notificationHeartes.length > 0 && a.notificationLikes.length > 0 ?
                          <div key={a._id}>
                            <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} src={PF + "/post/" + a.img} className="post-img-notification" alt="notiication" />
                              <span> <b onClick={() => getLikeNotificationList(a)} style={{ color: "red" }}> {a.notificationLikes.length}  people </b>  liked  <br /> your image  </span>
                            </div>
                            <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} src={PF + "/post/" + a.img} className="post-img-notification" alt="notiication" />
                              <span> <b onClick={() => getHeartNotificationList(a)} style={{ color: "red" }}> {a.notificationLikes.length}  people </b>  reacted  <br /> your image  </span>
                            </div>
                          </div>
                          : a.notificationHeartes.length > 0 ?
                            <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                              <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} src={PF + "/post/" + a.img} className="post-img-notification" alt="notiication" />
                              <span> <b onClick={() => getHeartNotificationList(a)} style={{ color: "red" }}> {a.notificationLikes.length}  people </b>  reacted  <br /> your image  </span>
                            </div>
                            : a.notificationLikes.length > 0 ?
                              <div style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                                <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} src={PF + "/post/" + a.img} className="post-img-notification" alt="notiication" />
                                <span> <b onClick={() => getLikeNotificationList(a)} style={{ color: "red" }}> {a.notificationLikes.length}  people </b>  liked  <br /> your image  </span>
                              </div>

                              : null
                      )

                    } else {
                      return <div key={a._id}> </div>
                    }
                  })}
                  {allPosts ? allPosts.map(a => {
                    if (a?.img?.includes("mp4")) {
                      return (
                        a?.notificationComments?.length > 0 &&
                        (<div key={a._id} style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                          <video onClick={() => { setPost(a); return setModalcover(!modalCover) }} src={PF + "/post/" + a.img} className="post-img-notification" alt="notiication" />
                          <span> <b onClick={() => openComment(a)} style={{ color: "red" }}>  {a.notificationComments.length} new comments  </b>  have been added to your video  </span>
                        </div>)
                      )
                    } else if (a?.img?.includes("mp3")) {
                      return (
                        a?.notificationComments?.length > 0 &&
                        <div key={a._id}  style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                          <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} className="post-img-notification" src={Muzikimg} alt="desc" />
                          <span>  <b onClick={() => openComment(a)} style={{ color: "red" }}> {a.notificationComments.length} new comments  </b>  have been added to your song  </span>
                        </div>
                      )
                    } else if (!a.img) {
                      return (
                        a?.notificationComments?.length > 0 &&
                        <div key={a._id}  style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                          <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} className="post-img-notification" src={Desc} alt="desc" />
                          <span>  <b onClick={() => openComment(a)} style={{ color: "red" }}> {a.notificationComments.length} new comments  </b> have been added to your status  </span>
                        </div>

                      )

                    } else if (a?.img) {
                      return (
                        a?.notificationComments?.length > 0 &&
                        <div key={a._id}  style={{ display: hideNotificationLikes ? "none" : null }} className="notification-follow-div">
                          <img onClick={() => { setPost(a); return setModalcover(!modalCover) }} src={PF + "/post/" + a.img} className="post-img-notification" alt="notiication" />
                          <span> <b onClick={() => openComment(a)} style={{ color: "red" }}> {a.notificationComments.length}  new comments </b>  have been added to your photo  </span>
                        </div>
                      )
                    } else {
                      return <div key={a._id} > </div>
                    }
                  }) : null}
                </div>
                <div className="clear-div">
                  <div className="svg">
                    <span id="all-notification-btn"
                      onClick={removeAllnotifications} className="button" href="#">
                      <svg>
                        <rect height="40" width="130" fill="transparent" />
                      </svg>
                      <span>{!hideNotificationLikes ? "Clear" : "Restore"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </CSSTransition>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          {users.map(u => {
            if (user._id === u._id) {
              return <img key={u._id} src={u.profilePicture ? PF + "person/" + u.profilePicture : u.male === "man" ? PF + `person/noAvatar.png` : PF + 'person/woman.png'} alt="user_icon" className="topbarImg" />
            } else {
              return <div key={u._id} > </div>
            }
          })
          }
        </Link>
      </div>
    </div>



  );
}