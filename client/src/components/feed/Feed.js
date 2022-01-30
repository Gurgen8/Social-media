import Post from "../post/Post";
import { useState, useEffect, useContext } from "react";
import Share from "../share/Share";
import "./feed.scss";
import axios from "axios"
import { AuthContext } from "../../context/AuthContext";
import { Spinner } from "react-bootstrap"
import SLider from "../slideusers/SlideUsers";
import SliderStoris from "../slideStoris/SliderStoris"
import SlideUserStori from "../slideUserStoris/SlideUserStori"

export default function Feed({ username, storis, userId, realStori }) {

  const [loading, setLoading] = useState(false)
  const [post, setPosts] = useState([]);
  const { user } = useContext(AuthContext)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER


  useEffect(() => {
    try {
      const fetchRequest = async () => {

        await axios.put(`/api/messages/videochatconnect/removeid/${user._id}/${user._id}`);
        const res =
          username
            ? await axios.get('/api/post/profile/' + username).catch(e => console.log(e))
            : await axios.get('/api/post/timeline/' + user._id).catch(e => console.log(e))

        setPosts(res.data.sort((p1, p2) => {

          return new Date(p2.createdAt) - new Date(p1.createdAt)
        }))


      }
      fetchRequest()
      setTimeout(() => setLoading(true), 2000)

    } catch (e) {
      console.log(e)
    }
  }, [username, user._id])

  return (

    <div>
      <div style={{ paddingTop: window.location.href.includes("profile") ? 0 : 40 }} className="feed">
        <div className="feedWrapper">
          {(!username || username === user.username) ? <Share /> : ""}
          {!loading || !post
            ? <div className="spiner" style={{ height: "100vh" }}>
              <div className="spiner-div">
                <Spinner animation="grow" variant="primary" />
                <Spinner animation="grow" variant="secondary" />
                <Spinner animation="grow" variant="success" />
                <Spinner animation="grow" variant="danger" />
                <Spinner animation="grow" variant="warning" />
                <Spinner animation="grow" variant="info" />
                <Spinner animation="grow" variant="dark" />
              </div>
            </div>
            : post.length === 0 && !(window.location.href.includes("profile")) && localStorage.getItem("mode") === "light"
              ? <> <img className="empty-post-img" style={{ marginTop: 20 }} src={PF + "/post/emptypost.jpg"} alt="empty" />
                <div style={{ overflow: "hidden", marginTop: 100, display: window.location.href.includes("profile") ? "none" : null }} className="post"> <SLider /></div>
              </>
              : post.length === 0 && !(window.location.href.includes("profile")) && localStorage.getItem("mode") === "dark"
                ? <> <div className="empti-div">You do not have any news or mail posts... <i className="fa fa-columns" aria-hidden="true"></i></div>
                  <div style={{ overflow: "hidden", marginTop: 100, display: window.location.href.includes("profile") ? "none" : null }} className="post"> <SLider /></div>
                </>
                : post.length === 0 && (window.location.href.includes("profile")) && localStorage.getItem("mode") === "dark"
                  ? <div className="empti-div">You do not have any news or posts... <i className="fa fa-columns" aria-hidden="true"></i></div>
                  :
                  <>
                    {!window.location.href.includes("profile") ? <SliderStoris userId={user?._id} /> : <SlideUserStori realStori={realStori} storis={storis} userId={userId} />}
                    {post.map((p) => (
                      <Post key={p._id} post={p} />))
                    }
                    <div style={{ overflow: "hidden", marginTop: 10, display: window.location.href.includes("profile") ? "none" : null }} className="post"> <SLider /></div>
                    {window.location.href.includes("profile") && !post.length ? <img className="empty-post-img" src={PF + "/post/emptypost.jpg"} alt="no-post" /> : null}
                  </>
          }

        </div>
      </div>
    </div>
  );
}
