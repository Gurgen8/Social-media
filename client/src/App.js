import Register from './pages/register/Register.js';
import Home from "./pages/home/Home.js"
import { Component } from 'react';
import Login from "./pages/login/Login.js"
import Profile from "./pages/profile/Profile"
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { AuthContext } from './context/AuthContext.js';
import Progres from './helpers/LogoProcess/Progres.js';
import { Messenger } from './pages/messanger/Messenger';
import AllUsers from './components/allusers/AllUsers.js';
import Weather from './pages/weather/Weather';
import Covid from "./pages/covid/Covid"
import Paymant from "./pages/paymant/Paymant"
import Millionaire from './pages/games/millionaire/Millionaire.js';
import Scissors from './pages/games/RockPaperScissors/Scissors.js';
import Films from './pages/movies/Films.js';
import SLider from './components/slideusers/SlideUsers.js';
import VideochatRoom from "./pages/videochat/Videochat.js"




export default class Page extends Component {

  static contextType = AuthContext
  state = {
    loading: false,
  };

  componentDidMount() {
    this.isLoading = setTimeout(() => { this.setState({ loading: true }) }, 2500);
  };

  componentWillUnmount() {
    clearTimeout(this.isLoading);
  }

  render() {
    const { user } = this.context
    const { loading } = this.state
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            {!loading ? <Progres /> : user ? <Home /> : <Register />}
          </Route>
          <Route path="/login">{user ? <Redirect to="/"/> : <Login />}</Route>
          <Route path="/register">
            {user ? <Redirect to="/" /> : <Register />}
          </Route>
          <Route path="/profile/:username">
            <Profile />
          </Route>
          <Route path="/messenger">
            {!user ? <Redirect to="/" /> : <Messenger />}
          </Route>
          <Route path="/allusers">
            <AllUsers />
          </Route>
          <Route path="/weather">
            <Weather />
          </Route>
          <Route path="/covidinfo">
            <Covid />
          </Route>
          <Route path="/game-rock-paper-scissors">
            <Scissors />
          </Route>
          <Route path="/game-millionair">
            <Millionaire />
          </Route>
          <Route path="/paymantsystem-travel">
            <Paymant />
          </Route>
          <Route path="/movies">
            <Films />
          </Route>
          <Route path="/slide">
            <SLider />
          </Route>
          <Route path="/videochat/:friendId"  >
            <VideochatRoom />
          </Route>
        </Switch>
      </Router>
    )

  }

}
