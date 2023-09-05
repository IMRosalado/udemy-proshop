import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from "./config/db";

import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';

import cookieParser from "cookie-parser";

import {notFound, errorHandler} from "./middleware/errorMiddleware";
import { PAYPAL_URL } from '../frontend/src/constants';
const port = process.env.PORT  || 5000;

connectDB();

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser())

app.get('/', (req, res)=> {
  res.send('API is running...')
})

app.use('/api/products', productRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}))

app.use(notFound);
app.use(errorHandler);

app.listen(port, ()=> {
  console.log(`Server running on port ${port}`)
})