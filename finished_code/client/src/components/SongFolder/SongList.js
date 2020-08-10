import React from 'react';
import Song from './Song'

function SongList(props) {
    let recommendedTracksUri = [];
    let playlistComponent = [];
    for (let i = 0; i < props.recommendedTracks.length; i++){
      let recommendedTrack = props.recommendedTracks[i];
      recommendedTracksUri.push(recommendedTrack.uri);
      playlistComponent.push(<Song 
        key={i} 
        img={recommendedTrack.album.images[2].url} 
        title={recommendedTrack.name}
        artist={recommendedTrack.artists[0].name}/>)
    }
    return (
    <div className="song-list">
        {playlistComponent}
    </div>
    );
}

export default SongList;
