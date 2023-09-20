import { model, Schema } from "mongoose";

const userSchema = Schema(
  {
    userName: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    salt: { type: String, unique: true, required: true },
    firstName: { type: String },
    lastName: { type: String },
    notes: [
      {
        type: Schema({
          contents: { type: String, required: true, index: true },
          sharedTo: [ { type: Schema.Types.ObjectId} ],
        }, {
          timestamps: true
        })
      }
    ],
  }, {
    timestamps: true,
  }
);

export default model("user", userSchema);
