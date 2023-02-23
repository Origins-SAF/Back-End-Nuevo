//Requerimos la libreria mongoose
import mongoose from "mongoose";
// 

//Ejecutamos la conexion a la BD
//Llamamos al método .connect de mongoose
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
       await mongoose.connect(process.env.ATLAS, {useNewUrlParser : true,/*  useCreateIndex: true */})
       mongoose.set('strictQuery', false);
       console.log(' Se establecio conexion con la base de datos ')
    } catch (err) {
       console.error(err.message)
       process.exit(1)
    }
 }
 
export default connectDB