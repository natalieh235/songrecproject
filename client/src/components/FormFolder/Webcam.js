import React from "react";
import Webcam from "react-webcam";

class Cam extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            screenshot: null
        };
    }

    render() {
        return (
          <div>
            <h1>Take a picture:</h1>
            <Webcam
              audio={false}
              ref={node => this.webcam = node}
              screenshotFormat='image/jpeg'
            />
            <div>
              <h2>Image</h2>
              <div className='screenshots'>
                <button 
                    className="green-btn" 
                    onClick={(event) => this.props.handleCapture(this.webcam.getScreenshot())}
                    >Capture</button>
                {this.props.img ? <img src={this.props.img} /> : null}
                <button className="green-btn" onClick={(event) => this.props.submit(event)}>Submit</button>
              </div>
            </div>
          </div>
        );
      }
}

export default Cam