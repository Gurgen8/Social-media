import React, { Component } from 'react';
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import KeypressSound from "../../assets/sounds/keypress.wav"

class SearchFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      play: false,
      pause: true
    };
    this.url = KeypressSound;
    this.audio = new Audio(this.url);
  }

  play = () => {
    this.setState({
      play: true,
      pause: false
    });
    console.log(this.audio);
    this.audio.play();
  }

  pause = () => {
    this.setState({ play: false, pause: true });
    this.audio.pause();
  }


  handleSubmit = (ev) => {

    ev.preventDefault()
    const queryObj = queryString.parse(window.location.search);
    queryObj.search = this.search.value ? this.search.value : undefined;
    this.props.history.replace(`/allusers?${queryString.stringify(queryObj)}`)
    window.location.reload()
  }

  render() {

    return (
      <form onSubmit={this.handleSubmit} className="search_form">
        <input onKeyUp={this.play} onKeyDown={this.pause} ref={el => this.search = el} id="search" placeholder="Search ..." type="text" /> 
        <i className="fa fa-search"></i>
      </form>

    )
  }
}


export default withRouter(SearchFilter)