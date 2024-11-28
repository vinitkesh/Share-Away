import express from 'express';
import upload from '../utils/upload.js';
import { uploadImage, getImage } from '../controller/image-controller.js';

const router = express.Router();


router.post('/upload', upload.single('file'), uploadImage);
router.get('/file/:fileId', getImage);
router.get('/test', (req, res) => {
    res.send('Hello World');
}
);

export default router;