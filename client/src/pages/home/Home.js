import React from 'react'
import Topbar from "../../components/topbar/Topbar"
import Sidebar from '../../components/sidebar/Siedbar'
import Rightbar from '../../components/rightbar/Rightbar'
import Scrol from "../../components/Scrolbar/scrol"
import "./home.scss"

export default function Home() {

  return (
    <div className={localStorage.getItem("mode") === "dark" ? "root" : null}>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Scrol />
        <Rightbar />
      </div>
    </div>
  )
}
