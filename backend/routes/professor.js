import { Router } from "express";
import ProfessorFiles from "../models/ProfessorFiles.js";
import mongoose from "mongoose";
import { uploadFile, getFile,removeFile } from "../grid.js";
import multer from "multer";
import path from "path"
const upload = multer({ dest: "/tmp/uploads/" });
const __dirname=path.resolve()

const router = Router();

router.post("/create", async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email } = req.body.data;
    console.log("here"
    )
    // Create if  not exists
    var professor = await ProfessorFiles.findOne({ professorEmail: email });
    if (professor) {
      return res.status(200).json({ message: "Professor already exists" });
    }
    professor = await ProfessorFiles.create({
      professorName: name,
      professorEmail: email,
      files: [],
    });
    return res.json(professor);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
router.post("/uploadFile", upload.single("myFile"), async (req, res) => {
  try {
    const file = req.file;

    const { email } = req.body;
    // Access multipart form data
    // console.log("Here")
    // console.log(file)

    const professor = await ProfessorFiles.findOne({ professorEmail: email });
    if (professor) {
      let { id } = await uploadFile(file);
      // console.log(id)
      professor.files.push({
        fileName: file.originalname,
        fileId: id,
      });
      await professor.save();
      return res.json(professor);
    } else {
      return res.status(404).json({ error: "Professor not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.post("/getFiles", async (req, res) => {
    
  try {
    const  email  = req.body.data.email;
  // console.log(req.body.data.email)
    const professor = await ProfessorFiles.findOne({ professorEmail: email });
    if (professor) {
      let reqFiles = [];
      let reqFile;
      let fileLoc
      for (let i = 0; i < professor.files.length; i++) {
        fileLoc=await getFile(professor.files[i].fileId)
        
        reqFile ={
            fileName: professor.files[i].fileName,
            url:"https://nba-visit.onrender.com/file?fileName="+fileLoc,
            fileId: professor.files[i].fileId,
        }
       
        reqFiles.push(reqFile);
      }
    
    
      return res.status(200).json({ files: reqFiles });
    } else {
      console.log("Professor not found"+email);
      return res.status(404).json({ error: "Professor not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
router.post("/getAllProfessors", async (req, res) => {

  try {
    const professors = await ProfessorFiles.find({});
    if (professors) {
      var resProf = [];
      professors.forEach((prof) => {
        resProf.push({
          professorName: prof.professorName,
          professorEmail: prof.professorEmail,
        });
      });
      return res.json(resProf);
    } else {
      return res.status(404).json({ error: "No professors found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.post("/deleteFile", async (req, res) => {
    try {
        const {fileId,email}=req.body.data
        const professor = await ProfessorFiles.findOne({ professorEmail: email });
        if (professor) {
            let fileIndex=professor.files.findIndex((file)=>file.fileId===fileId)
            if(fileIndex===-1){
                return res.status(404).json({ error: "File not found" });
            }
            let file=professor.files[fileIndex]
            professor.files.splice(fileIndex,1)
            await removeFile(file.fileId)
            await professor.save()
        } else {
            return res.status(404).json({ error: "Professor not found" });
        }
        return res.status(200).json({message:"File deleted successfully"})
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});

router.post("/deleteProfessor", async (req, res) => {   
    return res.status(200).json({message:"Professor deleted successfully"})
});
        




export default router;
