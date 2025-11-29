// ✅ Multer config
import multer from "multer";

const storage = multer.memoryStorage(); // for in-memory buffer upload
const fileUpload = multer({ storage });

export default fileUpload;
