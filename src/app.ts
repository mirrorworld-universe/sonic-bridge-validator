import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./routers";
import {logger} from "./utils/logger";
import {initBridgeClient} from "./utils/bridge";


const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
	origin: "*"
}));

app.use(router);

async function start() {
	await initBridgeClient();
}

const port = 3060;

start().then(() => {
	app.listen(port, () => {
		logger.info("validator service start successful")
	})
	
})