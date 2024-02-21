import parteModelo from "../models/parte.modelo.js";

export const getKilosVendidosSemana = async (req, res) => {
  let mesPartes = req.query.mes;
  let semanaPartes = req.query.semana;
  let añoPartes = parseInt(req.query.ano);

  try {
    const partes = await parteModelo
      .find({
        fecha: {
          // Crear un rango de fechas para el año específico
          $gte: new Date(añoPartes, 0, 1), // Primer día del año
          $lt: new Date(añoPartes + 1, 0, 1), // Primer día del siguiente año
        },
        mesSemana: mesPartes,
        estado: true,
        nroSemana: semanaPartes,
      })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", [
        "nombre",
        "img",
        "listaInventario",
        "totalEdit",
        "listaParteDia",
        "peso",
      ])
      .populate("distribuidor.prodmasvendido", ["nombre"]);

    const productosVendidos = {};

    partes.forEach((venta) => {
      venta.distribuidor.forEach((distribuidor) => {
        distribuidor.stock.forEach((producto) => {
          const nombreProducto = producto.producto.nombre;
          const kilosVendidos = producto.kilosVendidos;

          if (productosVendidos[nombreProducto]) {
            productosVendidos[nombreProducto] += kilosVendidos;
          } else {
            productosVendidos[nombreProducto] = kilosVendidos;
          }
        });
      });
    });

    const arrayProductosVendidos = Object.keys(productosVendidos).map(
      (nombreProducto) => {
        return {
          nombreProducto,
          kilosVendidos: productosVendidos[nombreProducto],
        };
      }
    );

    /* console.log(arrayProductosVendidos); */

    // Respuesta del servidor
    res.json(arrayProductosVendidos);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};
