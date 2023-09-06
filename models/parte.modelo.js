import { model, Schema } from 'mongoose';

const ParteSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "usuarioModelo",
    },
    fecha: {
      type: Date,
      default: Date.now()
    },
    nroSemana: {
      type: String
    },
    mesSemana: {
      type: String
    },
    cambioInicial:{
      type: String,
    },
    totalEnCaja:{
      type: Number,
    },
    distribuidor: [ 
      {
      nombre: {
        type: Schema.Types.ObjectId,
        ref: "distribuidorModelo",
      },
      nota: {
        type: String,
      },
      familiasParticipantes: {
        type: Number,
      },
      stock: [{
        producto: {
          type: Schema.Types.ObjectId,
          ref: "productoModelo",
        },
        stockInicial: {
          type: Number,
        }, 
        stockFinal: {
          type: Number,
        },
        unidadProducto: {
          type: String,
        }, 
        precioProducto: {
          type: Number,
        }, 
        totalRecaudado: {
          type: Number,
        },
        recaudacionRetirada: {
          type: Boolean,
        },
      }],
      prodmasvendido: {
        type: Schema.Types.ObjectId,
          ref: "productoModelo",
      },
      recaudacionRetirada:{
        type: Boolean,
        default: false
      }
    }
  ],
    recaudacionTotal: {
      type: Number,
    },
    ubicacion:{
      type: Schema.Types.ObjectId,
      ref: "PuntoModelo",
      
    },
    personalEditor:{
      type: Schema.Types.ObjectId,
      ref: "usuarioModelo",
    },
    estado: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
 
ParteSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("parteModelo", ParteSchema);