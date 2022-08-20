import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";
import process, { exit } from "process";

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

const esbuildServe = (options) => {
  console.log("Serving on http://localhost:8000");
  return esbuild
    .serve(
      {
        port: 8000,
        servedir: options.outdir,
        onRequest: (req) =>
          console.log(
            ` ${req.method} ${req.path} ${req.timeInMS}ms - ${req.status}`
          ),
      },
      {
        ...options,
      }
    )
    .then(async (server) => {
      await server.wait();
      server.stop();
    })
    .catch((err) => {
      process.stderr.write(err.stderr);
      process.exit(1);
    });
};

const buildLambdaOptions = (entryPoint, outdir) => ({
  entryPoints: [entryPoint],
  bundle: true,
  outdir,
  platform: "node",
  sourcemap: true,
  minify: process.env.NODE_ENV === "production",
});

const buildAppOptions = () => ({
  entryPoints: ["./src/app/index.tsx"],
  bundle: true,
  outdir: "./dist/app",
  sourcemap: true,
  minify: process.env.NODE_ENV === "production",
  plugins: [
    sassPlugin({
      async transform(source, _) {
        const { css } = await postcss([
          autoprefixer,
          postcssPresetEnv({ stage: 0 }),
        ]).process(source, { from: undefined });
        console.log(css);
        return css;
      },
    }),
  ],
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
      esbuildRun(buildAppOptions());
      break;
    case "lambda":
      esbuildRun(buildLambdaOptions("src/lambda/handler.ts", "dist/lambda"));
      esbuildRun(
        buildLambdaOptions("src/tg-forwarder/handler.ts", "dist/tg-forwarder")
      );
      break;
    case "all":
      esbuildRun(buildAppOptions());
      esbuildRun(buildLambdaOptions("src/lambda/handler.ts", "dist/lambda"));
      esbuildRun(
        buildLambdaOptions("src/tg-forwarder/handler.ts", "dist/tg-forwarder")
      );
      break;
    case "serve":
      await esbuildServe(buildAppOptions());
      break;
    default:
      console.error("Invalid build parameter provided.");
      console.error("Provide one of: `app`, `lambda` or `all`");
      exit(1);
  }
};

main();
