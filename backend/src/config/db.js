
import mongoose from "mongoose"

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MONGODB_URL: ${mongoose.connection.host}`)
        
    } catch (error) {

        console.log("Error in connecting the mongodb")
        
    }
}

