import entrenamientoModelo from '../models/entrenamiento.js';
import productoModelo from '../models/producto.modelo.js';
import distribuidorModelo from '../models/distribuidor.modelo.js';
import mongoose from 'mongoose';

export const getEntrenamiento = async (req, res) => {
    try {
        const entr = await entrenamientoModelo.find({estado: true}) // consulta para todos los documentos
    
    // Respuesta del servidor
    res.json(entr);
    } catch (error) {
        console.log("Error al traer los datos: ", error)
    }
  }

export const postEntrenamiento = async (req, res) => {
    // Desestructuramos la información recibida del cliente
  
   /* const datos = req.body; */
   const productos = await productoModelo.find({estado: true})
   const distribuidores = await distribuidorModelo.find({estado: true})
   try {
       
   /* const entrenamiento = new entrenamientoModelo(datos);
   await entrenamiento.save()  */
   let listaProductos = []

   for (let i = 0; i < productos.length; i++) {
    let id = productos[i]?.uid
    let nombre = productos[i]?.nombre
    let peso = productos[i]?.peso
    let obj = {
      producto: id,
      nombre: nombre,
      peso: peso
    }
    listaProductos.push(obj);
    }

    let listaProductosDis = []

    /* mongoose.Types.ObjectId(filtro) */

    for (let i = 0; i < productos.length; i++) {
        let idProducto = productos[i]?.distribuidor
        let nombre = productos[i]?.nombre
        let peso = productos[i]?.peso

        let dis = distribuidores.filter((item) => item._id == idProducto
          );
        let obj = {
            producto: idProducto,
            nombre: nombre,
            peso: peso || 0,
            distribuidor: dis
          }

          listaProductosDis.push(obj);
    }

  var datos;
var convocadosArrayList = [];
/* 
    for (let i = 0; i < productos.length; i++) {
      datos = productos[i];

      var listaFecha;
      var listaC = {};

   
      if (listaFecha !== datos.fecha.toLocaleDateString("es-ES")) {
      
        listaFecha = datos.fecha.toLocaleDateString("es-ES");
        
        listaC.fecha_convocados = datos.fecha;

        
        listaC.datos = listaConvocados.filter(
          (item) =>
            item.fecha.toLocaleDateString("es-ES") === listaFecha &&
            item.vigente == true
        );

        convocadosArrayList.push(listaC);
      }
    } */
   
   res.json({listaProductosDis});
   } catch (error) {
       console.log("Error al crear un entrenamiento: ", error)
   }
}

export const putEntrenamiento = async (req, res) => {
    // Desestructuramos la información recibida del cliente
  
   const datos = req.body;
   
   try {
       
   const entrenamiento = new entrenamientoModelo(datos);
   await entrenamiento.save() 
  
  
   
   res.json({msg: 'El entrenamiento se guardo correctamente'});
   } catch (error) {
       console.log("Error al crear un entrenamiento: ", error)
   }
}