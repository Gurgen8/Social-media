import React from "react"
import scissors from "../../../assets/img/rock.png"
import paper from "../../../assets/img/paper.png"
import rock from "../../../assets/img/scrisson.png"

function Player({ weapon }) {

  return (

    <div className="player">
      <img className="player-image" src={weapon === "rock" ? rock : weapon === "scissors" ? scissors : paper} alt="rock paper scissors" />
    </div>
  )
}

export default Player