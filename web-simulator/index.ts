import serveStatic from "serve-static-bun";

const staticHandler = serveStatic("dist");

const server = Bun.serve({
	async fetch(request) {
		console.log(
			`[${new Date().toISOString()}] ${request.method} ${request.url}`,
		);
		return staticHandler(request);
	},
});

console.log(`Server started on http://${server.hostname}:${server.port}`);
let shutdownCalled = false;
const shutdown = async () => {
	const force = shutdownCalled;
	console.log(`${force ? "Forcefully" : "Gracefully"} shutting down server...`);
	shutdownCalled = true;
	await server.stop(force);
	console.log("All requests have been served. Server stopped.");

	process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
