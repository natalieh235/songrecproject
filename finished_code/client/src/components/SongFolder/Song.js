import React from 'react';

function Song(props) {
    
    return (
    <div className="songItem">
        <img alt='' src={props.img} className="song"></img>
        <span>
            <strong>{props.title}- {props.artist}</strong>
        </span>          
    </div>
    );
}

export default Song;
