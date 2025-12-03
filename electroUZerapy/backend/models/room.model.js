import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  open: {
    type: Boolean
  },
  date: {
    type: Date,
    default: Date.now()
  },
  logs: {
    type: [ 
      {      
        logId: mongoose.Schema.ObjectId,
        userId: mongoose.Schema.ObjectId,
        userName: String,
        mark: { type: Number, default: -1 }
      }
    ],
    default: [ ]
  }
});

export default mongoose.model('Room', roomSchema);