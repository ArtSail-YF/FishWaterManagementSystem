const esbuild = require("esbuild");
esbuild.buildSync({
  absWorkingDir: "C:/Users/13372/Desktop/mark/项目/水产管理/user-center-admin",
  entryPoints: ["./test_simple.ts"],
  bundle: false,
  outdir: "out_test7",
  logLevel: "error",
  tsconfigRaw: {}
});
console.log("OK");
