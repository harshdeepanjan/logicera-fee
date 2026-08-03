import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const feeSchema = mongoose.Schema({
    feeDate : {
        type : Date
    },
    feeAmount : {
        type : Number
    },
    comment : {
        type : String,
        default : ''
    }
})

const studentSchema = mongoose.Schema({
    sname : {
        type : String,
        required : true,
        trim : true
    },
    rollno :{   
        type : Number,
        unique :  true,
        default : null,
        required : true
    },
    reg_date: {
        type : Date,
        default : new Date()
    },
    mno : {
        type : String
    },
    address : {
        type : String
    },
    course : {
        type : String
    },

    isArchived : {
        type : Boolean,
        default : false
    },
    fees : {
        type : [feeSchema],
        default : [],
    }
})

studentSchema.plugin(mongoosePaginate)

const Student  = mongoose.model('abhishekschool',studentSchema)

export default Student

