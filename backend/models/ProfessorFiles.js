import mongoose from "mongoose"

const professorFilesSchema=new mongoose.Schema({
    professorName:{
        type:String,
        required:true,
        unique:true
    },
    professorEmail:{
        type:String,
        required:true,
        unique:true
    },
    files:[{
        fileId:{
            type:String,
        },
        fileName:{
            type:String,
        },
        
    }]

});
const professorFiles=mongoose.model("professorFiles",professorFilesSchema);
export default professorFiles;