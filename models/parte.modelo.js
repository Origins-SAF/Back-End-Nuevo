import { model, Schema } from 'mongoose';

const ParteSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "usuarioModelo",
    },
    fecha: {
      type: String,
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
        totalRecaudado: {
          type: Number,
        },
      }],
      prodmasvendido: {
        type: String,
      },
    }
  ],
    recaudacionTotal: {
      type: Number,
    },
    ubicacion:{
      type: Schema.Types.ObjectId,
      ref: "PuntoModelo",
    },
    estado: {
      type: Boolean,
      default: true
    }
  }
);
 
ParteSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("parteModelo", ParteSchema);