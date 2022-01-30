import "./post.scss";
import axios from "axios"
import { format } from "timeago.js"
import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";
import { CSSTransition } from "react-transition-group"
import Emoji from "emoji-picker-react";
import Modal from 'react-modal';
import Heart from "../../assets/img/heart.png"
import Like from "../../assets/img/like.png";
import Plheart from "../../assets/img/pleaseheart.png"
import Pllike from "../../assets/img/liked.png";
import useSound from "use-sound";
import LikeSound from "../../assets/sounds/like.mp3"
import CommentSound from "../../assets/sounds/comment.mp3"
import RemoveSound from "../../assets/sounds/remove.mp3"
import UpdateSound from "../../assets/sounds/updatedesc.mp3"
import KeypressSound from "../../assets/sounds/keypress.wav";






export default function Post({ post }) {


  //usesounds
  const [likePost] = useSound(LikeSound)
  const [removeSound] = useSound(RemoveSound)
  const [commentPost] = useSound(CommentSound)
  const [updateSound] = useSound(UpdateSound)
  const [pressSound] = useSound(KeypressSound)


  //useStates

  const [modalCover, setModalcover] = useState(false)
  const [comments, setComments] = useState([])
  const [openComments, setOpenComments] = useState(false)
  const [openLikeList, setOpenLikeList] = useState(false)
  const [openHeartList, setOpenHeartList] = useState(false)
  const [likeList, setLikeList] = useState(false)
  const [heartList, setHeartList] = useState(false)
  const [like, setLike] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  const [heart, setHeart] = useState(post.heartes.length)
  const [isHeart, setIsHeart] = useState(false)
  const [user, setUser] = useState({})
  const [allUsers, setAllUsers] = useState([])
  const [toggle, setToggle] = useState(false)
  const [showEmojisComment, setShowEmojisComment] = useState(false)
  const [commentPicker, setCommentPicker] = useState("")
  const [message, setMessage] = useState("")
  const [showEmojis, setShowEmojis] = useState()
  const [cursorPosition, setCursorPosition] = useState()
  const postUpdate = useRef()
  const comment = useRef()
  const { user: currentUser } = useContext(AuthContext)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [updateUser, setUpdateUser] = useState()

  axios.interceptors.request.use(config => {
    config.headers.token = `${currentUser.token}`;
    return config
  },
    error => {
      return Promise.reject(error)
    }
  )

  // const authication=axios.create({
  //   baseURL:`/api/users?userId=${post.userId}`,
  //   method: 'post',
  //   headers: {
  //   'Content-Type': 'application/json',
  //   'token' :`${currentUser.token}`
  // }
  // })



  //emoji--post-updater-messages////

  const pickEmoji = (e, { emoji }) => {
    const ref = postUpdate.current
    ref.focus()
    const start = message.substring(0, ref.selectionStart)
    const end = message.substring(ref.selectionStart)
    const text = start + emoji + end
    postUpdate.current.selectionEnd = start.length + emoji.length
    setMessage(text)
    setCursorPosition(start.length + emoji.length)
  }

  const handelChange = (e) => {
    setMessage(e.target.value)
  }
  const handelShowEmojis = () => {
    postUpdate.current.focus()
    setShowEmojis(!showEmojis)
  }


  //emoji-coments-post
  const pickEmojiComment = (e, { emoji }) => {
    const ref = comment.current
    ref.focus()
    const start = commentPicker.substring(0, ref.selectionStart)
    const end = commentPicker.substring(ref.selectionStart)
    const text = start + emoji + end
    comment.current.selectionEnd = start.length + emoji.length
    setCommentPicker(text)
    setCursorPosition(start.length + emoji.length)
  }
  const handelChangeComment = (e) => {
    setCommentPicker(e.target.value)
  }
  const handelShowEmojisComment = () => {
    comment.current.focus()
    setShowEmojisComment(!showEmojisComment)
  }


  //useEffects

  useEffect(() => {
    openComments && (comment.current.selectionEnd = cursorPosition)
    toggle && (postUpdate.current.selectionEnd = cursorPosition)
  }, [cursorPosition, openComments, toggle])





  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`/api/users?userId=${post.userId}`).catch(e => console.log(e))

      setUser(res.data)

    }
    fetchUsers()

  }, [post.userId])




  //likes function

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [post._id, post?.likes, currentUser?._id]);



  const likeHandler = () => {
    try {
      axios.put("/api/post/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {
      console.log(err)
    }
    setLike(isLiked ? like - 1 : like + 1);
    likePost()
    setIsLiked(!isLiked);
  };

  //heartes-function

  useEffect(() => {
    setIsHeart(post.heartes.includes(currentUser._id));
  }, [post._id, post.heartes, currentUser._id]);

  const heartHandler = () => {
    try {
      axios.put("/api/post/" + post._id + "/heart", { userId: currentUser._id })
    } catch (error) {
      console.log(error)

    }
    setHeart(isHeart ? heart - 1 : heart + 1)
    likePost()
    setIsHeart(!isHeart)
  }


  //delete your post-function

  const deletePost = async () => {
    try {
      removeSound()
      await axios.delete("/api/post/" + post._id)

    } catch (error) {
      console.log(error)
    }

    setTimeout(() => {
      window.location.reload()

    }, 800)

  }

  //delete your-posts -geolocation

  const deleteLocation = async () => {
    removeSound()

    try {
      await axios.delete("/api/post/location/" + post._id)


    } catch (error) {
      console.log(error)
    }

    setTimeout(() => {
      window.location.reload()

    }, 500)
  }

  // update-post-function

  const comentModal = async () => {
    const res = await axios.get('/api/post/comments/' + post._id)

    await axios.get('/api/post/comments/notification/' + post._id + "/" + currentUser._id)
    setComments(res.data.comments.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt) }))
    setOpenComments(!openComments)

  }

  const handleClick = async (e) => {
    e.preventDefault()
    const postChange = {
      desc: postUpdate.current.value
    }

    try {
      updateSound()
      e.preventDefault()
      await axios.put("/api/post/" + post._id, postChange);


    } catch (err) {
      console.log(err);
    }

    setTimeout(() => {
      window.location.reload()

    }, 600)



  }


  //comments-post-function

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`/api/users?userId=${currentUser._id}`)
      setUpdateUser(res.data)

    }


    getUser()

  }, [currentUser])



  const handleComment = (e) => {
    commentPost()
    e.preventDefault()
    const commentChange = {
      userId: currentUser._id,
      comment: comment.current.value,
      author: currentUser.username,
      img: updateUser?.profilePicture,
      male: currentUser.male
    }



    try {

      e.preventDefault()
      axios.post("/api/post/" + post._id + "/comments/" + currentUser._id, commentChange);
      setTimeout(() => {

        window.location.reload()

      }, 300)

    } catch (err) {
      console.log(err);
    }

  }



  //custom style-react-modal

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

  // get-likes-list

  useEffect(() => {
    const getPostLikes = async () => {
      const res = await axios.get('/api/post/' + post?._id + "/likelist")
      const result = await axios.get('/api/post/' + post?._id + "/heartlist")
      setHeartList(result.data)
      setLikeList(res.data)

    }
    getPostLikes()



  }, [post._id])

  const openLikesList = () => {
    setOpenHeartList(false)
    setOpenLikeList(!openLikeList)

  }


  const openHeartesList = async () => {
    setOpenLikeList(false)
    setOpenHeartList(!openHeartList)

  }

  //deleteCommnets

  const removeComments = async (comment) => {

    try {
      removeSound()
      await axios.delete("/api/post/comments/" + post._id + "/" + comment._id);

    } catch (error) {

      console.log(error)

    }

    setTimeout(() => {
      window.location.reload()

    }, 800)



  }

  useEffect(() => {
    const allUser = async () => {
      const res = await axios.get('/api/users/getallusers')
      return setAllUsers(res.data.map(m =>
        m.username
      ))

    }
    allUser()


  }, [user])






  return (
    <>

      <div className="post">
        <Modal
          isOpen={modalCover}
          onRequestClose={modalCover ? false : null}

          style={customStylesImg} >
          <div className="modal_div">
            <img style={{ objectPosition: "top" }} src={post.img ? PF + "post/" + post.img : null} alt="post" />
            <button className="quit-modal-post" onClick={() => setModalcover(!modalCover)}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
          </div>

        </Modal>
        <div className="postWrapper">
          <div className="postTop">
            <div className="postTopLeft">
              <Link to={`/profile/${user?.username}`}>
                <img
                  className="postProfileImg"
                  src={user?.profilePicture ? PF + "person/" + user.profilePicture : user?.male === "man" ? PF + `person/noAvatar.png` : PF + 'person/woman.png'}
                  alt=""
                />
              </Link>
              <span className="postUsername">
                {user?.name}
              </span>
              <span className="postDate">{format(post.createdAt)}</span>
            </div>
            {post.url ?
              <a className="location" href={`https://www.google.ru/maps/@${post.url},13z`} target="_blank" rel="noreferrer"  >
                <i style={{ color: "red" }} className="fa fa-map-marker" aria-hidden="true"></i>  </a>
              : null}
            <div className="postTopRight">
              {toggle ? <i onClick={() => {
                setToggle(!toggle)
              }} className="fa fa-times" aria-hidden="true"></i> : <><i id="bars" onClick={() => {
                setToggle(!toggle)
              }} className="fa fa-bars" aria-hidden="true"></i></>}
            </div>
            <CSSTransition
              in={toggle && post.userId === currentUser._id}
              timeout={500}
              classNames="alert"
              unmountOnExit
            >
              <div className="setting_post_div">
                <span className="delete_post" onClick={deletePost}> deleted your post ...? <i className="fa fa-trash"></i></span>
                <form className="update_form" onSubmit={handleClick}> <input onKeyPress={() => pressSound()} onChange={handelChange} value={message} ref={postUpdate} id="update-post-input" type="text" placeholder="update your post ..?" /> <i onClick={handelShowEmojis} className="fa fa-smile-o" aria-hidden="true"></i><button type="submit"> <i className="fa fa-pencil-square-o" aria-hidden="true"></i></button> </form>
                <span id="location-span" onClick={post?.url ? deleteLocation : null}> remove  location ...? <i className="fa fa-map" aria-hidden="true"></i></span>
                {showEmojis ? <><Emoji onEmojiClick={pickEmoji} /> </> : null}
              </div>
            </CSSTransition>
          </div>
          <div className="postCenter">
            <span className="postText">{post?.desc}</span>
            {post.img?.includes(".mp3") ? <audio controls src={PF + "/post/" + post.img} > </audio> : post.img?.includes(".mp4") ? <video className="post-video" controls src={PF + "/post/" + post.img} /> : <img id="post_img" onClick={() => setModalcover(!modalCover)} className="postImg" src={PF + "/post/" + post.img} alt="" />}
          </div>
          <div className="postBottom">
            <div className="postBottomLeft">
              <div className="like_div"><i id="like-post" style={{ color: isLiked ? "#41ACF9" : "#8DA399" }} className="fa fa-thumbs-up" onClick={() => { likeHandler() }} ></i><span id="likelist-span" style={{ borderBottom: openLikeList ? "1px solid #ccc" : null }} onClick={async () => { openLikesList(); return await axios.delete('/api/post/likenotification/' + post._id + "/" + currentUser._id) }} className="postLikeCounter">{like} people like it</span></div>
              <div className="like_div"><i id="like-heart" style={{ color: isHeart ? "red" : "#8DA399" }} onClick={() => { console.log(post._id); return heartHandler() }} className="fa fa-gratipay"></i> <span id="hearelist-span" style={{ borderBottom: openHeartList ? "1px solid #ccc" : null }} onClick={async () => { openHeartesList(); return await axios.delete('/api/post/heartnotification/' + post._id + "/" + currentUser._id) }} className="postLikeCounter">{heart} people reacted it</span></div>
            </div>
            <div className="postBottomRight">
              <span onClick={comentModal} id="comments_span" className="postCommentText">{post.comment} comments <b id="comment-count">{post.comments.length}</b> <i className="fa fa-commenting-o" aria-hidden="true"></i></span>
            </div>

          </div>
        </div>
        <CSSTransition in={openLikeList} timeout={500} classNames="likelist" unmountOnExit >
          <div className="likelist">


            {like && likeList ? likeList.map(u => {

              return (

                <div key={u} className="likes-item">
                  <Link to={"/profile/" + u?.username}> <div>
                    {u ? <img src={u?.profilePicture ? PF + "/person/" + u?.profilePicture : u?.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} className="likes-user" alt="like" /> : <img className="likes-user" src={PF + '/person/noAvatar.png'} alt="delete-user" />}
                    {u ? <span className="likes-user-name">{u?.username} {u?.lastname}</span> : <span style={{ color: "brown" }} className="likes-user-name">user has been deleted..</span>}
                  </div>
                  </Link>
                  <div> <img src={Like} className="icon-like-img" alt="like-icon" /> </div>
                </div>

              )
            }) : <img alt="no-like" className="no-like" src={Pllike} />}
          </div>

        </CSSTransition>
        <CSSTransition in={openHeartList} timeout={500} classNames="heartlist" unmountOnExit >
          <div className="likelist">
            {heart && heartList ? heartList.map(u => {
              return (
                <Link key={u} to={"/profile/" + u?.username}>
                  <div className="likes-item">
                    <div>
                      {u ? <img src={u?.profilePicture ? PF + "/person/" + u?.profilePicture : u?.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} className="likes-user" alt="like" /> : <img className="likes-user" src={PF + '/person/noAvatar.png'} alt="delete-user" />}
                      {u ? <span className="likes-user-name">{u?.username} {u?.lastname} </span> : <span style={{ color: "brown" }} className="likes-user-name">user has been deleted..</span>}
                    </div>
                    <div> <img src={Heart} className="icon-like-img" alt="like-icon" /> </div>
                  </div>
                </Link>


              )
            }) : <img alt="no-like" className="no-like" src={Plheart} />}
          </div>

        </CSSTransition>
        <CSSTransition in={openComments} timeout={500} classNames="coment" unmountOnExit >
          <form onSubmit={handleComment} className="comment_form">
            <textarea onKeyPress={() => pressSound()} onChange={handelChangeComment} value={commentPicker} ref={comment} className="comment_textarea" name="comment" placeholder="Your comments"></textarea><i onClick={handelShowEmojisComment} className="fa fa-smile-o" aria-hidden="true"></i>
            <div className="send"> <button id="send-comment" type="submit">Send</button> </div>
            {showEmojisComment ? <><Emoji onEmojiClick={pickEmojiComment} /> </> : null}
            <div style={{ height: comments.length > 1 ? 300 : null }} className="comment_div">
              {comments.map(c => {

                return (<div key={c?.id} className="commentsection">
                  <div className="author_comment">
                    {allUsers.includes(c.author) ? <Link className="img_link" to={`/profile/${c.author}`}> < img className="comment_img" src={c.img ? PF + "person/" + c.img : c.male === "man" ? PF + "person/noAvatar.png" : PF + "/person/woman.png"} alt="after_comment" /> </Link> : <img src={PF + "/person/noAvatar.png"} className="comment_img" alt="delete-user" />}

                    {allUsers.includes(c.author) ? <span> {c.author} </span> : <span> {c.author} <b className="deleted-user">user  deleted <i className="fa fa-exclamation-circle" aria-hidden="true"></i> </b>  </span>}
                    <span className="time">{format(c.createdAt)}</span>
                  </div>
                  <div className="desc_comment"><span>{c.comment}</span> {c.author === currentUser.username || post.userId === currentUser._id ? <span onClick={() => removeSound()}> <i id="remove-comment" onClick={() => removeComments(c)} className="fa fa-trash"></i></span> : null} </div>
                </div>)
              })}
            </div>
          </form>
        </CSSTransition >
      </div>

    </>
  );

}