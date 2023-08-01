import productoConsorcioModelo from '../models/productosConsorcio.modelo.js';

// Devuelve todos los productos de la colección
export const getVerduras = async (req, res) => {
  try {
      const productos = await productoConsorcioModelo.find({estado: true}) // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json(productos);
  } catch (error) {
      console.log("Error al traer los productos: ", error)
  }
}

export const postProductosVerduras = async (req, res) => {
    // Desestructuramos la información recibida del cliente
  
   const datos = req.body;

   try {
       // Se alamacena el nuevo producto en la base de datos
   const producto = new productoConsorcioModelo(datos);
   await producto.save() 

  
  
  
   
   res.json({msg: 'El producto se guardo correctamente'});
   } catch (error) {
       console.log("Error al crear un producto: ", error)
   }
  }