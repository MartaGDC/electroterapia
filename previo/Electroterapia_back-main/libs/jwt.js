import { TOKEN } from "../config.js"
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

export const createAccessToken = async (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export const authRequired = (req, res, next) => {
  try {
    if (!req.cookies.token) return res.status(400).json({status: 400});
    
    const token = req.cookies.token.replace(/['"]+/g, '');

    jwt.verify(token, TOKEN, (err, user) => {
      if (err) return res.status(400).json({status: 400, message: "Error procesando el token de sesión"});
      req.userId = user.id;
      next();
    })
  } catch (error) {
    console.error(error);
    return res.status(401).json({ 
      status: 401,
      message: "Usuario no logueado"
    });    
  }
}

export const authTeacherRequired = (req, res, next) => {
  try {
    if (!req.cookies.token) return res.status(400).json({status: 400});
    
    const token = req.cookies.token.replace(/['"]+/g, '');

    jwt.verify(token, TOKEN, (err, user) => {
      if (err) return res.status(400).json({status: 400});

      if (user.role && user.role != "teacher") {
        return res.status(403).json({ 
          status: 403, 
          message: "Las salas deben ser creadas por profesores"
        });
      }
      req.user = user;
      req.userId = user.id;
      next();
    })
  } catch (error) {
    console.error(error);
    return res.status(401).json({ 
      status: 401,
      message: "Usuario no logueado"
    });    
  }
}


export const verifyToken = (req, res) => {

  if (!req.body.token) {
    return res.status(400).json({
      status: 400,
      message: "Token no incluido en petición"
    });
  }
  const token = req.body.token.replace(/['"]+/g, '');

  jwt.verify(token, TOKEN, async (err, user) => {

    if (err) return res.status(400).json({ 
      status: 400,
      message: "Error verificando el token"
    });

    const userFound = await User.findById(user.id);

    if (!userFound) return res.status(404).json({ 
      status: 404,
      message: "Usuario no encontrado"
    });

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
  });
};