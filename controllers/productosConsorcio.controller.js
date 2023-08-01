import productoConsorcioModelo from '../models/productosConsorcio.modelo.js';

// Devuelve todos los productos de la colección
export const getVerduras = async (req, res) => {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

  try {
      const productos = await productoConsorcioModelo.find({estado: true}) // consulta para todos los documentos
  
      const totalPage = productos.length
      //console.log(productos)
      const productosVFiltrados = productos.slice(skip, skip + limit);

   // Respuesta del servidor
   res.json({totalPage, productosVFiltrados});
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