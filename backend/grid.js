import {createModel} from "mongoose-gridfs"
import mongoose from "mongoose"
import { DATABASE_URL } from "./env.js";
import {createReadStream,createWriteStream} from "fs"
import fs from "fs"

const url=DATABASE_URL
await mongoose
    .connect(url,
        { useNewUrlParser: true,
             useUnifiedTopology: true
        })
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));

const gfs=createModel({
    modelName: 'ProfessorFilesDB',
    connection: mongoose.connection
})

const uploadFile=async(file)=>{
    // fileData is a buffer save it in local storage

    const fileStream=createReadStream(file.path)
    // Save fileStream according to fileName and fileType in local storage
    const options = ({ filename: file.originalname, contentType: file.mimetype });
    let uploadedFile=gfs.write(options, fileStream)
    // console.log(uploadedFile)
    return uploadedFile
}

const getFile=async(id)=>{
    let file=await gfs.findById(id)

    const readStream=file.read()

    if(!process.env.PORT){
    // CReate a directory if not exists
    if (!fs.existsSync("client/public/files")){
        fs.mkdirSync("client/public/files");
    }
    const writeStream=createWriteStream("client/public/files/"+id+file.filename)
    readStream.pipe(writeStream)
    }
    else{
        if (!fs.existsSync("client/build/files")){
            fs.mkdirSync("client/build/files");
        }
        const writeStream=createWriteStream("client/build/files/"+id+file.filename)
    readStream.pipe(writeStream)
    }
    // console.log(buffer)

    // const fileUrl="client"
    const resFile={
        url:"/files/"+id+file.filename,
        fileName:file.filename,
    }
    return resFile
}
const removeDirectory=()=>{
    if(!process.env.PORT){
        // CReate a directory if not exists
        if (fs.existsSync("client/public/files")){
            fs.rmSync("client/public/files",{ recursive: true, force: true });
        }
        }
        else{
            if (fs.existsSync("client/build/files")){
                fs.rmSync("client/build/files",{ recursive: true, force: true });
            }
        }
        fs.rmSync("backend/uploads",{ recursive: true, force: true });
        fs.mkdirSync("backend/uploads");
}

export {uploadFile,getFile,removeDirectory}

// const readStream=createReadStream(".gitignore")

// const options = ({ filename: 'sample.txt', contentType: 'text/plain' });
// let x=gfs.write(options, readStream)
// console.log(x);

// let y=await gfs.findById("647087ad03520343cdc74137")
// const readStream=y.read()
// readStream.pipe(process.stdout)