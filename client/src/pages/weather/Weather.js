import React, { Component } from 'react';
import './weather.scss';
import sun from "../../assets/img/sunrice.png"
import sun1 from "../../assets/img/sunset.png"
import wind from "../../assets/img/wind.png"
import { Spinner } from 'react-bootstrap';
import CitysWeather from "./SearchWeather"
import { Link } from "react-router-dom"



class WeatherRegion extends Component {
  state = {
    lat: "",
    lon: "",
    city: "",
    temperatureC: "",
    temperatureF: "",
    icon: "",
    sunrice: "",
    sunset: "",
    time: "",
    description: "",
    windSpeed: "",
    windDeg: "",
    erorMesage: "",
  }



  getPosition = () => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }


  getWeather = async (latitude, longitude) => {
    if (window.location.href.includes("localhost")) {
      const api = await fetch(`//api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=3937afcd923373a4cd1f0f8d44183933&units=metric`)

      const data = await api.json()
      this.setState({
        lat: latitude,
        lon: longitude,
        city: data.name,
        temperatureC: Math.round(data?.main?.temp),
        temperatureF: Math.round(data?.main?.temp * 1.8 + 32),
        icon: data?.weather[0]?.icon,
        sunrice: new Date(data.sys.sunrise).toLocaleTimeString(),
        sunset: new Date((data.sys.sunset)).toLocaleTimeString(),
        erorMesage: "not a information ",
        time: new Date().getUTCHours,
        windSpeed: data.wind.speed,
        windDeg: data.wind.deg,
        description: data?.weather[0]?.description

      })

    }

    console.log(this.state)

  }
  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition().then((position) => {
        this.getWeather(position.coords.latitude, position.coords.longitude)
      }).catch((err) => {
        this.setState({
          erorMesage: err.message
        })
      })
      this.timerId = setInterval(() =>
        this.getWeather(this.state.lat, this.state.lon),
        1000)
    }
  }


  componentWillUnmount() {
    clearInterval(this.timerId)
  }


  render() {
    const { city, windDeg, windSpeed, description, temperatureC, temperatureF, icon, sunrice, sunset, time } = this.state
    if (city || !window.location.href.includes("localhost")) {

      return (
        <div style={{ position: "relative" }} className="weather-div">
          {window.location.href.includes("localhost") ?
            <>
              <div className="weather-box">
                <h2 style={{ color: "gold" }}> Your region</h2>
                <div className="weather-country"> {city} </div>
                <div className="weather-temp"> {temperatureC} &deg;C <span className="slash">/</span> {temperatureF}&deg;F </div>
                <div><img className="weather-icon" src={`http://openweathermap.org/img/w/${icon}.png`} alt="weather-icon" /> </div>
                <div> <span style={{ color: "gold" }}>{description}</span> </div>
                <div className="weather-item"><img className="sunset" src={sun} alt="sunrise" /><span>sunrise--{sunrice} </span> </div>
                <div className="weather-item"><img className="sunrice" src={sun1} alt="sunset" /><span>sunset--{sunset}  </span> </div>
                <div className="weather-item"> <img className="wind" src={wind} alt="windt" /><span>WIND-{windSpeed}m/s -- {windDeg}&deg; </span> </div>
                <div className="time"> {time}</div>
              </div>
              <div className="search-box">
                <CitysWeather />
              </div>
              <Link to={'/'}><button className="go-back">Go back <i className="fa fa-arrow-left" aria-hidden="true"></i> </button> </Link>
            </> :
            <>
              <div style={{ position: "absolute", right: "0", left: 0, margin: "0 auto", width: 350 }} className="search-box">
                <CitysWeather />
              </div>
              <Link to={'/'}><button className="go-back">Go back <i className="fa fa-arrow-left" aria-hidden="true"></i> </button> </Link>
            </>}
        </div>)
    } else {

      return <div style={{ textAlign: "center", marginTop: 150 }}><Spinner animation="border" variant="primary" /></div>

    }
  }
}


export default WeatherRegion;