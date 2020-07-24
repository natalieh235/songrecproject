import React from 'react';
import Face from './images/faces.png'

function Home() {
  return (
    <div className="home-page">
        <h1>Upload your face. We pick the songs.</h1>
        <img alt='' src={Face} style={{display: "inline-block"}}></img> <br />
        <a href="https://bsr-client.herokuapp.com/">
          <button className="green-btn">Login with Spotify</button>
        </a>   
    </div>
  );
}

export default Home;