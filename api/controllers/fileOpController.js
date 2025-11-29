import {
  uploadFile,
  getAllFiles,
  getFileStream,
  getZipStream,
  deleteFile,
} from "../utilities/fileOperations.js";

// Upload controller
export const uploadHandler = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const results = [];
    const duplicates = [];

    for (const file of req.files) {
      try {
        const uploadedFile = await uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype
        );
        results.push(uploadedFile);
      } catch (err) {
        if (err.message.includes("Duplicate file")) {
          duplicates.push(file.originalname);
        } else {
          console.error("❌ Upload Error:", err.message);
        }
      }
    }

    const response = {
      uploaded: results.length,
      duplicates: duplicates.length,
      uploadedFiles: results,
      duplicateFiles: duplicates,
    };

    if (duplicates.length > 0) {
      return res.status(207).json({
        message: "Some files skipped due to duplicates",
        ...response,
      });
    }

    return res.status(200).json({
      message: "All files uploaded successfully",
      ...response,
    });
  } catch (error) {
    console.error("❌ Unexpected Upload Error:", error.message);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// Get all files
const getAllHandler = async (req, res) => {
  try {
    const files = await getAllFiles();
    res.status(200).json({ files });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Download single
const downloadHandler = async (req, res) => {
  try {
    const { file, stream } = await getFileStream(req.params.id);
    res.set({
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Content-Type": file.contentType,
    });
    stream.pipe(res);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Download multiple as ZIP
const downloadAllHandler = async (req, res) => {
  try {
    const fileIds = req.query.files ? req.query.files.split(",") : [];
    const zipStream = await getZipStream(fileIds);

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="AllDocs_${Date.now()}.zip"`,
    });

    zipStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete file
const deleteHandler = async (req, res) => {
  try {
    const result = await deleteFile(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  uploadHandler,
  getAllHandler,
  downloadHandler,
  downloadAllHandler,
  deleteHandler,
};
