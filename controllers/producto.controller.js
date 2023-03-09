import productoModelo from '../models/producto.modelo.js';


// Devuelve todos los productos activas de la colección
export const getProductos = async (req, res) => {
  try {
      const productos = await productoModelo.find({estado: true}) .populate("distribuidor", "nombre") // consulta para todos los documentos
  
  // Respuesta del servidor
  res.json({productos});
  } catch (error) {
      console.log("Error al traer los productos: ", error)
  }
}

export const getProducto = async (req, res = response) => {
    const { id } = req.params;
  
    try {
      const producto = await productoModelo.findById(id).populate("distribuidor", "nombre")
  
      res.json(producto);
    } catch (err) {
      console.log("Error al mostrar el producto: ", err);
      res.status(500).json({
        msg: "Por favor, hable con el administrador",
      });
    }
  };


// Controlador que almacena un nuevo inventario
export const postProducto = async (req, res) => {
  // Desestructuramos la información recibida del cliente

 const datos = req.body;

 try {
     // Se alamacena el nuevo inventario en la base de datos
 const producto = new productoModelo(datos);
 await producto.save() 

 res.json({msg: 'El producto se guardo correctamente'});
 } catch (error) {
     console.log("Error al crear un producto: ", error)
 }
}

//actualizar usuario

export const putProductos =  async (req, res = response) => {
    const { id } = req.params;
    const { estado, ...data } = req.body;
  
    data.nombre = data.nombre.toUpperCase();
    
  
    try {
      const producto = await productoModelo.findByIdAndUpdate(id, data, { new: true });
  
      res.json(producto);
    } catch (err) {
      console.log("Error al actualizar el punto: ", err);
      res.status(500).json({
        msg: "Por favor, hable con el administrador",
      });
    }
  };

/* export const putProductos = async (req, res) => {

    const {
        id
    } = req.params;
    
    const {
        _id,
        ...resto
    } = req.body;


    

    try {

        

        const producto = await productoModelo.findByIdAndUpdate(id, resto, {
            new: true
        });

        
        res.json({
            msg: 'Datos del usuario actualizados exitosamente',
            producto
        });



    } catch (error) {
        console.log('Error al actualizar los datos del usuario: ', error);
    }

}; */