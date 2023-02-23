import parteModelo from '../models/parte.modelo.js' ;

// Controlador que almacena un nuevo parte
// CREAR PARTE
export const postParte = async (req, res) => {
    // Desestructuramos la información recibida del cliente
  
   const datos = req.body;
  
   try {
       // Se alamacena el nuevo inventario en la base de datos
   const parte = new parteModelo(datos);
   await parte.save() 
  
   res.json({msg: 'El parte se guardó correctamente'});
   } catch (error) {
       console.log("Error al crear el parte: ", error)
   }
  }

  // Controlador que actualiza un parte
// ACTUALIZAR PARTE
export const putParte = async (req, res = response) => {
    const { id } = req.params;
//    const { usuario, ...data } = req.body;
    const  data  = req.body;
  
    try {
     /*    data.dia;
        data.distribuidor; */
      
    /*     data.usuario = req.usuario._id; */

      const parte = await parteModelo.findByIdAndUpdate(id, data, { new: true });
  
      res.json(parte, {msg: 'El parte se actualizó correctamente'});
    } catch (error) {
        console.log("Error al actualizar el parte: ", error);
    }
  }
