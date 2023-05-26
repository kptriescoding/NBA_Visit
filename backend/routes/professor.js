import { Router } from "express";
import ProfessorFiles from "../models/ProfessorFiles.js";
import mongoose from "mongoose";
import { uploadFile, getFile, removeDirectory } from "../grid.js";
import multer from "multer";
import path from "path"
const upload = multer({ dest: "backend/uploads/" });
const __dirname=path.resolve()

const router = Router();

router.post("/create", async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email } = req.body.data;
    // Create if not exists
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
    removeDirectory();
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
            url:("http://localhost:8081/file?fileName="+fileLoc)
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




export default router;
