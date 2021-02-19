export default function({ store, params, next }) {
  if (store.state.isDirty) {
    if (confirm('Do you really want to leave? You have unsaved changes!')) {
      store.dispatch('resetDirtyState');
      next(params);
    } else {
      next(false);
    }
  }
}
