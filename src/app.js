import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route.js'
import { errorHandler } from './middleware/errorHandler.middleware.js'

const app = express()

app.use(cors({
    origin:["*"],
    credentials:true
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())


// auth routes middleware 
app.use('/api/v1/auth',authRoutes)

// error handler to handle the error response
app.use(errorHandler)

export default app