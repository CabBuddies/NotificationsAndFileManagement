var express = require('express')
var multer  = require('multer')
var path = require('path')
var fileManager = require('./api/managers/file-manager')
var upload = multer()


var app = express()

app.listen(8008,function(){
    console.log('8008 started')
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/test/index.html'));
})

app.post('/profile', upload.single('avatar'), async function (req, res) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file)
  let fileLink = await fileManager.uploadFile(req.file)
  res.send({fileLink})
  //res.sendFile(path.join(__dirname + '/res/index.html'))
})

