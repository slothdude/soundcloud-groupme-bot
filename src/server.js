//run `node index.js`
//get request gives a sample, post request parses your file

const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());
const loggedIn = false;

app.get("/", (req, res) => {
  const code = req.query.code;
  if(!loggedIn){
    axios.post("https://accounts.spotify.com/api/token",
    {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://cool-new-sounds-bot.herokuapp.com/"
    },
    {
      headers: {
        'Authorization': "ZjYwYjE0MTdkNTU0NDE2YmFiYTYxNjFmMmU4OWEyMDU6ODM4NDg5NmZjNzZhNGM5NDhkN2UzOTM0NGU4OGNiMjQ=",
        'Content-Type':'application/x-www-form-urlencoded'
      }
    }
    ).then(response => {
      loggedIn = true;
      return res.status(200).send(JSON.stringify(response));
    }).catch(err => {
      console.log(err);
      loggedIn = true;
      return res.status(500).send(JSON.stringify(err));
    });
  }
  // res.status(200).send(JSON.stringify(req.query));
})

app.get("/login", (req, res) => {
  res.redirect(`https://accounts.spotify.com/authorize?client_id=f60b1417d554416baba6161f2e89a205&response_type=code&redirect_uri=https://cool-new-sounds-bot.herokuapp.com/`);
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
