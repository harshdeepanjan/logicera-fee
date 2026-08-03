 import Student from "../models/student-schema.js"
 import dayjs from "dayjs"
 import mongoose from "mongoose";
import  mongoosePaginate  from 'mongoose-paginate-v2';

export const getStudent = async (req, res) => {

    const { page = 1, limit = 5 } = req.query  // page = "3"

    const options = { page: Number(page), limit: Number(limit) }  //3

    const result = await Student.paginate({isArchived : false}, options)  // [{},{},{}]

    res.render('home', {
        "totalDocs": result.totalDocs,
        "limit": result.limit,
        "totalPages": result.totalPages,
        "currentPage": result.page,
        "pagingCounter": result.pagingCounter,
        "hasPrevPage": result.hasPrevPage,
        "hasNextPage": result.hasNextPage,
        "prevPage": result.prevPage,
        "nextPage": result.nextPage,
        "student": result.docs
    });
}

export const addStudentPage = (req, res) => {
    res.render('create_reg')
};

export const addStudent = async (req, res) => {
    await Student.create(req.body)
    res.redirect('/')                
}

export const viewStudent = async(req,res)=> {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.render('404')
        }

    const student = await Student.findById(req.params.id)
    res.render('view-student', {student, dayjs})
}

export const editStudentPage = async(req,res)=>{
    let paramId  = mongoose.Types.ObjectId.isValid(req.params.id)
    if(!paramId){
        return res.render('404')
    }
   const student = await Student.findById(req.params.id)
   res.render('edit-student', {student})
}
                    
export const editStudent =async(req,res)=>{
   await Student.findByIdAndUpdate(req.params.id, req.body)
   res.redirect('/')
}


const today = new Date();
const msPerDay = 1000 * 60 * 60 * 24;
export const defaulterList = async(req,res) => {
    const student = await Student.find({isArchived : false})
     
   const rows = student.map( c=> {
     const fees =  Array.isArray(c.fees) ? c.fees : [];

    if(fees.length === 0){
        return {
          id :  c._id,
          rollno : c.rollno,
          name : c.sname,
          doj : c.reg_date,
          status : "not_registered",
          course : c.course
        }
    }

   const firstFeeData = fees.reduce((first,second) =>{
            return new Date(first.feeDate) < new Date(second.feeDate) ? first : second; 
        })
    
        const firstFeeDate = new Date(firstFeeData.feeDate);

        const actualPayments = fees.length;

        const daysSinceFirstPayment = Math.floor((today - firstFeeDate)/msPerDay)

        const expectedPayments = Math.floor(daysSinceFirstPayment / 30) + 1

        const lastExpectedPaymentDate = new Date(firstFeeDate);
        lastExpectedPaymentDate.setDate(lastExpectedPaymentDate.getDate()  + actualPayments * 30 )  

        const overdueDays = Math.max(Math.ceil((today - lastExpectedPaymentDate ) / msPerDay),0)

        const status = actualPayments < expectedPayments ? "defaulter" : "ok";

        return{
            _id: c._id,
        rollno: c.rollno,
        name: c.sname,
        course : c.course,
        status,
        firstFeeDate: dayjs(firstFeeDate).format("DD-MMM-YYYY"),
        expectedPayments,
        lastExpectedPaymentDate,
        actualPayments,
        missedPayments: Math.max(0, expectedPayments - actualPayments),
        overdueDays
        }
    })

        const onlyDefaulters = rows.filter(checker => {
            return checker.status === "defaulter" || checker.status === "not_registered";
        })
        
        // res.json(onlyDefaulters)
        res.render('defaulter-list', {onlyDefaulters, dayjs})
        
}

   