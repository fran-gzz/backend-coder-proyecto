import express from 'express'
import compression from 'express-compression'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express()

// Configuraciones 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors())
app.use(compression({
    brotli: { enabled: true, zlib: {}}
}))

export default app;