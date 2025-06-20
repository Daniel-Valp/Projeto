import { Router } from "express";
import * as videoController from "../Controllers/videocontroller";

const router = Router();

router.get("/", videoController.getVideos);
router.get("/:id", videoController.getVideo);
router.post("/", videoController.createVideo);
router.put("/:id", videoController.updateVideo);
router.delete("/:id", videoController.deleteVideo);
router.patch("/videos/:id/status", videoController.updateVideoStatus);
router.post("/:videoId/enlistar", videoController.enlistarVideo);

export default router;
