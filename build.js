import esbuild from "esbuild";
import process, { exit } from "process";

import { build, createServer } from "vite";
import react from "@vitejs/plugin-react";

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

const main = async () => {
  const parameter = process.argv[2];

  switch (parameter) {
    case "app":
      await build({
        build: {
          outDir: "./dist/app",
        },
      });
      break;
    case "lambda":
      esbuildRun(buildLambdaOptions("src/lambda/handler.ts", "dist/lambda"));
      esbuildRun(
        buildLambdaOptions("src/tg-forwarder/handler.ts", "dist/tg-forwarder")
      );
      break;
    case "all":
      await build({
        build: {
          outDir: "./dist/app",
        },
      });
      esbuildRun(buildLambdaOptions("src/lambda/handler.ts", "dist/lambda"));
      esbuildRun(
        buildLambdaOptions("src/tg-forwarder/handler.ts", "dist/tg-forwarder")
      );
      break;
    case "serve":
      {
        const server = await createServer({
          plugins: [react()],
          // eslint-disable-next-line no-undef
          root: __dirname,
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
