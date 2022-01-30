import axios from 'axios'
import React from 'react'
import { useState, useEffect } from "react";
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./covid.scss"




export default function App() {

  const [value, setValue] = useState("")
  const [data, setData] = useState();


  useEffect(() => {
    const time = setTimeout(() => {
      if (value) {
        axios.get(`https://corona-api.com/countries/${value}`).then(results => setData(results.data.data))
        console.log(data)
      } setData("")
    }, 500)
    return () => {
      clearTimeout(time)
    }

  }, [data, value])


  return (
    <div className="corona-container">
      <div className="corona-div">
        <div style={{ color: "red" }}>CORONAVIRUSE STATE!! <i className="fa fa-ambulance" aria-hidden="true"></i></div>
        <input id="covid-inp" placeholder="ENTER COUNTRIES CODE IN 2 LATTER" value={value} type="text" onChange={(ev) => { setValue(ev.target.value) }} />
        <ul>
          {data ?
            <>
              <li> <b> code : </b>{data.code}</li>
              <li> <b> countries: </b>{data.name}</li>
              <li> <b> population: </b>{data.population}</li>
              <li> <b> latitude: </b>{data.coordinates.latitude}</li>
              <li> <b> longitude: </b>{data.coordinates.longitude}</li>
              <li> <b> death: </b>{data.today.deaths}</li>
              <li> <b> confirmed: </b>{data.today.confirmed}</li>
            </>
            : <Spinner animation="grow" variant="danger" />}
        </ul>
      </div>
      <Link to={'/'}><button className="go-back">Go back <i className="fa fa-arrow-left" aria-hidden="true"></i> </button> </Link>
    </div>
  )
}