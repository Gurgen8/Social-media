import "./sliderStoris.scss"
import { Component } from "react";
import Slider from "react-slick"
import axios from "axios"
import { format } from "timeago.js";
import Modal from 'react-modal';
import { Link } from "react-router-dom";

const PF = process.env.REACT_APP_PUBLIC_FOLDER

export default class SLider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      watchingList: [],
      openWatchingList: false,
      openStoriImg: false,
      stori: [],
      openSlide: false,
      authorImg:""


    };
  }


  componentDidMount() {
    const getStoris = async () => {
      const res = await axios.get('/api/storis/' + this.props?.userId);


      return res.data.map(slide => {

        if ((new Date().toISOString().split('T')[0]) === ((slide.createdAt + "").split('T')[0])) {
          return this.setState({
            data: res.data.sort((p1, p2) => {
              if (p1 && p2) {
                return new Date(p2.createdAt) - new Date(p1.createdAt)

              } else {
                return <div key={slide?.id} ></div>

              }
            })
          })
        } else {
          return <div key={slide?.id} ></div>
        }
      }


      )

    }



    getStoris()
  }


  slideClicked = e => {
    e.preventDefault();
    console.log(e.type);
  };



  nextClick = currentSlideIndex => {
    if (currentSlideIndex === 0) {
      document.querySelector(".slick-prev").setAttribute("aria-disabled", true);
    } else {
      return <> </>
    }
  };


  getWatcher = async (stori) => {

    const res = await axios.get('/api/storis/watchinglist/' + stori._id);

    this.setState({
      watchingList: res.data,
      openWatchingList: !this.state.openWatchingList

    })



  }

  openStoris = async (stori) => {

    const res = await axios.get('/api/storis/stori/' + stori._id);
    await axios.post('/api/storis/' + stori._id + "/" + this.props?.userId)
    const authorImg= await axios("api/users?userId=" + stori?.userId );
  
    this.setState({
      stori: res.data,
      openStoriImg: !this.state.openStoriImg,
      authorImg:authorImg?.data?.profilePicture

    })



  }

  // getStorisAthorImg=async(author)=>{
  //   const res = await axios("api/users?userId=" + author._id );
  //   console.log(res.data)



  // }


  render() {

    const { watchingList, openWatchingList, openStoriImg, stori, openSlide, data,authorImg } = this.state

    const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
      <button
        {...props}
        className={
          "slick-prev slick-arrow" +
          (currentSlide === 0 ? " slick-disabled" : "")
        }
        aria-hidden="true"
        aria-disabled={currentSlide === 0 ? true : false}
        type="button"
      >
        Previous
      </button>
    );
    const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
      <button
        {...props}
        className={
          "slick-next slick-arrow" +
          (currentSlide === slideCount - 1 ? " slick-disabled" : "")
        }
        aria-hidden="true"
        aria-disabled={currentSlide === slideCount - 1 ? true : false}
        type="button"
      >
        Next
      </button>
    );

    const settings = {
      arrows: true,

      edgeFriction: 1,
      infinite: false,
      swipeToSlide: true,
      variableWidth: true,
      accessibility: true,
      prevArrow: <SlickArrowLeft />,
      nextArrow: <SlickArrowRight />,
      focusOnSelect: true,
      draggable: true

    };
    const setting = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      speed: 3000,
      autoplaySpeed: 2000,

    };

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




    if (this.state.data.length > 0) {
      return (

        <div className="post">
          <div className="storis-timeline">
            <Modal
              isOpen={openWatchingList}
              onRequestClose={openWatchingList ? false : null}
              style={customStylesImg} >
              <div className="modal_div">
                {watchingList.map(w => {
                  return (
                    <li key={w?._id} className="likelist-li">

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
                  <video style={{ height: "90%", width: "100%" }} controls src={PF + "/storis/" + stori?.img} />
                  : <img style={{ height: "90%" }} className="stori-img" src={PF + "/storis/" + stori?.img} alt="stori" />}
                <Link to={"/profile/" + stori?.author}>  <div className="stori-desc">
                  <img alt="stori-avatar" id="avatar-stori" src={authorImg ? PF + "/person/" + authorImg : stori.male === "man" ? PF + "/person/noAvatar.png" : PF + '/person/woman.png'} />
                  <span className="stori-author">{stori.author}</span>
                </div>
                </Link>
                <button className="quit-image-view" onClick={() => this.setState({ openStoriImg: false })}> <i className="fa fa-times-circle-o" aria-hidden="true"></i></button>
              </div>
            </Modal>
            <Modal isOpen={openSlide} onRequestClose={openSlide ? false : null} style={customStylesImg}  >
              <Slider {...setting}>
                {data ? data.map((s) => {

                  return (
                    <div key={s?._id}>
                      <div  className="modal_div">
                        {!(s?.img?.includes("mp4")) ? <img style={{ width: "100%", height: "75vh" }} src={PF + "/storis/" + s.img} alt="post" /> : <video style={{ width: "100%", height: "75vh" }} controls src={PF + "/storis/" + s.img} alt="post" />}
                      </div>
                      <Link to={"/profile/" + s?.author}>  <div className="stori-desc">
                        <img alt="stori-avatar" id="avatar-stori" src={authorImg? PF + "/person/" + authorImg : s.male === "man" ? PF + "/person/noAvatar.png" : PF + '/person/woman.png'} />
                        <span className="stori-author">{s.author}</span>
                      </div>
                      </Link>
                      <button className="quit-slider" onClick={() => this.setState({ openSlide: !openSlide })}> <i className="fa fa-times-circle-o" aria-hidden="true"></i> </button>
                    </div>
                  )
                }) : null}
              </Slider>
            </Modal>
            <div className="slides">
              <h2 className="title-storis"> Storis <i className="fa fa-tablet" aria-hidden="true"></i>  <i onClick={() => this.setState({ openSlide: !openSlide })} className="fa fa-slideshare" aria-hidden="true"></i>  </h2>
              <Slider {...settings}>
                {this.state.data.map((slide, index) => {

                  if ((new Date().toISOString().split('T')[0]) === ((slide.createdAt + "").split('T')[0])) {

                    return (
                      <div className="figure-div" key={index}>
                        {slide?.img?.includes(".mp4") ?
                          <video onClick={() => this.openStoris(slide)} className="home-storis-img" style={{ width: 140, height: 140,marginTop:25,marginBottom:25 }} controls src={PF + "/storis/" + slide.img} />
                          : <img onClick={() => this.openStoris(slide)} style={{ width: 200, height: 200 }} alt="stori" className="home-storis-img" src={PF + "/storis/" + slide.img} data-index={index} />}


                        <p> <i onClick={() => this.getWatcher(slide)} className="fa fa-eye" aria-hidden="true"></i> {slide?.watchers?.length}</p>
                        <span className="time-storis"> <i className="fa fa-clock-o" aria-hidden="true"></i> {format(slide.createdAt)} </span>
                      </div>
                    );
                  } else {
                    return <div key={index}> </div>
                  }


                })}
              </Slider>
            </div>
          </div>
        </div>
      );
    } else {
      return <>  </>
    }
  }
}

