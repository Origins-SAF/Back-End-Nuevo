import inventarioModelo from '../models/inventario.modelo.js';


// Devuelve todos los inventarios activas de la colección
export const getInventarios = async (req, res) => {
  try {
    const inventarios = await inventarioModelo.find({estado: true}).populate('usuario',["nombre","apellido","img"]) // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(inventarios);
  } catch (error) {
      console.log("Error al traer los inventarios: ", error)
  }
}


// Controlador que almacena un nuevo inventario
export const postInventario = async (req, res) => {
  // Desestructuramos la información recibida del cliente

 const datos = req.body;


 try {
  datos.usuario = req.usuario._id
  datos.totalDeProductos = datos.productos.length


     // Se alamacena el nuevo inventario en la base de datos
 const inventario = new inventarioModelo(datos);
 await inventario.save() 

 res.json({msg: 'El inventario se guardo correctamente'});
 } catch (error) {
     console.log("Error al crear un inventario: ", error)
 }
}
  
  // Controlador que almacena un nuevo inventario
  export const updateInventario = async (req, res) => {
    const { id } = req.params;
    try {
      // Ejecución normal del programa
      const inventario = await inventarioModelo.findById(id);
      //console.log(publi)
      if (!inventario) return res.status(404).json({ msg: "El Inventario No Existe" });
      
      if (!inventario.estado) return res.status(404).json({ msg: "El Inventario No Existe (desactivado)" });
      const datos = req.body;
        //console.log(id_producto)
      const nuevoInventario = await inventarioModelo.updateOne(
        { "productos._id": req.params.id_producto },
        {
          $set: {
            "productos.$.nombre": datos.nombre,
            "productos.$.unidad": datos.unidad,
            "productos.$.cantidadProducto": datos.cantidadProducto,
            "productos.$.precio": datos.precio,
            "productos.$.destino": datos.destino
          },
        }
      );
      //const inventario2 = await inventarioModelo.findById(id);
      //const nuevo = await inventario.productos.find(productos => productos.id === req.params.id_producto)
      return res.json({
        msg: "Se Modifico correctamente el inventario",
        nuevoInventario
      });
    } catch (error) {
      // Si ocurre un error
      console.log("Error al actualizar el inventario: ", error);
    }
  };
  
  // Cambiar el estado activo de un Inventario (Eliminación lógica)
  export const deleteLogInventario = async (req, res) => {
      const { id } = req.params;
      try {
        const inventario = await inventarioModelo.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
          );
        
          // Respuesta del servidor
          res.json({
            msg: "Inventario eliminado correctamente (lógica)",
            inventario,
          });
      } catch (error) {
        console.log("Error al eliminar de forma logica un Inventario: ", error)
      }
    };
  
  // Cambiar el estado activo de un Inventario (Eliminación lógica)
  export const reactivarLogInventario = async (req, res) => {
      const { id } = req.params;
      try {
        const inventario = await inventarioModelo.findByIdAndUpdate(
            id,
            { estado: true },
            { new: true }
          );
        
          // Respuesta del servidor
          res.json({
            msg: "Inventario reactivado correctamente (lógica)",
            inventario,
          });
      } catch (error) {
        console.log("Error al reactivar de forma logica un Inventario: ", error)
      }
    };
  
  // Controlador para eliminar un Inventario de la BD físicamente
  export const deleteInventario = async (req, res) => {
      const { id } = req.params;
    
      try {
        // Ejecución normal del programa
        await inventarioModelo.findByIdAndDelete(id);
    
        res.json({
          msg: "Inventario eliminado (físicamente) correctamente",
        });
      } catch (error) {
        // Si ocurre un error
        console.log("Error al eliminar el Inventario: ", error);
      }
    };


