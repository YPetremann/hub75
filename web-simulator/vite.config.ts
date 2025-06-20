import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import license from "rollup-plugin-license";
import { defineConfig } from "vite";
import { devDependencies } from "./package.json";
export default defineConfig({
	// default to "/" but can be set with BASE_URL environment variable
	base: process.env.BASE_URL || "/",
	plugins: [tailwindcss()],
	build: {
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						const dep = Object.keys(devDependencies).find((pkgName) =>
							id.includes(`/node_modules/${pkgName}/`),
						);
						return dep ?? "vendor";
					}
				},
			},

			plugins: [
				license({
					sourcemap: true,
					banner: {
						content: `Copyright <%= moment().format('YYYY') %>`,
					},

					thirdParty: {
						includePrivate: true, // Default is false.
						includeSelf: true, // Default is false.
						multipleVersions: true, // Default is false.
						output: {
							file: path.join("dist", "LICENSE.md"),
							encoding: "utf-8", // Default is utf-8.
						},
					},
				}),
			],
		},
	},
	esbuild: {
		banner: "/* see LICENSE.md for license information */",
		legalComments: "none",
	},
});
