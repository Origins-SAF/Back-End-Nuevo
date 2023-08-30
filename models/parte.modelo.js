import { model, Schema } from 'mongoose';

const ParteSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "usuarioModelo",
      required : true
    },
    fecha: {
      type: Date,
      default: Date.now()
    },
    nroSemana: {
      type: String
    },
    cambioInicial:{
      type: String,
      required : true
    },
    totalEnCaja:{
      type: Number,
      required : true
    },
    distribuidor: [ 
      {
      nombre: {
        type: Schema.Types.ObjectId,
        ref: "distribuidorModelo",
        required : true
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
          required : true
        },
        stockInicial: {
          type: Number,
          required : true
        }, 
        stockFinal: {
          type: Number,
          required : true
        },
        unidadProducto: {
          type: String,
          required : true
        }, 
        precioProducto: {
          type: Number,
          required : true
        }, 
        totalRecaudado: {
          type: Number,
          required : true
        },
        recaudacionRetirada: {
          type: Boolean,
          required : false
        },
      }],
      prodmasvendido: {
        type: Schema.Types.ObjectId,
          ref: "productoModelo",
          required : true
      },
      recaudacionRetirada:{
        type: Boolean,
        default: false
      }
    }
  ],
    recaudacionTotal: {
      type: Number,
      required : true
    },
    ubicacion:{
      type: Schema.Types.ObjectId,
      ref: "PuntoModelo",
      required : true
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