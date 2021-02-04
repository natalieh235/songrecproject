import React from 'react';
import Face from './faces.png'
//"https://bsr-client.herokuapp.com/"
function Home() {
  // let handleClick = () => {
  //   fetch(`${process.env.REACT_APP_BACKEND_URL}/login`)
  // }
  console.log('hi')
  console.log(process.env.REACT_APP_BACKEND_URL)
  return (
    <div className="home-page">
        <h1>Upload your face. We pick the songs.</h1>
        <img alt='' src={Face} style={{display: "inline-block"}}></img> 
        <br />
        <a href={`${process.env.REACT_APP_BACKEND_URL}/login`}>
          <button className="green-btn">Login with Spotify</button>
        </a>
    </div>
  );
}

export default Home;
