import { useEffect, useRef, useState, useContext } from 'react';
import useSound from "use-sound";
import Peer from 'peerjs';
import "./videochat.scss"
import Nocalling from "../../assets/img/nocalling.png"
import { AuthContext } from '../../context/AuthContext';
import EndCall from "../../assets/sounds/callingend.mp3";
import { useParams } from "react-router";
import { Link } from 'react-router-dom';
import axios from 'axios';
import ConnectLine from "../../assets/img/connectline.png";
import { Spinner } from "react-bootstrap"



function VideoChat() {

  const [CallEndSound] = useSound(EndCall)
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  let { user } = useContext(AuthContext);
  const [updateUser, setUpdateUser] = useState()
  const [currentUser, setCurrentUser] = useState()
  const friendId = useParams().friendId;
  const [searchSignal, setSearchSignal] = useState(false)


  useEffect(() => {
    const getUserId = async () => {
      const res = await axios.get(`/api/users?userId=${user._id}`)
      setUpdateUser(res.data)

    }
    getUserId()

  }, [user])

  useEffect(() => {

    const getFriendId = async () => {
      const res = await axios.get(`/api/users?userId=${friendId}`)
      setCurrentUser(res.data)
    }

    getFriendId()

  }, [friendId])


  useEffect(() => {
    const peer = new Peer();
    peer.on('open', (id) => {
      setPeerId(id)
    });


    peer.on('call', (call) => {
      let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();

        });
      });
    })

    peerInstance.current = peer;
  }, [])

  const call = (remotePeerId) => {
    let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
        if (remoteStream) {
          console.log("signal")
        } else {
          console.log('no signal')
        }
      });
    });
  }


  const endCall = async () => {

    await axios.put(`/api/messages/videochatconnect/removeid/${user._id}/${friendId}`);
    CallEndSound()

    setTimeout(() => {
      window.location.replace("/messenger")
    }, 3000);

  }

  const refresh = async () => {

    await axios.put(`/api/messages/videochatconnect/removeid/${user._id}/${friendId}`);
    setTimeout(() => {
      window.location.reload()
    }, 300);

  }

  const quitChat = async () => {

    await axios.put(`/api/messages/videochatconnect/removeid/${user._id}/${friendId}`);

  }

  const connected = async () => {

    setSearchSignal(true)
    call(remotePeerIdValue);
    await axios.post('/api/messages/videochat/' + friendId, { videochatId: peerId })

  }

  useEffect(() => {
    setRemotePeerIdValue(updateUser?.videoConenctId ? updateUser?.videoConenctId : peerId)

  }, [updateUser?.videoConenctId,peerId])


  useEffect(() => {
    const viddeConect = async () => {
      peerId && await axios.post('/api/messages/videochat/' + friendId, { videochatId: peerId })

    }
    viddeConect()


  }, [peerId,friendId])

  return (
    <div className="videochatRoom">
      <input
        style={{ position: "absolute", visibility: "hidden", width: 0 }}
        value={updateUser?.videoConenctId ? updateUser.videoConenctId : peerId}
        type="text" onChange={e => { return setRemotePeerIdValue(e.target.value) }} />
      <i style={{ marginTop: "20px", position: "sticky", fontSize: "40px" }} onClick={connected} className="fa fa-video-camera" aria-hidden="true"></i>
      <div className="videochat-videos">
        <div className="videos-item">
          <span className="videochat-user">{user?.username}</span>
          <video ref={currentUserVideoRef} />
        </div>

        <div className="videos-item">
          <span className="videochat-user">{currentUser?.username}</span>
          <div className="friend-videochat-video">
            <video ref={remoteVideoRef} />
          </div>
          {searchSignal ? <div className="searching-signal">
            <p>searching signal... </p>
            <Spinner animation="grow" variant="dark" />
            <Spinner animation="grow" variant="light" />
            <Spinner animation="grow" variant="dark" />
            <Spinner animation="grow" variant="light" />
            <Spinner animation="grow" variant="dark" />
            <Spinner animation="grow" variant="light" />
            <Spinner animation="grow" variant="dark" />
          </div> : null}
        </div>

      </div>
      <img onClick={endCall} className="callicon" src={Nocalling} alt="call" />
      <i onClick={refresh} className="fa fa-refresh" aria-hidden="true"></i>
      <Link onClick={quitChat} to={'/messenger'}><button className="go-back">Go back </button></Link>
      <img className="line-connect" src={ConnectLine} alt="coneect-line" />

    </div>);
};

export default VideoChat;