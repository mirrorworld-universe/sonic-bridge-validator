import {Router} from "express";


const router = Router();

router.get("/ping", function (req, res, next) {
	res.status(200).send({
		"ping": "pong"
	})
});

export default router;