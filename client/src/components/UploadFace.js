import React from 'react';
import FaceImage from './FormFolder/FaceImage'
import EmotionDisplay from './FaceDetails/EmotionDisplay'
import FaceForm from './FormFolder/FaceForm'
import SongPage from './Song/SongPage'
import UserProfile from './FaceDetails/UserProfile'


class UploadFace extends React.Component {
  constructor(){
    super()
    
    this.state = {
      submitted: false,
      img: '',
      emotions: null,
      token: "",
      findSongs: false,
      loading: false,
      userInfo: [],
      showFormButton: false
    }

    this.submitForm = this.submitForm.bind(this)
    this.loadFile = this.loadFile.bind(this)
  }

  componentDidMount(){
    const params = this.getHashParams();
    this.setState({token: params.access_token})
  
    fetch('https://api.spotify.com/v1/me',{
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + params.access_token}
    }).then(resp => resp.json()).then(data => this.setState({userInfo: [data.display_name, data.id]}))
    //this.setState({userInfo: [resp.display_name, resp.id]})
  }

  getHashParams() {
    console.log('in hash params')
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }


  loadFile(event){
    console.log(URL.createObjectURL(event.target.files[0]))
    console.log('loadfile')
    this.setState({
      img: URL.createObjectURL(event.target.files[0]),
      showFormButton: true
    })
  }

  async submitForm(event){   
    this.setState({loading: true})
    event.stopPropagation();
    event.preventDefault();

    var myform = document.getElementById('imageForm');
    console.log('---- myform ---'+myform);
    var payload = new FormData(myform);
    console.log('---- handle completed---');

    //$('#emotion').html('<h3>Please wait...</h3>');

    const resp = await fetch("https://songrecapp.azurewebsites.net/api/SongRecTrigger", {
      method: 'POST',
      body: payload
    })

    var data = await resp.json();
    var emotions = data.result[0].faceAttributes.emotion;  
    console.log('!!!') 
    console.log(emotions)

    console.log('submitform')
    this.setState(() => {
      return{
        emotions: emotions,
        submitted: true
      }
    })
}

  render(){
    
    if(this.state.submitted){
      console.log('form submitted')
      return(
        <div className='page'>
          <div className="img-side">
            <div className='profile-container'>
              <UserProfile userInfo={this.state.userInfo}/>
              <FaceImage faceImg={this.state.img}/>
            </div>
            <EmotionDisplay emotions={this.state.emotions} />
            
          </div>
          <SongPage emotions={this.state.emotions} token={this.state.token} id={this.state.userInfo[1]}/>
        </div>
      )
    }
    else if (this.state.loading){
      return <h2>Plz wait...</h2>
    }
    
    return (
      <div>
        <UserProfile userInfo={this.state.userInfo}/>
        <FaceForm submitForm={this.submitForm} loadFile={this.loadFile} img={this.state.img} showButton={this.state.showFormButton}/>
      </div>
    )
  }
}

export default UploadFace;
