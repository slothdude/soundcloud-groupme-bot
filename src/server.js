//run `node index.js`
//get request gives a sample, post request parses your file

const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());


app.get('/api/sample', (req, res) => {
  // var date = new Date();
  // res.status(200).json({"data": sample,
  //                       "metadata": date})
                      });


app.post("/", (req,res) => {
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
    res.send(req.body, process.env.BOT_ID);
  // });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
