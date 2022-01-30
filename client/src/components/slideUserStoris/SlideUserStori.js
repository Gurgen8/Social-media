import './slideUserStor.scss'
import { Component } from "react";
import Slider from "react-slick"
import axios from "axios"
import { format } from "timeago.js";
import Modal from 'react-modal';
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { CSSTransition } from "react-transition-group"


const PF = process.env.REACT_APP_PUBLIC_FOLDER

export default class SLider extends Component {

  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      watchingList: [],
      openWatchingList: false,
      openStoriImg: false,
      openAllStoris: false,
      openSlide: false,

    };
  }


  deleteStori = async (stori) => {

    await axios.delete('/api/storis/' + stori._id)

    return window.location.reload()

  }




  getWatcher = async (stori) => {

    const res = await axios.get('/api/storis/watchinglist/' + stori._id);

    this.setState({
      watchingList: res.data,
      openWatchingList: !this.state.openWatchingList

    })
  };


  openStoris = async (stori) => {

    const res = await axios.get('/api/storis/stori/' + stori._id);
    await axios.post('/api/storis/' + stori._id + "/" + this.props?.userId)
    this.setState({
      stori: res.data,
      openStoriImg: !this.state.openStoriImg

    })


  }


  render() {
    const { watchingList, openWatchingList, openStoriImg, openSlide, stori } = this.state
    const { userId, realStori, storis } = this.props
    const { user } = this.context



    const customStylesImg = {
      content: {
        overflowY: "scroll",
        top: '50%',
        left: '50%',
        right: '10%',
        bottom: '0%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: "black",

      },
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.91)',


      }
    };


    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      speed: 3000,
      autoplaySpeed: 2000,

    };


    if (this.props.storis.length > 0) {
      return (
        <div className="post">
          <Modal
            isOpen={openWatchingList}
            onRequestClose={openWatchingList ? false : null}
            style={customStylesImg} >
            <div className="modal_div">
              {watchingList.map(w => {
                return (
                  <li key={w?.id} className="likelist-li">

                    <Link to={"/profile/" + w?.username}> <img className="likelist-person" src={w.profilePicture ? PF + "/person/" + w.profilePicture : w.male === "man" ? PF + '/person/noAvatar.png' : PF + "/person/woman.png"} alt="watchers" /> </Link>
                    <span className="likelist-span"> {w?.username} {w?.lastname}  </span>
                    <i style={{ color: "white" }} className="fa fa-eye" aria-hidden="true"></i>
                  </li>

                )
              })}
              <button className="quit-image-view" onClick={() => this.setState({ openWatchingList: false })}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
            </div>
          </Modal>
          <Modal
            isOpen={openStoriImg}
            onRequestClose={openStoriImg ? false : null}
            style={customStylesImg} >
            <div className="modal_div">
              {stori?.img?.includes(".mp4") ?
                <video style={{ height: "80vh", width: "100%" }} controls src={PF + "/storis/" + stori?.img} />
                : <img className="stori-img" src={PF + "/storis/" + stori?.img} alt="stori" />}
              <button className="quit-image-view" onClick={() => this.setState({ openStoriImg: false })}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
            </div>
          </Modal>
          <Modal isOpen={openSlide} onRequestClose={openSlide ? false : null} style={customStylesImg}  >
            <Slider {...settings}>
              {storis ? storis.map((s) => {

                return (
                  <div key={s?._id}  >
                    <div className="modal_div">
                      {!(s?.img?.includes("mp4")) ? <img src={PF + "/storis/" + s.img} alt="post" /> : <video style={{ width: "100%", height: "80vh" }} controls src={PF + "/storis/" + s.img} alt="post" />}
                    </div>
                    <button className="quit-slider" onClick={() => this.setState({ openSlide: !openSlide })}> <i class="fa fa-times-circle-o" aria-hidden="true"></i> </button>
                  </div>
                )
              }) : null}
            </Slider>
          </Modal>
          <div className="slides">
            <h2 className="title-storis"> Storis {realStori?.length}- <i onClick={() => this.setState({ openAllStoris: !this.state.openAllStoris })} className="fa fa-tablet" aria-hidden="true"></i> <i onClick={() => this.setState({ openSlide: !openSlide })} className="fa fa-slideshare" aria-hidden="true"></i> </h2>
            <div className="storis-root">
              {this.props.storis.map(s => {
                return (<div key={s._id} className="stori-feed">
                  {(s?.img?.includes(".mp4")) ?
                    <video onClick={() => this.openStoris(s)} className='storis-img' style={{ width: 100, height: 150, borderRadius: 5 }} controls src={PF + "storis/" + s?.img} />
                    : <img onClick={() => this.openStoris(s)} style={{ marginBottom: 5 }} className='storis-img' src={PF + "storis/" + s?.img} alt="stori" />

                  }
                  <p> <i onClick={() => this.getWatcher(s)} className="fa fa-eye" aria-hidden="true"></i> {s?.watchers?.length}</p>
                  <span className="time-storis"> <i className="fa fa-clock-o" aria-hidden="true"></i> {format(s.createdAt)} </span>
                  {user?._id === userId ? <button onClick={() => this.deleteStori(s)} className="remove-storis-btn"> <i className="fa fa-times-circle-o" aria-hidden="true"></i> </button> : null}
                </div>
                )
              })
              }
              {realStori?.length > 4 ?
                <div onClick={() => this.setState({ openAllStoris: !this.state.openAllStoris })} className="col-3">
                  <div className="snippet" data-title=".dot-bricks">
                    <div className="stage">
                      <div className="dot-bricks"></div>
                    </div>
                  </div>
                </div>
                : null}
            </div>
          </div>
          <CSSTransition in={this.state.openAllStoris} timeout={500} classNames="likelist" unmountOnExit >
            <>
              <h1 className="stori-title">All storis </h1>
              <div className="all-storis-section">

                {realStori.map(s => {

                  return (<div key={s?._id} className="stori-feed">
                    {(s?.img?.includes(".mp4")) ?
                      <video onClick={() => this.openStoris(s)} style={{ width: 200, height: 150 }} controls src={PF + "storis/" + s?.img} />
                      : <img onClick={() => this.openStoris(s)} className='storis-img' src={PF + "storis/" + s?.img} alt="stori" />

                    }
                    <p> <i onClick={() => this.getWatcher(s)} className="fa fa-eye" aria-hidden="true"></i> {s?.watchers?.length}</p>
                    <span className="time-storis"> <i className="fa fa-clock-o" aria-hidden="true"></i> {((s.createdAt + "").split('T')[0])} </span>
                    {user?._id === userId ? <button onClick={() => this.deleteStori(s)} className="remove-storis-btn"> <i className="fa fa-times-circle-o" aria-hidden="true"></i> </button> : null}
                  </div>
                  )
                })
                }
              </div>
            </>
          </CSSTransition>

        </div>

      )
    } else {
      return <> </>
    }
  }
}

