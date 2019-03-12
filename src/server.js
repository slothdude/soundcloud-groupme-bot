//run `node index.js`
//get request gives a sample, post request parses your file
const querystring = require('querystring');
const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());
// let loggedIn = false;
const client_id = "f60b1417d554416baba6161f2e89a205";
const client_secret = "8384896fc76a4c948d7e39344e88cb24";//process.env.CLIENT_SECRET
let refreshToken = null;

//request failing with unhandled promise request, maybe post on stackoverflow
app.get("/", (req, res) => {
  const code = req.query.code;
  if(!refreshToken){
    axios.post("https://accounts.spotify.com/api/token",
    querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://cool-new-sounds-bot.herokuapp.com/", //doesn't redirect so will only be called once
        client_id,
        client_secret
    }),
    {
      headers: {
        // 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
        'Content-Type':'application/x-www-form-urlencoded'
      }
    }
    ).then(response => {
      refreshToken = response.data.refresh_token;
      axios.post("https://api.spotify.com/v1/playlists/7tlQqoMHmOjSzeHhtt0qwn/tracks",
      querystring.stringify({
          uris: "spotify:track:2H6sMrYepfhqitVADAYpm4"
      }),
      {
        headers: {
          'Authorization': response.data.access_token,
        }
      }).then(response => {
        res.status(200).send(response.data);
      }).catch(err => {
        console.log(err);
        res.status(500).send(JSON.stringify(err));
      });
    }).catch(err => {
      console.log(err);
      res.status(500).send(JSON.stringify(err));
    });
  }
  //res.status(200).send(JSON.stringify(req.query.code));
})

app.get("/login", (req, res) => {
  res.redirect(`https://accounts.spotify.com/authorize?client_id=f60b1417d554416baba6161f2e89a205&response_type=code&redirect_uri=https://cool-new-sounds-bot.herokuapp.com/&scope=playlist-modify-public`);
});

app.post("/newsong", (req,res) => {
  console.log(req.body);
  if(req.body.sender_type === "bot") return;
  const scRegex = /.*spotify\.com.*/;
  if(req.body.text.match(scRegex)){
    const text = "yooooo";
    console.log("match found");
    axios.post("https://api.groupme.com/v3/bots/post",
    {
      bot_id: process.env.BOT_ID,
      text: JSON.stringify(req.body.text)
    }).then(function (response) {
      return res.send("all good" + JSON.stringify(req.body));
    })
    .catch(function (error) {
      return res.send("failure" + error);
    });
  } else return res.send("not needed");
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
