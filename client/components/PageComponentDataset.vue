<template>
  <div class="component-dataset">
    <Container
      class="component-dataset__inner"
      drag-class="dataset-item__ghost"
      drop-class="dataset-item__ghost--drop"
      :group-name="`dataset-${getRandomId}`"
      drag-handle-selector=".dataset-item__grab-handler"
      :get-child-payload="getItemPayload"
      :drop-placeholder="dropPlaceholderOptions"
      @drop="onDrop"
    >
      <Draggable
        v-for="(singleData, dataIndex) in dataset"
        :key="dataIndex"
        class="component-dataset__row"
      >
        <div class="columns is-multiline is-mobile">
          <Field
            v-for="(field, fieldIndex) in fields"
            :key="fieldIndex"
            css-class="column"
            :field-type="field.type"
            :label="field.label"
            :options="field.options"
            :value="singleData ? singleData[field.name] : null"
            :update="value => updateData(dataIndex, field.name, value)"
          />
        </div>
        <div class="component-dataset__inner-buttons buttons">
          <button class="button is-small is-info" @click="duplicate(dataIndex)">
            Duplicate
          </button>
          <button
            class="button is-small is-danger"
            @click="removeRow(dataIndex)"
          >
            Remove
          </button>
        </div>
        <span class="dataset-item__grab-handler">
          <fa icon="grip-vertical" />
        </span>
      </Draggable>
      <div class="component-dataset__actions">
        <button class="button is-small is-success" @click="addFieldsRow">
          Add +
        </button>
      </div>
    </Container>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { Container, Draggable } from 'vue-smooth-dnd';
import Field from '@/components/Field';
import { reorderItems } from '@/utils';

export default {
  name: 'PageComponentDataset',

  components: {
    Field,
    Container,
    Draggable,
  },

  props: {
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

    getFieldType(fieldTypeId) {
      return this.fieldTypes.find(field => field._id === fieldTypeId).type;
    },

    removeRow(rowIndex) {
      this.onUpdateData(
        this.dataset.filter((val, index) => index !== rowIndex)
      );
    },

    duplicate(rowIndex) {
      const newDataset = [...this.dataset];
      const duplicatedItem = {
        ...newDataset.find((val, index) => index === rowIndex),
      };
      newDataset.splice(rowIndex, 0, duplicatedItem);

      this.onUpdateData(newDataset);
    },

    getItemPayload(rowIndex) {
      return this.dataset.find((item, index) => index === rowIndex);
    },

    onDrop(dropResult) {
      const newDataset = [...this.dataset];
      this.onUpdateData(reorderItems(newDataset, dropResult));
    },

    updateData(index, fieldName, value) {
      const newDataset = this.dataset.map((fieldChunk, fieldChunkIndex) => {
        const newFieldChunk = { ...fieldChunk };

        if (index === fieldChunkIndex) {
          newFieldChunk[fieldName] = value;
        }

        return newFieldChunk;
      });

      this.onUpdateData(newDataset);
    },

    getRandomId() {
      return uuidv4();
    },
  },
};
</script>

<style lang="postcss">
.component-dataset {
  counter-reset: row-number;
  padding: var(--spacing-05);

  &__row {
    position: relative;
    padding: var(--spacing-25) var(--spacing) var(--spacing-05);
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
  }

  &__inner-buttons {
    justify-content: flex-end;

    &.buttons {
      margin: 0;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--spacing);
  }

  .control {
    min-width: 200px;

    .select,
    select {
      width: 100%;
    }
  }
}

.dataset-item {
  &__grab-handler {
    position: absolute;
    top: var(--spacing-025);
    right: var(--spacing-025);
    padding: var(--spacing-025) var(--spacing-05);
    color: var(--gray-darken);
    cursor: move;

    &:hover {
      color: var(--black);
    }
  }

  &__ghost {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--gray-dark);
    border: 2px solid var(--gray-darken);
    z-index: 3;

    & * {
      visibility: hidden;
      opacity: 0;
    }
  }
}

.smooth-dnd-container {
  &.vertical {
    & > .smooth-dnd-draggable-wrapper {
      &.columns {
        display: flex;
        overflow: visible;
      }
    }
  }
}
</style>
