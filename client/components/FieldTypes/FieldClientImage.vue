<template>
  <div class="field is-fullwidth">
    <label class="label">{{ label }}</label>
    <div class="row field-row">
      <div class="col-6">
        <label :for="fieldId('image-name')">Image Name</label>
        <input
          :id="fieldId('image-name')"
          v-model="mutableValue.imageName"
          class="input"
          type="text"
          placeholder="image-name.png"
          @change="onChange()"
        />
      </div>
      <div class="col-6">
        <label :for="fieldId('image-name')">Alt attribute value</label>
        <input
          :id="fieldId('image-alt')"
          v-model="mutableValue.imageAlt"
          class="input"
          type="text"
          placeholder="Image alt attribute"
          @change="onChange()"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-8">
        <label class="d-block mb-1">Breakpoints</label>
        <div class="d-flex">
          <label
            v-for="(breakpointChecked,
            breakpoint) in mutableValue.sourcesBreakpoints"
            :key="breakpoint"
            :for="fieldId('breakpoint' + breakpoint)"
            class="checkbox breakpoint-checkbox"
          >
            <input
              :id="fieldId('breakpoint' + breakpoint)"
              v-model="mutableValue.sourcesBreakpoints[breakpoint]"
              type="checkbox"
              @change="onChange()"
            />
            {{ breakpoint }}
          </label>
        </div>
      </div>
      <div class="col-4">
        <label class="d-block" :for="fieldId('retina')">Retina</label>
        <input
          :id="fieldId('retina')"
          v-model="mutableValue.isRetina"
          type="checkbox"
          @change="onChange()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase';
import { v4 as uuidv4 } from 'uuid';
import { mapState } from 'vuex';

export default {
  name: 'FieldClientImage',
  props: {
    label: {
      type: String,
      required: true,
    },

    value: {
      type: Object,
      default: () => ({
        src: '',
        srcset: '',
        sources: {},
      }),
    },

    componentName: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      mutableValue: {
        imageName: this.value?.src,
        imageAlt: this.value?.alt,
        isRetina: !!this.value?.srcset,
        sourcesBreakpoints: {
          xs: !!this.value?.sources?.xs,
          sm: !!this.value?.sources?.sm,
          md: !!this.value?.sources?.md,
          lg: !!this.value?.sources?.lg,
          xl: !!this.value?.sources?.xl,
          xxl: !!this.value?.sources?.xxl,
        },
      },
      ids: {},
    };
  },

  computed: {
    ...mapState({
      siteInfo: state => state.siteInfo,
    }),
  },

  methods: {
    fieldId(name) {
      if (!this.ids[name]) {
        const slug = name.replace(/\s/, '-').toLowerCase();
        const uniqueId = uuidv4().replace('-', '');
        this.ids[name] = `${slug}_${uniqueId}`;
      }

      return this.ids[name];
    },
    onChange() {
      const imagesPath = this.siteInfo?.imagesPath;
      const imageName = this.mutableValue.imageName;
      const alt = this.mutableValue.imageAlt;
      const componentName = _kebabCase(this.componentName);
      const extension = imageName.substr(imageName.lastIndexOf('.'));
      let src;
      let srcset;
      const sources = {};

      if (
        !imageName ||
        !componentName ||
        !imagesPath ||
        imageName.substr(0, 1) === '/'
      ) {
        src = imageName;
      } else {
        src = imagesPath + '/' + componentName + '/' + imageName;
        this.mutableValue.imageName = src;
      }

      if (src) {
        if (this.mutableValue.isRetina) {
          const src2x = src.replace(extension, '@2x' + extension);
          srcset = src + ' 1x, ' + src2x + ' 2x';
        }

        for (const [breakpoint, checked] of Object.entries(
          this.mutableValue.sourcesBreakpoints
        )) {
          const breakpointImageName = src.replace(
            extension,
            '-' + breakpoint + extension
          );

          if (checked === true) {
            sources[breakpoint] = breakpointImageName;
          }
        }
      }

      const value = {
        alt,
        src,
        srcset,
        sources,
      };

      this.$emit('update', value);
    },
  },
};
</script>

<style lang="postcss" scoped>
.field-row {
  &:not(:last-of-type) {
    margin-bottom: var(--spacing-2);
  }
}

.breakpoint-checkbox {
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > input {
    margin-right: 0;
  }
}
.d-block {
  display: block;
}
.d-flex {
  display: flex;
}
.row {
  width: 100%;
  display: flex;
  & > div {
    position: relative;
    width: 100%;
    padding-left: 7.5px;
    padding-right: 7.5px;
  }
}
.col-2 {
  flex: 0 0 16.66666%;
  max-width: 16.66666%;
}
.col-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
}
.col-6 {
  flex: 0 0 50%;
  max-width: 50%;
}
.mb-1 {
  margin-bottom: 5px;
}
</style>
