
<p align="center"><b>一个简洁的图片上传器</b></p>

# 目录

- [快速入门](#快速入门)
  - [安装](#安装)
  - [依赖](#依赖)
  - [用法](#用法)
- [维护者](#维护者)

## 快速入门

### 安装

```bash
$ npm i duo-image-uploader --save             # install duo-image-uploader   
```

### 依赖

[→ duo-image-viewer](https://www.npmjs.com/package/duo-image-viewer)

### 用法

#### main.js 文件：

```js

import duoImageUploader from 'duo-image-uploader'

Vue.use(duoImageUploader)

```
#### 使用：

```vue
<template>
  <div>
    <h1 class="description">点击按钮上传 →</h1>
    <duo-image-uploader
      :limit="limit"
      :maxSize="maxSize"
      :imageSrc="imageSrc"
      @errMessage="errMessage"
      :acceptType="acceptType"
      @uploadChange="uploadChange"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      limit: 3,
      imageSrc: [],   
      maxSize: 1024,
      acceptType: ['png', 'jpeg', 'jpg'],
    };
  },
  methods: {
    uploadChange(item, list) {
      console.log(item, list);
    },
    errMessage(message) {
      console.log(message);
    },
  }
};
</script>
```

[→ simple demo](https://duofuni.github.io/duo-image-uploader/)

## 维护者

- [duofuni](https://github.com/duofuni)