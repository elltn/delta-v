const DETAIL_COMPONENT_TEMPLATE = `
  <div class="v-details--row_item">
    <label>{{ column.label }}</label><input placeholder="Label.." v-model="row['_' + column.name]"/>
  </div>`;

Vue.component('v-detail', {
  template: DETAIL_COMPONENT_TEMPLATE,
  props: ['row', 'column']
});