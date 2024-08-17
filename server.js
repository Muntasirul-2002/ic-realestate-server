import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import authRoute from './routes/authRoute.js'
import { connectDB } from './config/db.js';

dotenv.config();
const app = express()
const port = 8080


app.use(express.json())
app.get('/', (req,res)=>{
    res.send("Welcome to the myhome server")
})
//DB connection
connectDB()
//routers 
app.use('/api/v1/auth', authRoute)
app.listen(port,()=>{
    console.log(` server listening on ${port}`)
})