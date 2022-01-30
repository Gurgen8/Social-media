import axios from "axios";
import { useRef, useState } from "react";
import "./register.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Logo from "../../assets/img/logo.jpg"

export default function Register() {
  const username = useRef();
  const email = useRef();
  const age = useRef()
  const lastname = useRef()
  const city = useRef()
  const from = useRef()
  const job = useRef()
  const scool = useRef()
  const birthDay = useRef()
  const phone = useRef()
  const gender = useRef()
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const [male, setMale] = useState("man");
  const genders = useRef()
  const [errorMessage, setErrorMessgae] = useState('')
  const [allready, setAllready] = useState('')

  const handleClick = async (e) => {

    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        passwordAgain: passwordAgain.current.value,
        from: from.current.value,
        city: city.current.value,
        age: age.current.value,
        scool: scool.current.value,
        lastname: lastname.current.value,
        job: job.current.value,
        phone: phone.current.value,
        birthDay: birthDay.current.value,
        notificationBirthday: birthDay.current.value,
        male: male,

      };

      try {
        await axios.post("/auth/register", user)
          .then(e => history.push('/login'))
          .catch((e) => {
            try {
              setAllready(JSON.stringify((e.response.data.keyValue)).toString().replace("{", "").replace("}", ""));
            } catch (error) {
              console.log(error)
            }
            return setErrorMessgae(e.response.data.toString().substring(110).replace(/<\/pre>\s+<\/body>\s<\/html>/, "").replace('&quot;', ""))
          })
      } catch (err) {

        console.log(err);
      }
    }
  };


  return (

    <div className="register">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">FaceContact</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on FaceContact.
          </span>
          <img className="logo" src={Logo} alt="logo" />
        </div >
        <div className="loginRight">
          <h1> Registaration </h1>
          <form className="loginBox" onSubmit={handleClick} >
            <div className="register_div">
              <i className="fa fa-dot-circle-o" aria-hidden="true"></i>
              <input id="name" required ref={username} className="loginInput" />
              <label className="inp-label">Username </label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("username") ? <> {errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
              <div className="inp-line"> </div>
              {allready ? <div className="allready-message">{allready.includes("username") ? <>{allready}+already registered  <i className="fa fa-exclamation-triangle" aria-hidden="true"></i> </> : null} </div> : null}
            </div>
            <div className="register_div">
              <i className="fa fa-dot-circle-o" aria-hidden="true"></i>
              <input id="lastname" required ref={lastname} className="loginInput" type="text" />
              <label className="inp-label">Lastname</label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("lastname") ? <> {errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
              <div className="inp-line"> </div>
            </div>
            <div className="register_div">
              <i className="fa fa-dot-circle-o" aria-hidden="true"></i>
              <input id="email" required ref={email} className="loginInput" type="email" />
              <label className="inp-label">Email </label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("email") ? <>{errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
              {allready ? <div className="allready-message">{allready.includes("email") ? <>{allready}+ allready-registred  <i className="fa fa-exclamation-triangle" aria-hidden="true"></i></> : null} </div> : null}
              <div className="inp-line"> </div>
            </div>
            <div className="register_div">
              <input id="from" ref={from} className="loginInput" type="text" />
              <label className="inp-label">Countri </label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("from") ? <> {errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
              <div className="inp-line"> </div>
            </div>
            <div className="register_div">
              <input id="city" ref={city} className="loginInput" type="text" />
              <label className="inp-label">City </label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("city") ? <> {errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
              <div className="inp-line"> </div>
            </div>
            <div className="register_div">
              <input id="job" ref={job} className="loginInput" type="text" />
              <label className="inp-label">Job </label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("job") ? <> {errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
              <div className="inp-line"> </div>
            </div>
            <div className="register_div">
              <input id="scool" ref={scool} className="loginInput" type="text" />
              <label className="inp-label">Scool / University </label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("scool") ? <> {errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
              <div className="inp-line"> </div>
            </div>
            <div className="register_div">
              <input id="age" ref={age} className="loginInput" type="number" minLength="1" maxLength="3" />
              <label className="inp-label">Age </label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("age") ? <> {errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
              <div className="inp-line"> </div>
            </div>
            <div className="register_div">
              <div className="inp-line"> </div>
              <input id="phone" ref={phone} className="loginInput" type="number" />
              <label className="inp-label">Phone </label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("phone") ? <> {errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
            </div>
            <div className="register_div">
              <input id="birthday" ref={birthDay} className="loginInput" type="date" />
              <label className="inp-label"> Data of birth  </label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("birthDay") ? <> {errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
              <div className="inp-line"> </div>
            </div>
            <div className="register_div">
              <div className="div-radio ">  <input checked value="man" onChange={(e) => setMale(e.target.value)} ref={genders} type="radio" name="gender" id="man" /> <label htmlFor="man"> Man </label> </div>
              <div className="div-radio">  <input value="woman" onChange={(e) => setMale(e.target.value)} ref={gender} type="radio" name="gender" id="woman" /> <label htmlFor="woman"> Woman </label> </div>
            </div>
            <div className="register_div">
              <i className="fa fa-dot-circle-o" aria-hidden="true"></i>
              <input id="password" required ref={password} className="loginInput" type="password" />
              <label className="inp-label">Password </label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("password") ? <> {errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
              <div className="inp-line"> </div>
            </div>
            <div className="register_div">
              <i className="fa fa-dot-circle-o" aria-hidden="true"></i>
              <input id="againpassword" required ref={passwordAgain} className="loginInput" type="password" />
              <label className="inp-label">Password Again </label>
              {errorMessage ? <div className="error_message"> {errorMessage.includes("passwordAgain") ? <> {errorMessage} <i className="fa fa-exclamation-circle" aria-hidden="true"></i></> : null} </div> : null}
              <div className="inp-line"> </div>
            </div>
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <Link to="/login"><button className="loginRegisterButton">Log into Account</button></Link>
          </form>
        </div>
      </div>
    </div>
  );

}