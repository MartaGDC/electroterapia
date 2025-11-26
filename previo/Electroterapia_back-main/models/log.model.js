import mongoose from "mongoose";
import simuladores from "../libs/simuladores.js";

const logSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ['simulacion', 'evaluacion'],
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  fixedParams: { },
  params: {
    type: [
      {time: Date, params: {} }
    ],
    default: []
  },
  finished: {
    type: Boolean,
    default: false,
  },
  simulator: {
    type: String,
    enum: Object.values(simuladores),
    required: true
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
    required: false
  }
});

export default mongoose.model('Log', logSchema);