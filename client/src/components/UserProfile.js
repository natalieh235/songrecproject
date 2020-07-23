import React from 'react'

function UserProfile(props){
    return(
        <h3 className="user-profile">Logged in as {props.userInfo[0]}</h3>
    )
}

export default UserProfile