## Part 2: Creating a React App with Spotify Oauth

In my previous post, I outlined how to detect emotion in photos using the Microsoft Face API and Azure Functions. In the second part of this series, we'll be focusing on creating the actual React frontend and getting the user logged in to Spotify before getting any song recommendations.



As a refresher, here's an overall flowchart.

![flowchart](images/flowchart.png)



### Setting up Oauth

Disclaimer: this part of my tutorial is completely ripped off from [this](https://medium.com/@jonnykalambay/now-playing-using-spotifys-awesome-api-with-react-7db8173a7b13) higher-quality and very excellent blog post/video by Jonny Kalambay. If you're looking for a better explanation, I suggest you take a look.

#### Here's what I'm assuming:

- you've installed npm
- you understand the basics of Node and maybe Express or React(if not, doesn't matter because I didn't know anything either)
- you have a Spotify account



Let's talk about Oauth: it's an open-standard authorization protocol or framework that describes how unrelated servers and services can safely allow authenticated access to their assets without actually sharing the initial, related, single logon credential. If you've ever gone to a website that's asked you to log in with Google or Facebook, that's using Oauth. 



There are different types of authorization flows, but today we'll be using the [authorization code flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow). Spotify provides a great diagram of this workflow: 

![spotifyoauthflow](images/spotifyoauthflow.png)

Follow the arrows and notice the data getting passed through in each step: the app has a client id and secret, and uses these to request a token from the Spotify Accounts Service. Then the app redirects the user to a specified webpage with an access token in the URL, which our app needs to call the Spotify Web API. Now that we've got the basic concept down, let's get started!



### Step 1- Registering your App

Login to Spotify's developer dashboard [here](https://developer.spotify.com/dashboard/login). Then press **create an app**. Give it a cool name and press **Create**!

Click into your app to a page like this:

![spotifydashboard](images/spotifydashboard.png)

Save and don't reveal your Client ID and Client Secret. Then press on **EDIT SETTINGS**. We're going to add a Redirect URI here- this is the URI that the user will be redirected to once authorization is complete. For now, use `http://localhost:8888/callback`. The /callback part will indicate to our Node app that a request to the Spotify Accounts Service for a token should be made.   **MAKE SURE YOU CLICK THE SAVE BUTTON AT THE BOTTOM.**

![redirecturi](images/redirecturi.png)



### Step 2- Creating the Server

Now, we're going to be writing the actual authorization code. And by writing, I mean copying the example code that Spotify's excellently documented API has provided. Here's [the link](https://github.com/spotify/web-api-auth-examples) to the repo, which can also be found on Spotify's developer site. In your code editor(I'm using Visual Studio Code), run these commands:

```
git clone https://github.com/spotify/web-api-auth-examples.git server
cd server
npm install
```

This will clone the Github repo code into a new folder called server, and install all the necessary dependencies. Note! The repo has three folders, one for each type of authorization flow. The only one we need is the `authorization_code` folder. In my final project, I deleted the other folders and moved everything out into my `server` folder, but don't worry about that for now.



Go into the `authorization_code` folder, and then into app.js

You'll see this code near the top:

``` 
var client_id = ‘CLIENT_ID’; // Your client id
var client_secret = ‘CLIENT_SECRET’; // Your secret
var redirect_uri = ‘REDIRECT_URI’; // Your redirect uri
```

You're going to replace `client_id`, `client_secret`,  and `redirect_uri`  with your own id and secret and `http://localhost:8888/callback`. **This isn't a permanent solution!** To protect your id and secret, you should move them into an untracked .env file later. Refer to [this](https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786) tutorial. **Tip! Make sure to commit your .gitignore file with .env inside before actually creating a .env file, this ensures no early versions of the file with your api key make it onto github.**

Before we test, we need to specify the **scope**. In your app.js file, you're going to find a variable `scope`. Right now, it's probably set to some string of words like `var scope = ‘user-read-private user-read-email’;`. So what is scope? Basically, scope defines the set of actions that your app is requesting to do with the Spotify API. Right now, we want to use `'user-read-private'` to get user info like their name, and `'user-read-email'` to get the user's email. Some Spotify API calls have required scopes. Others, like accessing a public playlist have no required scopes. For our purposes, we're going to have to use a couple more than the one's currently specified. In your code, set scope like so:
`var scope = user-read-private user-read-email user-top-read playlist-modify-private playlist-modify-public`
We added `'user-top-read'` and `'playlist-modify-private/public'`, which we need to 
1) Get the user's top tracks/artists
2) Create a playlist filled with recommended songs for the user 
Without specifying these scopes, the API will not allow us to make certain calls or access certain information, so don't forget this step!


Now, we're going to test if the server is set up correctly. In terminal `cd` to the authorization_server directory, and then use `node app.js`  to get the application running.



Now go to `http://localhost:8888`. You should see this page:

![local8888example](images/local8888example.png)

Pressing login should take you to an authorization page. Once you login, you'll be redirected to a page like this: 

![loggedinas](images/loggedinas.png)

Check out the url of the final page! 

![loggedinurl](images/loggedinurl.png)

Notice that it's the original url, just with an access token attached. If you also take a closer look at the code, notice that clicking login will take you to `localhost:8888/callback`, where a Spotify API call is made to get a token. You're then redirected to `localhost:8888/#access_token=...` , where we can actually access the token from the url. 







