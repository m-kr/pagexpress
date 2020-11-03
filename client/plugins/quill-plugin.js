import Vue from 'vue';
import VueQuillEditor from 'vue-quill-editor';
import { betterQuillLink } from '@/extensions';

betterQuillLink.register();

Vue.use(VueQuillEditor);
