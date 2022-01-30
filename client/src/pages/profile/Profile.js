import "./profile.scss";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Siedbar";
import Scrol from "../../components/Scrolbar/scrol"
import Rightbar from "../../components/rightbar/Rightbar";
import { useState, useEffect, useContext, useRef } from "react"
import { useParams } from "react-router";
import axios from "axios"
import { AuthContext } from "../../context/AuthContext";
import Modal from 'react-modal';
import Bg from "../../assets/img/bg.jpg"
import Slider from "react-slick";
import AllFriendList from "../../components/allFriendList/AllFriendList"
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import useSound from "use-sound";
import UpdateSound from "../../assets/sounds/updateinfo.mp3"
import StorisSound from "../../assets/sounds/storis.mp3"
import Diselike from "../../assets/sounds/diselike.wav";
import RemoveStori from "../../assets/sounds/removestori.mp3"
import _ from "lodash"






export default function Profile() {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [updateSound] = useSound(UpdateSound)
  const [diselike] = useSound(Diselike)
  const [modal, setModal] = useState(false)
  const [fileCover, setFileCover] = useState(null);
  const [img, setImg] = useState(null)
  const [users, setUsers] = useState({})
  const { user } = useContext(AuthContext)
  const [modalCover, setModalcover] = useState(false)
  const [modalProfile, setModalProfile] = useState(false)
  const [allPosts, setAllPosts] = useState(false)
  const [userPosts, setUserPosts] = useState([])
  const [mariedes, setMarides] = useState("")
  const [openSinglePost, setOpenSinglePost] = useState(false)
  const [openSlide, setOpenSlide] = useState(false)
  let [imgUrl, setImgUrl] = useState('')
  const [, setStatus] = useState("")
  const [openPosts, setOpenPosts] = useState(false)
  const lastname = useRef();
  const userName = useRef();
  const job = useRef();
  const scool = useRef();
  const age = useRef();
  const single = useRef();
  const phone = useRef();
  const desc = useRef()
  const from = useRef()
  const city = useRef()
  const birthDay = useRef()
  const username = useParams().username
  const [getfriend, setGetFriend] = useState(false)
  const [getInfo, setGetInfo] = useState(false)
  const [spam, setSpam] = useState(users?.spam?.length)
  const [isSpam, setISpam] = useState(false)
  const [spamList, setSpamList] = useState([])
  const [openSpam, setOpenSpam] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [storiImg, setStoriImg] = useState(null)
  const [storis, setStoris] = useState([])
  const [realStori, setRealStorin] = useState([])
  const [storisData, setStoriData] = useState([])
  const [StoriSound] = useSound(StorisSound)
  const [StoriDelSound] = useSound(RemoveStori)

  axios.interceptors.request.use(config => {
    config.headers.token = `${user.token}`;

    return config
  },
    error => {
      return Promise.reject(error)
    }
  )




  useEffect(() => {
    setISpam(users.spam?.includes(user._id));
  }, [users._id, users.spam, user._id]);


  //slider-settings

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,

  };

  //useEffects
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`/api/users?username=${username}`).catch(e => console.log(e))
      const result = await axios.get('/api/users/spam/' + username)
      setSpamList(result.data)
      setUsers(res.data)

    }
    fetchUsers()
  }, [username])




  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.put('/api/users/' + users._id)
        setStatus(res.data.user)
      } catch (err) {

      }
    }
    getUser()
  }, [users]);




  //handelUpdate 

  const handleClick = async (e) => {
    e.preventDefault()
    updateSound()


    const userChange = {
      username: userName.current.value,
      desc: desc.current.value,
      from: from.current.value,
      city: city.current.value,
      age: age.current.value,
      scool: scool.current.value,
      lastname: lastname.current.value,
      job: job.current.value,
      phone: phone.current.value,
      single: mariedes,
      birthDay: birthDay.current.value,
      notificationBirthday: birthDay.current.value,


    }

    try {

      e.preventDefault()
      await axios.put("/api/users/" + users._id, userChange)

    } catch (err) {
      console.log(err);
    }

    setTimeout(() => {
      window.location.reload()
    }, 450)

  }
  //modal-custom-styles


  const customStyles = {
    content: {
      overflowY: "scroll",
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: "1000px",
      backgroundColor: localStorage.getItem("mode") === "dark" ? "#202020" : "white"

    },
    overlay: {
      backgroundColor: localStorage.getItem("mode") === "dark" ? "black" : "white"
    }
  };

  //img-modal
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



  //update profileImg


  const submitImgHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
    };

    if (img) {
      const data = new FormData();
      const fileName = img.name;
      data.append("file", img);
      data.append("name", fileName);
      newPost.profilePicture = fileName;

      try {
        await axios.post("/api/profileimg/upload", data);

      } catch (err) {
        console.log(err)
      }
    }
    try {
      await axios.put("/api/users/" + users._id, newPost);

      window.location.reload();
    } catch (err) {
      console.log(err)
    }
  };




  //upload coverimg

  const submitCoverHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
    };

    if (fileCover) {




      const data = new FormData();
      const fileName = fileCover.name;
      data.append("file", fileCover);
      data.append("name", fileName);
      newPost.coverePicture = fileName;

      try {
        await axios.post("/api/coverimg/upload", data);

      } catch (err) {
        console.log(err)
      }
    }
    try {
      await axios.put("/api/users/" + users._id, newPost);

      window.location.reload();
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {

    const allPost = async () => {
      const result = await axios.get('/api/post/user/' + users._id)
      setUserPosts(result.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      }))


    }
    allPost()

  }, [users._id])







  ///spam -


  const sendSpam = () => {
    try {
      diselike()
      axios.post("/api/users/spam/" + username, { userId: user._id });
    } catch (err) {
      console.log(err)
    }
    setSpam(isSpam ? spam - 1 : spam + 1);
    setISpam(!isSpam);
  };


  //allusers

  useEffect(() => {

    const allUsers = async () => {
      const res = await axios.get('/api/users/getallusers')
      return setAllUsers(res.data.map(m =>
        m.username
      ))

    }

    allUsers()

  }, [user])



  /// create-stories

  const createStoris = async (e) => {

    e.preventDefault();

    const newStori = {
      userId: user._id,
      author: user?.username,
      authorImg: user?.profilePicture,
      male: user?.male
    };

    if (storiImg) {

      const data = new FormData();
      const fileName = storiImg.name;
      data.append("file", storiImg);
      data.append("name", fileName);
      newStori.img = fileName;

      try {
        await axios.post("/api/storiespicture/upload", data)

      } catch (err) {

        console.log(err)
      }
    }
    try {
      await axios.post("/api/storis/", newStori);
    } catch (err) {
      console.log(err)
    }

    setStoriImg(null)
    StoriSound()

    setTimeout(() => {
      window.location.reload()

    }, 400)

  }

  useEffect(() => {

    const stroisData = async () => {
      const res = await axios.get('/api/storis/userstoris/' + users?._id)
      const data = await axios.get("/api/storis/data/" + users._id)

      setStoriData(data.data)
      setRealStorin(res.data)
      setStoris((res.data.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt) })))
      setStoris(_.sortBy(res.data, 'scope').splice(0, 4));


    }
    stroisData()

  }, [users])




  return (
    <div className={localStorage.getItem("mode") === "dark" ? "root" : null} >
      <Topbar />

      <div className="profile">

        <Sidebar />
        <Modal
          isOpen={modalCover}
          onRequestClose={modalCover ? false : null}

          style={customStylesImg} >
          <div className="modal_div">
            <img src={users.coverePicture ? PF + "cover/" + users.coverePicture : PF + "/person/nocover.png"} alt="cover" />
            <button className="quit-image-view" onClick={() => setModalcover(!modalCover)}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
          </div>

        </Modal>
        <Modal isOpen={openSlide} onRequestClose={openSlide ? false : null} style={customStylesImg}  >
          <Slider {...settings}>
            {userPosts.map((p) => {
              if (!(p?.img?.includes("mp3")) && !(p?.img?.includes("mp4")) && (p?.img !== undefined)) {
                return (
                  <div key={p?._id}>
                    <div className="modal_div">
                      <img src={PF + "/post/" + p.img} alt="post" />
                    </div>
                    <button className="quit-slider" onClick={() => setOpenSlide(!openSlide)}> <i className="fa fa-times-circle-o" aria-hidden="true"></i> </button>
                  </div>
                )
              } else {
                return <div key={p?._id}></div>
              }
            })}
          </Slider>
        </Modal>
        <Modal
          isOpen={modalProfile}
          onRequestClose={modalProfile ? false : null}
          style={customStylesImg} >
          <div className="modal_div">
            <img className="profileModalImg" src={users.profilePicture ? PF + "person/" + users.profilePicture : users.male === "man" ? PF + `person/noAvatar.png` : PF + 'person/woman.png'} alt="profile_img" />
            <button className="quit-image-view" onClick={() => setModalProfile(!modalProfile)}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
          </div>

        </Modal>
        <div className="profileRight">

          <button onClick={() => window.location.replace("/")}>back</button>
          <div>
          </div>
          <div style={{ background: localStorage.getItem("mode") === "dark" ? "black" : "white" }} className="profileRightTop">
            <div className="profileCover">
              <img onClick={() => setModalcover(!modalCover)}
                className="profileCoverImg"
                src={users.coverePicture ? PF + "cover/" + users.coverePicture : PF + "person/nocover.png"}
                alt=""
              />
              <div className="pfofile_container">
                <img onClick={() =>
                  setModalProfile(!modalProfile)}
                  className="profileUserImg"
                  src={users?.profilePicture ? PF + "person/" + users?.profilePicture : users?.male === "man" ? PF + `person/noAvatar.png` : PF + 'person/woman.png'}
                  alt="profile_img" />
                {user._id === users._id ?
                  <form onSubmit={submitImgHandler} >
                    <label htmlFor="img" ><i id="profile_camera" className="fa fa-camera" aria-hidden="true"></i> </label>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      id="img"
                      accept=".png,.jpeg,.jpg,.webp,.svg"
                      onChange={(e) =>
                        setImg(e.target.files[0])
                      } />
                    {img ? <div className="change_photo_img">
                      <button type="submit">CHANGE PHOTO PROFILE ??</button> <span onClick={() => setImg(null)} ><i className="fa fa-times-circle-o" aria-hidden="true"></i></span>
                    </div> : null}
                  </form>
                  : null}
              </div>


              {user._id === users._id ? <form onSubmit={submitCoverHandler} >
                <label htmlFor="filebg" ><i id="covercamera" className="fa fa-camera" aria-hidden="true"></i> </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="filebg"
                  onChange={(e) => {
                    setFileCover(e.target.files[0])
                  }}
                  accept=".png,.jpeg,.jpg,.webp,.svg"
                />
                {fileCover ? <div className="change_photo"><button type="submit">CHANGE PHOTO bg ??</button> <span onClick={() => setFileCover(null)} className="change_photo__bg_span"><i className="fa fa-times-circle-o" aria-hidden="true"></i></span></div> : null}
              </form> : null}
            </div>
            <div className="profileInfo">
              {user._id === users._id && (!storisData?.length) ? <div style={{ cursor: "pointer" }} className="stori">
                <form onSubmit={createStoris}>
                  <input
                    type="file"
                    id="storis-share"
                    accept=".png,.jpeg,.jpg,.webp,.svg,.mp4"
                    onChange={(e) => {
                      setStoriImg(e.target.files[0])
                    }}
                    style={{ display: 'none' }} />
                  <label id="share-stori" htmlFor="storis-share">  <i className="fa fa-reply-all" aria-hidden="true"> Create Stori</i>  </label>
                  {storiImg ?
                    <div>

                      <button className="share-stori-btn" type="submit">share</button>
                      <button className="share-stori-cancel-btn" onClick={() => { StoriDelSound(); return setStoriImg(null) }}  >cancel</button>
                    </div>
                    : null}
                </form>
              </div>
                : null}
              <div className="user-profile-centre">
                <h4 className="profileInfoName">{users.username} {users.lastname}</h4>
                <span className="profileInfoDesc">{users.desc}</span>
              </div>
              <div className="info_div">
                <div className="info-div-fild">
                  <h5 style={{ textDecoration: getInfo ? "underline red" : null }} onClick={() => setGetInfo(!getInfo)} className="info-title"> Information {user._id === users._id ? <i onClick={() => { setModal(!modal) }} className="fa fa-pencil-square" aria-hidden="true"></i> : null}  </h5>
                  <h3 style={{ textDecoration: allPosts ? "underline 3px tomato " : null, }} onClick={() => { setAllPosts(!allPosts); return setOpenPosts(!openPosts) }} className="all-post"> All posts  <i className="fa fa-list" aria-hidden="true"></i></h3>
                </div>
                <div className="info-div-fild" >
                  <div className="allfriends-div"><i style={{ color: getfriend ? "slateblue" : null, borderBottom: getfriend ? "3px solid red" : null }} onClick={() => setGetFriend(!getfriend)} id="allfriends-icon" className="fa fa-users" aria-hidden="true"></i> </div>
                  <div className="spam-div"><span id="spam-length">{users?.spam?.length ? <>{users?.spam?.length} <i className="fa fa-exclamation-triangle" aria-hidden="true"></i> </> : null}</span><i style={{ color: isSpam ? "brown" : null }} onClick={sendSpam} className="fa fa-thumbs-down" aria-hidden="true">  </i> <span id="spam-list-span" onClick={() => setOpenSpam(!openSpam)}>Spam</span>
                  </div>
                  <CSSTransition in={openSpam} timeout={500} classNames="spamlist" unmountOnExit >
                    <div className="spam-list">
                      {spamList ? spamList.map(s => {
                        if (allUsers.includes(s?.username)) {
                          return (
                            <Link  key={s?._id} to={"/profile/" + s?.username}>   <div className="spam-container">
                              <div>
                                <img className="spam-img" src={s?.profilePicture ? PF + "/person/" + s?.profilePicture : s?.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} alt="spam-img" />
                                <span className="span-name">{s?.username}</span>
                              </div>
                            </div>
                            </Link>
                          )
                        } else {
                          return (
                            <div key={s?._id}  className="spam-container">
                              <div>
                                <img className="spam-img" src={PF + "/person/noAvatar.png"} alt="spam-img" />
                                <span className="span-name-deleted">user deleted  </span>
                              </div>
                            </div>



                          )
                        }
                      }) : null}
                    </div>
                  </CSSTransition>
                </div>
              </div>

              <Modal
                isOpen={modal}
                onRequestClose={modal ? false : null}
                style={customStyles}

              >   <h4 style={{ color: localStorage.getItem("mode") === "dark" ? "#ccc" : "black" }} className="title-modal">UPDATE ACCOUNT <button className="close_modal" onClick={() => {
                setModal(false)
                localStorage.setItem("users", JSON.stringify(users.male))
              }} > x </button></h4>
                <form style={{ color: localStorage.getItem("mode") === "dark" ? "#ccc" : "black" }} className="profile-update-form" onSubmit={handleClick} >
                  <input value={user.username} required placeholder="username" minLength="2" type="text" ref={userName} />
                  <input id="lastname" placeholder=" lastname " type="text" ref={lastname} />
                  <input id="age" placeholder=" age" type="number" ref={age} />
                  <input id="status" placeholder="status" type="text" ref={desc} />
                  <input id="countries" placeholder="countries " type="text" ref={from} />
                  <input id="city" placeholder=" city " type="text" ref={city} />
                  <input id="scool" placeholder=" university / scool " type="text" ref={scool} />
                  <input id="job" placeholder="jobs" type="text" ref={job} />
                  <input id="birth" type="date" placeholder="birthDay" ref={birthDay} />
                  <input id="phone" placeholder="phone" minLength="8" maxLength="15" type="number" ref={phone} />
                  <div className="inp_container">
                    <input onChange={(e) => setMarides(e.target.value)} value="married" ref={single} id="married" name="single" type="radio" /> <label for="married"> MARIED </label>
                    <input onChange={(e) => setMarides(e.target.value)} value="single" ref={single} id="single" name="single" type="radio" /> <label for="single"> SINGLE </label>
                  </div>
                  <button className="ok_btn" type="submit"> ok</button>
                </form>
              </Modal>

            </div>
          </div>
          <div style={{ background: localStorage.getItem("mode") === "dark" ? "black" : "white" }} className="rightbarInfo">
            {users.city ? <div className="rightbarInfoItem">
              <span className="rightbarInfoKey"><i className="fa fa-map-marker" aria-hidden="true"></i>City:</span>
              <span id="citys-desc" className="rightbarInfoValue">{users.city}</span>
            </div> : null}
            {users.job ? <div className="rightbarInfoItem">
              <span className="rightbarInfoKey"><i className="fa fa-briefcase" aria-hidden="true"></i>Work:</span>
              <span id="job-desc" className="rightbarInfoValue">{users.job}</span>
            </div> : null}
            {users.single ? <div className="rightbarInfoItem">
              <span className="rightbarInfoKey"> <i className="fa fa-american-sign-language-interpreting" aria-hidden="true"></i>Marital Status:</span>
              <span id="single-desc" className="rightbarInfoValue">{users.single}</span>
            </div> : null}
            {users?.single || users?.job || users?.city ? <span style={{ color: "dodgerblue", fontSize: 22 }} clasname="top">...</span> : null}
          </div>
          <div style={{ background: localStorage.getItem("mode") === "dark" ? "black" : "white" }} className="profileRightBottom">
            {allPosts ?
              < >
                {userPosts.length ? <div className="all-posts-section">
                  <h2 className="title-gallery"> PhotoAlbum  <i className="fa fa-picture-o" aria-hidden="true"></i>   <div className="container-2"> <div onClick={() => setOpenSlide(!openSlide)} className="btn btn-two"><span >Slider</span></div></div> </h2>
                  <div className="post-gallery">
                    {userPosts.map(p => {
                      if (p.img?.includes("jpg", "png", "svg", "jpeg", "webp", "mp4")) {
                        return (<div key={p?._id}>
                          <div  onClick={() => {
                            setImgUrl(p.img);
                            return setOpenSinglePost(!openSinglePost)

                          }}

                            className="postimg-div">
                            <i style={{ zIndex: openSinglePost ? 0 : 2 }} className="fa fa-heart" aria-hidden="true">{p.heartes.length}</i> <i style={{ zIndex: openSinglePost ? 0 : 2 }} className="fa fa-thumbs-up" aria-hidden="true">{p.likes.length}</i>
                            <i style={{ zIndex: openSinglePost ? 0 : 2 }} className="fa fa-commenting" aria-hidden="true">{p.comments.length}</i>  <img className="hover-bg" src={Bg} alt="bg" />
                            <img className="allpostimg" src={PF + "/post/" + p.img} alt="post" />
                          </div>

                          <Modal
                            isOpen={openSinglePost}
                            onRequestClose={openSinglePost ? false : null}
                            style={customStylesImg}>
                            <div className="modal_div">
                              <img src={PF + "/post/" + imgUrl} alt="post" />
                              <button onClick={() => setOpenSinglePost(!openSinglePost)}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
                            </div>
                          </Modal>
                        </div>
                        )
                      } else {
                        return <div key={p?._id}> </div>
                      }
                    })
                    }
                  </div>
                  <h2 className="title-gallery">VideoAlbum <i className="fa fa-video-camera" aria-hidden="true"></i></h2>
                  <div className="post-gallery">


                    {userPosts.map(u => {

                      if (u.img?.includes("mp4")) {

                        return (
                          <div key={u._id} className="postimg-div">
                            <video className="allpostimg" controls src={PF + "/post/" + u.img} />
                            <i className="fa fa-heart" aria-hidden="true">{u.heartes.length}</i>
                            <i className="fa fa-thumbs-up" aria-hidden="true">{u.likes.length}</i>
                            <i className="fa fa-commenting" aria-hidden="true">{u.comments.length}</i>
                          </div>
                        )
                      } else {
                        return <div key={u._id}></div>
                      }

                    })}


                  </div>
                  <h2 className="title-gallery">AudioAlbum <i className="fa fa-music" aria-hidden="true"></i></h2>
                  <div className="post-gallery">
                    {userPosts ? userPosts.map(u => {
                      if (u.img?.includes("mp3")) {

                        return (<div key={u._id} className="postaudio-div"><audio style={{ width: "100%" }} className="allpostaudio" controls src={PF + "/post/" + u.img} />
                          <i className="fa fa-heart" aria-hidden="true">{u.heartes.length}</i>
                          <i className="fa fa-thumbs-up" aria-hidden="true">{u.likes.length}</i>
                          <i className="fa fa-commenting" aria-hidden="true">{u.comments.length}</i>
                        </div>
                        )
                      } else {
                        return <div key={u?._id}></div>
                      }
                    }) : null}
                  </div>
                </div> : localStorage.getItem("mode") === "light" ? <div><img className="empti-post" src={PF + "post/emptypost.jpg"} alt="empty-page" /></div> : <div className="empti-div"> You do not have any news or posts yet... <i className="fa fa-columns" aria-hidden="true"></i></div>}
              </>
              : getfriend ? <AllFriendList username={username} /> : getInfo
                ?
                <div className="information-user">
                  <h1> User information</h1>
                  <div className="info-fild-div"><span className="rightbarInfoKey"><i className="fa fa-map-marker" aria-hidden="true"></i>City:</span><span id="citys-info" className="rightbarInfoValue">{users?.city ? users.city : "no info"}</span> </div>
                  <div className="info-fild-div"><span className="rightbarInfoKey"><i className="fa fa-globe" aria-hidden="true"></i>Country:</span><span id="countries-info" className="rightbarInfoValue">{users?.from ? users.from : "no info"}</span> </div>
                  <div className="info-fild-div"><span className="rightbarInfoKey"><i className="fa fa-briefcase" aria-hidden="true"></i>Job:</span><span id="job-info" className="rightbarInfoValue">{users?.job ? users.job : "no info"}</span> </div>
                  <div className="info-fild-div"><span className="rightbarInfoKey"><i className="fa fa-graduation-cap" aria-hidden="true"></i>SCool/University:</span><span id="scool-info" className="rightbarInfoValue">{users?.scool ? users.scool : "no info"}</span> </div>
                  <div className="info-fild-div"><span className="rightbarInfoKey"><i className="fa fa-venus-mars" aria-hidden="true"></i>Gender:</span><span className="rightbarInfoValue">{users?.male ? users.male : "no info"}</span> </div>
                  <div className="info-fild-div"><span className="rightbarInfoKey"><i className="fa fa-american-sign-language-interpreting" aria-hidden="true"></i>Marrital status:</span><span id="single-info" className="rightbarInfoValue">{users?.single ? users.single : "no info"}</span> </div>
                  <div className="info-fild-div"><span className="rightbarInfoKey"><i className="fa fa-male" aria-hidden="true"></i>Age:</span><span id="age-info" className="rightbarInfoValue">{users?.age ? users.age : "no info"}</span> </div>
                  <div className="info-fild-div"><span className="rightbarInfoKey"><i className="fa fa-birthday-cake" aria-hidden="true"></i>Birthday:</span><span className="rightbarInfoValue">{users?.birthDay ? users?.birthDay?.replace(/T[\d+:]{8}.\d+Z/, "") : "no info"}</span></div>
                  <div className="info-fild-div"><span className="rightbarInfoKey"><i className="fa fa-phone-square" aria-hidden="true" ></i>Phone:</span><span id="phone-info" className="rightbarInfoValue">{users?.phone ? <a href={`tel:${users.phone}`}>{users.phone}</a> : "no info"}</span> </div>
                  <div style={{ textAlign: "center" }} className="info-fild-div"> <buton onClick={() => setGetInfo(!getInfo)} className="close-btn">Close</buton></div>
                </div>
                : <>
                  <Scrol realStori={realStori} storis={storis} userId={users._id} username={username} /> </>}

            <Rightbar getfriend={getfriend} user={users} />
          </div>
        </div>
      </div>

    </div>
  );
}