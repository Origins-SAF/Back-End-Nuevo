import express from 'express'
import cors from 'cors'
import morgan from "morgan";
import "dotenv/config.js";
import connectDB from './config/db.js'
import { rutas } from './routes/index.js'


//conectamos a db
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

//iniciamos el mware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(morgan("dev"));

const whiteList = [
   "http://localhost:5173", 
   "http://admin.soberaniaalimentariafsa.com",
   "https://soberaniaalimentariafsa.com"
];

const corsOptions =  {
   origin: function(origin, callback){
      if(whiteList.indexOf(origin) !== -1 || !origin){
         callback(null, true);
      } else {
         callback(new Error("Not allowed by CORS"));
      }
   }
}
app.use(cors(corsOptions))



// RUTAS
app.use("/api", rutas());

app.listen(PORT , () => {
   console.log(`servidor iniciado en el puerto: ${PORT}`)
})
