import React, {useState} from 'react';
import FaceImage from './FaceImage'

//<h1>Upload Face</h1>
function FaceForm(props){
    
    return(
        <div>
        
        <form encType="multipart/form-data" id="imageForm" >
          <div className="formPart">
          <label className="form-input" htmlFor="faceUploadInput">
            <input type="file" accept="image/*" name="image" id="faceUploadInput" onChange={(event) => props.loadFile(event)}/>
            <strong>Choose file</strong>
          </label>
          <FaceImage faceImg={props.img}/>
          <button 
            type="submit"
            onClick={(event) => props.submitForm(event)} 
            className="green-btn"
            style={{display: props.showButton ? 'inline-block' : 'none' }}
            >Generate my playlist!</button>
          </div>
        </form>  
      </div>
    )
}

export default FaceForm