<template>
  <div v-if="component" class="modal is-active">
    <div class="modal-background" @click="toggleVisibility"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span>{{ componentPattern.label }}</span>
          <small>{{ componentPattern.description }}</small>
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="toggleVisibility"
        ></button>
      </header>
      <div class="modal-card-body">
        <div v-if="componentPattern.fields" class="fields-container">
          <PageComponentData
            :fields="componentPattern.fields"
            :component-name="componentPattern.name"
            :data="component.data"
            :on-update-data="updateData"
          />
        </div>
        <div
          v-if="componentPattern && componentPattern.fieldset"
          class="fieldset-container"
        >
          <PageComponentDataset
            v-for="singleFieldset in componentPattern.fieldset"
            :key="singleFieldset._id"
            :fields="singleFieldset.fields"
            :data="
              component.data ? component.data[singleFieldset.name] : undefined
            "
            :on-update-data="value => updateData(singleFieldset.name, value)"
          />
        </div>
      </div>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="saveAndClose">
          Save & close
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import PageComponentData from './PageComponentData';
import PageComponentDataset from './PageComponentDataset';

export default {
  name: 'ModalComponent',

  components: {
    PageComponentData,
    PageComponentDataset,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    componentPatterns: {
      type: Array,
      required: true,
    },

    component: {
      type: Object,
      default: () => {},
    },

    save: {
      type: Function,
      required: true,
    },

    toggleVisibility: {
      type: Function,
      required: true,
    },

    updateComponent: {
      type: Function,
      required: true,
    },
  },

  computed: {
    componentPattern() {
      return this.componentPatterns.find(
        pattern => pattern._id === this.component.componentPatternId
      );
    },
  },

  methods: {
    updateData(fieldName, value) {
      this.updateComponent({
        _id: this.component._id,
        data: {
          ...this.component.data,
          [fieldName]: value,
        },
      });
    },

    saveAndClose() {
      this.save();
      this.toggleVisibility();
    },
  },
};
</script>

<style lang="postcss" scoped>
.modal {
  z-index: 999;
}
</style>
