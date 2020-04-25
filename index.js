var express = require('express')
var app = express()
const cors = require('cors');
var multer  = require('multer')
var path = require('path')
var fileManager = require('./api/managers/file-manager')
var mailManager = require('./api/managers/mail-manager')
var authToken = require('api-library-user-management/utils/auth-token')
const UserManagement = require('api-library-user-management')
var upload = multer()
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000


app.use(cors());
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.listen(PORT,function(){
    console.log(PORT+' started')
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/test/index.html'));
})

app.get('/upload',(req,res)=>{
    res.sendFile(path.join(__dirname + '/test/upload.html'));
})

app.get('/mail',(req,res)=>{
    res.sendFile(path.join(__dirname + '/test/mail.html'));
})

app.post('/upload', authToken.extractAuthToken ,async (req, res) => {
    let fileLink = await fileManager.uploadFile(req.body.fileData)
    await UserManagement.createMedia(req.token,fileLink);
    res.send({fileLink})
})


app.post('/mail', async function (req, res) {
    //console.log(req)
    console.log(req.body)

    await mailManager.sendMail(req.body.to,req.body.subject,req.body.html)
    res.sendFile(path.join(__dirname + '/test/mail.html'));
})
