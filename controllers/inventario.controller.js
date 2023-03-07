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

export const obtenerInventarios = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  let query;

  query = {
    estado: true
  };

  try {
    const [total, inventario, detallado] = await Promise.all([
      inventarioModelo.countDocuments(query),
      inventarioModelo.aggregate([
        { $match: query },
        {
          $unwind: "$usuario",
        },
        {
          $lookup: {
            from: "usuarioModelo",
            localField: "proveedor",
            foreignField: "uid",
            as: "proveedor",
          },
        },
        {
          $unwind: "$proveedor",
        },
        {
          $project: {
            _id: 0,
            createdAt: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            productos: [{
              nombre: 1,
              unidad: 1,
              cantidadProducto: 1,
              precio: 1,
              categoria: 1,
              destino: 1,
              img: 1
            }],
            proveedor: "$proveedor.nombre",
            usuario: "$usuario.nombre",
          },
        },
        { $sort: { nombre: 1 } },
        { $skip: parseInt(desde) },
        { $limit: parseInt(limite) },
      ]),
      inventarioModelo.find(query)
        .populate("usuario", "nombre")
        .populate("proveedor", "nombre")
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.json({
      total,
      inventario,
      detallado,
    });
    console.log(inventario)
  } catch (err) {
    console.log("Error al mostrar los productos: ", err);
    res.status(500).json({
      msg: "Por favor, hable con el administrador",
    });
  }
};


// Controlador que almacena un nuevo inventario
export const postInventario = async (req, res) => {
  // Desestructuramos la información recibida del cliente

 const datos = req.body;

 try {
     // Se alamacena el nuevo inventario en la base de datos
     datos.usuario = req.usuario.id
     datos.totalDeProductos = datos.productos.length

     //console.log(datos)
 const inventario = new inventarioModelo(datos);
 await inventario.save() 

 res.json({msg: 'El inventario se guardo correctamente'});
 } catch (error) {
     console.log("Error al crear un inventario: ", error)
 }
}


