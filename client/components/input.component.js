Vue.component('v-input', {
  template: /*html*/`
    <div class="v-input">
      <input :placeholder="placeholder">
    </div>
  `,
  props: ['placeholder', 'label', 'value']
});