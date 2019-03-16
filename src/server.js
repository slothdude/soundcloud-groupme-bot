//run `node index.js`
//get request gives a sample, post request parses your file
const querystring = require('querystring');
const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());
// let loggedIn = false;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
let refreshToken = null;
let accessToken = null;

const postSong = (res) => {
  axios.post("https://api.spotify.com/v1/playlists/7tlQqoMHmOjSzeHhtt0qwn/tracks",
  {
      uris: ["spotify:track:2H6sMrYepfhqitVADAYpm4"]
  },
  {
    headers: {
      'Content-Type': "application/json",
      'Authorization': "Bearer " + access_token
    }
  }).then(response2 => {
    console.log(response2.data);
    res.status(200).send("success!");
    // res.status(200).send(JSON.stringify(response2.data));
  }).catch(err => {
    console.log(err);
    // res.status(500).send(JSON.stringify(err));
    res.status(500).send("error on playlist post");
  });
}
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
      accessToken = response.data.access_token;
      // console.log("Bearer " + response.data.access_token);
      res.status(200).send("logged in! " + accessToken);
      // refreshToken = response.data.refresh_token;

    }).catch(err => {
      console.log(err);
      res.status(500).send("error on token");
      // res.status(500).send(JSON.stringify(err));
    });
  }
  //res.status(200).send(JSON.stringify(req.query.code));
})

app.get("/login", (req, res) => {
  res.redirect(`https://accounts.spotify.com/authorize?client_id=f60b1417d554416baba6161f2e89a205&response_type=code&redirect_uri=https://cool-new-sounds-bot.herokuapp.com/&scope=playlist-modify-private%20playlist-modify-public`);
});

app.post("/newsong", (req,res) => {
  console.log(req.body);
  if(req.body.sender_type === "bot") return;
  const regex = /.*spotify\.com\/track\/(\S)*/;
  const url = req.body.text.match(regex)[0];
  axios.get("https://api.spotify.com/track/3mnZ8RsgfMkHNlo3UK45FU?si=1tgaFfctRkKckP-foX_RJA")
  .then(response => {
    console.log(resonse.data);
    res.status(200).send(JSON.stringify(response.data));
  }).catch(error => {
    console.log(error);
    res.status(500).send(JSON.stringify(err));
  });
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
