import { Mongoose } from "mongoose"
import { Employees } from "../models/employees.model.js"

export const getEmployees=async ({skip,pageSize})=>{

    const result= await Employees.find({}).skip(skip).limit(pageSize)
    return result


}