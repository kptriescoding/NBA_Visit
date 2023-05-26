    import dotenv from "dotenv"
import path from "path"


const __dirname=path.resolve()
dotenv.config({path:__dirname+"/.env"});


export const DATABASE_URL=process.env.DATABASE_URL
