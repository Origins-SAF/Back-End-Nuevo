import parteModelo from "../models/parte.modelo.js";
import _ from "lodash";
import mongoose from 'mongoose';

// Devuelve todos los partes activas de la colección
export const getPartes = async (req, res) => {
  try {
    const partes = await parteModelo
      .find({ estado: true })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", ["nombre", "img", "peso"]);
    // Respuesta del servidor
    res.json(partes);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getPartesSemanales = async (req, res) => {
  try {
    const partes = await parteModelo 
      .find({ estado: true }) // consulta para todos los documentos
      .populate("usuario", ["nombre", "apellido", "img"]) 
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", ["nombre","img","listaInventario","totalEdit","listaParteDia", "peso"])
      .populate('personalEditor', ["nombre", "apellido", "img"])
      .populate("distribuidor.prodmasvendido", ["nombre"]);
    

// Función para ordenar las fechas en formato 'MM/DD/YYYY'
const compararFechas = (a, b) => {
  const fechaA = new Date(a.fechaF);
  const fechaB = new Date(b.fechaF);
  return fechaA - fechaB;
};

// Función para agrupar los datos por semana y fecha
const agruparDatos = (datos) =>
  datos.reduce((agrupado, dato) => {
    const { nroSemana, fecha, mesSemana } = dato;
    let semana = "Semana " + nroSemana + " de " + mesSemana;
    let fechaF = fecha.toLocaleDateString("en-US");
    agrupado[mesSemana] = agrupado[mesSemana] || {};
    agrupado[mesSemana][semana] = agrupado[mesSemana][semana] || {};
    agrupado[mesSemana][semana][fechaF] = agrupado[mesSemana][semana][fechaF] || [];
    agrupado[mesSemana][semana][fechaF].push(dato);
    return agrupado;
  }, {});

// Función para convertir los datos agrupados en el formato deseado
const convertirDatosAFormatoDeseado = (agrupado) =>
  Object.entries(agrupado).map(([mes, semanas]) => ({
    mes,
    semanas: Object.entries(semanas).map(([semana, fechas]) => ({
      semana,
      datos: Object.entries(fechas).map(([fechaF, partes]) => ({
        fechaF,
        partes,
      })).sort(compararFechas), // Ordenar las fechas dentro de cada semana
    })).sort((a, b) => a.semana.localeCompare(b.semana)), // Ordenar las semanas por nombre
  })).sort((a, b) => a.mes.localeCompare(b.mes)); // Ordenar los meses por nombre


// Agrupar los datos por semana y fecha
const datosAgrupados = agruparDatos(partes);

// Convertir los datos agrupados al formato deseado
const partesDatos = convertirDatosAFormatoDeseado(datosAgrupados);

// Función para calcular la suma total de "totalRecaudado" dentro de un mes
const calcularSumaTotalMes = (mes) => {
  let sumaTotalMes = 0;

  for (const semana of mes.semanas) {
    for (const dato of semana.datos) {
      for (const parte of dato.partes) {
        for (const distribuidor of parte.distribuidor) {
          for (const stock of distribuidor.stock) {
            sumaTotalMes += stock.totalRecaudado;
          }
        }
      }
    }
  }

  return sumaTotalMes;
};

// Agregar "recaudacionMes" a cada mes
for (const mes of partesDatos) {
  mes.recaudacionMes = calcularSumaTotalMes(mes);
}

// Función para obtener la fecha más reciente dentro de un mes
const obtenerFechaMasReciente = (mes) => {
  let fechaMasReciente = new Date(0); // Inicializar con la fecha más antigua posible

  for (const semana of mes.semanas) {
    for (const dato of semana.datos) {
      for (const parte of dato.partes) {
        const fechaParte = new Date(parte.fecha);
        if (fechaParte > fechaMasReciente) {
          fechaMasReciente = fechaParte;
        }
      }
    }
  }

  return fechaMasReciente;
};

// Agregar "ultimoRegistro" al mismo nivel que "mes"
for (const mes of partesDatos) {
  mes.ultimoRegistro = obtenerFechaMasReciente(mes);
}

// Función para obtener el producto más vendido dentro de un mes
const obtenerProductoMasVendido = (mes) => {
  const productosContador = {}; // Objeto para contar la frecuencia de cada producto
  
  for (const semana of mes.semanas) {
    for (const dato of semana.datos) {
      for (const parte of dato.partes) {
        for (const distribuidor of parte.distribuidor) {
          if (distribuidor.prodmasvendido) {
            const productoId = distribuidor.prodmasvendido._id;
            productosContador[productoId] = productosContador[productoId] || { producto: distribuidor.prodmasvendido, contador: 0 };
            productosContador[productoId].contador++;
          }
        }
      }
    }
  }

  // Encontrar el producto con la mayor frecuencia
  let productoMasVendido = null;
  let frecuenciaMasAlta = 0;

  for (const productoId in productosContador) {
    if (productosContador[productoId].contador > frecuenciaMasAlta) {
      frecuenciaMasAlta = productosContador[productoId].contador;
      productoMasVendido = productosContador[productoId].producto;
    }
  }

  return productoMasVendido;
};

// Agregar "prodMasVendidoMes" al mismo nivel que "mes"
for (const mes of partesDatos) {
  mes.prodMasVendidoMes = obtenerProductoMasVendido(mes);
}

const totalPage = partes.length;

// Mapear los nombres de los meses a su posición en el año
const mesesEnOrden = {
  "enero": 1,
  "febrero": 2,
  "marzo": 3,
  "abril": 4,
  "mayo": 5,
  "junio": 6,
  "julio": 7,
  "agosto": 8,
  "septiembre": 9,
  "octubre": 10,
  "noviembre": 11,
  "diciembre": 12
};

// Ordena la lista por el atributo "mes" usando el objeto de meses
partesDatos.sort((a, b) => mesesEnOrden[a.mes.toLowerCase()] - mesesEnOrden[b.mes.toLowerCase()]);


/* // Imprime la lista ordenada
partesDatos.forEach(item => console.log(item?.mes)); */
// Función para formatear el atributo "peso" con ceros a la derecha
function formatearPesoConCeros(peso) {
  if (typeof peso === 'number') {
    return peso.toFixed(3); // Asegura que siempre tenga 3 decimales
  }
  return peso; // Si no es un número, no se modifica
}

// Función para calcular el total de kilos vendidos por semana
function calcularTotalKilosVendidosPorSemana(semana) {
  let totalKilosVendidos = 0;

  for (const dato of semana.datos) {
    for (const parte of dato.partes) {
      for (const distribuidor of parte.distribuidor) {
        if (distribuidor.stock) {
          for (const producto of distribuidor.stock) {
            const stockInicial = producto.stockInicial || 0; // Valor por defecto si no está definido
            const stockFinal = producto.stockFinal || 0; // Valor por defecto si no está definido
            const peso = producto.producto.peso || 0; // Valor por defecto si no está definido
            const nombre = producto.producto.nombre
            /* console.log(producto) */
            
              /* console.log(semana.semana)
              console.log("-----------")
              console.log("Producto: ", nombre)
              console.log("Stock Inicial: ",stockInicial)
              console.log("Stock Final: ",stockFinal)
              console.log("Peso: ", peso) */
           
            
            
            // Convertir el peso a kilogramos
            let totalvendido = stockInicial - stockFinal;
            let kilosVendidos
            // Si el peso es un número, convertirlo a kilogramos y sumarlo
            if (typeof peso === 'number') {
              if(peso === 0){
                  kilosVendidos = totalvendido
              } else{
                  kilosVendidos = peso * totalvendido;
              }
            }

            /* console.log("Kilo Vendido: ", kilosVendidos)
              console.log("-----------") */
            /* if(semana.semana = "Semana 2 de octubre"){
              
            } */
            
            totalKilosVendidos += kilosVendidos;
          }
        }
      }
    }
  }

/*   console.log("==============")
  console.log("Semana: ", semana.semana)
  
  console.log("Kilos Vendidos: ", totalKilosVendidos) */
  return totalKilosVendidos;
}

// Recorrer los datos y formatear el peso
for (const mes of partesDatos) {
  for (const semana of mes.semanas) {
    for (const dato of semana.datos) {
      for (const parte of dato.partes) {
        for (const distribuidor of parte.distribuidor) {
          if (distribuidor.stock) {
            for (const producto of distribuidor.stock) {
              producto.peso = formatearPesoConCeros(producto.peso);
            }
          }
        }
      }
    }

    // Calcular el total de kilos vendidos por semana y agregarlo como atributo
    semana.totalKilosVendidosSemanas = calcularTotalKilosVendidosPorSemana(semana);
  }
}

// Función para calcular el total de kilos vendidos por mes
function calcularTotalKilosVendidosPorMes(mes) {
  let totalKilosVendidos = 0;

  for (const semana of mes.semanas) {
    totalKilosVendidos += semana.totalKilosVendidosSemanas || 0; // Asegura que se sume correctamente
  }

  return totalKilosVendidos;
}

// Recorrer los datos y calcular el total de kilos vendidos por mes
for (const mes of partesDatos) {
  mes.totalKilosVendidosMes = calcularTotalKilosVendidosPorMes(mes);
}

// Función para calcular el total de kilos vendidos por parte
function calcularTotalKilosVendidosPorParte(parte) {
  let totalKilosVendidos = 0;
  
  for (const distribuidor of parte.distribuidor) {
    if (distribuidor.stock) {
      for (const producto of distribuidor.stock) {
        const stockInicial = producto.stockInicial || 0; // Valor por defecto si no está definido
        const stockFinal = producto.stockFinal || 0; // Valor por defecto si no está definido
        const peso = producto.producto.peso || 0; // Valor por defecto si no está definido
        const nombre = producto.producto.nombre
        /* console.log(nombre) */
        // Convertir el peso a kilogramos
         // Convertir el peso a kilogramos
         let totalvendido = stockInicial - stockFinal;
         let kilosVendidos
         // Si el peso es un número, convertirlo a kilogramos y sumarlo
         if (typeof peso === 'number') {
           if(peso === 0){
               kilosVendidos = totalvendido
           } else{
               kilosVendidos = peso * totalvendido;
           }
         }

        totalKilosVendidos += kilosVendidos;
      }
    }
  }

  return totalKilosVendidos;
}

// Recorrer los datos y calcular el total de kilos vendidos por parte
for (const mes of partesDatos) {
  for (const semana of mes.semanas) {
    for (const dato of semana.datos) {
      for (const parte of dato.partes) {
        parte.totalKilosVendidosFecha = calcularTotalKilosVendidosPorParte(parte);
      }
    }
  }
}

/* console.log(partesDatos[0].mes[2]) */
    res.json({ totalPage, partesDatos });
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getPartesPorFecha = async (req, res) => {
  const { fechapd } = req.params;
  console.log(fechapd);
  try {
    const partes = await parteModelo
      .find({ fecha: fechapd, estado: true })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio", "tipo"])
      .populate("distribuidor.stock.producto", ["nombre", "img"]);
    // Respuesta del servidor
    res.json(partes);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getPartesPorGrupos = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);

  let fechaInicio;
  let fechaFinal;
  var año = new Date().getFullYear();

  if (req.query.fechaInicio) {
    fechaInicio = new Date(req.query.fechaInicio);
  } else {
    fechaInicio = new Date(`${año}/01/01`);
  }

  if (req.query.fechaFinal) {
    fechaFinal = new Date(req.query.fechaFinal);
  } else {
    fechaFinal = new Date(`${año}/12/31`);
  }

  try {
    const partes = await parteModelo
      .find({
        fecha: {
          $gte: fechaInicio,
          $lt: fechaFinal,
        },
        estado: true,
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
      ])
      .populate("distribuidor.prodmasvendido", ["nombre"]);

    const totalPage = partes.length;

    //console.log(datosParte)

    /*  var nuevoArray = _.chain(partes).groupBy("cambioInicial") */

    const nuevoArray = _.groupBy(partes, function (item) {
      /* console.log(item.fecha) */
      let newFecha = item.fecha.toLocaleDateString("en-US");
      /* console.log(newFecha) */
      return newFecha;
    });

    const datap = Object.keys(nuevoArray).map((date) => {
      return {
        parte_fecha: date,
        datos: nuevoArray[date],
      };
    });

    /* console.log(datap[0].parte_fecha)

    let nuevafecha = new Date(datap[0].parte_fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }); */

    /* console.log(datap[0].parte_fecha)
    console.log(nuevafecha)
    console.log("===================") */

    /* console.log(partesDatos)  */
    let datosRev = datap.reverse();
    let partesDatos = datosRev.slice(skip, skip + limit);

    // Respuesta del servidor
    //console.log(partesDatos.length)
    res.json({ totalPage, partesDatos });
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getPartesPorMes = async (req, res) => {
  let fechaInicio;
  let fechaFinal;
  var año = new Date().getFullYear();

  if (req.query.fechaInicio) {
    fechaInicio = new Date(req.query.fechaInicio);
  } else {
    fechaInicio = new Date(`${año}/01/01`);
  }

  if (req.query.fechaFinal) {
    fechaFinal = new Date(req.query.fechaFinal);
  } else {
    fechaFinal = new Date(`${año}/12/31`);
  }

  const consulta = await parteModelo.find({
    fecha: {
      $gte: fechaInicio,
      $lt: fechaFinal,
    },
  });

  res.json(consulta);
  /* parteModelo.find({
    $expr: {
      $eq: [{ $month: "$fecha" }, mes]
    }
  }, function(err, users) {
    console.log(users);
  }); */
};

// Controlador que almacena un nuevo parte
// CREAR PARTE
export const postParte = async (req, res) => {
  // Desestructuramos la información recibida del cliente

  const datos = req.body;
  datos.usuario = req.usuario._id;

 /*  if(datos.mesSemana == undefined || datos.mesSemana == null){
    datos.mesSemana = fechaDelParte.toLocaleString('default', { month: 'long' })
  } */

  try {
    // Se alamacena el nuevo inventario en la base de datos
    const parte = new parteModelo(datos);
    await parte.save();

    res.json({ msg: "El parte se guardó correctamente" });
  } catch (error) {
    console.log("Error al crear el parte: ", error);
  }
};

// Controlador que actualiza un parte
// ACTUALIZAR PARTE
export const putParte = async (req, res = response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    //console.log(data.fecha)
    data.personalEditor = req.usuario._id;
    //console.log(id)
    await parteModelo.findByIdAndUpdate(id, data, { new: true });

    res.json({ msg: "El parte se actualizó correctamente" });
  } catch (error) {
    console.log("Error al actualizar el parte: ", error);
  }
};


export const CalculosGraficos = async (req, res ) => {

  const parte_dia = req.body;
  try {
    
  
  let datos = parte_dia
  let nuevoArray = []

  for (var i = 0; i < datos?.length; i++) {
    let obj = datos[i]
    for (var x= 0; x < obj?.partes?.length; x++) {
      let objParte = obj?.partes[x]
      nuevoArray.push(objParte)
   }
 }

 let cambioInicialTotal = 0
 let distribuidoresTotal
 let mesParte = nuevoArray[0]?.mesSemana
 let semanaParte = nuevoArray[0]?.nroSemana
 let alerta = false
 let recaudacionGeneral = 0
 let totalEnCajaGeneral = 0



  for (var x= 0; x < nuevoArray?.length; x++) {
     let fecha = fechaTexto(nuevoArray[x]?.fecha)
      if(nuevoArray[i]?.nroSemana != semanaParte){
        alerta = true
          console.log("El Parte es de " + nuevoArray[i]?.mesSemana + " y de la semana " + nuevoArray[i]?.nroSemana)
      }
      if(nuevoArray[i]?.mesSemana != mesParte){
        alerta = true
        console.log("El Parte es de " + nuevoArray[i]?.mesSemana + " y de la semana " + nuevoArray[i]?.nroSemana)
      }

      recaudacionGeneral = recaudacionGeneral + nuevoArray[x]?.recaudacionTotal
      totalEnCajaGeneral = totalEnCajaGeneral + nuevoArray[x]?.totalEnCaja
      
    }
    
  let recFinal = 0;
    /*  console.log(datosPunto?.distribuidor) */
    for (let a = 0; a < nuevoArray.length; a++) {
           let listaArray = nuevoArray[a]?.distribuidor
      for (let i = 0; i < listaArray?.length; i++) {      
        let listaS = listaArray[i].stock;
     /*    console.log(nuevoArray) */    
          for (let x = 0; x < listaS.length; x++) {        
            recFinal = recFinal + listaS[x].totalRecaudado;
          }
   }
    }

    // Crear un nuevo array con la sumatoria de 'recaudacionTotal' por fecha
const nuevoArray2 = datos.map(item => {
  const recaudacionTotalSumatoria = item.partes.reduce((acumulador, parte) => acumulador + parte.recaudacionTotal, 0);
  return {
    fechaF: item.fechaF,
    partes: [
      {
        recaudacionTotal: recaudacionTotalSumatoria
      }
    ]
  };
});


let labelsGrafico = []
let dataGrafico = []
for (var x= 0; x < nuevoArray2?.length; x++) {
  /* console.log(nuevoArray2[x]?.partes[0]?.recaudacionTotal) */
  let fechaText = fechaTexto(nuevoArray2[x]?.fechaF)
  labelsGrafico.push(fechaText)

  dataGrafico.push(nuevoArray2[x]?.partes[0]?.recaudacionTotal)
 }
/* 
 console.log(dataGrafico) */
    
    const myData = [
        { 
          labels:labelsGrafico,
          data: dataGrafico,
        },
    ];


    let objGeneral ={
     alertaSemana: alerta,
     mesSemana: mesParte,
     nroSemana: semanaParte,
     recaudacionTotal: recaudacionGeneral,
     totalEnCaja: totalEnCajaGeneral,
     recaudacionFinal: recFinal,
     dataGrafico : myData
    }

   


    //Grafico

   
    res.json(objGeneral);

  } catch (error) {
    
  }
}

export const guardarKilosVendidosParte = async (req, res) => {

  let idProducto = req.body.producto;
  let idDistribuidor = req.body.distribuidor;
  let kilosVendidos = req.body.kilos;
  const {idParte} = req.params;
/* 
  console.log(idProducto, kilosVendidos, idParte) */

  try {
    const parte = await parteModelo.findById(idParte).populate("distribuidor.stock.producto", ["nombre","peso"]);
    
    const distribuidores = parte?.distribuidor

    // Filtrar el array de objetos por ID
    console.log(mongoose.Types.ObjectId(idDistribuidor))
    console.log(distribuidores[0].nombre)


    let productos = distribuidores.filter(obj => obj.nombre ==  mongoose.Types.ObjectId(idDistribuidor));
    // Respuesta del servidor
    res.json(productos);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};
