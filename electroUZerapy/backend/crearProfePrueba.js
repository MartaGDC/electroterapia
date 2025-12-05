import mongoose from "mongoose";
import User from './models/user.model.js'; 
import bcrypt from 'bcryptjs';
import { URI } from './config.js';

const createTeacher = async () => {
  try {
    await mongoose.connect(URI);
    const hashedPassword = await bcrypt.hash('MMU', 10);
    const teacher = new User({
      name: 'mmu',
      password: hashedPassword,
      role: 'teacher'
    });
    await teacher.save();
  } catch (error) {
    console.error(error);
  } finally {
    // Cerrar la conexión
    await mongoose.connection.close();
  }
};

createTeacher();