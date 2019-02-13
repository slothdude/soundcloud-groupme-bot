//run `node index.js`
//get request gives a sample, post request parses your file

const express = require('express');
const app = express();
const axios = require('axios');


app.post("/what", (req,res) => {
  axios.post("https://api.groupme.com/v3/bots/post",
  {
    bot_id: process.env.BOT_ID,
    text: "test"
  }).then(function (response) {
    return res.send("all good");
  })
  .catch(function (error) {
    return res.send("failure");
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
