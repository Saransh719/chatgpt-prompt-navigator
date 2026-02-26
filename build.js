import * as esbuild from "esbuild";

esbuild.build({
    entryPoints : ["src/content.js"],
    bundle : true,
    outfile : "dist/content.bundle.js",
    format : "esm",
    target : "chrome120",
}).catch(() => process.exit(1));