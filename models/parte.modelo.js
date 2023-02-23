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
        distribuidor: [ {
          nombre: {
            type: Schema.Types.ObjectId,
            ref: "Distribuidor",
          },
          nota: {
            type: String,
          },
          familiasParticipantes: {
            type: Number,
          },
          stockInicial: {
            type: Number,
          }, 
          stockVendidos: {
            type: Number,
          }, 
          totalRecaudado: {
            type: Number,
          },
          prodmasvendido: {
            type: String,
          },
        }],
        recaudacionTotal: {
          type: Number,
        },
      }
);

 
ParteSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("parteModelo", ParteSchema);