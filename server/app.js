/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

 var express = require("express"); // Express web server framework
 var request = require("request"); // "Request" library
 var cors = require("cors");
 var querystring = require("querystring");
 var cookieParser = require("cookie-parser");
 var multipart = require("parse-multipart");
 var util = require("util");
 
 // server.js
 const dotenv = require("dotenv");
 dotenv.config();
 
 var client_id = process.env.API_ID; // Your client id
 var client_secret = process.env.API_SECRET; // Your secret
 var redirect_uri = "https://bsr-client.herokuapp.com/callback"; // Your redirect uri
//  var redirect_uri = "http://localhost:4000/callback"
 //https://bsr-client.herokuapp.com/callback
 
 /**
  * Generates a random string containing numbers and letters
  * @param  {number} length The length of the string
  * @return {string} The generated string
  */
 var generateRandomString = function (length) {
   var text = "";
   var possible =
     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
   for (var i = 0; i < length; i++) {
     text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return text;
 };
 
 var stateKey = "spotify_auth_state";
 
 var app = express();
 
 app.use(express.static(__dirname)).use(cors()).use(cookieParser());
 
 app.get("/login", function (req, res) {
   var state = generateRandomString(16);
   res.cookie(stateKey, state);
 
   // your application requests authorization
   var scope =
     "user-read-private user-read-email user-modify-playback-state user-top-read playlist-modify-private playlist-modify-public";
   res.redirect(
     "https://accounts.spotify.com/authorize?" +
       querystring.stringify({
         response_type: "code",
         client_id: client_id,
         scope: scope,
         redirect_uri: redirect_uri,
         state: state,
       })
   );
 });
 
 app.get("/callback", function (req, res) {
   // your application requests refresh and access tokens
   // after checking the state parameter
 
   var code = req.query.code || null;
   var state = req.query.state || null;
   var storedState = req.cookies ? req.cookies[stateKey] : null;
 
   if (state === null || state !== storedState) {
     res.redirect(
       "/#" +
         querystring.stringify({
           error: "state_mismatch",
         })
     );
   } else {
     res.clearCookie(stateKey);
     var authOptions = {
       url: "https://accounts.spotify.com/api/token",
       form: {
         code: code,
         redirect_uri: redirect_uri,
         grant_type: "authorization_code",
       },
       headers: {
         Authorization:
           "Basic " +
           new Buffer(client_id + ":" + client_secret).toString("base64"),
       },
       json: true,
     };
 
     request.post(authOptions, function (error, response, body) {
       if (!error && response.statusCode === 200) {
         var access_token = body.access_token,
           refresh_token = body.refresh_token;
 
         var options = {
           url: "https://api.spotify.com/v1/me",
           headers: { Authorization: "Bearer " + access_token },
           json: true,
         };
 
         // use the access token to access the Spotify Web API
         // request.get(options, function (error, response, body) {
         //   console.log(body);
         // });
 
         // we can also pass the token to the browser to make requests from there
 
        //  let redirect_uri = "https://better-song-rec.herokuapp.com/face/#"
        //  let redirect_uri = "http://localhost:3000/face/#"
        let redirect_uri = process.env.REDIRECT
         res.redirect(
           redirect_uri +
             querystring.stringify({
               access_token: access_token,
               refresh_token: refresh_token,
             })
         );
       } else {
         res.redirect(
           "/#" +
             querystring.stringify({
               error: "invalid_token",
             })
         );
       }
     });
   }
 });
 
 app.get("/refresh_token", function (req, res) {
   // requesting access token from refresh token
   var refresh_token = req.query.refresh_token;
   var authOptions = {
     url: "https://accounts.spotify.com/api/token",
     headers: {
       Authorization:
         "Basic " +
         new Buffer(client_id + ":" + client_secret).toString("base64"),
     },
     form: {
       grant_type: "refresh_token",
       refresh_token: refresh_token,
     },
     json: true,
   };
 
   request.post(authOptions, function (error, response, body) {
     if (!error && response.statusCode === 200) {
       var access_token = body.access_token;
       res.send({
         access_token: access_token,
       });
     }
   });
 });
 
 app.get("/face_deets", async function (req, res) {
   console.log('inside the face deets')
   var bodyBuffer = Buffer.from(req.body);
 
   var boundary = multipart.getBoundary(req.headers["content-type"]);
   // parse the body with parse-multipart
   var parts = multipart.Parse(bodyBuffer, boundary);
 
   //calls a function that calls the Face API
   // var result = await analyzeImage(parts[0].data);
 
   const subscriptionKey = process.env.face_key;
   const uriBase = process.env.face_endpoint + "/face/v1.0/detect";
 
   //Face API params
   const params = {
     returnFaceId: "true",
     returnFaceAttributes: "emotion",
   };
 
   const options = {
     uri: uriBase,
     qs: params,
     body: byteArray,
     headers: {
       "Content-Type": "application/octet-stream",
       "Ocp-Apim-Subscription-Key": subscriptionKey,
     },
   };
   let jsonResponse;
 
   await request.post(options, (error, response, body) => {
     if (error) {
       console.log("Error: " + error);
       return;
     }
 
     jsonResponse = JSON.parse(body);
   });
   console.log('face response', jsonResponse)
   // return jsonResponse;
 });
 
//  console.log('Listening on 4000');
 app.listen(process.env.PORT || 4000);
//  app.listen(4000);
 