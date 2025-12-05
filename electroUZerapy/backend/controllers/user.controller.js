import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

// Funciones del módulo:
// - register
// - createUser (privada)
// - login
// - getAllUsers
// - createUsers
// - deleteUser
// - getUserByID
// - getUserID
// - changePassword

const createUser = async (req) => {
  try {
    if (!req.body) return { status: 400 };

    const { name, password, role } = req.body;

    if (!name || !password || !role || (role != 'student' && role != 'teacher')) {
      return { status: 400 };
    }

    const userFound = await User.findOne({name});
    if (userFound) return { status: 409 };

    const passwdHash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, password: passwdHash, role });

    const userSaved = await newUser.save();

    return {
      status: 200,
      user: { _id: userSaved._id, name: userSaved.name, role: userSaved.role },
    };

  } catch (error) {
    return { status: 500, message: "Error en el servidor" };
  }
};

export const login = async (req, res) => {
  try {

    const { name, password } = req.body;

    if (!name || !password) return res.status(400).json({ status: 400, message: "Parámetros incorrectos" });

    const userFound = await User.findOne({name});
    if (!userFound) return res.status(400).json({ status: 400 });

    const equal = await bcrypt.compare(password, userFound.password);
    if (!equal) return res.status(400).json({ status: 400 });

    const token = await createAccessToken({ id: userFound._id, role: userFound.role});

    res.cookie("token", token, {
      httpOnly: true, // No accesible desde JavaScript (protección XSS)
      secure: true, // Solo se envía en HTTPS
      sameSite: "None", // Protección contra CSRF (ajustar si el frontend está en otro dominio)
      maxAge: 24 * 60 * 60 * 1000, // 1 día de duración
    });

    return res.status(200).json({
      status: 200,
      user: { id: userFound._id, name: userFound.name, role: userFound.role },
      token
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res.status(200).json({ status: 200 });
};

export const changePassword = async (req, res) => {
  try {
    if (!req.body || !req.body.userId || !req.body.oldPassword || !req.body.newPassword) {
      return res.status(400).json({status: 400});
    }
    const userID = req.body.userId;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const user = await User.findOne({ _id: userID });

    const equal = await bcrypt.compare(oldPassword, user.password);
    if (!equal) return res.status(400).json({status: 400});

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    return res.status(200).json({status: 200});

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  } 
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ role: -1 }); // Orden ascendente por rol
    const usersData = users.filter((user) => {
      if (user._id != req.userId) {
        return { _id: user._id, name: user.name, role: user.role };
      }
    });

    return res.status(200).json({
      status: 200,
      users: usersData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const createUsers = async (req, res) => {

  try {
    if (!req.body.users) return res.status(400).json({ status: 400 });

    const usersNotCreated = [];
    const usersCreated = [];
    let resRegister;

    for (const user of req.body.users) {
      resRegister = await createUser({ body: user });
      if (resRegister.status !== 200) usersNotCreated.push(user);
      else usersCreated.push(resRegister.user)
    }
    
    return res.status(200).json({
      status: 200,
      usersCreated,
      usersNotCreated
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!req.body || !req.body.userId) return res.status(400).json({status: 400});
    
    const userDeleted = await User.findOneAndDelete({ _id: req.body.userId });

    if (!userDeleted) return res.status(400).json({status: 400});
    else return res.status(200).json({ status: 200, userDeleted });

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export const deleteUsers = async (req, res) => {
  try {
    if (!req.body || !req.body.users) return res.status(400).json({
      status: 400, 
      message: "Parámetros incorrectos"
    });

    // Eliminamos los usuarios cuyos IDs estén en el array
    const result = await User.deleteMany({ _id: { $in: req.body.users } });

    // Verificamos si realmente se eliminó algún documento
    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: "No se encontró ningún usuario para eliminar",
      });
    }

    return res.status(200).json({
      status: 200,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} usuario(s) eliminado(s) correctamente`,
    });

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
}

// export const getUserByID = async (req, res) => {
//   try {
//     if (!req.body || !req.body.userId) return res.status(400).json({status: 400});

//     const user = await User.findOne({ _id: req.body.userId }).select("-password");
//     if (!user) return res.status(400).json({status: 400});
//     else return res.status(200).json({status: 200, user});

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: 500, message: "Error en el servidor" });
//   }
// };

// export const getUserID = async (req, res) => {
//   try {
//     if (!req.body || !req.body.userID) return res.status(400).json({status: 400});
//     const userID = req.body.userID;

//     if (!userID) return res.status(400).json({ status: 400 });

//     const user = await User.findById(userID).select("-password"); // Excluye la contraseña por seguridad

//     if (!user) return res.status(404).json({ status: 404 });

//     return res.status(200).json({ status: 200, user });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: 500 });
//   }
// };

