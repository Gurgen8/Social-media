import ChatOnline from "../chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios'
import { io } from "socket.io-client";

export default function Onlineusers() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);

  ///socket-connext-message

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

  }, []);

  ///SOCKET-addUser-ONLINE

  useEffect(() => {
    const getUsers = async () => {
      const res = await axios.get('api/users/?userId=' + user._id)
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(
          res.data.followins.filter((f) => users.some((u) => u.userId === f))

        );

      });

    }
    getUsers()


  }, [user?._id]);


  return (
    <>
      <div className="chatOnline">
        <div className="chatOnlineWrapper">
          <ChatOnline
            onlineUsers={onlineUsers}
            currentId={user._id}

          />
        </div>
      </div>
    </>
  )
}