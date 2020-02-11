// eventually this will handle loads of shit
// types of datatypes need different fields
// needs to check required / unique / defaults
// needs to check system / writable
// needs to update the row if it becomes dirty

Vue.component('v-detail', {
  template: `
  <div class="v-details--row_item">
    <label>{{ column.label }}</label><input placeholder="Label.." v-model="row['_' + column.name]"/>
  </div>`,
  props: ['row', 'column']
});