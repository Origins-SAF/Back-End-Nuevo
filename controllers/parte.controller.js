import { json } from 'express';
import parteModelo from '../models/parte.modelo.js' ;


// Devuelve todos los partes activas de la colección
export const getPartes = async (req, res) => {
    try {
        const partes = await parteModelo.find({estado: true}).populate('distribuidor.stock.producto',['nombre', 'precio']) // consulta para todos los documentos
        

        /* for (var i = 0; i < partes.length; i++) {
            //console.log(partes[i].distribuidor[0].stock)
            const partesDistribuidores = partes[i].distribuidor

            for (var i = 0; i < partesDistribuidores.length; i++) {
                //console.log(partes[i].distribuidor[i].stock)
                const partesStock = partes[i].distribuidor[i].stock
                for (var i = 0; i < partesStock.length; i++) {
                    console.log(partesStock[i])
                }   
            }    
          }
           */
    // Respuesta del servidor
    res.json(partes);
    } catch (error) {
        console.log("Error al traer los partes: ", error)
    }
  }


// Controlador que almacena un nuevo parte
// CREAR PARTE
export const postParte = async (req, res) => {
    // Desestructuramos la información recibida del cliente
  
   const datos = req.body;

   
  
   try {
     // Se alamacena el nuevo inventario en la base de datos
   const parte = new parteModelo(datos);
   await parte.save() 
  
   res.json({msg: 'Se guardo correctamente el parte'});
   } catch (error) {
       console.log("Error al crear el parte: ", error)
   }
  }

  // Controlador que actualiza un parte
// ACTUALIZAR PARTE
export const putParte = async (req, res = response) => {
    const { id } = req.params;
    const { usuario, ...data } = req.body;
  
    try {
        data.dia;
        data.distribuidor;
      
        data.usuario = req.usuario._id;

      const parte = await parteModelo.findByIdAndUpdate(id, data, { new: true });
  
      res.json(parte, {msg: 'El parte se actualizó correctamente'});
    } catch (error) {
        console.log("Error al actualizar el parte: ", error);
    }
  }
