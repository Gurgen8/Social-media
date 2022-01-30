import './allusers.scss'
import axios from 'axios'
import React, { Component } from 'react'
import queryString from 'query-string'
import _ from "lodash";
import { Link } from "react-router-dom"
import Topbar from '../topbar/Topbar'
import Rightbar from '../rightbar/Rightbar';
import Sidebar from '../sidebar/Siedbar';
import { AuthContext } from '../../context/AuthContext';
const PF = process.env.REACT_APP_PUBLIC_FOLDER

export default class AllUsers extends Component {

  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      data: []

    }
  }


  componentDidMount() {
    const getuser = async () => {
      const res = await axios.get('/api/users/getallusers')
      this.setState({
        data: res.data
      })
    }
    getuser()
  }


  render() {
    const { user } = this.context
    let { data } = this.state
    const queryObj = queryString.parse(window.location.search)

    if (queryObj.search) {
      data = data.filter(p => _.toLower(p.username)?.includes(_.toLower((queryObj.search))))
    }



    return (
      < div className={localStorage.getItem("mode") === "dark" ? "root" : null}  >
        <Topbar />
        <div className="homeContainer">
          <Sidebar />
          <div className="all-users-container">
            <h3 className="allusers-title">LIST OF USERS</h3>
            {data.length ? data.map((d) => {
              if (d.username !== user.username) {
                return (
                  <Link key={d?._id} to={"/profile/" + d.username}>
                    <div  className="user-div" >
                      <div className="picture-div">
                        <img className="alluser-img" src={d.profilePicture ? PF + "/person/" + d.profilePicture 
                        : d.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} alt="user" />{user?.followins.includes(d._id) && d.followins.includes(user._id) && d.followers.includes(user._id) ? 
                        <i className="fa fa-user-circle" aria-hidden="true"></i> : null}
                      </div>
                      <span className="user-name">{d.username} {d.lastname ? d.lastname : null}</span>
                      <span className="followin-length" > {d?.followins?.length} <i className="fa fa-users" aria-hidden="true"></i> </span>
                      <span className="gender-simvol">{d.male === "man" ? <i className="fa fa-mars" aria-hidden="true"></i> : <i className="fa fa-venus" aria-hidden="true"></i>}</span>
                    </div>
                  </Link>)
              } else {
                return <div key={d?._id}> </div>
              }
            }) :
              <div className="empty-div">
                <span > Sorry, no such person was found!!!</span>
              </div>
            }
          </div>
          <Rightbar />
        </div>
      </div>
    )
  }
}