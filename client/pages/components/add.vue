<template>
  <div class="component-add">
    <Panel title="Main parameters">
      <Form
        :form-schema="formMainParameters"
        :values="mainData"
        :update="updateMainParameters"
      />
    </Panel>

    <Panel title="Fields">
      <div class="fields">
        <Container
          class="draggable-forms-container"
          drag-class="draggable-form__ghost"
          drop-class="draggable-form__ghost--drop"
          :group-name="`draggable-form-${getRandomId}`"
          drag-handle-selector=".draggable-form__grab-handler"
          :get-child-payload="getItemPayload"
          :drop-placeholder="dropPlaceholderOptions"
          @drop="onFieldDrop"
        >
          <Draggable
            v-for="(field, index) of fields"
            :key="index"
            class="fields__item"
          >
            <DraggableForm>
              <template #form>
                <Form
                  :form-schema="formFields"
                  :update="updateFields.bind(undefined, index)"
                  :values="field"
                  :field-types="fieldTypes"
                />
              </template>
            </DraggableForm>
          </Draggable>

          <div class="component-dataset__actions">
            <button class="button is-small is-success" @click="addField">
              Add +
            </button>
          </div>
        </Container>
      </div>
    </Panel>

    <Panel
      v-for="(singleFieldset, singleFieldsetIndex) of fieldset"
      :key="singleFieldsetIndex"
      title="Fieldset"
    >
      <Form
        :form-schema="formMainParameters"
        :values="singleFieldset"
        :update="updateFieldsetData.bind(undefined, singleFieldsetIndex)"
      />
      <div class="fields">
        <Container
          class="draggable-forms-container"
          drag-class="draggable-form__ghost"
          drop-class="draggable-form__ghost--drop"
          :group-name="`draggable-form-${getRandomId}`"
          drag-handle-selector=".draggable-form__grab-handler"
          :get-child-payload="getItemPayload"
          :drop-placeholder="dropPlaceholderOptions"
          @drop="onFieldsetFieldDrop(singleFieldsetIndex)"
        >
          <Draggable
            v-for="(field, index) of singleFieldset.fields"
            :key="index"
            class="fields__item"
          >
            <DraggableForm>
              <template #form>
                <Form
                  :form-schema="formFields"
                  :update="
                    updateFieldsetFieldData.bind(
                      undefined,
                      singleFieldsetIndex,
                      index
                    )
                  "
                  :values="field"
                  :field-types="fieldTypes"
                />
              </template>
            </DraggableForm>
          </Draggable>

          <div class="component-dataset__actions">
            <button
              class="button is-small is-success"
              @click="addFieldsetField(singleFieldsetIndex)"
            >
              Add +
            </button>
          </div>
        </Container>
      </div>
    </Panel>
  </div>
</template>

<script>
import { Draggable, Container } from 'vue-smooth-dnd';
import { mapGetters, mapState } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import { Form, Panel, DraggableForm } from '@/components';

export default {
  computed: {
    ...mapGetters('componentPatterns', ['formFieldsAttributes']),
    ...mapState({
      fieldTypes: state => state.fieldTypes.types,
    }),

    formMainParameters() {
      const fieldsAttributes = this.formFieldsAttributes('componentPattern');

      return {
        name: {
          type: 'text',
          description: 'Camel case with first capital letter',
          attributes: fieldsAttributes.name,
        },
        label: {
          type: 'text',
          attributes: fieldsAttributes.label,
        },
        description: {
          type: 'text',
          attributes: fieldsAttributes.description,
        },
      };
    },

    formFields() {
      const fieldsAttributes = this.formFieldsAttributes('field');

      return {
        required: {
          type: 'boolean',
          attributes: fieldsAttributes.required,
        },
        fieldTypeId: {
          label: 'Field type',
          type: 'text',
          defaultValue: 'text',
          hidden: !this.getFieldTypeOptions(),
          options: this.getFieldTypeOptions(),
          attributes: fieldsAttributes.fieldTypeId,
        },
        name: {
          label: 'Name (camelCase)',
          type: 'text',
          attributes: fieldsAttributes.name,
        },
        label: {
          type: 'text',
          attributes: fieldsAttributes.label,
        },
        description: {
          type: 'text',
          attributes: fieldsAttributes.description,
        },
        definedOptionsId: {
          label: 'Options from global definition',
          type: 'text',
          attributes: fieldsAttributes.definedOptionsId,
        },
        options: {
          label: 'Custom options',
          type: 'list',
          attributes: fieldsAttributes.options,
        },
        defaultValue: {
          label: 'Default value',
          typeFrom: 'fieldTypeId',
          attributes: fieldsAttributes.defaultValue,
        },
      };
    },

    formFieldset() {
      const fieldsetAttributes = this.formFieldsAttributes('fieldset');

      return {
        required: {
          type: 'boolean',
          attributes: fieldsetAttributes.required,
        },
        name: {
          type: 'text',
          attributes: fieldsetAttributes.name,
        },
        label: {
          type: 'text',
          attributes: fieldsetAttributes.label,
        },
        description: {
          type: 'text',
          attributes: fieldsetAttributes.description,
        },
      };
    },
  },
  components: {
    Container,
    Draggable,
    DraggableForm,
    Form,
    Panel,
  },

  data() {
    return {
      mainData: {},
      fields: [{}],
      fieldset: [
        {
          fields: [{}],
        },
      ],
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
    };
  },

  mounted() {
    this.initPageData();
  },

  methods: {
    async initPageData() {
      await this.$store.dispatch('fieldTypes/fetchFieldTypes');
    },

    getFieldTypeOptions() {
      if (!this.fieldTypes) {
        return null;
      }

      return this.fieldTypes.map(fieldType => ({
        name: fieldType.type,
        value: fieldType._id,
      }));
    },

    updateMainParameters(fieldName, value) {
      this.mainData[fieldName] = value;
    },

    updateFields(index, fieldName, value) {
      if (Array.isArray(value) || !!this.formFields[fieldName].options) {
        this.$set(this.fields[index], fieldName, value);
      } else {
        this.fields[index][fieldName] = value;
      }
    },

    onFieldDrop() {
      console.log('test');
    },

    onFieldsetFieldDrop(fieldsetIndex) {
      console.log('test', fieldsetIndex);
    },

    addField() {
      this.fields.push({});
    },

    addFieldset() {
      this.fieldset.push({
        fields: [{}],
      });
    },

    addFieldsetField(fieldsetIndex) {
      this.fieldset[fieldsetIndex].fields.push({});
    },

    updateFieldsetData(fieldsetIndex, fieldName, value) {
      this.fieldset[fieldsetIndex][fieldName] = value;
    },

    updateFieldsetFieldData(fieldsetIndex, fieldIndex, fieldName, value) {
      if (
        Array.isArray(value) ||
        !!this.fieldset[fieldsetIndex].fields[fieldName].options
      ) {
        this.$set(
          this.fieldset[fieldsetIndex].fields[fieldIndex],
          fieldName,
          value
        );
      } else {
        this.fieldset[fieldsetIndex].fields[fieldIndex][fieldName] = value;
      }
    },

    getRandomId() {
      return uuidv4();
    },

    getItemPayload(index) {
      return index;
    },
  },
};
</script>

<style lang="postcss">
.fields {
  width: 100%;

  &__item {
    width: 100%;

    &:not(:last-of-type) {
      margin-bottom: var(--spacing);
    }
  }
}
</style>
