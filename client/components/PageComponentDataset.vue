<template>
  <div v-if="fieldTypes && fieldTypes.length" class="component-dataset">
    <div
      v-for="(singleData, dataIndex) in dataset"
      :key="dataIndex"
      class="component-dataset__row columns is-multiline is-mobile"
    >
      <div
        v-for="(field, fieldIndex) in fields"
        :key="fieldIndex"
        class="field-wrapper column is-one-third"
      >
        <FieldText
          v-if="isFieldType(field.fieldTypeId, 'text')"
          :label="field.label"
          :value="singleData ? singleData[field.name] : ''"
          @update="value => updateData(dataIndex, field.name, value)"
        />

        <FieldHtml
          v-if="isFieldType(field.fieldTypeId, 'html')"
          :label="field.label"
          :value="singleData ? singleData[field.name] : ''"
          @update="value => updateData(dataIndex, field.name, value)"
        />

        <FieldList
          v-if="isFieldType(field.fieldTypeId, 'list')"
          :label="field.label"
          :values="singleData ? singleData[field.name] : []"
          @update="value => updateData(dataIndex, field.name, value)"
        />
      </div>

      <button class="button is-small is-danger" @click="removeRow(dataIndex)">
        Remove
      </button>
    </div>
    <div class="component-dataset__actions">
      <button class="button is-small is-success" @click="addFieldsRow">
        Add +
      </button>
    </div>
  </div>
</template>

<script>
import FieldText from './FieldText';
import FieldHtml from './FieldHtml';
import FieldList from './FieldList';

export default {
  name: 'PageComponentDataset',

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
    data: {
      type: Array,
      default: () => [{}],
    },
    onUpdateData: {
      type: Function,
      required: true,
    },
  },

  computed: {
    dataset() {
      if (this.data.length) {
        return this.data;
      }

      return [{}];
    },
  },

  methods: {
    addFieldsRow() {
      this.onUpdateData([...this.dataset, {}]);
    },

    isFieldType(fieldTypeId, targetTypeName) {
      const fieldType = this.fieldTypes.find(
        field => field._id === fieldTypeId
      );

      return fieldType.type === targetTypeName;
    },

    removeRow(rowIndex) {
      this.onUpdateData(
        this.dataset.filter((val, index) => index !== rowIndex)
      );
    },

    updateData(index, fieldName, value) {
      const newDataset = this.dataset.map((fieldChunk, fieldChunkIndex) => {
        if (index === fieldChunkIndex) {
          fieldChunk[fieldName] = value;
        }
        return fieldChunk;
      });

      this.onUpdateData(newDataset);
    },
  },
};
</script>

<style scoped lang="postcss">
.component-dataset {
  counter-reset: row-number;
  padding: var(--spacing-05);

  &__row {
    position: relative;
    padding: var(--spacing-05);
    background-color: var(--gray-dark);
    counter-increment: row-number;

    &:not(:first-of-type) {
      margin-top: var(--spacing);
    }

    &::before {
      position: absolute;
      top: var(--spacing-05);
      left: var(--spacing-05);
      font-size: var(--font-small);
      font-weight: 700;
      color: var(--gray-darken);
      content: '#' counter(row-number);
    }

    .button {
      position: absolute;
      top: var(--spacing);
      right: var(--spacing);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
