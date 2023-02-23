import express from "express";
// import bodyParser from "body-parser";
import mongoose from "mongoose";
 import { MONGO_DB_URI, PORT } from "./config/configue.js";
 import userRouter from './Routers/userRouter.js';
 import dayoffRouter from './Routers/dayoffRouter.js';
 import swaggerJSDoc from "swagger-jsdoc";
 import swaggerUi from "swagger-ui-express"
import cors from 'cors';
import morgan from "morgan";
import { readFileSync } from "fs";
const swaggerDocument = JSON.parse(readFileSync("./swagger.json"));
const app = express()


app.use('/api-swagger', swaggerUi.serve,  swaggerUi.setup(swaggerDocument)
);

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.get('/', (req,res)=>{
    res.send('Gestion des emploiyee')
  });
// Conecter MongoDB
mongoose.connect(MONGO_DB_URI,() => {
    console.log("Connected to MongoDB");
  });


app.use(express.json())

  app.use(cors({origin:"*"}))
  app.use(morgan('tiny'))
  // Create My Router 
app.use(userRouter)
app.use(dayoffRouter)
/*create new PORT*/
const port = PORT || 5000
app.listen(port , ()=>{
    console.log(`server is running at http://localhost:${port}`)
})

