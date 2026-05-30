const esbuild = require("./node_modules/@umijs/bundler-utils/compiled/esbuild");
async function main() {
  try {
    const r = await esbuild.build({
      entryPoints: ["./test_simple.ts"],
      bundle: true,
      outdir: "out_test4",
      logLevel: "error"
    });
    console.log("OK");
  } catch(e) {
    console.log(e.message.substring(0, 500));
  }
}
main();
