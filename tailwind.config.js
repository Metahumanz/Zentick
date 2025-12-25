export default {
  content: [
    "./index.html",
    // 扫描根目录下的 tsx/ts 文件 (比如 App.tsx, index.tsx)
    "./*.{js,ts,jsx,tsx}",
    // 扫描 components 文件夹
    "./components/**/*.{js,ts,jsx,tsx}",
    // 扫描 hooks 文件夹 (如果有用到样式)
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}