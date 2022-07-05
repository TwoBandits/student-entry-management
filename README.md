# Vue 3 + TypeScript + Vite

源代码：https://github.com/TwoBandits/student-entry-management.git

重要：该项目使用了 vite 来打包，打包后的文件在根目录的 dist 文件夹中，如果直接用游览器打开 index.html，会出现一个跨域错误。

原因：vite 是直接使用原生 ES6 模块打包的 <script type="module" />（是让浏览器接管了打包程序的部分工作），然而 ES6 模块遵循同源策略，加上 script 本来就会跨域和 file 协议不支持跨域，所以不能直接通过 file 协议直接打开，除非使用 http(s) 等支持跨域的协议。

- 解决方法一：VSCode 安装 Live Server 拓展插件，通过 VScode 来运行 dist 中的 index.html
- 解决方法二：启动一个本地服务器，`npm` 安装 `http-server` 包
- 解决方法三：暂时禁用浏览器的同源策略



## 技术栈:

- vue3 +  ts
- vite
- vue-router
- axios
- element plus
- dayjs
- lodash

## 

## 

