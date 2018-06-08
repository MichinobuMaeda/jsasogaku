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
      let activeUser = this.$store.state.site.activeUser
      let activeEvent = this.$store.state.site.activeEvent
      let event = this.$store.state.events.reduce(
        (cur, ret) => cur.key === activeEvent ? cur : ret,
        {}
      )
      const categoryNames = {
        GA: '',
        lecture: this.$store.state.resources.titleLectureEntry,
        excursion: this.$store.state.resources.titleExcursion
      }
      return this.$store.state.users.reduce(
        (ret, cur) => cur.key === activeUser
          ? cur.events[activeEvent]
            ? cur.events[activeEvent].summary
              ? {
                total: cur.events[activeEvent].summary.total,
                items: cur.events[activeEvent].summary.items
                  .map(item => {
                    let ref = event.items.reduce(
                      (ret, cur) => cur.key === item.key ? cur : ret,
                      {}
                    )
                    return {
                      ...item,
                      name: ref.name,
                      categoryName: categoryNames[ref.category],
                      selection: ref.list
                        ? ref.list[item.value - 1].name
                        : null
                    }
                  })
              }
              : null
            : ret
          : ret
        , null
      )
    }
  }
}
</script>
