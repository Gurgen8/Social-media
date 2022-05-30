import "./rightbar.scss";
import Online from "../onlineRightbar/Online";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { AuthContext } from "../../context/AuthContext";
import BirtIcon from "../../assets/img/gift.png";
import Banner1 from "../../assets/img/banner/travel.jpg";
import Banner2 from "../../assets/img/banner/travel2.jpg";
import Banner3 from "../../assets/img/banner/travel3.jpg";
import Banner4 from "../../assets/img/banner/travel4.jpg";
import Banner5 from "../../assets/img/banner/travel5.jpg";
import Banner6 from "../../assets/img/banner/travel6.jpg";
import Banner7 from "../../assets/img/banner/travel7.jpg";
import Banner8 from "../../assets/img/banner/travel8.jpg";
import useSound from "use-sound";
import FollowSound from "../../assets/sounds/follow.wav";

export default function Rightbar({ user, getfriend }) {
  const [friends, setFriends] = useState([]);
  const [followSound] = useSound(FollowSound);
  const [followers, setFollowers] = useState([]);
  const [followlength, setFollowLength] = useState("");
  const [followinLength, setFollowinLength] = useState("");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser?.followins?.includes(user?._id) || false
  );
  const [openMenu, setOpenMenu] = useState(false);
  const banner = [
    Banner1,
    Banner2,
    Banner3,
    Banner4,
    Banner5,
    Banner6,
    Banner7,
    Banner8,
  ];

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/api/users/friends/" + user?._id);

        setFollowinLength(friendList.data.length);
        setFriends(_.sortBy(friendList.data, "scope").reverse().splice(0, 4));
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  useEffect(() => {
    const getFollowers = async () => {
      try {
        const friendList = await axios.get("/api/users/followers/" + user?._id);

        setFollowLength(friendList.data.length);
        setFollowers(_.sortBy(friendList.data, "scope").reverse().splice(0, 4));
      } catch (err) {
        console.log(err);
      }
    };
    getFollowers();
  }, [user]);

  const handelClick = async () => {
    followSound();
    try {
      if (followed) {
        await axios.put(`/api/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/api/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (error) {
      setFollowed(followed);
    }

    window.location.reload();
  };

  const HomeRightbar = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
      const fetchAllUsers = async () => {
        const res = await axios.get(`/api/users/getallusers`);

        setUsers(res.data);
      };
      fetchAllUsers();
    }, [user._id]);

    const [count, setCount] = useState(0);

    ///random image banner

    useEffect(() => {
      setInterval(() => {
        setCount((count) => {
          if (count === 7) {
            setCount(0);
          }
          return count + 1;
        });
      }, 6000);
    }, []);

    return (
      <>
        <div
          style={{
            marginTop: window.location.href.includes("allusers") ? 45 : null,
          }}
          className="birthdayContainer"
        >
          <span className="birthdayText">
            <img className="birthdayImg" src={BirtIcon} alt="" />
            <b> Today's birthdays:</b> <br />
            {users?.map((u) => {
              if (
                new Date().toISOString().split("T")[0] ===
                  (u.birthDay + "").split("T")[0] &&
                u.username !== user.username &&
                user.followins.includes(u._id) &&
                u?.followers?.includes(user._id)
              ) {
                return (
                  <b class="bday_text" key={u?._id}>
                    {" "}
                    <Link to={`/profile/${u.username}`}>
                      {" "}
                      {u.username},{" "}
                    </Link>{" "}
                  </b>
                );
              } else {
                return <div key={u?._id}> </div>;
              }
            })}
          </span>
        </div>
        <Link to="/paymantsystem-travel">
          {" "}
          <img
            id="travel-banner"
            className="rightbarAd"
            src={banner[count]}
            alt="travel"
          />{" "}
        </Link>
        <div className="rightbarFriendList">
          <Online />
        </div>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user?.followers?.includes(currentUser._id) &&
        user._id !== currentUser._id ? (
          <div className="user-followins-div">
            <span
              id="follow"
              onClick={handelClick}
              clasName="rightbarFollowButton"
            >
              {" "}
              Unfollow{" "}
              <i
                style={{ color: "brown" }}
                className="fa fa-user-times"
                aria-hidden="true"
              ></i>{" "}
            </span>
          </div>
        ) : !user?.followers?.includes(currentUser._id) &&
          user._id !== currentUser._id ? (
          <div className="user-followins-div">
            <span
              id="follow"
              onClick={handelClick}
              clasName="rightbarFollowButton"
            >
              Follow{" "}
              <i
                style={{ color: "green" }}
                className="fa fa-user-plus"
                aria-hidden="true"
              ></i>{" "}
            </span>
          </div>
        ) : null}

        <h4 className="rightbarTitle">
          Followings <b>{followinLength}</b>
        </h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => {
            return (
              <div
                key={friend?._id}
                onClick={() => {
                  if (getfriend === true) {
                    window.location.reload();
                  }
                }}
                className="rightbarFollowing"
              >
                {friend?._id ? (
                  <Link
                    style={{ textDecoration: "none" }}
                    to={"/profile/" + friend.username}
                  >
                    {" "}
                    <img
                      src={
                        friend.profilePicture
                          ? PF + "/person/" + friend.profilePicture
                          : PF + `person/noAvatar.png`
                      }
                      alt="friendpictures"
                      className="rightbarFollowingImg"
                    />
                  </Link>
                ) : null}
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            );
          })}
          {followinLength > 4 ? (
            <span className="show-all-friends">...</span>
          ) : null}
        </div>
        <h4 className="rightbarTitle">
          {" "}
          Followers <b>{followlength}</b>{" "}
        </h4>
        <div className="rightbarFollowings">
          {followers.map((follow) => {
            return (
              <div
                key={follow?._id}
                onClick={() => {
                  if (getfriend === true) {
                    window.location.reload();
                  }
                }}
                className="rightbarFollowing"
              >
                <Link
                  style={{ textDecoration: "none" }}
                  to={"/profile/" + follow.username}
                >
                  {" "}
                  <img
                    src={
                      follow.profilePicture
                        ? PF + "/person/" + follow.profilePicture
                        : PF + `person/noAvatar.png`
                    }
                    alt="friendpictures"
                    className="rightbarFollowingImg"
                  />
                </Link>
                <span className="rightbarFollowingName">{follow.username}</span>
              </div>
            );
          })}
          {followlength > 4 ? (
            <span className="show-all-friends">...</span>
          ) : null}
        </div>
      </>
    );
  };
  return (
    <>
      <div className={openMenu ? "rightbar-open" : "rightbar"}>
        <div className="rightbarWrapper">
          {user ? <ProfileRightbar /> : <HomeRightbar />}
        </div>
      </div>
      {!window.location.href.includes("allusers") ? (
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="rightbar-togle"
        >
          <i className="fa fa-window-restore" aria-hidden="true"></i>
        </button>
      ) : null}
    </>
  );
}
