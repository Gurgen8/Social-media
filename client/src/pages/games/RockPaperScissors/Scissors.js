import './scissors.scss';
import React from "react"
import { Component } from "react"
import Player from "./Player"
import winner from "../../../assets/img/winner.png"
import { Link } from "react-router-dom"
import { CSSTransition } from "react-transition-group"


const arr = ["rock", "paper", "scissors"]

class Scissors extends Component {
  state = {
    user: arr[0],
    cpu: arr[0],
    winner: null,
    userPoints: 0,
    cpuPoints: 0,
    point: false,
    draw: false,



  }


  startGame = () => {
    const { userPoints, cpuPoints } = this.state
    let counter = 0
    let gameInterval = setInterval(() => {
      counter++
      this.setState({
        cpu: arr[Math.floor(Math.random() * arr.length)],
        winner: "",





      })
      if (counter > 8) {
        clearInterval(gameInterval)
        this.setState({
          winner: this.selectWinner(),



        })
      }
      if (userPoints === 5) {
        this.setState({
          winner: <div>  USER WON <br /> <br />  total {userPoints} points<br /> <br /> <img src={winner} alt="winner" /></div>,
          userPoints: 0,
          cpuPoints: 0,

        })

      } else if (cpuPoints === 5) {
        this.setState({
          winner: <div> CPU WON <br /> <br /> total {cpuPoints} points<br /> <br /> <img src={winner} alt="winner" /></div>,
          userPoints: 0,
          cpuPoints: 0,

        })
      }
    }, 165)

  }

  selectWinner = () => {
    const { cpu, user, userPoints, cpuPoints } = this.state

    if (cpu === user) {
      this.setState({ draw: true })
      return "DRAW"


    } else if ((user === "rock" && cpu === "scissors") || (user === "scissors" && cpu === "paper") || (user === "paper" && cpu === "rock")) {

      this.setState({ userPoints: userPoints + 1, point: true, draw: false })
      return "USER  +1"

    } else {
      this.setState({ cpuPoints: cpuPoints + 1, point: false, draw: false })
      return "CPU  +1"

    }
  }


  selectWeapon = (weapon) => {

    this.setState({
      user: weapon,
      winner: "",


    })

  }


  render() {
    const { user, cpu, winner, userPoints, cpuPoints, audio, point, draw, } = this.state

    return (< div className="game-zone">
      <h1>Rock Paper Scissors</h1>

      <div className="player-section ">
        <div className="winner">
          <CSSTransition timeout={500} in={true} classNames={draw ? "draw" : point ? "user" : "cpu"} unmountOnExit  >
            <>  {winner ? <h3>{winner} </h3> : ""}     </>
          </CSSTransition>
          <div className="line" ><div className="inline" style={draw ? { background: "green", width: "150px" } : null}></div></div>
          <button className="start" onClick={this.startGame}> GO</button><br />

        </div>
        <div className="user-section">
          <h2> User </h2>
          <h2>POINTS : {userPoints}</h2>
          <Player weapon={user} />
          <div className="buttons-section">
            <button className="weaponBtn" onClick={() => this.selectWeapon("rock")}> rock</button>
            <button className="weaponBtn" onClick={() => this.selectWeapon("paper")}> paper</button>
            <button className="weaponBtn" onClick={() => this.selectWeapon("scissors")}> scissor</button>
          </div>
        </div>
        <audio className="audio-element">
          <source src="https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"></source>
        </audio>
        <div className="cpu-section">
          <h2> CPU </h2>
          <h2>POINTS : {cpuPoints}</h2>
          <Player weapon={cpu} />
        </div>
        <audio className="audio" autoPlay={true} loop src="https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/backsound.mp3" controls />
      </div>
      <Link to={'/'}><button className="go-back">Go back <i class="fa fa-arrow-left" aria-hidden="true"></i> </button> </Link>
    </div>
    )
  }

}


export default Scissors