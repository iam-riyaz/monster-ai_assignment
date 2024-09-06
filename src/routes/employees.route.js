
import express from 'express';
import * as employeesController from "../controllers/employees.controller.js";


export const employeesRoute= express.Router()

employeesRoute.get("/get", employeesController.getEmployees)