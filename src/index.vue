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
          <div class="image-option-wrap">
            <div class="image-option">
              <div class="image-option-item" @click="handlePreview(item.url)">
                <i class="search"></i>
              </div>
              <div class="image-option-item" @click="handleDelete(item)">
                <i class="false"></i>
              </div>
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
      v-if="isShowUploadImage"
    >
      <input
        ref="file-input"
        type="file"
        @change="handleUpload"
        :accept="acceptType.join(',')"
        class="image-file"
      />
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
      imageFiles: [],
      selfImageSrc: [],
      previewUrl: "",
      showViewer: false,
    };
  },
  watch: {
    imageSrc() {
      if (this.imageSrc.length) {
        this.selfImageSrc = this.imageSrc;
        this.imageFiles.push(...this.imageSrc);
      }
    },
  },
  props: {
    mode: {
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
      return this.mode === "idCard";
    },
    // Make a judgment here: If the maximum limit is exceeded
    isShowUploadImage() {
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
      this.imageFiles = imageSrc;
      this.showViewer = false;
      // clear input value
      this.$refs["file-input"] && (this.$refs["file-input"].value = "");

      this.$emit("uploadChange", this.selfImageSrc, this.imageFiles);
    },

    // Local preview
    previewImg(imageFile) {
      this.selfImageSrc = this.selfImageSrc.concat(imageFile);
    },

    // Upload image
    handleUpload(event) {
      // feedback function
      const messageFeedback = (propsMessage) => {
        this.$emit("errMessage", propsMessage);
      };

      const imageFile = event.target.files[0];

      if (!imageFile) return;

      if (
        !imageFormatIsCorrect(
          imageFile,
          this.acceptType,
          this.acceptTypeDescript,
          this.maxSize,
          messageFeedback
        )
      )
        return;

      let imageData = {
        name: `${new Date().getTime()}.${imageFile.type.split("/")[1]}`,
        url: URL.createObjectURL(imageFile),
        file: imageFile,
      };
      this.imageFiles = this.imageFiles.concat(imageData);
      this.$emit("uploadChange", imageFile, this.imageFiles);
      this.previewImg(imageData);
    },

    // Destroy self images
    destroyData() {
      this.selfImageSrc = [];
      this.imageFiles = [];
    },
  },
};
</script>

<style>
</style>