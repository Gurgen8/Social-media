import { Component } from "react";
import Feed from "../feed/Feed";

class App extends Component {

    render() {
        const { username, userId, storis, realStori } = this.props

        return <div className="scroll-div"><SmoothScroll storis={storis} userId={userId} username={username} realStori={realStori} /></div>;
    }
};

let smoothScroll = {
    timer: null,

    stop: function () {
        clearTimeout(this.timer);
    },

    scrollTo: function (id, callback) {
        let settings = {

            duration: 1000,
            easing: {
                outQuint: function (x, t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                }
            }
        };
        let percentage;
        let startTime;
        let node = document.getElementById(id);
        let nodeTop = node.offsetTop;
        let nodeHeight = node.offsetHeight;
        let body = document.body;
        let html = document.documentElement;
        let height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        let windowHeight = window.innerHeight
        let offset = window.pageYOffset;
        let delta = nodeTop - offset;
        let bottomScrollableY = height - windowHeight;
        let targetY = (bottomScrollableY < delta) ?
            bottomScrollableY - (height - nodeTop - nodeHeight + offset) :
            delta;

        startTime = Date.now();
        percentage = 0;

        if (this.timer) {
            clearInterval(this.timer);
        }

        function step() {
            let yScroll;
            let elapsed = Date.now() - startTime;

            if (elapsed > settings.duration) {
                clearTimeout(this.timer);
            }

            percentage = elapsed / settings.duration;

            if (percentage > 1) {
                clearTimeout(this.timer);

                if (callback) {
                    callback();
                }
            } else {
                yScroll = settings.easing.outQuint(0, elapsed, offset, targetY, settings.duration);
                window.scrollTo(0, yScroll);
                this.timer = setTimeout(step, 10);
            }
        }

        this.timer = setTimeout(step, 10);
    }
};

class SmoothScroll extends Component {

    render() {
        const { username, storis, userId, realStori } = this.props
        return (
            <div className="smooth-scroll">
                <button style={{ display: "none" }} id="top" onClick={this.handleTopClick}>scroll to bottom</button>
                <Feed realStori={realStori} userId={userId} storis={storis} username={username} />
                <button id="bottom" onClick={this.handleBottomClick}><i className="fa fa-chevron-up" aria-hidden="true"></i></button>
            </div>
        );
    }

    //   handleTopClick() {
    // 	smoothScroll.scrollTo('bottom');
    // }

    handleBottomClick() {
        smoothScroll.scrollTo('top');
    }
};

export default App