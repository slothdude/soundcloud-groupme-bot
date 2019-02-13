//run `node index.js`
//get request gives a sample, post request parses your file

const express = require('express');
const app = express();
const axios = require('axios');


app.post("/newsong", (req,res) => {
  console.log(req.body);
  const text = "";
  axios.post("https://api.groupme.com/v3/bots/post",
  {
    bot_id: process.env.BOT_ID,
    text: text
  }).then(function (response) {
    return res.send("all good" + response);
  })
  .catch(function (error) {
    return res.send("failure" + error);
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
