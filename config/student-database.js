

 import mongoose from "mongoose"
 export const dbConnect =()=>{
mongoose.connect(process.env.MONGO_URL)
.then( ()=> {
    console.log('MongoDb is connected via mongoose');
})  }