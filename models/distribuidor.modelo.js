import { model, Schema } from 'mongoose';

const DistribuidorSchema = new Schema(
        {
          nombre: {
            type: String,
          },
          consorcio: {
            type: Boolean,
            default: false
          },
          estado: {
            type: Boolean,
            default: true
          },
        }
      );

 
DistribuidorSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("distribuidorModelo", DistribuidorSchema);
