import path from "path";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from "./config/db";

import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import uploadRoutes from './routes/uploadRoutes';

import cookieParser from "cookie-parser";

import {notFound, errorHandler} from "./middleware/errorMiddleware";
import loggerMiddleware from './middleware/loggerMiddleware';

const port = process.env.PORT  || 5000;

connectDB();

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser())

app.use(loggerMiddleware)


app.use('/api/products', productRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}))

app.use("/uploads", express.static(path.join(__dirname, "/dist/uploads")));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
} else {
  app.get('/', (req, res)=> {
    res.send('API is running...')
  })
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, ()=> {
  console.log(`Server running on port ${port}`)
})