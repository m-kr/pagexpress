<template>
  <div class="component-add">
    <Toolbar>
      <template v-slot:left>
        <button class="button is-info" @click="addField">
          Add field +
        </button>

        <button class="button is-info" @click="addFieldset">
          Add fieldset +
        </button>
      </template>

      <template v-if="unsavedState" v-slot:right>
        <button class="button is-success" @click="updateComponentPattern">
          Update component
        </button>
      </template>
    </Toolbar>
    <Panel title="Main parameters">
      <Form
        :form-schema="formMainParameters"
        :values="componentPatternMainData"
        :update="updateMainParameters"
      />
    </Panel>

    <Panel v-if="componentPatternFields" title="Fields">
      <div class="fields">
        <Container
          class="draggable-forms-container"
          drag-class="draggable-form__ghost"
          drop-class="draggable-form__ghost--drop"
          :group-name="`draggable-form-${randomId}`"
          drag-handle-selector=".draggable-form__grab-handler"
          :drop-placeholder="dropPlaceholderOptions"
          @drop="reorderFields"
        >
          <Draggable
            v-for="(field, index) of componentPatternFields"
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
      v-for="(singleFieldset, singleFieldsetIndex) of componentPatternFieldset"
      :key="singleFieldsetIndex"
      title="Fieldset"
    >
      <Form
        :form-schema="formFieldset"
        :values="singleFieldset"
        :update="updateFieldsetData.bind(undefined, singleFieldsetIndex)"
      />
      <div class="fields">
        <Container
          class="draggable-forms-container"
          drag-class="draggable-form__ghost"
          drop-class="draggable-form__ghost--drop"
          :group-name="`draggable-form-${randomId}`"
          drag-handle-selector=".draggable-form__grab-handler"
          :drop-placeholder="dropPlaceholderOptions"
          @drop="
            dropResults => onFieldsetFieldDrop(singleFieldsetIndex, dropResults)
          "
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
import { mapGetters, mapState, mapActions } from 'vuex';
import { Form, Panel, DraggableForm, Toolbar } from '@/components';

export default {
  components: {
    Container,
    Draggable,
    DraggableForm,
    Form,
    Panel,
    Toolbar,
  },

  data() {
    return {
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

  computed: {
    ...mapGetters('componentPatterns', [
      'formMainParameters',
      'formFields',
      'formFieldset',
      'randomId',
    ]),
    ...mapState('componentPatterns', [
      'componentPatternMainData',
      'componentPatternFields',
      'componentPatternFieldset',
      'fieldTypes',
      'componentId',
      'unsavedState',
    ]),
  },

  mounted() {
    this.$store.dispatch(
      'componentPatterns/initEditComponentViewData',
      this.$route.params.componentId
    );
  },

  methods: {
    ...mapActions('componentPatterns', [
      'updateComponentPattern',
      'addField',
      'addFieldset',
      'addFieldsetField',
      'reorderFields',
      'reorderFieldsetFields',
    ]),

    updateMainParameters(fieldName, value) {
      this.$store.dispatch(
        'componentPatterns/updateComponentPatternMainParameters',
        {
          fieldName,
          value,
        }
      );
    },

    updateFields(fieldIndex, fieldName, value) {
      this.$store.dispatch('componentPatterns/updateComponentPatternField', {
        fieldIndex,
        fieldName,
        value,
      });
    },

    updateFieldsetData(fieldsetIndex, fieldName, value) {
      this.$store.dispatch('componentPatterns/updateFieldsetData', {
        fieldsetIndex,
        fieldName,
        value,
      });
    },

    updateFieldsetFieldData(fieldsetIndex, fieldIndex, fieldName, value) {
      this.$store.dispatch(
        'componentPatterns/updateComponentPatternFieldsetField',
        {
          fieldsetIndex,
          fieldIndex,
          fieldName,
          value,
        }
      );
    },

    onFieldsetFieldDrop(fieldsetIndex, dropResult) {
      this.reorderFieldsetFields({ fieldsetIndex, dropResult });
    },

    async createComponent() {
      await this.addComponentPattern();

      if (this.componentId) {
        await this.$router.push({
          path: `/components/${this.componentId}/edit`,
        });
      }
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