import { useContext, useRef, useState,useEffect } from "react";
import "./login.scss";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import 'react-circular-progressbar/dist/styles.css';
import axios from "axios";
import { Spinner } from "react-bootstrap"

export default function Login () {


  const [qrImg, setQrImg] = useState('');
  const [varifyNumber, setVarifyNumber] = useState('');
  const[errorVarify,setErrorVarify]=useState('')
  const {  dispatch } = useContext(AuthContext);
  const [failmessage, setFailMessage] = useState('')
  const email = useRef();
  const password = useRef();
  const[fetch,setFetch]=useState(false)
  const[user,setUser]=useState('')

  useEffect(() => {
    const fetchQr = async () => {
      const res = await axios.get('/auth/verification')
      setQrImg(res.data)
    };
    fetchQr()
  })

  const sendVarifyNumber = async (e) => {
    e.preventDefault();
    loginCall({
      varificationNumber: varifyNumber,
      email: email.current.value,
      password: password.current.value,
    },dispatch
    )
    try{ 
       await axios.post('/auth/varify',loginCall).then(()=> setTimeout(() => {

        setErrorVarify('invalid varification number')
   
      }, 500))

    }catch(e){
      
      console.log(e)
    }
  }
  
  console.log(errorVarify)


  const handleClick =  async (e) => {
    e.preventDefault();
   const loginCall = {
        email: email.current.value,
        password: password.current.value,
      }
      // loginCall({
      //   email: email.current.value,
      //   password: password.current.value,
      // },dispatch
      // )
    

    try {
    const res =  await axios.post('auth/login', loginCall).catch((e) =>
        setTimeout(() => {

          setFailMessage(e.response.data)
          setFetch(!fetch)
        }, 500))

        setUser(res?.data)

    } catch (error) {
      console.log(error)
    }

  };
  const isFetch=()=>{
    setFetch(!fetch)

  }

  return (
    <> 
    {!user?
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">FaceContact</h3>
            <span className="loginDesc">
              Connect with friends and the world around you on FaceContact.
            </span>
          </div>
          <div className="loginRight">
            {failmessage ? <div className="login-fail"> {failmessage}   <i className="fa fa-exclamation-circle" aria-hidden="true"></i> </div> : ''}
            <form className="loginBox" onSubmit={handleClick} >
              <div className="register-div">
                <input id="email" type="email" className="loginInput" ref={email} />
                <label> Email </label>
              </div>
              <div className="register-div">
                <input id="password" type="password" className="loginInput" ref={password} />
                <label> Password </label>
              </div>
              <button onClick={isFetch} className="loginButton" type="submit"  >

                {fetch  ?<Spinner animation="border" variant="dark" /> : ("Log In")}
              </button>
              <Link to="/register" className="loginForgot">Forgot Password?</Link>
              <Link to="/register">
                <button className="loginRegisterButton">{fetch ? (<Spinner animation="border" variant="dark" />) : ("Create a New Account")} </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
      : <div className="varification-div">
         {errorVarify? 
         <p className="error-message">{errorVarify} !!!</p>
         :null}
      <div className="qr-container">
        <img className="qr-image" src={qrImg} alt="qr-code" />
        <form onSubmit={sendVarifyNumber} >
          <input onChange={(e) => setVarifyNumber(e.target.value)} id="qr" placeholder=" varification number ..." type="number" className="varification-number" /> 
          <button type="submit">submit</button><br/>
          <input style={{visibility:"hidden"}} value={email.current.value} type="email"  ref={email} /><br/>
          <input style={{visibility:"hidden"}}  value={password.current.value}  type="password"  ref={password} />
        </form>
      </div>
    </div>}
    </>
  );
}