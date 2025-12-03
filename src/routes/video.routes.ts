import express from 'express';
import {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/video.controller';

const router = express.Router();

router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.post('/', createVideo);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

export default router;

