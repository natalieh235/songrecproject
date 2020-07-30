### Creating the React App

In the final part of these series, I'm going to be going over important steps in creating the frontend of our app in React. This tutorial won't cover the full code, so refer to [this](https://github.com/natalieh235/songrecproject/) github repo for all the deets.

### Setting up the Client in React

#### Step 1- Create the App

If you haven't already, use the command `npm install create-react-app -g` to install create-react-app globally on your machine. Then, get back into your Visual Studio Code root directory and use these commands to make a React app:

```
create-react-app client
cd client
```

You should now have two folders: server and client. 

Now you can run these commands to install your dependencies and start running your app.

```
npm install
npm start
```

Navigate to `http://localhost:3000` to see if your app is up and running. It should look something like this:

[![startingreactpage](https://github.com/natalieh235/songrecproject/raw/blog/images/startingreactpage.png)](https://github.com/natalieh235/songrecproject/blob/blog/images/startingreactpage.png)

#### Step 2- Create the Homepage

So this React app will involve some very simple routing- basically this means that different urls will render different pages. For example, going to `localhost:3000/home` will take you to a homepage, while going to `localhost:3000/song` will perhaps show a list of songs. We're going to focus on creating a basic homepage, which will look something like this:

[![reacthomepage](https://github.com/natalieh235/songrecproject/raw/blog/images/reacthomepage.png)](https://github.com/natalieh235/songrecproject/blob/blog/images/reacthomepage.png)

Get started by making a new file called `Home.js`. I stuck this inside a folder `components`, since we're going to end up making a lot more files later on.

Add in this code:

```
import React from 'react';

function Home() {
  return (
    <div className="home-page">
        <h1>Upload your face. We pick the songs.</h1>
        <a href="https://localhost:8888">
          <button className="green-btn">Login with Spotify</button>
        </a>   
    </div>
  );
}

export default Home;
```

This is a simple functional component, and simply contains a header and button. Notice that the button is redirecting us to our OAuth server page.

Return to your React app page and check to make sure the button takes you to the OAuth page, but don't log in quite yet.

#### Step 2- Creating the Redirect Page

After the user logs in, we need to redirect them to a different page in our React app. To do this, I'm creating a new file called `UploadFace.js`. Note: this name ends up being kind of misleading, since this ends being the page where all the uploading and song-finding happens, but just bear with me.

Copy paste this code into UploadFace:

This creates a class component with state variables `token` and `userInfo`. Once the component mounts, we're using the lifecycle method `componentDidMount()` to immediately call the `getHashParams` function. The `getHashParams` function is actually used in the Spotify Oauth example code to parse the query string and extract the token. We're stealing this function to get the access token in our client-side.

Once we get the token, we set our state variable `token` and make a API call using the token to get the user's display name and id. To test that this actually works, let's render a "Logged in as {display_name}" statement. This will change later.

```
import React from 'react';

class UploadFace extends React.Component {
  constructor(){
    super()
    
    this.state = {
      token: "",
      userInfo: []
    }
  }

  //calls getHashParams and uses token to get user info
  componentDidMount(){
    const params = this.getHashParams();
    this.setState({token: params.access_token})
  
    fetch('https://api.spotify.com/v1/me',{
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + params.access_token}
    }).then(resp => resp.json()).then(data => this.setState({userInfo: [data.display_name, data.id]}))
    
  }

  //this parses the query string and extracts the token
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

  render(){
    <h3>Logged in as {this.state.userInfo[0]}</h3>
  }
}

export default UploadFace;
```

Don't run this just yet- we have some routing to do.

#### Step 3- Adding Routing

Go back into your App.js file. In your terminal run `npm install react-router-dom` . We'll be using react-router-dom to route our function, meaning that we'll be able to display different pages depending on the url.

Copy paste this code:

Notice that I'm using `BrowserRouter`(saved as Router) and `Route` from the react-router-dom library. I'm surrounding all the components in my return statement with `<Router><Router/>`, which will allow me to specifiy actual Routes.

```
import React from 'react';
import './App.css';
import UploadFace from './components/UploadFace'
import Home from './components/Home'
import {BrowserRouter as Router, Route} from 'react-router-dom';

class App extends React.Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Nav />
          <Route path="/face" component={UploadFace}/>
          <Route path="/" exact component={Home}/>
        </div>
      </Router>  
    );
  }
}

export default App;
```

These lines:

```
<Route path="/face" component={UploadFace}/>
<Route path="/" exact component={Home}/>
```

are doing the actual routing. The path indicates the url that the user needs to go to for the page to render, and the component is the component that should be rendered at that specific url. Notice that there's a `<Nav />` component that isn't surrounded by route- this means that it will alway be rendered regardless of url. This is the navbar at the top of the page- you can customize this however you want, or eliminate it entirely.

We're almost ready to test- the last step is actually to change the redirect url of your server. Find this line in your code(it should be around line 107):

```
res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
```

This specifies the url that the access_token should be attached to. For us, it's going to be the React `UploadFace.js` page. Replace `'/#'` with `'http://localhost:3000/face/#'`. It's important to keep the hashtag because without it, our `getHashParams` function won't be able to parse the query string. Also notice that we are adding `/face` to our url- this changes the route so that we will see the UploadFace page instead of our homepage.

Make sure both your server and app are running(use `node app.js` for your server and `npm start` for your React app) and test it out!

[![loginexample](https://github.com/natalieh235/songrecproject/raw/blog/images/loginexample.gif)](https://github.com/natalieh235/songrecproject/blob/blog/images/loginexample.gif)

Yay it works! (hopefully)



#### Calling the Azure Function

Remember the Azure Function we made all the way back in step one? Time to finally integrate it into our app. You may remember the test html page we made, and we're pretty much going to add that into our app. I created a component called `FaceForm.js`  with our html form inside:

```react
//FaceForm.js

import React, {useState} from 'react';
import FaceImage from './FaceImage'

function FaceForm(props){
    
    return(
        <div>
        
        <form encType="multipart/form-data" id="imageForm" >
          <div className="formPart">
          <label className="form-input" htmlFor="faceUploadInput">
            <input type="file" accept="image/*" name="image" id="faceUploadInput" onChange={(event) => props.loadFile(event)}/>
            <strong>Choose file</strong>
          </label>
           <div className="faceImage">
            <img alt='' id="facePic" src={props.img}></img>
        	</div>
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
```



This component is a child of `UploadFace.js` . Notice the event handler on the button has changed to call a function, `submitForm(event)`. The function gets the form data and calls our Azure Function using the function url. Let's take a look:

```react
//UploadFace.js

async submitForm(event){   
    this.setState({loading: true})
    event.stopPropagation();
    event.preventDefault();

  
  //creating a FormData object to pass into the API call
    var myform = document.getElementById('imageForm');
    var payload = new FormData(myform);

  
  //calling our Azure Function!!
    const resp = await fetch("<FUNCTION URL>", {
      method: 'POST',
      body: payload
    })

    var data = await resp.json();
    var emotions = data.result[0].faceAttributes.emotion;  

  //setting state as submitted so we don't have to render the form
    this.setState(() => {
      return{
        emotions: emotions,
        submitted: true
      }
    })
}
```



Notice that in the last section, we set the state variable `submitted` to be true. Let's take a look at how this affects the rendered screen. Here's the `render()` function for the `UploadFace.js` component:

Here, we're using an `if` statement to check if the state variable `submitted` is true or not. If true, we're going to be displaying the final page with all the emotion analysis and song recommendations. Else, we will display the form that allows the user to submit an image. The `else if` statement just renders a loading page while we make all the API calls.

```react
//UploadFace.js

  render(){
    
    //if the form was submitted, show the emotions + song recommendations
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
    
    //if loading, show a loading page
    else if (this.state.loading){
      return <h2>Plz wait...</h2>
    }
    
    
    //if not submitted, show the image submission form
    return (
      <div>
        <UserProfile userInfo={this.state.userInfo}/>
        <FaceForm submitForm={this.submitForm} loadFile={this.loadFile} img={this.state.img} showButton={this.state.showFormButton}/>
      </div>
    )
  }
```

The loading page:

![loadingpage](/images/loadingpage)

 

**!!! IMPORTANT: YOU MUST SET YOUR REACT APP URL AS AN ALLOWED CORS ORIGIN IN YOUR AZURE FUNCTION**(refer to part 1 of this blog).

![CORS](images/CORS.png)

(Notice how http://localhost:3000 is an allowed origin)

#### Getting Song Recommendations from Spotify

Now that we've integrated our Azure Function into the React App, the rest of the process is pretty simple. I won't be going super in-depth into the code, just a few key points. The actual function that gets song recommendations is the `getRecommendations()` function. 



A basic overview: the Spotify web API has a feature that allows you to call an API endpoint, enter in seed artists/seed tracks as params, and get a list of recommended tracks in return. In this function, I'm calling a different function called `getTop` , which uses the Spotify API to get a user's top tracks and artists.



Then, I'm setting my min and max valence. **Valence**: a numerical measure from 0 to 1 of a song's sadness/happiness. The lower the number, the sadder the track. You may see that I already have a variable called valence. This is how I calculated it:

```react
//SongPage.js

let valence = props.emotions.happiness+props.emotions.surprise-props.emotions.anger-props.emotions.fear
    -props.emotions.contempt-props.emotions.disgust;

  if(props.emotions.neutral > Math.abs(valence)){
    valence = 0.5
  }
```

Basically, using the emotion data, I added all the happy emotions and subtracted the negative ones. However, if the person was overall more neutral than any other emotion, I set the valence to be 0.5 for neutral.

Based on this value, I set ranges for the min and max valence. 

Now that I have all my params, I'm making the actual API call and saving the results.

Here's the whole `getRecommendations()` function:

```react
//SongPage.js

//GET RECOMMENDATIONS FUNCTION
  async function getRecommendations(){

    const numTracks = 3;
    const numArtists = 2;
  
    
    //calls a function called getTop(type, limit) that uses the API to get a user's top tracks/artists
    const topTracks = await getTop('tracks', numTracks)
    let seedTracks = "";
    
    //this for loop formats the top tracks into a string for the api call
    for (let i = 0; i < numTracks; i++){
      seedTracks = seedTracks + topTracks[i].id + "%2C";
    }
    seedTracks = seedTracks.substring(0, seedTracks.length-3); 
    
    //calls a function called getTop(type, limit) that uses the API to get a user's top tracks/artists
    const topArtists = await getTop('artists', numArtists)
    let seedArtists = '';
    
    //this for loop formats the top artists into a string for the api call
    for (let i = 0; i < numArtists; i++){
      seedArtists = seedArtists + topArtists[i].id + "%2C";
    } 

    
    //valence is a measure from 0(sad) to 1(happy) of the happiness/sadness of song
    //the variable valence was pre-calculated(will show later)
    let minValence = 0;
    let maxValence = 1;

    const limit = 10;

    
    //person is sad :()
    if (valence < .33){
        maxValence = .3;
    }
    
    //person is happy :)
    else if (valence > .66){
        minValence = .66;
    }
    
    //or person is neutral :/
    else{
        minValence = .4;
        maxValence = .65;
    }

    console.log("min: " + minValence);
    console.log("max: " + maxValence);

 
    const minPopularity = "70";

    //this api endpoint returns recommendations generated from seed tracks/artists
    const result = await fetch(`https://api.spotify.com/v1/recommendations?&limit=${limit}&seed_tracks=${seedTracks}&min_popularity=${minPopularity}&min_valence=${minValence}&max_valence=${maxValence}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + props.token}
    });

    //i'm saving the uris of the tracks to use later in creating a playlist
    const data = await result.json();
    let recommendedTracksUri = [];
    for (let i = 0; i < data.tracks.length; i++){
      recommendedTracksUri.push(data.tracks[i].uri);
    }

    setTracksUris(recommendedTracksUri);
    
    //return tracks!
    return data.tracks;
  }
```

In the rest of the code, I'm pretty much just displaying these 10 songs. Here's what the finished page looks like:

![finishedpage](/images/finishedpage)









