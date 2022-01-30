import axios from "axios";
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import "./chatOnline.scss";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriend, setOnlineFriend] = useState(false)
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/api/users/friends/" + currentId);
      setFriends(res.data);
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends?.filter((f) => onlineUsers?.includes(f._id)));
  }, [friends, onlineUsers]);


  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `api/conversation/find/${currentId}/${user._id}`
      );
      setCurrentChat(res.data);
    } catch (err) {

      console.log(err)
    }
  };



  return (
    <>
      <div className={onlineFriend ? "chatonline-open" : "chatOnline"}>
        <h4 className="chat-online-title"> Online friends</h4>
        {onlineFriends.map((o) => (
          <Link to={`/profile/${o.username}`}> 
          <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
            <div key={o.id} className="chatOnlineImgContainer">
              <img
                className="chatOnlineImg"
                src={
                  o?.profilePicture
                    ? PF + "/person/" + o.profilePicture
                    : o.male === "man" ? PF + "person/noAvatar.png" : PF + 'person/woman.png'
                }
                alt=""
              />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{o?.username}</span>
          </div>
          </Link>
        ))}
      </div>
      {window.location.href.includes("messenger") ? <button onClick={() => setOnlineFriend(!onlineFriend)} className="open-onlines"><i className="fa fa-user-circle-o" aria-hidden="true"></i></button> : null}
    </>
  );
}