const querystring = require('querystring');
const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());
app.use(express.static("./app/build"))
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
let accessToken = null;
let refreshToken = null;

client.connect();
client.query('SELECT * FROM KEYS', (err, res) => {
    if (err) throw err;
    refreshToken = res.rows[0].token;
    console.log("refresh token from datbase: ", refreshToken);
});


const login = (res, code) => { //logs in for the first time (I have to do that in browser at https://cool-new-sounds-bot.herokuapp.com/login)
  axios.post("https://accounts.spotify.com/api/token",
  querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "https://cool-new-sounds-bot.herokuapp.com/auth", //doesn't redirect so will only be called once
      client_id,
      client_secret
  }),
  {
    headers: {
      'Content-Type':'application/x-www-form-urlencoded'
    }
  }
).then(async response => {
    refreshToken = response.data.refresh_token;
    await client.query(`UPDATE KEYS SET Token = '${refreshToken}'`, (err, res) => {
      if (err) throw err;
        console.log("updated (new) refresh token to " + refreshToken + ". Res: " + JSON.stringify(res));
    });
    res.status(200).send("logged in! " + response.data.access_token + "\nrefreshToken: " + refreshToken);
  }).catch(err => {
    console.log(err);
    res.status(500).send("error getting original token");
  });
}

const postSoundCloudSong = async (res, url, name) => {
    console.log(url, name);
    client.query(
      `INSERT INTO POSTS (date_added, link, name)
      VALUES ( now(), '${url}', '${name}' )`,
        (err, result) => {
          if (err) {
            res.status(500).send("error inserting soundcloud post");
            throw err
          };
          console.log(result);
          res.status(200).send(`successfully added ${url} from ${name}`);
        }
    );
}


const postSong = async (res, id) => {
  await axios.post("https://accounts.spotify.com/api/token", //get next access token from refresh token
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
      console.log("successfully added track", response2.data);
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
  res.sendFile("/index.html");
});

app.get("/auth", (req, res) => {
  login(res, req.query.code);
})

app.get("/login", (req, res) => {
  res.redirect(`https://accounts.spotify.com/authorize?client_id=f60b1417d554416baba6161f2e89a205&response_type=code&redirect_uri=https://cool-new-sounds-bot.herokuapp.com/auth&scope=playlist-modify-private%20playlist-modify-public`);
});

app.post("/newsong", (req,res) => {
  console.log(req.body);
  if(req.body.sender_type === "bot") return res.status(500).send("ignoring: bot message");
  const spotifyRegex = /\/track\/([^\?]*)/;
  const spotifyId = req.body.text.match(spotifyRegex) ? req.body.text.match(spotifyRegex)[1] : -1;
  if(spotifyId !== -1)
    postSong(res, id);
  else {
    const soundcloudRegex = /soundcloud\.com\/[^\s]+/;
    const soundCloudUrl = req.body.text.match(soundcloudRegex) ? req.body.text.match(soundcloudRegex)[0] : "";
    if(soundCloudUrl !== "")
      postSoundCloudSong(res, soundCloudUrl, req.body.name)
    else res.status(500).send("not a link I can recognize");
  }
});

app.get("/posts", (req,res) => {
  client.query('SELECT * FROM POSTS', (err, result) => {
      if (err) throw err;
      console.log(result);
      res.status(200).send(result.rows);
  });
});

// app.post("/newsoundcloudpost", (req, res) => {
//   console.log(req.body);
//   client.query(
//     `INSERT INTO POSTS (date_added, link, name)
//     VALUES ( now(), ${req.body.data.link}, ${req.body.data.name} )`,
//       (err, result) => {
//         if (err) {
//           res.status(500).send("error inserting soundcloud post")
//           throw err
//         };
//         console.log(result);
//         res.status(200).send("successfully added");
//       }
//   );
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  client.end();
});
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
