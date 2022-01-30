import "./millionaire.scss"
import { useContext, useEffect, useMemo, useState } from "react";
import Start from "./components/Start";
import Timer from "./components/Timer";
import Trivia from "./components/Trivia";
import { Link } from "react-router-dom"
import { AuthContext } from "../../../context/AuthContext";
import Call from "../../../assets/img/tel.png"
import FiveTen from "../../../assets/img/50.png"
import Audience from "../../../assets/img/audience.png"
import data from "./questensions/Data"
import Help from "./components/help";
import Help50 from "./components/help50";

function Millionaire() {
  const [username, setUsername] = useState(null);
  const [timeOut, setTimeOut] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [earned, setEarned] = useState("$ 0");
  const [open, setOpen] = useState(false)
  const { user } = useContext(AuthContext)
  const [call, setCall] = useState(false)
  const [audience, setAudience] = useState(false)
  const [help, setHelp] = useState(false)
  const moneyPyramid = useMemo(
    () =>
      [
        { id: 1, amount: "$ 100" },
        { id: 2, amount: "$ 200" },
        { id: 3, amount: "$ 300" },
        { id: 4, amount: "$ 500" },
        { id: 5, amount: "$ 1.000" },
        { id: 6, amount: "$ 2.000" },
        { id: 7, amount: "$ 4.000" },
        { id: 8, amount: "$ 8.000" },
        { id: 9, amount: "$ 16.000" },
        { id: 10, amount: "$ 32.000" },
        { id: 11, amount: "$ 64.000" },
        { id: 12, amount: "$ 125.000" },
        { id: 13, amount: "$ 250.000" },
        { id: 14, amount: "$ 500.000" },
        { id: 15, amount: "$ 1.000.000" },
      ].reverse(),
    []
  );

  useEffect(() => {
    questionNumber > 1 &&
      setEarned(moneyPyramid.find((m) => m.id === questionNumber - 1).amount);
  }, [questionNumber, moneyPyramid]);

  console.log(open)

  return (
    <div className="app">

      {username !== user.username ? (
        <Start setUsername={setUsername} />
      ) : (
        <>
          <div className="main">
            <button onClick={() => setOpen(!open)} className="query-bar">{!open ? "Open" : "Close"}</button>
            {audience ? <Help /> : null}
            {help ? <Help50 /> : null}
            {timeOut ? (
              <h1 className="endText">{user.username}<br />You earned: {earned}</h1>
            ) : (
              <>
                <div className="top">
                  <div className="timer">
                    <Timer
                      setTimeOut={setTimeOut}
                      questionNumber={questionNumber}
                    />
                  </div>
                </div>
                <div className="bottom">
                  <Trivia
                    call={call}
                    data={data}
                    questionNumber={questionNumber}
                    setQuestionNumber={setQuestionNumber}
                    setTimeOut={setTimeOut}
                  />
                </div>
              </>
            )}
          </div>

          <div className={open ? "open-querybar" : "pyramid"}>
            <div className="help-div">
              {call ? "" : <a target="_black" href="https://google.com/"><img onClick={() => setCall(!call)} className="help-icon" src={Call} alt="help" /></a>}
              {help ? "" : <img onClick={() => setHelp(!help)} className="help-icon" src={FiveTen} alt="help" />}
              {audience ? "" : <img onClick={() => setAudience(!audience)} className="help-icon" src={Audience} alt="help" />}
            </div>

            <ul className="moneyList">
              {moneyPyramid.map((m) => (
                <li
                  key={m.id}
                  className={
                    questionNumber === m.id
                      ? "moneyListItem active"
                      : "moneyListItem"
                  }
                >
                  <span className="moneyListItemNumber">{m.id}</span>
                  <span className="moneyListItemAmount">{m.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )} <Link to={'/'}><button className="go-back">Go back <i className="fa fa-arrow-left" aria-hidden="true"></i> </button> </Link>

    </div>
  );

}

export default Millionaire;