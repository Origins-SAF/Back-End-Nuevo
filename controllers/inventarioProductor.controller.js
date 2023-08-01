import inventarioProductorModelo from "../models/inventarioProductor.modelo.js";

// Devuelve todos los inventarios activas de la colección
export const getInventariosProductor = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);

  try {
    const inventarios = await inventarioProductorModelo
      .find({ estado: true })
      .populate("usuario", ["nombre", "apellido", "img"])
      .populate("destino", ["barrio", "nombre"]); // consulta para todos los documentos

    const totalPage = inventarios.length;
    //console.log(productos)
    const inventarioFiltrados = inventarios.slice(skip, skip + limit);

    // Respuesta del servidor
    res.json({ totalPage, inventarioFiltrados });
  } catch (error) {
    console.log("Error al traer los inventarios: ", error);
  }
};
export const getInventariosProductorDesactivados = async (req, res) => {
  try {
    const inventarios = await inventarioProductorModelo.find({ estado: false }); // consulta para todos los documentos

    // Respuesta del servidor
    res.json(inventarios);
  } catch (error) {
    console.log("Error al traer los inventarios: ", error);
  }
};

export const getInventarioProductorUnico = async (req, res) => {
  const { id } = req.params;
  try {
    const inventarios = await inventarioProductorModelo
      .findById(id)
      .populate("usuario", ["nombre", "apellido", "img"])
      .populate("productos.destino", ["barrio", "nombre"]); // consulta para todos los documentos

    // Respuesta del servidor
    res.json(inventarios);
  } catch (error) {
    console.log("Error al traer los inventarios: ", error);
  }
};

// Controlador que almacena un nuevo inventario
export const postInventarioProductor = async (req, res) => {
  // Desestructuramos la información recibida del cliente

  const datos = req.body;

  try {
    datos.usuario = req.usuario._id;

    datos.totalDeProductos = datos.productos.length;

    console.log(datos);

    // Se alamacena el nuevo inventario en la base de datos
    const inventario = new inventarioProductorModelo(datos);
    await inventario.save();

    res.json({ msg: "El inventario se guardo correctamente" });
  } catch (error) {
    console.log("Error al crear un inventario: ", error);
  }
};

// Controlador que almacena un nuevo inventario
export const updateInventarioProductor = async (req, res) => {
  const { id } = req.params;
  try {
    // Ejecución normal del programa
    const inventario = await inventarioProductorModelo.findById(id);
    //console.log(publi)
    if (!inventario)
      return res.status(404).json({ msg: "El Inventario No Existe" });

    if (!inventario.estado)
      return res
        .status(404)
        .json({ msg: "El Inventario No Existe (desactivado)" });
    const datos = req.body;
    //console.log(id_producto)
    const nuevoInventario = await inventarioProductorModelo.updateOne(
      { "productos._id": req.params.id_producto },
      {
        $set: {
          "productos.$.nombre": datos.nombre,
          "productos.$.cantidadProducto": datos.cantidadProducto,
          "productos.$.precio": datos.precio,
        },
      }
    );
    //const inventario2 = await inventarioProductorModelo.findById(id);
    //const nuevo = await inventario.productos.find(productos => productos.id === req.params.id_producto)
    return res.json({
      msg: "Se Modifico correctamente el inventario",
      nuevoInventario,
    });
  } catch (error) {
    // Si ocurre un error
    console.log("Error al actualizar el inventario: ", error);
  }
};

// Cambiar el estado activo de un Inventario (Eliminación lógica)
export const deleteLogInventarioProductor = async (req, res) => {
  const { id } = req.params;
  try {
    const inventario = await inventarioProductorModelo.findByIdAndUpdate(
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
    console.log("Error al eliminar de forma logica un Inventario: ", error);
  }
};

// Cambiar el estado activo de un Inventario (Eliminación lógica)
export const reactivarLogInventarioProductor = async (req, res) => {
  const { id } = req.params;
  try {
    const inventario = await inventarioProductorModelo.findByIdAndUpdate(
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
    console.log("Error al reactivar de forma logica un Inventario: ", error);
  }
};

// Controlador para eliminar un Inventario de la BD físicamente
export const deleteInventarioProductor = async (req, res) => {
  const { id } = req.params;

  try {
    // Ejecución normal del programa
    await inventarioProductorModelo.findByIdAndDelete(id);

    res.json({
      msg: "Inventario eliminado (físicamente) correctamente",
    });
  } catch (error) {
    // Si ocurre un error
    console.log("Error al eliminar el Inventario: ", error);
  }
};
