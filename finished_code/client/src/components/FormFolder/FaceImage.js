import React from 'react';
//import {Link} from 'react-router-dom'

function FaceImage(props){

    return (
        <div className="faceImage">
            <img alt='' id="facePic" src={props.faceImg}></img>
        </div>
    );
    
    
}

export default FaceImage;
