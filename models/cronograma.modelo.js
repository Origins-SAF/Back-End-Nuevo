import { model, Schema } from 'mongoose';

const CronogramaSchema = new Schema(
        {
          detalles: [
            {
              fecha: {
                type: Date,
                  require:true,
              },
              puntos: [
                {
                  puntoNombre:{
                    type: Schema.Types.ObjectId,
                    ref: "PuntoModelo",
                    require: true
                  },
                  nombreConsorcio:{
                    type: String
                  }
                },
              ],
              publicado: {
                type: Boolean,
                default: false
              },
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