
import { Employees } from "../models/employees.model.js"
import * as employeesService from "../services/employees.services.js"

export const getEmployees= async(req,res)=>{

    try{

        const {page}= req.body || "1"
        const {pageSize}= req.body || "5"
        const skip=  (page-1)*pageSize
    
        
        const totalPages = Math.ceil((await Employees.find().countDocuments()) / pageSize);
        const employees= await employeesService.getEmployees({skip,pageSize})

        res.status(200).send({
            success: true,
            data:{employees},
            total_pages:totalPages
        })


    }
    catch{
        res.status(400).send("error occurred while getting employees")

    }

}