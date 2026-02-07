import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended: true,limit: "16kb"}))
// json files above the limit are rejected
//limits
// Why keep limits?
// If you don’t set limits, attacker can send huge body like 100MB / 1GB and:
// server memory gets overloaded
// app becomes slow/crashes
// DoS attack possible
// So limits protect your server.

app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'




//router declaration
app.use("/api/v1/users", userRouter)

// https://localhost:8000/api/v1/users/register
export {app}