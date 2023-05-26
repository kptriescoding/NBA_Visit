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
        fileName:{
            type:String
        },
        data:{
            type:Buffer
        }
        
    }]

});
const professorFiles=mongoose.model("professorFiles",professorFilesSchema);
export default professorFiles;