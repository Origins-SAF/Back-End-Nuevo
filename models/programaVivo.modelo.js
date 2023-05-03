import { model, Schema } from 'mongoose';

const ProgramaSchema = new Schema(
        {
          titulo: {
            type: String,
          },
          fecha: {
            type: Date,
          },
          vivo: {
            type: Boolean,
            default: false
          },
          video:{
            type: String,
          },
          videoLink:{
            type: String,
          },
          publicado: {
            type: Boolean,
            default: false
          },
          estado: {
            type: Boolean,
            default: false
          },
        }
      );

 
ProgramaSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("programaModelo", ProgramaSchema);