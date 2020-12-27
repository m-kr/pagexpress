<template>
  <div class="field-list">
    <label :for="fieldId" class="label">{{ label }}</label>
    <div class="field is-fullwidth has-addons">
      <div class="control">
        <input
          v-if="!options.length"
          :id="fieldId"
          v-model="newItem"
          class="input"
          type="text"
          @keyup.enter="addItem"
        />
        <div v-else class="select">
          <select :id="fieldId" v-model="newItem">
            <option value="">-- Chose value --</option>
            <option
              v-for="(option, index) in options"
              :key="index"
              :value="option.value"
            >
              {{ option.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="control">
        <button class="button is-info" @click.prevent="addItem">
          <span>Add</span>
          <span class="icon">
            <fa icon="plus" />
          </span>
        </button>
      </div>
    </div>
    <Container
      tag="ul"
      drag-class="fieldlist-item__ghost"
      drop-class="fieldlist-item__ghost--drop"
      drag-handle-selector=".fieldlist-item__grab-handler"
      :group-name="`fieldlist-${getRandomId}`"
      :get-child-payload="getItemPayload"
      :drop-placeholder="dropPlaceholderOptions"
      @drop="onDrop"
    >
      <Draggable
        v-for="(value, index) of values"
        :key="index"
        class="fieldlist-item"
        tag="li"
      >
        <span class="fieldlist-item__grab-handler">
          <fa icon="grip-vertical" />
        </span>
        <span class="fieldlist-item__value">{{ value }}</span>
        <button
          class="button is-outlined is-danger is-small"
          @click="removeItem(value)"
        >
          <span class="icon is-small">
            <fa :icon="['fas', 'times']" />
          </span>
        </button>
      </Draggable>
    </Container>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { Container, Draggable } from 'vue-smooth-dnd';
import { reorderItems } from '@/utils';

export default {
  name: 'FieldList',

  components: {
    Container,
    Draggable,
  },

  props: {
    label: {
      type: String,
      required: true,
    },

    options: {
      type: Array,
      default: () => [],
    },

    values: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      newItem: '',
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
    };
  },

  computed: {
    fieldId() {
      const slug = this.label.replace(/\s/, '-').toLowerCase();
      const uniqueId = uuidv4().replace('-', '');
      return `${slug}_${uniqueId}`;
    },
  },

  methods: {
    addItem() {
      this.$emit('add', this.newItem);
      this.$emit('update', [...this.values, this.newItem]);
      this.newItem = '';
    },

    removeItem(removedValue) {
      this.$emit(
        'update',
        this.values.filter(val => val !== removedValue)
      );
    },

    onDrop(dropResult) {
      const newValues = [...this.values];
      this.$emit('update', reorderItems(newValues, dropResult));
    },

    getRandomId() {
      return uuidv4();
    },

    getItemPayload(rowIndex) {
      return this.values.find((item, index) => index === rowIndex);
    },
  },
};
</script>

<style lang="postcss" scoped>
li {
  margin-bottom: 0.5em;
}

.smooth-dnd-container {
  &.vertical {
    min-height: 0;

    & > .smooth-dnd-draggable-wrapper {
      display: flex;
      align-items: center;

      & > * {
        margin-right: var(--spacing-05);
      }
    }
  }
}

.fieldlist-item {
  padding: var(--spacing-025);
  border: 1px solid var(--gray-dark);
  background-color: var(--white);
  border-radius: var(--border-radius);

  &:not(:last-of-type) {
    margin-bottom: var(--spacing);
  }

  &__value {
    flex: 1 1 0;
    font-size: var(--font-md);
    font-weight: var(--font-weight-medium);
  }

  &__grab-handler {
    display: flex;
    align-items: center;
    padding: var(--spacing-025);
    margin-right: var(--spacing-025);
    color: var(--gray-dark);
    cursor: move;

    &:hover {
      color: var(--gray-darken);
    }
  }
}
</style>
