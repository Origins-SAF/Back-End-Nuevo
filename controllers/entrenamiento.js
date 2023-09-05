import entrenamientoModelo from '../models/entrenamiento.js';
import productoModelo from '../models/producto.modelo.js';
import distribuidorModelo from '../models/distribuidor.modelo.js';
import mongoose from 'mongoose';

export const getEntrenamiento = async (req, res) => {
    try {
        const entr = await entrenamientoModelo.find() // consulta para todos los documentos
    
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

        let dis = await distribuidorModelo.find({_id: mongoose.Types.ObjectId(idProducto)})
          
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

    for (let i = 0; i < listaProductosDis.length; i++) {
      datos = listaProductosDis[i];

      var listaFecha;
      var listaC = {};

   
      if (listaFecha !== datos.distribuidor[0].nombre) {
      
        listaFecha = datos.distribuidor[0].nombre;
        
        listaC.nombreDistribuidor = datos.distribuidor[0].nombre;

        
        listaC.datos = listaProductosDis.filter(
          (item) =>
            item.distribuidor[0].nombre === listaFecha
        );

        convocadosArrayList.push(listaC);
      }
    }

     

   let nl = 
    {
      lista: convocadosArrayList
    }
   

   const entrenamiento = new entrenamientoModelo(nl);
   await entrenamiento.save() 

   /* console.log() */
   
   res.json({msg: "Se Creo La Listaaaa!!!!!!!", entrenamiento});
   } catch (error) {
       console.log("Error al crear un entrenamiento: ", error)
   }
}

export const putEntrenamiento = async (req, res) => {
  const { id } = req.params;
  console.log(id)

  try {
    const data = req.body;
   /*  console.log(data) */
    let me = await entrenamientoModelo.findByIdAndUpdate(id, data, { new: true });
    /* console.log(me) */

    res.json({ msg: "Se Actualizo la planilla", data, me });

  } catch (err) {
    console.log("Error al actualizar la planilla: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};