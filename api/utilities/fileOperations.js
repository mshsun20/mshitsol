// fileOpUtility.js
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import archiver from "archiver";
import crypto from "crypto";
import { PassThrough, Readable } from "stream";

let gfs;

// ✅ Initialize GridFS once when Mongoose is ready
mongoose.connection.once("open", () => {
  gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "fileuploads" });
  console.log("✅ GridFSBucket initialized for reusable file ops");
});


/* ------------------------------------------------------------------
  ✅ 1. Upload with duplicate prevention
------------------------------------------------------------------ */
export const uploadFile = async (buffer, originalname, mimetype) => {
  if (!gfs) throw new Error("GridFS not initialized");

  // ✅ Generate hash (still useful for reference/metadata, but not used for duplicate blocking)
  const hash = crypto.createHash("md5").update(buffer).digest("hex");

  // 🟢 CHANGE #1: Removed duplicate check — always upload new file
  // (No more findOne query for existing file)

  return new Promise((resolve, reject) => {
    const uploadStream = gfs.openUploadStream(originalname, {
      contentType: mimetype,
      metadata: { hash, size: buffer.length },
    });

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);

    readable.pipe(uploadStream);

    uploadStream.on("finish", async () => {
      // ✅ Always get the freshly created file info by _id
      const fileInfo = await mongoose.connection.db
        .collection("fileuploads.files")
        .findOne({ _id: uploadStream.id });

      // 🟢 CHANGE #2: Return consistent structure
      resolve({
        duplicate: false, // always false now since duplicates are allowed
        file: fileInfo,
      });
    });

    uploadStream.on("error", (err) => reject(err));
  });
};

/* ------------------------------------------------------------------
  ✅ 2. Get all uploaded files metadata
------------------------------------------------------------------ */
export const getAllFiles = async () => {
  if (!gfs) throw new Error("GridFS not initialized");

  return mongoose.connection.db
    .collection("fileuploads.files")
    .find()
    .sort({ uploadDate: -1 })
    .toArray();
};

/* ------------------------------------------------------------------
  ✅ 3. Get single file stream
------------------------------------------------------------------ */
export const getFileStream = async (fileId) => {
  if (!gfs) throw new Error("GridFS not initialized");

  const _id = new mongoose.Types.ObjectId(fileId);
  const file = await mongoose.connection.db
    .collection("fileuploads.files")
    .findOne({ _id });

  if (!file) throw new Error("File not found");

  const stream = gfs.openDownloadStream(_id);
  return { file, stream };
};

/* ------------------------------------------------------------------
  ✅ 4. Get ZIP stream for multiple files
------------------------------------------------------------------ */
export const getZipStream = async (fileIds) => {
  if (!gfs) throw new Error("GridFS not initialized");
  if (!Array.isArray(fileIds) || !fileIds.length)
    throw new Error("No file IDs provided");

  const archive = archiver("zip", { zlib: { level: 9 } });

  const filePromises = fileIds.map(async (fileId) => {
    try {
      const _id = new mongoose.Types.ObjectId(fileId);
      const file = await gfs.find({ _id }).next();
      if (!file) return;

      const fileStream = gfs.openDownloadStream(_id);
      archive.append(fileStream, { name: file.filename });
    } catch (err) {
      console.error(`Error processing file ${fileId}:`, err);
    }
  });

  await Promise.all(filePromises);
  process.nextTick(() => archive.finalize());

  return archive;
};

/* ------------------------------------------------------------------
  ✅ 5. Delete file by ID
------------------------------------------------------------------ */
export const deleteFile = async (fileId) => {
  if (!gfs) throw new Error("GridFS not initialized");

  const _id = new mongoose.Types.ObjectId(fileId);
  await gfs.delete(_id);
  return { message: "File deleted successfully", _id };
};
