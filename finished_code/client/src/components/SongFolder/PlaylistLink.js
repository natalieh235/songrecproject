import React from 'react'

function PlaylistLink(props){
  
    return <a href={props.link} target="_blank" rel="noopener noreferrer">{props.value}</a>
}

export default PlaylistLink