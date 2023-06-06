import { model, Schema } from 'mongoose';

const ConvocadosSchema = new Schema(
        {
        fecha:{
            type: Date,
            require: true
        },
        punto:{
          type: Schema.Types.ObjectId,
          ref: "PuntoModelo"
        },
         lista:[
            {
                nombreCompleto: {
                    type: String,
                  },
                  funcion:{
                    type: String,
                  },
                  asistencia:[
                    {
                        presente:{
                            type: Boolean,
                            default: false
                        },
                        tardanza:{
                            type: Boolean,
                            default: false
                        },
                        falta:{
                            type: Boolean,
                            default: false
                        },
                        horaDeLlegada:{
                            type: String
                        }
                    }
                  ]
            }
         ],
         vigente:{
          type: Boolean,
          default: true
         },
          estado: {
            type: Boolean,
            default: true
          },
        }
      );

 
ConvocadosSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("convocadoModelo", ConvocadosSchema);