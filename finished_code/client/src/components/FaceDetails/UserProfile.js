import React from 'react'

function UserProfile(props){
    return(
        <h2 className="user-profile">Logged in as {props.userInfo[0]}</h2>
    )
}

export default UserProfile