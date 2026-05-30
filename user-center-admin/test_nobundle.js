const esbuild = require("esbuild");
esbuild.buildSync({
  entryPoints: ["./test_simple.ts"],
  bundle: false,
  outdir: "out_test6",
  logLevel: "error"
});
console.log("OK");
