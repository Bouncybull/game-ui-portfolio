export default defineConfig({
  server: {
    port: 3000,
    hmr: {
      host: "localhost",
    },
  },
  plugins: [], // Add your plugins here

  base: "/", // Take note of this!!

 // Add the rest of your build and vite config.
});