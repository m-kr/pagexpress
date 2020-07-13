<template>
  <div v-if="fieldTypes && fieldTypes.length" class="component-dataset">
    <div
      v-for="(data, dataIndex) in dataset"
      :key="dataIndex"
      class="component-dataset__row"
    >
      <div
        v-for="(field, fieldIndex) in fields"
        :key="fieldIndex"
        class="field-wrapper"
      >
        <FieldText
          v-if="isFieldType(field.fieldTypeId, 'text')"
          :label="field.name"
          :value="data ? data[field.name] : null"
          @update="value => updateData(dataIndex, field.name, value)"
        />

        <FieldHtml
          v-if="isFieldType(field.fieldTypeId, 'html')"
          :label="field.name"
          :value="data ? data[field.name] : null"
          @update="value => updateData(dataIndex, field.name, value)"
        />

        <FieldList
          v-if="isFieldType(field.fieldTypeId, 'list')"
          :label="field.name"
          :values="data ? data[field.name] : null"
          @update="value => updateData(dataIndex, field.name, value)"
        />
      </div>
    </div>
    <div class="component-dataset__actions">
      <button class="button is-small is-success">Add +</button>
    </div>
  </div>
</template>

<script>
import FieldText from './FieldText';
import FieldHtml from './FieldHtml';
import FieldList from './FieldList';

export default {
  name: 'PageComponentData',

  components: {
    FieldHtml,
    FieldText,
    FieldList,
  },

  props: {
    fieldTypes: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
    dataset: {
      type: Array,
      default: () => [],
    },
    onUpdateData: {
      type: Function,
      required: true,
    },
  },

  methods: {
    updateData(index, fieldName, value) {
      const newDataset = this.dataset.map((fieldChunk, fieldChunkIndex) => {
        if (index === fieldChunkIndex) {
          fieldChunk[fieldName] = value;
        }
      });

      this.onUpdateData(newDataset);
    },

    addFieldsRow(fieldsetName) {
      this.onUpdateData([...this.dataset, []]);
    },

    isFieldType(fieldTypeId, targetTypeName) {
      const fieldType = this.fieldTypes.find(
        field => field._id === fieldTypeId
      );

      return fieldType.type === targetTypeName;
    },
  },
};
</script>

<style scoped>
.field-wrapper {
  &:not(:first-of-type) {
    margin-top: var(--spacing);
  }
}
</style>
