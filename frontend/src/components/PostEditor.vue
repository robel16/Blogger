<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Code from "@editorjs/code";
import Table from "@editorjs/table";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import axios from "axios";

const editor = ref(null);
const uploadProgress = ref(0);
const emit = defineEmits(["update:content", "upload-progress"]);

const uploadImageByFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");
    console.log("Token:", token);  // Debug log for token
    const response = await axios.post(
      "http://localhost:5000/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          uploadProgress.value = percentCompleted;
          emit("upload-progress", percentCompleted);
        },
      }
    );

    return {
      success: 1,
      file: {
        url: response.data.url,
      },
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    return { success: 0 };
  } finally {
    uploadProgress.value = 0;
  }
};

onMounted(() => {
  editor.value = new EditorJS({
    holder: "editor",
    placeholder: "Let's write an awesome story!",
    tools: {
      paragraph: {
        config: {
          placeholder: "Tell your story...",
        },
      },
      header: {
        class: Header,
        config: {
          levels: [1, 2, 3],
          defaultLevel: 2,
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      image: {
        class: Image,
        config: {
          uploader: {
            uploadByFile: uploadImageByFile,
          },
        },
      },
      code: Code,
      table: {
        class: Table,
        inlineToolbar: true,
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+O",
      },
      warning: Warning,
      marker: {
        class: Marker,
        shortcut: "CMD+SHIFT+M",
      },
      linkTool: {
        class: LinkTool,
        config: {
          endpoint: "http://localhost:5000/api/fetchUrl",
        },
      },
      embed: {
        class: Embed,
        config: {
          services: {
            youtube: true,
            codesandbox: true,
            codepen: true,
          },
        },
      },
    },
    data: {
      blocks: [
        {
          type: "paragraph",
          data: {
            text: "",
          },
        },
      ],
    },
    onChange: async () => {
      const content = await editor.value.save();
      emit("update:content", content);
    },
  });
});

const getContent = async () => {
  if (editor.value) {
    return await editor.value.save();
  }
  return null;
};

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

defineExpose({ getContent });
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div
      v-if="uploadProgress > 0"
      class="relative h-2 bg-gray-200 rounded mb-4"
    >
      <div
        class="absolute top-0 left-0 h-full bg-green-500 rounded transition-all duration-300"
        :style="{ width: `${uploadProgress}%` }"
      ></div>
      <span class="absolute -top-6 right-0 text-sm text-gray-600">
        Uploading: {{ Math.round(uploadProgress) }}%
      </span>
    </div>
    <div id="editor" class="min-h-[300px] prose max-w-none"></div>
  </div>
</template>

<style scoped>
.ce-block__content {
  max-width: none;
}

.ce-toolbar__content {
  max-width: none;
}

.cdx-block {
  @apply my-4;
}

.ce-paragraph {
  @apply text-lg leading-relaxed;
}

.ce-header {
  @apply font-bold;
}
</style>
