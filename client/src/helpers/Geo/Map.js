import React, { Component } from 'react'
import { Marker, GoogleApiWrapper, Map } from "google-maps-react"
const YOUR_GOOGLE_API_KEY = ""


class MapContainer extends Component {

  render() {
    const { lat, long } = this.props

    return (
      <Map google={this.props.google} zoom={13} initialCenter={{ lat: lat, lng: long }}>
        <Marker position={{ lat: lat, lng: long }} />
      </Map>
    )
  }

}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCuWZAkNcSEXqCIrFka5OYWByHOzLUjfeU" || YOUR_GOOGLE_API_KEY)

})(MapContainer)