import React from 'react';

function Emotion(props) {
    //console.log(props.img)
    return (
    <div className="emojiDiv">
        <img alt='' src={props.img} className="emoji"></img>
        <span>
            <strong>{props.percentage}%</strong>
        </span>
                
    </div>
    );
}

export default Emotion;
