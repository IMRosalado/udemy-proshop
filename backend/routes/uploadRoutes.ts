import express, { Request, Response } from 'express';
import path from "path";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'dist/uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
});

function fileFilter(req, file, cb) {
  const fileTypes = /jpe?g|png|webp/
  const mimeTypes = /image\/jpe?g|image\/png|image\/webp/

  const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
  const mimeType = mimeTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true)
  } else {
    cb(new Error("Images only"), false)
  }
}

const upload = multer({storage, fileFilter});
const uploadSingleImage = upload.single('image');

router.post("/", (req, res) => {
  uploadSingleImage(req, res, function(err) {
    if (err) {
      res.status(400).send({message: err.message} )
    }
    res.status(200).send({
      message: "Image Uploaded",
      image: `/${req.file.path}`
    })
  })
})

export default router;