import bcrypt from "bcryptjs";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Log from "../models/log.model.js";

export const create = async (req, res) => {
  try {
    if (!req.body || !req.body.name || !req.body.password) {
      return res.status(400).json({ status: 400, message: "Parámetros incorrectos"});
    }

    const { name, password, description, open } = req.body;

    const newRoom = new Room({ name, password, description, open });
    const roomSaved = await newRoom.save();

    return res.status(200).json({
      status: 200,
      roomSaved
    })

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const update = async (req, res) => {
  try {
    if (!req.body || !req.body.name ) {
      return res.status(400).json({ status: 400, message: "Parámetros incorrectos"});
    }

    const { roomId, name, description, open } = req.body;

    // Cerrar la sala
    const salaRes = await Room.updateOne({ _id: roomId }, { name, description, open });

    if (salaRes.matchedCount == 0) {
      return res.status(400).json({ status: 400, message: "No se ha encontrado ningún documento" });
    } else {
      return res.status(200).json({ status: 200 });
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const eliminate = async (req, res) => {
  try {
    if (!req.body || !req.body.roomId) {
      return res.status(400).json({ status: 400, message: "Parámetros incorrectos"});
    }

    const { roomId } = req.body;

    // Se elimina la sala
    const roomDeleted = await Room.findOneAndDelete({ _id: roomId });

    // Se eliminan todos los logs asociados a esa sala
    const result = await Log.deleteMany({ room: roomId });

    if (!roomDeleted) return res.status(400).json({status: 400});
    else return res.status(200).json({ status: 200, roomDeleted });

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

// export const open = async (req, res) => {
//   try {
//     if (!req.body || !req.body.roomId) return res.status(400).json({ status: 400, message: "Parámetros incorrectos"});

//     const { roomId } = req.body;

//     // Abrir la sala
//     const salaRes = await Room.updateOne({ _id: roomId }, { open: true });

//     if (salaRes.matchedCount == 0) {
//       return res.status(400).json({ status: 400, message: "No se ha encontrado ningún documento" });
//     } else {
//       return res.status(200).json({ status: 200 });
//     }
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ status: 500, message: "Error en el servidor" });
//   }
// };

// export const close = async (req, res) => {
//   try {
//     if (!req.body || !req.body.roomId) return res.status(400).json({ status: 400, message: "Parámetros incorrectos"});

//     const { roomId } = req.body;

//     // Cerrar la sala
//     const salaRes = await Room.updateOne({ _id: roomId }, { open: false });

//     if (salaRes.matchedCount == 0) {
//       return res.status(400).json({ status: 400, message: "No se ha encontrado ningún documento" });
//     } else {
//       return res.status(200).json({ status: 200 });
//     }
//   } catch (error) {
//     return res.status(500).json({ status: 500, message: "Error en el servidor" });
//   }
// };

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}).sort({ date: -1 }); // Orden ascendente por fecha

    return res.status(200).json({
      status: 200,
      rooms
    });

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const getAllRoomsStudent = async (req, res) => {
  try {
    const rooms = await Room.find({}).sort({ date: -1 }); // Orden ascendente por fecha
    const roomsStudent = rooms.map((room) => {
      const log = room.logs.find(log => log.userId == req.userId);
    
      return {
        _id: room._id,
        name: room.name, 
        open: room.open, 
        date: room.date,
        description: room.description,
        mark: log ? log.mark : null
      };
    });

    return res.status(200).json({
      status: 200,
      rooms: roomsStudent
    });

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const roomId = req.query.roomId;
    if (!roomId) return res.status(400).json({ status: 400, message: "Parámetros incorrectos" });

    // Cogemos la sala de la que devolveremos los ids de los logs asociados
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(400).json({ status: 400, message: "No se ha encontrado la sala" });
    } else {
      return res.status(200).json({
        status: 200,
        room
      });
    }

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const getAllRoomLogs = async (req, res) => {
  try {
    const roomId = req.query.roomId;
    if (!roomId) return res.status(400).json({ status: 400, message: "Parámetros incorrectos" });

    // Cogemos la sala de la que devolveremos los ids de los logs asociados
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(400).json({ status: 400, message: "No se ha encontrado la sala" });
    } else {
      return res.status(200).json({
        status: 200,
        logs: room.logs
      });
    }

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const enterRoom = async (req, res) => {
  try {
    const { password, roomId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ status: 404, message: "Sala no encontrada" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ status: 404, message: "Usuario no encontrado" });

    const alreadyInRoom = room.logs.some(log => log.userId.toString() === req.userId);

    if (room.password == password && user.role == "student" && !alreadyInRoom) {
      return res.status(200).json({ status: 200 });
    } else {
      return res.status(400).json({ 
        status: 400, 
        message: "Acceso no permitido a la sala" 
      });
    } 
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
}

export const establishMark = async (req, res) => {
  try {
    const { mark, roomId, logId } = req.body;

    if (typeof mark !== 'number' || mark < 0 || mark > 10) {
      return res.status(400).json({ status: 400, message: "La nota debe estar entre 0 y 10." });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ status: 404, message: "Sala no encontrada." });
    }

    const log = room.logs.find(l => l.logId.toString() === logId);
    if (!log) {
      return res.status(404).json({ status: 404, message: "Log no encontrado en esta sala." });
    }

    log.mark = mark;

    await room.save();

    return res.status(200).json({ status: 200, message: "Nota establecida correctamente.", log });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Error en el servidor." });
  }
};
