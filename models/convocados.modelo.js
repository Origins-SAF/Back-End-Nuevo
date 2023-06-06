import { model, Schema } from 'mongoose';

const ConvocadosSchema = new Schema(
        {
        fecha:{
            type: Date,
            require: true
        },
         lista:[
            {
                nombreCompleto: {
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
                  ],
                  convocado: {
                    type: Boolean,
                    default: false
                  }
            }
         ],
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