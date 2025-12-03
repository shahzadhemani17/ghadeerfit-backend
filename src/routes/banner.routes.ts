import express from 'express';
import {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/banner.controller';
import { upload } from '../utils/fileUpload';

const router = express.Router();

router.get('/', getAllBanners);
router.get('/:id', getBannerById);
router.post('/', upload.single('banner_image'), createBanner);
router.put('/:id', upload.single('banner_image'), updateBanner);
router.delete('/:id', deleteBanner);

export default router;

