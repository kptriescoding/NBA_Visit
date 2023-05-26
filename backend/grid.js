import {createModel} from "mongoose-gridfs"
import mongoose from "mongoose"
import { DATABASE_URL } from "./env.js";
import  {createReadStream,createWriteStream} from "fs"
import fs from "fs"
import { resolve } from "path";
const __dirname=resolve()

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

    const readStream=await file.read()

    var fileName=id+file.filename
    if (!fs.existsSync("/tmp/uploads")){
                    fs.mkdirSync("/tmp/uploads",{ recursive: true, force: true });
                }
    const writeStream=createWriteStream("/tmp/files/"+fileName)
    await readStream.pipe(writeStream)


    return fileName
}
// const removeDirectory=()=>{
//         if (fs.existsSync("backend/uploads")){
//             fs.rmSync("backend/uploads",{ recursive: true, force: true });
//         }
//         if (fs.existsSync("client/build/files")){
//                 fs.rmSync("client/build/files",{ recursive: true, force: true });
//             }
        
//         fs.mkdirSync("backend/uploads");
//         fs.mkdirSync("client/build/files");
// }
const removeFile=async(id)=>{
    // let file= gfs.unlink(id,(err,unlinked)=>{
    //     if(err) throw err;
    // })
    // gfs.unlink(id)
    await gfs.deleteOne({ _id: id }).exec();
        //  gfs.unlink(id)  
}

export {uploadFile,getFile,removeDirectory,removeFile}

// const readStream=createReadStream(".gitignore")

// const options = ({ filename: 'sample.txt', contentType: 'text/plain' });
// let x=gfs.write(options, readStream)
// console.log(x);

// let y=await gfs.findById("647087ad03520343cdc74137")
// const readStream=y.read()
// readStream.pipe(process.stdout)