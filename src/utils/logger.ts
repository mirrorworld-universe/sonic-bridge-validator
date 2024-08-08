import consola from "consola";

const basicLogger = consola.withDefaults({

});

export const logger = {
	info(message, ...params) {
		basicLogger.info(`[INFO] [${new Date().toISOString()}]`, message, ...params);
	},
	error(message, ...params) {
		basicLogger.info(`[INFO] [${new Date().toISOString()}]`, message, ...params);
	}
}
