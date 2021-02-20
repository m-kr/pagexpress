<template>
  <form class="form">
    <div v-if="fields" class="form__fields">
      <Field
        v-for="(fieldSchema, fieldName) of fields"
        :key="fieldName"
        :hidden="isHidden(fieldSchema)"
        :field-type="getFieldType(fieldSchema)"
        :label="fieldSchema.label || getFieldLabel(fieldName)"
        :value="getValue(fieldSchema, fieldName)"
        :options="fieldSchema.options"
        :placeholder="fieldSchema.placeholder"
        :update="value => update(fieldName, value)"
        :css-class="`field--${getFieldType(fieldSchema)}`"
      />
    </div>
    <div v-if="fieldsGroups && fieldsGroups" class="form__fields-groups">
      <div
        v-for="(fieldsGroup, fieldsGroupName) of fieldsGroups"
        :key="fieldsGroupName"
        class="form__fields-group"
      >
        <p class="label">
          {{ fieldsGroup.label || getFieldLabel(fieldsGroupName) }}:
        </p>
        <Container
          v-if="values[fieldsGroupName] && values[fieldsGroupName].length"
          class="draggable-forms-container"
          drag-class="draggable-form__ghost"
          drop-class="draggable-form__ghost--drop"
          :group-name="`draggable-form-${getRandomId(fieldsGroupName)}`"
          drag-handle-selector=".draggable-form__grab-handler"
          :drop-placeholder="dropPlaceholderOptions"
          @drop="
            dropResult => reorderFieldsGroupItems(fieldsGroupName, dropResult)
          "
        >
          <Draggable
            v-for="(rowValues, rowIndex) of values[fieldsGroupName]"
            :key="`${fieldsGroupName}-${rowIndex}`"
            class="fields__item"
          >
            <DraggableForm type="nested">
              <template #form>
                <Field
                  v-for="(fieldSchema, fieldName) of fieldsGroup.fields"
                  :key="`${fieldsGroupName}-${rowIndex}-${fieldName}`"
                  :hidden="isHidden(fieldSchema)"
                  :field-type="getFieldType(fieldSchema)"
                  :label="fieldSchema.label || getFieldLabel(fieldName)"
                  :value="rowValues[fieldName]"
                  :options="fieldSchema.options"
                  :placeholder="fieldSchema.placeholder"
                  :update="
                    value =>
                      updateFieldsGroup(
                        fieldsGroupName,
                        rowIndex,
                        fieldName,
                        value
                      )
                  "
                  :css-class="`field--${getFieldType(fieldSchema)}`"
                />
              </template>
              <template #actions>
                <button
                  class="button is-small is-danger"
                  @click.prevent="
                    removeFieldsGroupItem(fieldsGroupName, rowIndex)
                  "
                >
                  Remove
                </button>
              </template>
            </DraggableForm>
          </Draggable>
        </Container>
        <div class="form__fields-group-actions buttons">
          <button
            class="button is-small is-success"
            @click.prevent="addFieldsGroupItem(fieldsGroupName)"
          >
            Add fields group item +
          </button>
        </div>
      </div>
      <div class="form__bottom-actions">
        <button
          v-if="removeButtonActive"
          class="button is-small is-danger"
          @click.prevent="selfDestroy"
        >
          Remove
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { Draggable, Container } from 'vue-smooth-dnd';
import { v4 as uuidv4 } from 'uuid';
import { Field, DraggableForm } from '@/components';
import { reorderItems } from '@/utils';

export default {
  name: 'Form',

  components: { Container, Draggable, DraggableForm, Field },

  props: {
    update: {
      type: Function,
      required: true,
    },

    selfDestroy: {
      type: Function,
      default: () => {},
    },

    removeButtonActive: {
      type: Boolean,
      default: false,
    },

    fieldTypes: {
      type: Array,
      default: () => [],
    },

    formSchema: {
      type: Object,
      default: () => {},
    },

    values: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
    };
  },

  computed: {
    fields() {
      const fields = {};

      for (const fieldName of Object.keys(this.formSchema)) {
        const fieldSchema = this.formSchema[fieldName];

        if (
          !this.shouldHideField(fieldSchema) &&
          !(fieldSchema.type && fieldSchema.type === 'fieldsGroup')
        ) {
          fields[fieldName] = fieldSchema;
        }
      }

      return fields;
    },

    fieldsGroups() {
      const fields = {};

      for (const fieldName of Object.keys(this.formSchema)) {
        const fieldSchema = this.formSchema[fieldName];

        if (
          !this.shouldHideField(fieldSchema) &&
          fieldSchema.type &&
          fieldSchema.type === 'fieldsGroup'
        ) {
          fields[fieldName] = fieldSchema;
        }
      }

      return fields;
    },
  },

  methods: {
    getValue(fieldSchema, fieldName) {
      return (
        this.values[fieldName] ||
        fieldSchema.defaultValue ||
        fieldSchema.attributes.default
      );
    },

    shouldHideField(fieldSchema) {
      if (
        fieldSchema.hideWhenFieldValue &&
        this.values[fieldSchema.hideWhenFieldValue]
      ) {
        return true;
      }

      return false;
    },

    getFieldType(fieldSchema) {
      if (fieldSchema.type) {
        return fieldSchema.type;
      }

      if (fieldSchema.typeFrom) {
        return this.getFieldTypeFrom(fieldSchema) || '';
      }

      return '';
    },

    getFieldTypeFrom(fieldSchema) {
      if (
        !(
          this.fieldTypes &&
          fieldSchema.typeFrom &&
          this.values[fieldSchema.typeFrom]
        )
      ) {
        return null;
      }

      const targetFieldType = this.fieldTypes.find(
        type => type._id === this.values[fieldSchema.typeFrom]
      );

      if (targetFieldType) {
        return targetFieldType.type;
      }

      return null;
    },

    isHidden(fieldSchema) {
      if (fieldSchema.hidden) {
        return true;
      }

      if (fieldSchema.typeFrom && !this.getFieldTypeFrom(fieldSchema)) {
        return true;
      }

      return false;
    },

    getRandomId(fieldName) {
      return `${fieldName}_${uuidv4()}`;
    },

    getFieldLabel(fieldName) {
      return `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}`;
    },

    getDefaultValueForType(type) {
      switch (type) {
        case 'text':
        case 'html':
          return '';
        case 'list':
          return [];
        default:
          return '';
      }
    },

    updateFieldsGroup(fieldsGroupName, rowIndex, fieldName, value) {
      const newFieldsGroupValue = [...this.values[fieldsGroupName]];
      newFieldsGroupValue[rowIndex] = {
        ...newFieldsGroupValue[rowIndex],
        [fieldName]: value,
      };

      this.update(fieldsGroupName, [...newFieldsGroupValue], true);
    },

    addFieldsGroupItem(fieldsGroupName) {
      const { fields } = this.fieldsGroups[fieldsGroupName];
      const fieldsGroupValue = this.values[fieldsGroupName] || [];
      const newItem = {};

      for (const itemFieldName of Object.keys(fields)) {
        const fieldType = fields[itemFieldName].type;

        newItem[itemFieldName] = this.getDefaultValueForType(fieldType);
      }

      this.update(fieldsGroupName, [...fieldsGroupValue, newItem]);
    },

    removeFieldsGroupItem(fieldsGroupName, itemIndex) {
      const fieldsGroupItems = [...this.values[fieldsGroupName]];

      this.update(
        fieldsGroupName,
        fieldsGroupItems.filter((item, index) => index !== itemIndex)
      );
    },

    reorderFieldsGroupItems(fieldsGroupName, dropResult) {
      const reorderedItems = reorderItems(
        [...this.values[fieldsGroupName]],
        dropResult
      );

      this.update(fieldsGroupName, reorderedItems);
    },
  },
};
</script>

<style lang="postcss">
.form {
  width: 100%;
  padding-bottom: var(--spacing);

  &__fields-group {
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: var(--spacing);

    &:not(:last-of-type) {
      margin-bottom: var(--spacing);
    }

    &-actions {
      display: flex;
      padding-top: var(--spacing);
    }
  }

  &__fields-groups .draggable-form,
  &__fields {
    display: flex;
    flex-wrap: wrap;
    grid-gap: var(--spacing);
    width: 100%;
    grid-template-columns: repeat(auto-fill, minmax(15em, auto));
  }

  &__bottom-actions {
    display: flex;
    justify-content: flex-end;
  }

  .select,
  select {
    width: 100%;
  }

  .field--boolean,
  .field--html,
  .field--list {
    width: 100%;
  }

  .field-wrapper {
    flex-grow: 1;
  }
}
</style>
