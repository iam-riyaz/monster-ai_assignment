import mongoose from "mongoose";

export const employeesSchema= new mongoose.Schema({
    first_name:{type:String,},
    last_name:{type:String,},
    email:{type:String,},
    date_of_birth:{type:String},
    department:{type:String}
    
})

export const Employees = mongoose.model("employee",employeesSchema)