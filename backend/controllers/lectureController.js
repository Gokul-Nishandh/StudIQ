import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { CourseMaterial } from '../models/index.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

export const upload = multer({ storage });

export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, course_id } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const material = await CourseMaterial.create({
      course_id,
      uploaded_by: req.user.id, // token → decoded user ID
      title,
      description,
      file_url: `/uploads/${file.filename}`,
      file_type: file.mimetype,
    });

    res.status(201).json({ message: 'Lecture material uploaded', material });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCourseMaterials = async (req, res) => {
  const { courseId } = req.params;
  try {
    const materials = await CourseMaterial.findAll({ where: { course_id: courseId } });
    res.status(200).json({ materials });
  } catch (err) {
    console.error("Get materials error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
