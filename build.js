import esbuild from "esbuild";
import process, { exit } from "process";

import { build, createServer } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

const esbuildRun = (options) =>
  esbuild
    .build({
      ...options,
      logLevel: "info",
    })
    .catch((err) => {
      process.stderr.write(err.stderr);
      process.exit(1);
    });

const buildLambdaOptions = (entryPoint, outdir) => ({
  entryPoints: [entryPoint],
  bundle: true,
  outdir,
  platform: "node",
  sourcemap: true,
  minify: process.env.NODE_ENV === "production",
});

if (process.argv.length < 3) {
  console.error("Missing build parameter.");
  console.error("Provide one of: `app`, `lambda` or `all`");
  exit(1);
}

const buildApp = async () =>
  await build({
    build: {
      outDir: "./dist/app",
    },
    plugins: [topLevelAwait(), wasm(), react()],
  });

const main = async () => {
  const parameter = process.argv[2];

  switch (parameter) {
    case "app":
      await buildApp();
      break;
    case "lambda":
      esbuildRun(buildLambdaOptions("src/lambda/handler.ts", "dist/lambda"));
      esbuildRun(
        buildLambdaOptions("src/tg-forwarder/handler.ts", "dist/tg-forwarder"),
      );
      break;
    case "all":
      await buildApp();
      esbuildRun(buildLambdaOptions("src/lambda/handler.ts", "dist/lambda"));
      esbuildRun(
        buildLambdaOptions("src/tg-forwarder/handler.ts", "dist/tg-forwarder"),
      );
      break;
    case "serve":
      {
        const server = await createServer({
          plugins: [topLevelAwait(), wasm(), react()],
          // eslint-disable-next-line no-undef
          root: __dirname,
          optimizeDeps: {
            // This is necessary because otherwise `vite dev` includes two separate
            // versions of the JS wrapper. This causes problems because the JS
            // wrapper has a module level variable to track JS side heap
            // allocations, initializing this twice causes horrible breakage
            exclude: ["@automerge/automerge-wasm"],
          },
        });
        await server.listen();
        server.printUrls();
      }
      break;
    default:
      console.error("Invalid build parameter provided.");
      console.error("Provide one of: `app`, `lambda` or `all`");
      exit(1);
  }
};

main();
