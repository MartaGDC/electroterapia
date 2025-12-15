import List from "../models/list.model.js";

export const createList = async (req, res) => {
    try {
        const profesorId = req.user.id;
        //Comprobar si este profesor ya tiene una lista abierta
        const existingOpenList = await List.findOne({
            teacher: profesorId,
            isOpen: true
        });
        if (existingOpenList) {
            return res.status(200).json({
                status: 200,
                existingOpenList
            });
        }
        const newList = new List({
            teacher: profesorId,
            isOpen: true,
            start: new Date()
        });
        const listSaved = await newList.save();
        
        return res.status(200).json(listSaved)
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Error en el servidor" });
    }
};

export const getAllLists = async (req, res) => {
    console.log(req.body);
    try {
        const lists = await List.find({}).sort({ start: -1 });
        //Actualizo el estado de abierto a cerrado si ha pasado más de media hora (en el momento en que se ejectua getAllList en el frontend)
        const now = new Date();
        const tiempoCambio = 30*60*1000;
        for (const list of lists) {
            if (list.isOpen && now.getTime() - list.reOpenedDate.getTime() > tiempoCambio) {
                list.isOpen = false;
                await list.save();
            }
        }
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
        
        const list = await List.findById(listId);
        if (!list) {
            return res.status(400).json({ status: 400, message: "No se ha encontrado el listado" });
        } else {
            //Por si no se ha actualizado antes el open:
            const now = new Date();
            const tiempoCambio = 30*60*1000;
            if (list.isOpen && now.getTime() - list.reOpenedDate.getTime() > tiempoCambio) {
                list.isOpen = false;
                await list.save();
            }
            return res.status(200).json({
                status: 200,
                list
            });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Error en el servidor" });
    }
};

export const cambiarEstadoList = async (req, res) => {
  try {
    const { idList, isOpen } = req.body;
    if (!idList || isOpen === undefined) {
      return res.status(400).json({ status: 400, message: "Parámetros incorrectos"});
    }

    const list = await List.findById(idList);
    if (!list) {
      return res.status(400).json({ status: 400, message: "No se ha encontrado ningún documento" });
    }

    if (isOpen) {
      list.isOpen = true;
      list.reOpenedDate = new Date(); //Dará un margen de 30 mintuos para nuevos registros
    }
    if (isOpen === false) {
      list.isOpen = false;
    }
    await list.save();
    res.status(200).json({ status: 200, list });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error cambiando estado del listado" });
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