<template>
  <div>
    <h2><v-icon dark>list</v-icon> {{ res.titleSummary }}</h2>
    <v-expansion-panel>
      <v-expansion-panel-content>
        <div slot="header">All</div>
        <table>
          <tr>
            <th>{{ res.labelUserName }}</th>
            <th>{{ res.labelMembership }}</th>
            <th>{{ res.labelBranch }}</th>
            <th
              v-for="item in event.items"
              v-bind:key="item.key"
            >
              {{ item.key }}
            </th>
            <th>{{ res.labelAcceptsSummary }}</th>
          </tr>
          <tr
            v-for="user in list"
            v-bind:key="user.key"
          >
            <td>{{ user.name }}</td>
            <td>{{ memberships[user.membership] }}</td>
            <td>{{ branches[user.branch] }}</td>
            <td
              v-for="item in event.items"
              v-bind:key="item.key"
            >
              {{
                  user.events[event.key]
                    ? user.events[event.key].items[item.key]
                      ? item.list
                        ? user.events[event.key].items[item.key]
                        : '○'
                      : '×'
                    : '-' }}
            </td>
            <td>
              {{
                user.events[event.key]
                  ? user.events[event.key].cost.toLocaleString()
                  : '-'
              }}
            </td>

          </tr>
        </table>
      </v-expansion-panel-content>
      <v-expansion-panel-content
        v-for="item in event.items"
        v-bind:key="item.key"
      >
        <div slot="header">{{ item.key }}</div>
        <table>
          <tr>
            <th>{{ res.labelUserName }}</th>
            <th>{{ res.labelMembership }}</th>
            <th>{{ res.labelBranch }}</th>
            <th
              v-if="item.category === 'lecture'"
            >Title</th>
            <th
              v-if="item.list"
              v-for="(i, index) in item.list"
              v-bind:key="index"
            >{{ i.name }}</th>
          </tr>
          <tr
            v-for="user in list"
            v-bind:key="user.key"
            v-if="user.events[event.key] && user.events[event.key].items[item.key]"
          >
            <td>{{ user.name }}</td>
            <td>{{ memberships[user.membership] }}</td>
            <td>{{ branches[user.branch] }}</td>
            <td
              v-if="item.category === 'lecture'"
            >{{ user.events[event.key].items[item.key] }}</td>
            <td
              v-if="item.list"
              v-for="(i, index) in item.list"
              v-bind:key="index"
            >{{ user.events[event.key].items[item.key] === (index + 1) ? '○' : ''}}</td>
          </tr>
        </table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  border: solid 1px black;
  padding: 1px 2px 1px 2px;
}
</style>

<script>
export default {
  data () {
    return {
      list: Object.keys(this.$store.state.users).sort().map(key => ({
        key,
        ...this.$store.state.users[key]
      }))
    }
  },
  methods: {
  },
  computed: {
    res () {
      return this.$store.state.resources
    },
    memberships () {
      return this.$store.state.memberships.reduce((ret, cur) => ({...ret, [cur.key]: cur.text}), {})
    },
    branches () {
      return this.$store.state.branches.reduce((ret, cur) => ({...ret, [cur.key]: cur.text}), {})
    },
    event () {
      return this.$store.state.site.selectedEvent
    }
  }
}
</script>
