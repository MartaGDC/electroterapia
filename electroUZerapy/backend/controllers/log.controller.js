import Log from "../models/log.model.js";
import crypto from "crypto";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";

export const initLog = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.body || !req.body.params || !req.body.fixedParams || !req.body.simulator
      || !req.body.type) {
      return res.status(400).json({ status: 400, message: "Faltan parámetros"});
    }
    const type = req.body.type;
    if (type != "simulacion" && type != "evaluacion") return res.status(400).json({ status: 400, message: "Type incorrecto"});

    const params = [];
    params.push(req.body.params);

    const simulator = req.body.simulator;
    const fixedParams = req.body.fixedParams;

    const timestamp = Date.now().toString(); // Convertir timestamp a string
    const rawString = `${userId}-${timestamp}`; // Concatenación única

    const sessionId = await crypto.createHash("sha256").update(rawString).digest("hex");

    if (type == "evaluacion") {
      if (!req.body.roomId) return res.status(400).json({ status: 400, message: "Sala no asociada"});
      
      // Aseguramos que la sala exista, esté abierta y el usuario aún no haya realizado ninguna simulación en la misma
      const room = await Room.findOne({ _id: req.body.roomId });
      if (!room) {
        return res.status(404).json({ status: 404, message: "No existe la sala"});
      } else if (!room.open) {
        return res.status(409).json({ status: 409, message: "Sala cerrada. No acepa registro de logs"});
      } else {
        const idx = room.logs.findIndex((log, _) => log.userId == userId);
        if (idx != -1) return res.status(409).json({ status: 409, message: "El usuario ya ha realizado esta actividad" })
      }
    }

    const log = new Log({ 
      userId, 
      type, 
      sessionId, 
      params, 
      fixedParams, 
      simulator,
      ...(type == "evaluacion" ? { room: req.body.roomId } : { }) 
    });

    await log.save();

    return res.status(200).json({ status: 200, sessionId });

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const saveParams = async (req, res) => {
  try {
    const { sessionId, params } = req.body; // Recibe sessionId y nuevos parámetros

    if (!sessionId || !params) {
      return res.status(400).json({ status: 400, message: "Parámetros incorrectos" });
    }

    // Buscar y actualizar el documento agregando los nuevos parámetros
    const log = await Log.findOneAndUpdate(
      { sessionId: sessionId.trim() }, // Buscar por sessionId
      { $push: { params: { $each: params } } }, // Agregar múltiples parámetros
      { new: true } // Retorna el documento actualizado
    );

    if (!log) return res.status(404).json({ status: 404, message: "Log no encontrado" })

    return res.status(200).json({ status: 200 });

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const endLog = async (req, res) => {
  try {
    const userId = req.userId;
    const { sessionId, params } = req.body; // Recibe sessionId y nuevos parámetros

    if (!sessionId || !params) {
      return res.status(400).json({ status: 400 });
    }

    // Buscar y actualizar el documento agregando los nuevos parámetros
    const log = await Log.findOneAndUpdate(
      { sessionId, finished: false }, // Buscar por sessionId
      { 
        $push: { params: { $each: params } },
        $set: { finished: true }
      }, // Agregar múltiples parámetros
      { new: true } // Retorna el documento actualizado 
    );

    if (!log) return res.status(400).json({ status: 400 });

    if (log.type == "evaluacion") {
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ status: 400, message: "Usuario no encontrado"});

      await Room.findOneAndUpdate(
        { _id: log.room },
        { $push: { logs: { logId: log._id, userId, userName: user.name } } }
      );
    }

    return res.status(200).json({ status: 200 });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const deleteLog = async (req, res) => {
  try {
    const { sessionId } = req.body; // Recibe sessionId y nuevos parámetros

    if (!sessionId) return res.status(400).json({ status: 400, message: "Parámetros incorrectos" });

    // Buscar y actualizar el documento agregando los nuevos parámetros
    const log = await Log.findOneAndDelete({ sessionId, finished: false });

    if (!log) return res.status(400).json({ 
      status: 400, 
      message: "No se pudo borrar el registro" 
    });

    if (log.type == "evaluacion") {
      const room = await Room.findOneAndUpdate(
        { _id: req.body.roomId },
        { $pull: { logs: { logId: log._id } } },
        { new: true } // Para devolver el documento actualizado
      );

      if (!room) return res.status(400).json({ 
        status: 400, 
        message: "No se pudo borrar el log de la sala" 
      });
    }

    return res.status(200).json({ status: 200 });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

// Profesor
export const getLogById = async (req, res) => {
  try {
    const logId = req.query.logId;

    if (!logId) return res.status(400).json({status: 400, message: "Parámetros incorrectos"});

    const log = await Log.findById(logId);

    if (!log) return res.status(400).json({status: 400, message: "Log no encontrado"});

    return res.status(200).json({
      status: 200,
      log
    })

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
}