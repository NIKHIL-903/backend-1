//require('dotenv').config()

import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path: './env'
})
// ( ()=> { console.log("Hi I am IIFE")})()

connectDB()

/*
1st approach

import express from "express"
import mongoose from "mongoose"
import { DB_NAME } from "./constants"
import connectDB from "./db"
const app =express()
( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error",(error)=> {
            console.log("ERROR",error);
            throw error
        })

        app.listen(process.env.PORT, ()=> {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    }catch( error) {
        console.log("ERROR : ",error)
        throw error
    }
})()
*/