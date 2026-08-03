 
 import express from "express"
 import Student  from "../models/student-schema.js";
 import dayjs from "dayjs";

import { getStudent,
       addStudentPage,
       addStudent,
       viewStudent,
       editStudentPage,
    editStudent,
    defaulterList
    } from "../controllers/student-controllers.js";
import mongoose from "mongoose";

 const router = express.Router()



router.get('/', getStudent);


//req karega form page  read/kholne ke liye
router.get('/create_reg', addStudentPage);

//req form data server pe write/push karne ke liye
router.post('/create_reg', addStudent);

// view student by ID
router.get('/view-student/:id', viewStudent)

// edit Student Details Page or form
router.get('/edit-student/:id', editStudentPage)

router.post('/edit-student/:id', editStudent)

//archieve karne ke liye button
router.get('/archieve-btn/:id', async(req,res)=>{
   const student = await Student.findByIdAndUpdate(req.params.id, {isArchived:true})
   res.redirect('/')
})

router.get('/past-student', async(req,res)=>{
    const student = await Student.find({isArchived:true})
    res.render('past-student', {student})
})

//archieve se haatane ke liyereq.accepts(types);
router.get('/unarchieve-btn/:id', async(req,res)=>{
   const student = await Student.findByIdAndUpdate(req.params.id, {isArchived:false})
   res.redirect('/')
    })


//delete student route

router.get('/delete-student/:id', async(req,res)=>{
   await Student.findByIdAndDelete(req.params.id)
   res.redirect('/')
})


router.get('/collect-fee/:id', async(req,res)=> {
    const student = await Student.findById(req.params.id) //find using the ID to update form accordingly
    res.render('collect-fee.ejs', {student})
})

router.post('/collect-fee/:id', async(req,res)=> {
     await Student.findByIdAndUpdate(req.params.id, {$push : {fees : req.body}}) //find using the ID to update form accordingly
    res.redirect('/')
})

//get student fee details along with student name , rollno etc..
router.get('/fee-detail/:id', async(req,res)=> {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.render('404')
    }
    const student = await Student.findById(req.params.id)
    res.render('fee-detail',{student, dayjs})
})

//check-fee 
router.get('/check-fee', (req,res)=> {
    res.render('check-fee')
})

router.post('/get-feeDetail', async(req,res) =>{
    const roll = req.body.rollno;  
           const student = await Student.findOne({rollno : roll})
           if(!student){
            res.send("Noo Fees Record Found !!");
            return;
           }
           res.render('fee-detail', {student, dayjs})
})

router.get('/defaulter-list', defaulterList)



export default router