const esbuild = require("@umijs/bundler-utils/compiled/esbuild");
async function main() {
  try {
    const result = await esbuild.build({
      entryPoints: ["src/.umi/umi.ts"],
      bundle: true,
      outdir: "out_test2",
      logLevel: "debug",
      loader: {
        ".aac": "empty",".css": "empty",".less": "empty",".sass": "empty",".scss": "empty",".eot": "empty",".flac": "empty",".gif": "empty",".htm": "empty",".html": "empty",".ico": "empty",".icon": "empty",".jpeg": "empty",".jpg": "empty",".empty": "empty",".mdx": "empty",".mp3": "empty",".mp4": "empty",".ogg": "empty",".otf": "empty",".png": "empty",".svg": "empty",".ttf": "empty",".wav": "empty",".webm": "empty",".webp": "empty",".woff": "empty",".woff2": "empty",
        ".js": "tsx",".jsx": "tsx",".ts": "ts",".tsx": "tsx"
      }
    });
    console.log("Success");
  } catch(e) {
    console.log(e.message.substring(0, 800));
  }
}
main();
