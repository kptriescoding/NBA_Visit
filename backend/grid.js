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

const getFile=async(id,res)=>{
    let file=await gfs.findById(id)

    // let writeStream=createWriteStream(file.filename)
    // console.log(file)
    // Convert file to buffer and send it to frontend
    console.log(file.contentType)
    const readStream=await file.read()
    // Append file to res
    res.append('Content-Type', file.contentType);
    res.append('Content-Disposition', 'attachment; filename="' + file.filename + '"');

    readStream.pipe(res)
    return res
}

export {uploadFile,getFile}

// const readStream=createReadStream(".gitignore")

// const options = ({ filename: 'sample.txt', contentType: 'text/plain' });
// let x=gfs.write(options, readStream)
// console.log(x);

// let y=await gfs.findById("647087ad03520343cdc74137")
// const readStream=y.read()
// readStream.pipe(process.stdout)