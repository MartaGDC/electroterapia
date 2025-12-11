import mongoose from "mongoose";

const ListSchema = mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    asistentes: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        default: []
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    start: {
      type: Date,
      default: Date.now
    },
    reOpenedDate: {
      type: Date,
      default: Date.now
    }
});

export default mongoose.model("List", ListSchema);