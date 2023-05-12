import { model, Schema } from 'mongoose';

const NoticiaSchema = new Schema(
        {
          titulo: {
            type: String,
          },
          descripcion: {
            type: String,
          },
          fecha: {
            type: Date,
            default: Date.now()
          },
          img:{
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
        },
        { timestamps: true }
      );

 
NoticiaSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("noticiaModelo", NoticiaSchema);