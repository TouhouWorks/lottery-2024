<script lang="ts" setup>
import { ref } from 'vue'

import type { UploadInstance } from 'element-plus'

const props = defineProps<{
  onChange: (file: { raw: File }) => void
  buttonText?: string
}>()

const uploadRef = ref<UploadInstance>()
const noticeText = ref(`${props.buttonText || '请选择照片'} ( <5MB )`)

function onChange(file: { raw: File }) {
  const fileType = file.raw.type
  if (!fileType.startsWith('image/')) {
    alert('请上传图片文件')
    uploadRef.value?.clearFiles()
    return
  }
  if (file.raw.size > 1024 * 1024 * 5) {
    alert('照片大小不能超过 5MB')
    uploadRef.value?.clearFiles()
    return
  }
  props.onChange(file)
  uploadRef.value?.clearFiles()
  // noticeText.value = `${file.raw.name}`;
}
</script>

<template>
  <el-upload
    ref="uploadRef" class="upload-demo" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :auto-upload="false" :on-change="onChange"
  >
    <template #trigger>
      <el-button type="primary">
        {{ noticeText }}
      </el-button>
    </template>

    <!-- <el-button class="ml-3" type="success" @click="submitUpload">
      upload to server
    </el-button> -->

    <!-- <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template> -->
  </el-upload>
</template>
