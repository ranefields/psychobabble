import * as express from 'express';
import { auth } from './../../config/auth';
import { VideoController } from './../../controllers/video.controller';


// prefix: /api/videos/...
export function loadRoutes() {
  let router = express.Router();

  let videoCtrl = new VideoController();

  // POST /api/videos/generate-video-url
  // auth: ADMIN
  // Creates a new S3 bucket URL with policy and sends it to the user
  router.post('/generate-video-url', auth, videoCtrl.generateVideoUrl);

  // POST /api/videos/upload
  // params: url, videoId, description
  // auth: ADMIN
  // Saves a video to the database using the previously generated URL
  router.post('/upload', auth, videoCtrl.uploadVideo);

  // POST /api/videos/upload-fail
  // params: videoId
  // auth: ADMIN
  // Deletes dummy video if upload failed
  router.post('/upload-fail', auth, videoCtrl.removeVideo);

  // Post /api/videos/get-videos
  // auth: ADMIN
  // Retrieves all videos from the database
  router.get('/get-videos', auth, videoCtrl.getVideos);

  return router;
}
