import { model, Schema } from 'mongoose';

const CronogramaSchema = new Schema(
        {
          Puntos: [
            {
            fecha: {
                    type: Date,
                    require:true,
                },
              puntoNombre:{
                type: Schema.Types.ObjectId,
                ref: "PuntoModelo",
                require: true
              },
              nombreConsorcio:{
                type: String
              }
            }
          ],
          estado: {
            type: Boolean,
            default: true
          },
        }
      );

 
CronogramaSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("cronogramaModelo", CronogramaSchema);