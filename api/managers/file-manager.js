const upload_path = './res/upload.json'
const download_path = './res/DOWNLOAD_URL'

const B2 = require('backblaze-b2')
var fs = require('fs')

const applicationKeyId = '00005af2f10d2640000000001'
const applicationKey = 'K000HCyeco4nMM1qWB84u4JTiCJdKm0'
const bucketId = '10f5da1ff2cf21f07d120614'

const b2 = new B2({
    applicationKeyId,
    applicationKey
});


var UPLOAD_URL = undefined
var DOWNLOAD_URL = undefined

function saveConfig(){
    fs.writeFileSync(upload_path, JSON.stringify({data:UPLOAD_URL.data}));
    fs.writeFileSync(download_path, DOWNLOAD_URL);
}

function deleteConfig(){
     UPLOAD_URL = undefined
     DOWNLOAD_URL = undefined
     try {
        fs.unlinkSync(upload_path)
        fs.unlinkSync(download_path)
     } catch (error) {
         console.log(error)
     }
}

function loadConfig(){
    UPLOAD_URL = JSON.parse(fs.readFileSync(upload_path))
    DOWNLOAD_URL = fs.readFileSync(download_path)
    console.log('info retreived')
}

async function getUploadUrl(){
    
    try {
        if(UPLOAD_URL.data!==undefined)
            return UPLOAD_URL
        loadConfig()
        if(UPLOAD_URL.data!==undefined)
            return UPLOAD_URL
    } catch (error) {
        console.log(error)
    }

    let authorize = await b2.authorize()
    console.log(authorize)
    //console.log(authorize.data.authorizationToken)
    DOWNLOAD_URL = authorize.data.downloadUrl;
    UPLOAD_URL = await b2.getUploadUrl({bucketId});
    saveConfig()
    return UPLOAD_URL
}

async function uploadFile(fileData){
    try {
        let uploadUrl = await getUploadUrl()
        console.log(uploadUrl)
        let uploadUrlBucket = uploadUrl.data.uploadUrl;
        console.log(uploadUrlBucket)
        let uploadAuthToken = uploadUrl.data.authorizationToken;
        console.log(uploadAuthToken)
        let randomFileName=new Date().getTime()+'_'+fileData.fileName;
        //console.log(fileBuffer.buffer)
        let uploadFile = await b2.uploadFile({
            uploadUrl: uploadUrlBucket,
            uploadAuthToken: uploadAuthToken,
            fileName: randomFileName,
            data: Buffer.from(fileData.fileB64, 'base64'), // this is expecting a Buffer, not an encoded string
            onUploadProgress: (event) => {console.log(event)} 
            // ...common arguments (optional)
        });  
        console.log(uploadFile)
        let friendlyUrl = DOWNLOAD_URL+'/file/CabBuddies/'+uploadFile.data.fileName
        console.log(friendlyUrl)

        console.log('great!!! : '+friendlyUrl)
        return friendlyUrl
    } catch (error) {
        console.log(error)
        deleteConfig()
        return await uploadFile(fileBuffer)
        //return 'null'
    }
}

module.exports={uploadFile}