import React from "react"
import { Component } from "react"
import Map from "./Map"
import './map.scss'


class GeoLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {

      lat: null,
      long: null,

    }
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        })
      })
    }
  };

  componentWillUnmount() {
    this.setState({
      lat: null,
      long: null,
    })

  }

  render() {
    const { long, lat, } = this.state

    return (

      <ul className="ul_map"  >
        <Map className="map" lat={lat} long={long} />
      </ul>)
  }
}


export default GeoLocation