import './progres.scss';
import Logo from "../../assets/img/logo.webp"
import React from 'react'

export default function Progres() {

  return (
    <div className={localStorage.getItem("mode") === "dark" ? "root" : null}>
      <div className="logo-page">
        <img className="logo-img" src={Logo} alt="logo" />
      </div>
    </div>
  )
}

