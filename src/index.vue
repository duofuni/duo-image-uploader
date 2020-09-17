<template>
  <div class="duo-image-uploader">
    <div class="image-show-list">
      <ul style="display: inline-block">
        <li
          :key="item.name"
          v-for="item in selfImageSrc"
          :class="{
            'id-card-image': isIdCardClass,
            'image-box-preview-show': true
          }"
        >
          <img :src="item.url" class="image-item" />
          <div class="image-view">
            <div>
              <div @click="handlePreview(item.url)" class="search"></div>
              <div @click="handleDelete(item)" class="false"></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      :class="{
        'id-card-upload': isIdCardClass,
        'image-add-wrap': true
      }"
      v-if="isShowUploadImg"
    >
      <input type="file" @change="handleUpload" :accept="acceptType.join(',')" class="image-file" />
      <div class="image-add">
        <div class="plus"></div>
        <div class="upload-notice">
          <span class="accept-type-descript">{{ acceptTypeDescript }}</span>
        </div>
      </div>
    </div>
    <duo-image-viewer
      :src="previewUrl"
      @close="handleClose"
      :showViewer="showViewer"
      :srcList="imagePreviewerList"
    ></duo-image-viewer>
  </div>
</template>

<script>
import "./style/css/index.css";
import { imageFormatIsCorrect } from "../utils/image_verification.js";

export default {
  name: "duoImageUploader",
  data() {
    return {
      imgFiles: [],
      selfImageSrc: [],
      previewUrl: "",
      showViewer: false,
    };
  },
  watch: {
    imageSrc() {
      if (this.imageSrc.length) {
        this.selfImageSrc = this.imageSrc;
        this.imgFiles.push(...this.imageSrc);
      }
    },
  },
  props: {
    type: {
      type: String,
      default: "",
    },
    limit: {
      type: Number,
      default: 3,
    },
    imageSrc: {
      type: Array,
      default: [],
    },
    maxSize: {
      type: Number,
      default: 1024,
    },
    acceptType: {
      type: Array,
      default: [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    acceptTypeDescript() {
      let res = "";
      const acceptType = this.acceptType;
      acceptType.forEach(
        (item, index) =>
          (res += index < acceptType.length - 1 ? `${item}/` : item)
      );
      return res;
    },
    imagePreviewerList() {
      return this.selfImageSrc.map((item) => item.url);
    },
    // Make a judgment here: If the type is 'IDcard'
    isIdCardClass() {
      return this.type === "idCard";
    },
    // Make a judgment here: If the maximum limit is exceeded
    isShowUploadImg() {
      const disabled = this.disabled ? this.disabled : false;

      return this.selfImageSrc.length >= this.limit || disabled ? false : true;
    },
  },
  methods: {
    // Propagation imagePreviewer data
    // Open imagePreviewer
    handlePreview(url) {
      this.showViewer = !this.showViewer;
      this.previewUrl = url;
    },

    // Close imagePreviewer
    // reset imagePreviewer data
    handleClose() {
      this.showViewer = false;
      this.previewUrl = "";
    },

    // Delete image
    async handleDelete(imageItem) {
      const imageSrc = this.selfImageSrc.filter(
        (item) => item.url !== imageItem.url
      );
      this.selfImageSrc = imageSrc;
      this.imgFiles = [];
      this.showViewer = false;
      this.$emit("uploadChange", this.selfImageSrc);
    },

    // Local preview
    previewImg(imgFile) {
      this.selfImageSrc = this.selfImageSrc.concat(imgFile);
    },

    // Upload image
    handleUpload(event) {
      // feedback function
      const messageFeedback = (propsMessage) => {
        this.$emit("errMessage", propsMessage);
      };

      const imgFile = event.target.files[0];
      if (
        !imageFormatIsCorrect(
          imgFile,
          this.acceptType,
          this.acceptTypeDescript,
          this.maxSize,
          messageFeedback
        )
      ) {
        return;
      }

      let imageData = {
        name: `${new Date().getTime()}.${imgFile.type.split("/")[1]}`,
        url: URL.createObjectURL(imgFile),
      };
      this.imgFiles = this.imgFiles.concat(imageData);
      this.$emit("uploadChange", imgFile, this.imgFiles);
      this.previewImg(imageData);
    },

    // Destroy self images
    destroyData() {
      this.selfImageSrc = [];
      this.imgFiles = [];
    },
  },
};
</script>

<style>
</style>