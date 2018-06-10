<template>
  <table
    v-if="summary"
  >
    <tr>
      <th colspan="2">{{ res.labelUserSumName }}</th>
      <th>{{ res.labelUserSumPrice }}</th>
    </tr>
    <tr
      v-for="item in summary.items"
      v-bind:key="item.key"
    >
      <td>{{ item.key }}</td>
      <td>{{
        (item.categoryName ? '【' + item.categoryName + '】' : '')
        + item.name
        + (item.selection ? ' : ' + item.selection : '')
      }}</td>
      <td class="num">{{ item.cost ? item.cost.toLocaleString() : '-' }}</td>
    </tr>
    <tr>
      <th colspan="2">{{ res.labelUserSumTotal }}</th>
      <td class="num">{{ summary.total.toLocaleString() }}</td>
    </tr>
  </table>
  <div
    v-else
  >{{ res.labelNoEntryData }}</div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  border: solid 1px black;
  padding: 1px 2px 1px 2px;
}
td.num {
  text-align: right;
}
</style>

<script>
import {getSummaryTable} from '../common'

export default {
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    res () {
      return this.$store.state.resources
    },
    summary () {
      return getSummaryTable(this.$store.state)
    }
  }
}
</script>
