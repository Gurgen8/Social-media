import "./sidebar.scss";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import Flag from "../../assets/img/flagam.png"



export default function Sidebar() {
  const [rangeStart] = useState(new Date())
  const defaultEndDate = new Date()
  defaultEndDate.setDate(defaultEndDate.getDate())
  const [rangeEnd, setRangeEnd] = useState(defaultEndDate)
  const [openEvents, setOpenEvents] = useState(false)
  const [openSetting, setOpenSetting] = useState(false)
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([])
  const [showFriends, setShowFriends] = useState(false)
  const [open, setOpen] = useState(false)
  const [showCourse, setShowCourse] = useState(false)
  const [showGames, setShowGames] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [deleteAccount, setDeleteAccount] = useState(false)
  const [showBooks, setShowBooks] = useState(false)
  const [openbar, setOpenbar] = useState(false)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER


  //open all users section



  const selectEndDate = d => {
    setRangeEnd(d)
  }


  useEffect(() => {

    const fetchAllUsers = async () => {

      const res = await axios.get(`/api/users/getallusers`)
      setUsers(res.data)

    }
    fetchAllUsers()

  }, [user._id])



  //delete user


  const deleteUser = async () => {
    await axios.delete("/api/users/" + user._id)
    window.location.replace('/')
    localStorage.removeItem("user")
    prompt("You have just deleted your profile, we hope you will register on our site soon  Specify the reason for deleting")
    setTimeout(() => {
      window.location.reload()
    }, 200)

  }


  /// deleteing-account-for-user-spam

  useEffect(() => {

    const spamDelete = async () => {
      await axios.delete("/api/users/spam/" + user._id)

    }
    user.spam?.length > 2 && (prompt("Your account has been deleted because you have too much spam"))
    user.spam?.length > 2 && localStorage.removeItem("user")
    user.spam?.length > 2 && (window.location.replace('/'))

    spamDelete()

  }, [user.spam, user?._id])



  //quit-account


  const quit = () => {
    localStorage.removeItem("user")
    window.location.href = "/"

  }

  //darkmode-lightmode
  const changeDark = () => {
    localStorage.setItem("mode", "dark")
    window.location.reload()
  }


  const changeLigth = () => {
    localStorage.removeItem("mode")
    localStorage.setItem("mode", "light")
    window.location.reload()
  }


  return (<>
    <div className={openbar ? "sidebar-open" : "sidebar"}>
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li id="setting" onClick={() => setOpenSetting(!openSetting)} className="sidebarListItem">
            <i className="fa fa-wifi" aria-hidden="true"></i>
            <span className="sidebarListItemText">Setings <i style={{ transition: "0.5s", transform: openSetting ? "rotate(90deg)" : null }} className="fa fa-caret-right" aria-hidden="true"></i></span>
          </li>
          <CSSTransition in={openSetting} timeout={600} classNames="coment" unmountOnExit >
            <ul>
              <li id="refresh" onClick={() => window.location.reload()} className="setting-li">Reload page <i className="fa fa-refresh" aria-hidden="true"></i></li>
              <li className="setting-li"><a className="gogle-map" target="_blank" rel="noreferrer" style={{ color: "firebrick" }} href="https://www.google.com/maps"> Google Map  <i class="fa fa-globe" aria-hidden="true"></i></a></li>
              <li id="mode" onClick={() => setDarkMode(!darkMode)} className="setting-li">{localStorage.getItem("mode") === "dark" ? <>Darkmode  <i onClick={changeLigth} className="fa fa-toggle-on" aria-hidden="true"></i></> : <> Darkmode<i onClick={changeDark} className="fa fa-toggle-off" aria-hidden="true"></i></>}</li>
              <li id="delete-account" onClick={() => setDeleteAccount(!deleteAccount)} className="setting-li">Delete account <i className="fa fa-eraser" aria-hidden="true"></i>
                {deleteAccount ? <><li className="del-query"> <b> delete? </b><br /> <span id="yes-del" onClick={deleteUser}>yes</span> <span onClick={() => setDeleteAccount(!deleteAccount)}>no</span></li></> : null}
              </li>
              <li id="quit" onClick={quit} className="setting-li">Quit acount <i className="fa fa-external-link" aria-hidden="true"></i></li>
            </ul>
          </CSSTransition>
          <Link to="/messenger">
            <li id="chat" className="sidebarListItem">
              <i className="fa fa-comment"></i>
              <span className="sidebarListItemText">Chats</span>
            </li>
          </Link>
          <Link to="/movies" > <li id="movies" className="sidebarListItem">
            <i className="fa fa-film" aria-hidden="true"></i>
            <span className="sidebarListItemText">Movies</span>
          </li>
          </Link>
          <Link to="/allusers">  <li id="groups" className="sidebarListItem">
            <i className="fa fa-users"></i>
            <span className="sidebarListItemText">Groups</span>
          </li>
          </Link>
          <Link to="/weather"> <li id="weather" className="sidebarListItem">
            <i className="fa fa-thermometer-quarter" aria-hidden="true"></i>
            <span className="sidebarListItemText">Weather</span>
          </li>
          </Link>
          <li id="games" onClick={() => setShowGames(!showGames)} className="sidebarListItem">
            <i className="fa fa-gamepad"></i>
            <span className="sidebarListItemText">Games <i style={{ transition: "0.5s", transform: showGames ? "rotate(90deg)" : null }} className="fa fa-caret-right" aria-hidden="true"></i></span>
          </li>
          <CSSTransition in={showGames} timeout={600} classNames="coment" unmountOnExit >
            <ul>
              <li id="rock-papaers-scissors" className="course-li"> <Link to='/game-rock-paper-scissors'>ROCK PAPER SCISSORS <i className="fa fa-trophy" aria-hidden="true"></i></Link></li>
              <li id="millionares" className="course-li"><Link to='/game-millionair'>Milloners <i className="fa fa-cc-mastercard" aria-hidden="true"></i> </Link></li>
            </ul>
          </CSSTransition>
          <li id="books" onClick={() => setShowBooks(!showBooks)} className="sidebarListItem">
            <i style={{ color: "black" }} className="fa fa-book" aria-hidden="true"></i>
            <span className="sidebarListItemText">Books  <i style={{ transition: "0.5s", transform: showBooks ? "rotate(90deg)" : null }} className="fa fa-caret-right" aria-hidden="true"></i></span>
          </li>
          <CSSTransition in={showBooks} timeout={600} classNames="coment" unmountOnExit >
            <ul>
              <li className="course-li"> <a href="https://openlibrary.org/" target="_blank" rel="noreferrer"> Open Library</a>  </li>
              <li className="course-li"> <a href="https://onlinelibrary.wiley.com/" target="_blank" rel="noreferrer">Wiley Online Library </a>  </li>
              <li className="course-li"> <a href="https://library.aua.am/ " target="_blank" rel="noreferrer">Papazyan Library </a>   <img className="flag-img" src={Flag} alt="flag" /> </li>
            </ul>
          </CSSTransition>
          <Link to="/covidinfo"><li id="covid" className="sidebarListItem">
            <i style={{ color: "#B05C52" }} className="fa fa-ambulance" aria-hidden="true"></i>
            <span className="sidebarListItemText">COVID-19 </span>
          </li>
          </Link>
          <li id="events" className="sidebarListItem" >
            <i onClick={() => setOpenEvents(!openEvents)} className="fa fa-calendar"></i>
            <div className="datepicker_div">
              {openEvents ? <> <DatePicker
                selectsEnd
                selected={rangeEnd}
                startDate={rangeStart}
                endDate={rangeEnd}
                onChange={selectEndDate}
              />
                <button className="datepicker_button" onClick={() => {
                  setRangeEnd(new Date())

                }}>x</button>
              </>
                : null}
            </div>
            <span onClick={() => setOpenEvents(!openEvents)} className="sidebarListItemText">Events</span>
          </li>
          <li onClick={() => setShowCourse(!showCourse)} className="sidebarListItem">
            <i id="courses" className="fa fa-graduation-cap"></i>
            <span className="sidebarListItemText">Courses <i style={{ transition: "0.5s", transform: showCourse ? "rotate(90deg)" : null }} className="fa fa-caret-right" aria-hidden="true"></i></span>
          </li>
        </ul>
        <CSSTransition in={showCourse} timeout={600} classNames="coment" unmountOnExit >
          <ul>
            <li className="course-li"> <a href="https://www.w3schools.com/" target="_blank" rel="noreferrer">W3-Scools</a></li>
            <li className="course-li"><a href="https://ru.reactjs.org/" target="_blank" rel="noreferrer">ReactJs course</a></li>
            <li className="course-li"> <a href="https://nodejs.org/en/docs/" target="_blank" rel="noreferrer">NodeJs course</a></li>
            <li className="course-li"><a href="https://docs.mongodb.com/" target="_blank" rel="noreferrer">MongoDb course</a></li>
            <li className="course-li"><a href="https://jsfiddle.net/" target="_blank" rel="noreferrer">jsfiddle online editor</a></li>
          </ul>
        </CSSTransition>
        <div class="frame">
          <button onClick={() => {
            setOpen(!open)
            return setShowFriends(!showFriends)
          }} class="custom-btn btn-12"><span>Click!</span><span>{!open ? "Show More" : "Hide More"}</span></button>
        </div>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {showFriends ?
            users.map((u) => (
              <Link key={u._id} style={{ textDecoration: "none" }} to={"/profile/" + u.username}>
                <li className="sidebarFriend">
                  <img className="sidebarFriendImg" src={u.profilePicture ? PF + "person/" + u.profilePicture : user.male === "man" ? PF + `person/noAvatar.png` : PF + 'person/woman.png'} alt="users..." />
                  <span className="sidebarFriendName">{u.username}</span>
                </li>
              </Link>
            )) : null}
        </ul>
      </div>
    </div>
    {!window.location.href.includes("allusers") ? <button onClick={() => setOpenbar(!openbar)} className="togle-button"  ><i style={{ transition: "all 0.7s", transform: openbar ? "rotate(180deg)" : null }} className="fa fa-caret-square-o-up" aria-hidden="true"></i>  </button> : null}
  </>
  );
}