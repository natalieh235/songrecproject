import React from 'react';

function Song(props) {
    
    return (
    <div className="songItem">
        <img alt='' src={props.img} className="song"></img>
        <span style={{marginLeft: '5px'}}>
            <strong>{props.title}- {props.artist}</strong>
        </span>          
    </div>
    );
}

export default Song;
