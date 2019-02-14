//run `node index.js`
//get request gives a sample, post request parses your file

const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());

app.post("/newsong", (req,res) => {
  if(req.body.sender_type === "bot") return;
  const scRegex = /.*soundcloud\.com.*/;
  if(scRegex.match(req.body.text)){
    const text = "yooooo";
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
  });
  }

  console.log(req.body.text);
  // if you want to send a message back to group


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
