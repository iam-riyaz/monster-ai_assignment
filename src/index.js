import { employeesRoute } from "./routes/employees.route.js"
import {app} from "./utils/server.js"

app.get("/",async(req,res)=>{
    try{
 
        res.status(200).send({message:"route is working fine this is just a test route"})
    }
    catch{

    }
})

app.use("/employees",employeesRoute)
