<template>
  <div id="app">
    <h1>
      <div>VueとQuill.jsのサンプル</div>
    </h1>
    <quill-editor :value="state.editorText" @editor-change="input" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import QuillEditor from "./components/QuillEditor.vue";

interface State {
  editorText: Object;
}

export default defineComponent({
  name: "App",
  components: {
    QuillEditor,
  },
  setup() {
    const state = reactive<State>({
      editorText: "",
    });
    const input = (text: Object) => {
      state.editorText = text;
    };
    return { state, input };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#vue-quill-editor {
  border: solid;
}
</style>
