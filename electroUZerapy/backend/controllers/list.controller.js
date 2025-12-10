import List from "../models/list.model.js";

export const createList = async (req, res) => {
    try {
        const profesorId = req.user.id;
        const newList = new List({ teacher: profesorId });
        const listSaved = await newList.save();
        
        return res.status(200).json({
            status:200,
            listSaved
        })
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Error en el servidor" });
    }
};

export const getAllLists = async (req, res) => {
    try {
        const lists = await List.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            status:200,
            lists
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Error en el servidor" });
    }
};

export const getListById = async (req, res) => {
    try {
        const listId = req.query.listId;
        if (!listId) return res.status(400).json({ status: 400, message: "Parámetros incorrectos" });
        
        const list = await Room.findById(listId);
        if (!list) {
            return res.status(400).json({ status: 400, message: "No se ha encontrado el listado" });
        } else {
            return res.status(200).json({
                status: 200,
                list
            });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Error en el servidor" });
    }
};

export const registrarAsistencia = async (req, res) => {
    try {
        const alumnoId = req.user.id;
        const listId = req.query.listId;
        
        const list = await List.findById(listId);
        
        if (!list || !list.isOpen) {
            return res.status(400).json({ message: "Clase cerrada o inexistente" });
        }
        
        if (list.asistentes.includes(alumnoId)) {
            return res.status(200).json({ message: "Asistencia ya registrada" });
        }
        
        list.asistentes.push(alumnoId);
        await list.save();
        
        res.status(200).json({ message: "Asistencia registrada" });
    } catch (error) {
        res.status(500).json({ message: "Error registrando asistencia" });
    }
};