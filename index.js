import express from "express"
const app = express();
import mongoose from "mongoose"
import Student from "./models/student-schema.js"
import dayjs from "dayjs"
import mongoosePaginate from "mongoose-paginate-v2"
import router from "./routes/student-routes.js"
import { dbConnect } from "./config/student-database.js";
import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT

//connecting to mongodb using mongoose
dbConnect()


//middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use('/' , router)


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});