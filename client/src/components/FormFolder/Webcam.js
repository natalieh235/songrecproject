import React from "react";
import Webcam from "react-webcam";
import notfound from './imagenotfound.png'

class Cam extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            screenshot: null
        };

    }

    render() {
      return (
        <div id='image-submission'>
          
          <div id="webcam-div">
            <h1>Take a picture:</h1>
            <Webcam
              audio={false}
              ref={node => this.webcam = node}
              screenshotFormat='image/jpeg'
              mirrored={true}
              style={{width: '100%'}}
            />
            <button 
              className="green-btn" 
              onClick={(event) => this.props.handleCapture(this.webcam.getScreenshot())}
              style={{width: "50%" }}
              >Capture
            </button>
          </div>

          <div id='screenshots'>
            <h1>Image</h1>
            {this.props.img ? <img src={this.props.img} /> : <img src={notfound} style={{width: '100%'}}/>}
            <button 
              className="green-btn" 
              onClick={(event) => this.props.submit(event)}
              style={{display: this.props.showButton ? 'inline-block' : 'none', width: "50%"}}
              >Submit
            </button>
          </div>
        </div>

      );
    }
}

export default Cam