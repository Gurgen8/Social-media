import { Component } from "react";
import './slideUsers.scss'
import Slider from "react-slick"
import axios from "axios"
import { AuthContext } from '../../context/AuthContext';
import { Link } from "react-router-dom";
const PF = process.env.REACT_APP_PUBLIC_FOLDER

export default class SLider extends Component {
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }


  componentDidMount() {
    const getuser = async () => {
      const res = await axios.get('/api/users/getallusers')
      this.setState({
        data: res.data
      })
    }
    getuser()
  }
  slideClicked = e => {
    e.preventDefault();
    console.log(e.type);
  };



  nextClick = currentSlideIndex => {
    if (currentSlideIndex === 0) {
      document.querySelector(".slick-prev").setAttribute("aria-disabled", true);
    }
  };
  render() {

    const { user } = this.context

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
      centerMode: true,
      edgeFriction: 1,
      infinite: true,
      swipeToSlide: true,
      variableWidth: true,
      accessibility: true,
      prevArrow: <SlickArrowLeft />,
      nextArrow: <SlickArrowRight />,
      focusOnSelect: true,
      draggable: true

    };


    return (
      <div className="slides">
        <h2 className="title-know"> Do you know? <i className="fa fa-user-secret" aria-hidden="true"></i></h2>
        <Slider {...settings}>
          {this.state.data.map((slide, index) => {
            if (!slide._id.includes(user._id) && !(slide.followers.includes(user._id))) {
              return (
                <div className="figure-div" key={index}>
                  <span className="icon-user">{slide.followins.includes(user._id) ? <i className="fa fa-user" aria-hidden="true"></i> : null}    </span>
                  <img style={{ width: 200, height: 200 }} src={slide.profilePicture ? PF + "/person/" + slide.profilePicture : slide.male === "man" ? PF + "/person/noAvatar.png" : PF + "/person/woman.png"} data-index={index} alt="slide-img" />
                  <div className="text-slide"><span style={{ textTransform: "capitalize" }}  > {slide.username} </span> <span> {slide.lastname && slide.lastname} </span> </div>
                  <p className="following-length">{slide?.followers?.length} Followers</p>
                  <Link to={'/profile/' + slide.username}> <button className="button">View profile</button>   </Link>
                </div>
              );
            } else if (!slide.followers || !slide.followins) {
              return <div key={index} className="no-user" > <h1 style={{ width: 360 }} >There are no new users to display yet  </h1> </div>
            } else {
              return <div key={index}> </div>
            }
          })}
        </Slider>
      </div>
    );
  }
}

