//run `node index.js`
//get request gives a sample, post request parses your file

const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

app.use(cors());


app.get('/', (req, res) => {
  console.log(process.env);
                      });


app.post("/", (req,res) => {
  axios.post("https://api.groupme.com/v3/bots/post",
  {
    bot_id: process.env.BOT_ID,
    text: "test"
  }).then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  // var buffer = req.files.file.data.toString();
  // console.log(buffer);
  // if (!req.files)
  //   return res.status(400).send('No files were uploaded.');
  // var file = buffer.split("\r\n");
  // console.log(parser.parse(file));
  //
  //
  // fs.writeFile('parsed-json/post.json', parser.parse(file), function (err) {
  //   if (err){
  //     return console.log(err);
  //   }
    res.send("hi");
  // });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
