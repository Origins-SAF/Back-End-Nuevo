import productoModelo from '../models/producto.modelo.js';
import mongoose from 'mongoose';
import notificacionesModelo from '../models/notificaciones.modelo.js';
import usuarioModelo from '../models/usuario.modelo.js';
import cloudinary from 'cloudinary'



// Devuelve todos los productos publicado de la colección
export const getProductosPublicados = async (req, res) => {
  

  try {
      const productos = await productoModelo.find({publicado: true}).populate("distribuidor", "nombre") // consulta para todos los documentos
   
      
      const productosFiltrados = productos.reverse()

      // Función para agregar ceros a la derecha de un Decimal128
function agregarCerosADerecha(decimal, cantidadCeros) {
  // Convierte el Decimal128 a una cadena de texto y agrega ceros
  const valorDecimal = decimal.toString();
  const partes = valorDecimal.split('.');
  if (partes.length === 1) {
    // Si no hay parte decimal, agrega la cantidad deseada de ceros
    return valorDecimal + '.' + '0'.repeat(cantidadCeros);
  } else {
    // Si hay una parte decimal, agrega ceros a la parte decimal
    return valorDecimal + '0'.repeat(cantidadCeros - partes[1].length);
  }
}

// Itera sobre los productos y agrega ceros a los valores Decimal128
const productosConCeros = productos.map(producto => {
  return {
    nombre: producto.nombre,
    // Agrega ceros a la derecha del campo Decimal128
    campoDecimal: agregarCerosADerecha(producto.peso, 3) // 2 es la cantidad deseada de ceros
  };
});

// Ahora, productosConCeros contendrá los valores Decimal128 con ceros a la derecha.

    
      // Respuesta del servidor
      res.json(productosConCeros);
  } catch (error) {
      console.log("Error al traer los productos: ", error)
  }
}

// Devuelve todos los productos activas de la colección
export const getProductos = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  const filtro = req.query.filtroProductos;
  
/*   console.log(filtro) */

  try {
      let productos 
      if(filtro){
        productos = await productoModelo.find({distribuidor: mongoose.Types.ObjectId(filtro)}).populate("distribuidor", "nombre") 
      }
      else{
        productos = await productoModelo.find().populate("distribuidor", "nombre") // consulta para todos los documentos
      }
      //const tamano = (await productoModelo.find()).length
      const totalProductos = productos.length
      //console.log(productos)
      
      const productosFiltrados = productos.reverse().slice(skip, skip + limit);

      const pages = [];
      if(limit != 1){
        for (let i = 0; i < productos.length; i += limit) {
          const page = i
          pages.push(page);
        }
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
      const productos = await productoModelo.find({distribuidor: mongoose.Types.ObjectId(id), listaParteDia: true}); // consulta para todos los documentos
    
      //console.log(productos)
  // Respuesta del servidor
    const cantidadProductos = productos.length
  res.json({cantidadProductos, productos});
  } catch (error) {
      console.log("Error al traer los productos por distribuidor: ", error)
  }
}

// Controlador que almacena un nuevo inventario
export const postProducto = async (req, res) => {
  // Desestructuramos la información recibida del cliente


 const usuarios = await usuarioModelo.find({}, 'uid')

 let imgURl;

 if(req?.file?.path){
   imgURl = await cloudinary.uploader.upload(req?.file?.path)
 }else {
   imgURl = req?.body?.linkIMG
 }

 try {
  const datos = {
    ...req.body,
    img: imgURl?.url ? imgURl?.url : imgURl,
    config:  JSON.parse(req?.body?.config),
    puntosDeVenta: JSON.parse(req?.body?.puntosDeVenta)
  }
//console.log(req.body.config)
     // Se alamacena el nuevo inventario en la base de datos
 //console.log(datos)
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

export const publicacionProducto = async (req, res) => {
    const { id } = req.params;
    const valor = req.body.publicado
  
    const data = !valor
  try {
      const productoPublicado = await productoModelo.findByIdAndUpdate(
        id,
        { publicado: data },
        { new: true }
      );
  
      res.json({
        msg: "Producto Actualizado Correctamente (Publicacion)",
        productoPublicado,
      });
    } catch (err) {
      console.log("Error al actualizar el punto: ", err);
      res.status(500).json({
        msg: "Por favor, hable con el administrador",
      });
    }
  };

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

export const putProductos =  async (req, res ) => {
  const { id } = req.params;
  //console.log(req.body)
  //console.log(req.body.nombre)
  let imgURl;

  if(req?.file?.path){
    imgURl = await cloudinary.uploader.upload(req?.file?.path)
  }else {
    imgURl = req?.body?.image
  }
    
    //console.log(imgURl)
  const data = {
    ...req.body,
    img: imgURl?.url ? imgURl?.url : imgURl,
    config:  JSON.parse(req?.body?.config),
    puntosDeVenta: JSON.parse(req?.body?.puntosDeVenta)
  }

  
  //console.log(data)

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