import React from 'react';

function Emotion(props) {
    //console.log(props.img)
    return (
    <div className="emojiDiv">
        <img alt='' src={props.img} className="emoji"></img>
        <br />
        <strong>{props.percentage}%</strong>
        
                
    </div>
    );
}

export default Emotion;
