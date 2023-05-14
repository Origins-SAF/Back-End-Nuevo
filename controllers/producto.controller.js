import productoModelo from '../models/producto.modelo.js';
import mongoose from 'mongoose';
import notificacionesModelo from '../models/notificaciones.modelo.js';
import usuarioModelo from '../models/usuario.modelo.js';
import cloudinary from 'cloudinary'

// Devuelve todos los productos activas de la colección
export const getProductos = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
 /*  console.log(limit)
  console.log(skip) */

  try {
      const productos = await productoModelo.find().populate("distribuidor", "nombre") // consulta para todos los documentos
      //const tamano = (await productoModelo.find()).length
      const totalProductos = productos.length
      //console.log(productos)
      
      const productosFiltrados = productos.reverse().slice(skip, skip + limit);

      const pages = [];
      for (let i = 0; i < productos.length; i += limit) {
        const page = i
        pages.push(page);
      }
  
      const totalPages= pages
  // Respuesta del servidor
  res.json({totalPages,totalProductos,productosFiltrados});
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

export const getProductoDistribuidores = async (req, res) => {

    const { id, numPage } = req.params;
    //console.log(numPage)

  try {
      const productos = await productoModelo.find({distribuidor: mongoose.Types.ObjectId(id)}); // consulta para todos los documentos
    
      //console.log(productos)
  // Respuesta del servidor
  const productoUnico = productos[numPage]
  /* 
  if(productoUnico){
   
  }else{
    res.json({ msg: "No hay más Productos" });
  } */
  res.json(productoUnico);
  } catch (error) {
      console.log("Error al traer los productos por distribuidor: ", error)
  }
}

export const getProductoDistribuidoresTodos = async (req, res) => {

    const { id } = req.params;
    //console.log(numPage)

  try {
      const productos = await productoModelo.find({distribuidor: mongoose.Types.ObjectId(id)}); // consulta para todos los documentos
    
      //console.log(productos)
  // Respuesta del servidor

  res.json({cantidadProductos: productos.length});
  } catch (error) {
      console.log("Error al traer los productos por distribuidor: ", error)
  }
}

// Controlador que almacena un nuevo inventario
export const postProducto = async (req, res) => {
  // Desestructuramos la información recibida del cliente


 const usuarios = await usuarioModelo.find({}, 'uid')

 const imgURl = await cloudinary.uploader.upload(req?.file?.path)

 try {
  const datos = {
    ...req.body,
    img: imgURl?.url
  }

     // Se alamacena el nuevo inventario en la base de datos
 const producto = new productoModelo(datos);
 await producto.save() 

 const noti = {}

    noti.descripcion = `Nuevo Producto Registrado (${producto.nombre})`
    noti.tipo = "Producto"
    noti.img = "ti-package"
    noti.color = "bg-warning"

    const userID = []
    for (let i = 0; i < usuarios.length; i++) {
      //console.log()
      const nuevoUser = {
        leido: false,
        idUsuario: usuarios[i]._id
      }
      userID.push(nuevoUser);
    }

    noti.usuarios = userID

    const notificacionNueva = new notificacionesModelo(noti)
    await notificacionNueva.save()

 res.json({msg: 'El producto se guardo correctamente'});
 } catch (error) {
     console.log("Error al crear un producto: ", error)
 }
}

export const reactivarProductoLog = async (req, res) => {
  const { id } = req.params;

  try {
    const productoReactivado = await productoModelo.findByIdAndUpdate(
      id,
      { estado: true },
      { new: true }
    );

    res.json({
      msg: "Producto Reactivado correctamente (lógica)",
      productoReactivado,
    });
  } catch (err) {
    console.log("Error al reactivar el producto: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};

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

//eliminar producto

export const deleteProductos =  async (req, res = response) => {
  const  id = req.params.id;
  
  try {
     
      await productoModelo.findByIdAndDelete(id)

      res.json({
          msg: 'producto eliminado correctamente'
      })
  } catch (error) {
     
      console.log('Error al eliminar producto: ', error)
  }
}