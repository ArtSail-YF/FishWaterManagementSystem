const esbuild = require("esbuild");
async function main() {
  try {
    const r = await esbuild.build({
      entryPoints: ["./test_simple.ts"],
      bundle: true,
      outdir: "out_test5",
      logLevel: "error"
    });
    console.log("OK");
  } catch(e) {
    console.log(e.message.substring(0, 500));
  }
}
main();
