import { Router } from "express"
import ProfessorFiles from "../models/ProfessorFiles.js"
const router=Router()

router.post("/create",async(req,res)=>{
    try{
        console.log(req.body)
        const {name,email}=req.body.data
        // Create if not exists
        var professor=await ProfessorFiles.findOne({professorEmail:email})
        if(professor){
            return res.status(400).json({error:"Professor already exists"})
        }
        professor=await ProfessorFiles.create({
            professorName:name,
            professorEmail:email,
            files:[]
        })
        return res.json(professor)
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}
)
router.post("/addFile",async(req,res)=>{ 
    try{
        // const {name,email,fileName,fileData}=req.body.data
        // Access multipart form data
        
        console.log(req);
        console.log(req.body)
        console.log(email)
        const professor=await ProfessorFiles.findOne({professorEmail:email})
        if(professor){
            professor.files.push({
                fileName:fileName,
                data:fileData
            })
            await professor.save()
            return res.json(professor)
        }
        else{
            return res.status(404).json({error:"Professor not found"})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

router.post("/getFiles",async(req,res)=>{
    try{
        const {email}=req.body
        const professor=await ProfessorFiles.findOne({professorEmail:email})
        if(professor){
            return res.json(professor)
        }
        else{
            return res.status(404).json({error:"Professor not found"})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})
router.post("/getAllProfessors",async(req,res)=>{
    try{
        const professors=await ProfessorFiles.find({})
        if(professors){
            return res.json(professors)
        }
        else{
            return res.status(404).json({error:"No professors found"})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

export default router;
