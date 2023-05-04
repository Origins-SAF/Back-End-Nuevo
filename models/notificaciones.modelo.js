import { model, Schema } from 'mongoose';

const NotificacionSchema = new Schema(
        {
          descripcion: {
            type: String,
          },
          tipo:{
            type: String,
          },
          img:{
            type: String,
          },
          usuarios:[
            {
              idUsuario:{
                type: Schema.Types.ObjectId,
                ref: "usuarioModelo",
              },
              leido: {
                type: Boolean,
                default: false
              },
            }
          ]
        }
      );

 
NotificacionSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("notificacionModelo", NotificacionSchema);