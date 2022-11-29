<template>
  <div class="editor-container">
    <div id="vue-quill-editor" ref="quillEditor"></div>
  </div>
  <div>
    <pre>
      {{ editorValue }}
    </pre>
  </div>
</template>

<script lang="ts">
import Quill from "quill";
import { defineComponent, reactive, onMounted, ref, computed } from "vue";
import type { SetupContext } from "vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

import { uploadImage } from "../services/uploadImage";

interface State {
  editor: Quill | null;
}
interface Props {
  value: Object;
}

export default defineComponent({
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },

  setup(props: Props, ctx: SetupContext) {
    const state = reactive<State>({ editor: null });
    const quillEditor = ref<HTMLDivElement>();
    const editorValue = computed(() => props.value);
    const update = () => {
      if (!state.editor) return;
      ctx.emit("editor-change", state.editor.getContents());
    };

    const imageHandler = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.click();

      input.onchange = async () => {
        if (input.files === null || !state.editor) return;
        const file = input.files[0];
        // TODO: ファイル検証して画像以外の場合、弾く
        const imageUrl = await uploadImage(file);
        const range = state.editor.getSelection();

        if (imageUrl && range) {
          state.editor.insertEmbed(range.index, "image", imageUrl);
        }
      };
    };

    onMounted(() => {
      if (!quillEditor.value) return;
      const editor = new Quill(quillEditor.value, {
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, false] }],
              ["bold", "italic", "underline", "strike", "clean"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["link"],
              ["image"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
        },
        theme: "snow",
        formats: ["link", "bold", "underline", "header", "italic", "image"],
        bounds: document.body,
        debug: "warn",
        placeholder: "文章を入力してください。",
        readOnly: false,
      });
      // TODO: DivElement扱いする
      editor.container.addEventListener(
        "drop",
        async (event) => {
          if (
            !event.dataTransfer.files ||
            event.dataTransfer.files.length == 0
          ) {
            return;
          }
          event.stopPropagation();
          event.preventDefault();

          const files = event.dataTransfer.files;
          const file = files[0];
          const range = editor.getSelection(true);

          const imageUrl = await uploadImage(file);

          editor.insertEmbed(range.index, "image", imageUrl, "user");
        },
        false
      );

      editor.setContents(props.value as any, "user");
      editor.on("editor-change", () => update());
      state.editor = editor;
    });
    return {
      state,
      quillEditor,
      update,
      editorValue,
    };
  },
});
</script>
<style lang="scss" scoped>
.ql-container {
  font-size: 18px;
  height: 100%;
  width: 100%;
}
</style>
