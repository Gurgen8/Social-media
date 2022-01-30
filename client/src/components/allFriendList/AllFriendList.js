import "./allFriendList.scss"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import { Spinner } from "react-bootstrap"




export default function AllFriendList({ username }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [follower, setFollowers] = useState([])
    const [followins, setFollowins] = useState([])
    const { user } = useContext(AuthContext)

    useEffect(() => {
        const profile = async () => {

            const res = await axios.get('/api/users/profile/friends/' + username);
            return setFollowins(res.data)
        }
        profile()
    }, [username])

    useEffect(() => {
        const profile = async () => {
            const res = await axios.get('/api/users/profile/followers/' + username);
            return setFollowers(res.data)
        };

        profile()
    }, [username])


    return (
        <div className="friends-list">
            <div className="followins-section">
                <h3>All followings {followins.length}</h3>
                {followins.map(f => {
                    if (f) {
                        return (<div key={f?._id}>

                            <div  className="follow-div" >
                                <img src={f.profilePicture ? PF + "/person/" + f.profilePicture : f.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} className="follow-img" alt="foloow-img" />
                                <span className="follow-span"> {f?.username} </span>
                                {user.username === username && window.location.href.includes(user.username) ? 
                                <i id="remove-followins" onClick={() => { window.location.reload(); return axios.put(`/api/users/${f._id}/unfollow`, { userId: user._id }) }} className="fa fa-trash" aria-hidden="true"></i> : null}
                            </div>
                        </div>
                        )
                    } else {
                        return <Spinner key={f?._id}  animation="border" variant="dark" />
                    }
                })}
            </div>
            <div className="followers-section">
                <h3>All followers {follower.length}</h3>
                {follower.map(f => {
                    return (<div key={f?._id}>
                        <div className="follow-div" key={f.id}>
                            <img src={f.profilePicture ? PF + "/person/" + f.profilePicture : f.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} className="follow-img" alt="foloow-img" />
                            <span className="follow-span"> {f?.username} </span>
                            {user.username === username && window.location.href.includes(user.username) ? 
                            <i id="remove-followers" onClick={() => { window.location.reload(); return axios.put(`/api/users/${user._id}/removefollow`, { userId: f._id }) }} className="fa fa-trash" aria-hidden="true"></i> : null}
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    )

}
