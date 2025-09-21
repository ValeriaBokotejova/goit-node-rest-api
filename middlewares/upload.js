import multer from "multer";
import path from "node:path";

const tempDir = path.resolve("temp");

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, tempDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const fileFilter = (_, file, cb) => {
  if (/^image\/(png|jpe?g|gif|webp)$/i.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

export default multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });