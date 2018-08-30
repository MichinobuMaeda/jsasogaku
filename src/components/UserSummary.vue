<template>
  <table
    v-if="summary(activeUser.key, activeEvent.key)"
  >
    <tr>
      <th colspan="2">{{ res.labelUserSumName }}</th>
      <th>{{ res.labelUserSumPrice }}</th>
    </tr>
    <tr
      v-for="item in summary(activeUser.key, activeEvent.key).items"
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
      <td class="num">{{ summary(activeUser.key, activeEvent.key).total.toLocaleString() }}</td>
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
import {mapGetters} from 'vuex'
import {GETTERS} from '../constants'

export default {
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    ...mapGetters(GETTERS)
  }
}
</script>
