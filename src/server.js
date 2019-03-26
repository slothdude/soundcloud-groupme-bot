const querystring = require('querystring');
const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());

var client = require('redis').createClient(process.env.REDIS_URL);
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
let accessToken = null;
let refreshToken = null;

const login = (res, code) => { //logs in for the first time (I have to do that in browser at https://cool-new-sounds-bot.herokuapp.com/login)
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
      'Content-Type':'application/x-www-form-urlencoded'
    }
  }
  ).then(response => {
    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    res.status(200).send("logged in! " + accessToken + "\nrefreshToken: " + refreshToken);
  }).catch(err => {
    console.log(err);
    res.status(500).send("error getting original token");
  });
}

const postSong = (res,id) => {
  if(!refreshToken) {
    console.log("not posting this bc no refresh token");
    return res.status(500).send("error: no refresh token");
  }
  axios.post("https://accounts.spotify.com/api/token", //get next access token from refresh token
  querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken
  }),
  {
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
      'Content-Type':'application/x-www-form-urlencoded'
    }
  }
  ).then(response => {
    console.log(response.data);
    accessToken = response.data.access_token;
    axios.post("https://api.spotify.com/v1/playlists/7tlQqoMHmOjSzeHhtt0qwn/tracks",
    {
        uris: ["spotify:track:"+id],
        position: 0
    },
    {
      headers: {
        'Content-Type': "application/json",
        'Authorization': "Bearer " + accessToken
      }
    }).then(response2 => {
      console.log(response2.data);
      res.status(200).send("success!");
    }).catch(err => {
      console.log(err);
      res.status(500).send("error on playlist post");
    });
  }).catch(err => {
    console.log(err);
    res.status(500).send("error getting refresh token");
  });
}

app.get("/", (req, res) => {
  login(res, req.query.code);
})

app.get("/login", (req, res) => {
  res.redirect(`https://accounts.spotify.com/authorize?client_id=f60b1417d554416baba6161f2e89a205&response_type=code&redirect_uri=https://cool-new-sounds-bot.herokuapp.com/&scope=playlist-modify-private%20playlist-modify-public`);
});

app.post("/newsong", (req,res) => {
  console.log(req.body);
  if(req.body.sender_type === "bot") return res.status(500).send("ignoring: bot message");
  const regex = /\/track\/([^\?]*)/;
  const id = req.body.text.match(regex) ? req.body.text.match(regex)[1] : -1;
  if(id !== -1)
    postSong(res, id);
  else res.status(500).send("not a spotify link");
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

// get track info
// axios.get("https://api.spotify.com/track/" + id)
// .then(response => {
  //   console.log(resonse.data);
  //   res.status(200).send(JSON.stringify(response.data));
  // }).catch(error => {
    //   console.log(error);
    //   res.status(500).send(JSON.stringify(error));
    // }); //postSOng(res)

//how to get the bot to send messages
// axios.post("https://api.groupme.com/v3/bots/post",
// {
//   bot_id: process.env.BOT_ID,
//   text: JSON.stringify(req.body.text)
// }).then(function (response) {
//   return res.send("all good" + JSON.stringify(req.body));
// })
// .catch(function (error) {
//   return res.send("failure" + error);
// });
