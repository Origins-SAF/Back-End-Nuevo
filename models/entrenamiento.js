import { Schema, model } from "mongoose";

const entrenamientoSchema = new Schema({
  lista:[
    {
      nombreDistribuidor: {
        type: String,
      },
      datos: [
        {
          producto: {
            type: Schema.Types.ObjectId,
            ref: "productoModelo",
          },
          nombre: {
            type: String,
          },
          peso: {
            type: String,
          },
          distribuidor: [
            {
              nombre: {
                type: String,
              },
              uid: {
                type: Schema.Types.ObjectId,
                ref: "distribuidorModelo",
              },
            }
        ],
        }
      ]
    }
  ]
});

entrenamientoSchema.methods.toJSON = function () {
    const { __v, estado, _id, ...data } = this.toObject();
    data.uid = _id;
    return data;
  };
  
  export default model("entrenamientoModelo", entrenamientoSchema);