<template>
  <div class="field is-fullwidth">
    <label :for="label" class="label">{{ label }}</label>
    <div class="control">
      <client-only>
        <quill-editor
          ref="editor"
          :content="value"
          :options="editorOption"
          @change="onChange($event)"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldHtml',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      editorOption: {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [2, 3, 4, 5, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote'],
            ['clean'],
          ],
        },
      },
    };
  },
  methods: {
    onChange({ html }) {
      this.$emit('update', html);
    },
  },
};
</script>
