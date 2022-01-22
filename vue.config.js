module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/photo/" : "/",
  pages: {
    index: {
      entry: "src/main.ts",
      title: "TSUYOSHI OCHIAI PHOTOGRAPHY"
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/global.scss";`
      }
    }
  }
};
