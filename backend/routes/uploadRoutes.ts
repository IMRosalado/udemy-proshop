import express, { Request, Response } from 'express';
import path from "path";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
});

function checkFileType(file: Express.Multer.File, cb) {
  const fileTypes = /jpg|jpeg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    return cb(null, true)
  } else {
    cb("Images Only");
  }
}

const upload = multer({storage});

router.post("/", upload.single('image'), (req: any, res: Response ) => {
  res.send({
    message: "Image Uploaded",
    image: `/${req.file.path.replace(/\\/g,"/")}`
  })
})

export default router;