import express, { Router } from "express";
const router = Router();

import * as controller from "../../controllers/client/song.controller";

router.get("/:slugTopic", controller.list);
router.get("/detail/:slugSong", controller.detail);
router.patch("/like/:typeLike/:id", controller.like);
router.patch("/favourite/:typeFavourite/:id", controller.favourite);


export const songRoutes: Router = router;