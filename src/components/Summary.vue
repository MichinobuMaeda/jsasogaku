<template>
  <div>
    <h2><v-icon dark>list</v-icon> {{ res.titleSummary }}</h2>
    <v-card color="grey lighten-3">
      <v-card-text>
        <div v-for="(text, index) in res.guideAdminSummary" v-bind:key="index">
          {{ text }}
        </div>
      </v-card-text>
    </v-card>
    <v-expansion-panel>
      <v-expansion-panel-content>
        <div slot="header">All</div>
        <table>
          <tr>
            <th>No.</th>
            <th>{{ res.labelUserName }}</th>
            <th>{{ res.labelMembership }}</th>
            <th>{{ res.labelBranch }}</th>
            <th
              v-for="item in activeEvent.items"
              v-bind:key="item.key"
            >
              {{ item.key }}
            </th>
            <th>{{ res.labelAcceptsSummary }}</th>
          </tr>
          <tr
            v-for="user in users"
            v-bind:key="user.key"
          >
            <td class="num">{{ ++seq }}</td>
            <td>{{ user.name }}</td>
            <td>{{ memberships.reduce((ret, cur) => cur.key === user.membership ? cur.text : ret, null) }}</td>
            <td>{{ branches.reduce((ret, cur) => cur.key === user.branch ? cur.text : ret, null) }}</td>
            <td
              v-for="item in activeEvent.items"
              v-bind:key="item.key"
              class="value"
            >
              {{
                  user.events[activeEvent.key] &&
                  user.events[activeEvent.key].entry
                    ? user.events[activeEvent.key].items[item.key]
                      ? item.list
                        ? user.events[activeEvent.key].items[item.key]
                        : '○'
                      : '×'
                    : '-' }}
            </td>
            <td class="num">
              {{
                user.events[activeEvent.key]
                  ? user.events[activeEvent.key].cost.toLocaleString()
                  : '-'
              }}
            </td>

          </tr>
        </table>
      </v-expansion-panel-content>
      <v-expansion-panel-content
        v-for="item in activeEvent.items"
        v-bind:key="item.key"
      >
        <div slot="header">{{ item.key }}. {{ item.name }}</div>
        <div style="display: none;">{{ seq = 0 }}</div>
        <table>
          <tr>
            <th>No.</th>
            <th>{{ res.labelUserName }}</th>
            <th>{{ res.labelMembership }}</th>
            <th>{{ res.labelBranch }}</th>
            <th
              v-if="item.list"
              v-for="(i, index) in item.list"
              v-bind:key="index"
            >{{ i.name }}</th>
          </tr>
          <tr
            v-for="user in users"
            v-bind:key="user.key"
            v-if="user.events[activeEvent.key] &&
                  user.events[activeEvent.key].entry &&
                  user.events[activeEvent.key].items[item.key]"
          >
            <td class="num">{{ ++seq }}</td>
            <td>{{ user.name }}</td>
            <td>{{ memberships.reduce((ret, cur) => cur.key === user.membership ? cur.text : ret, null) }}</td>
            <td>{{ branches.reduce((ret, cur) => cur.key === user.branch ? cur.text : ret, null) }}</td>
            <td
              class="value"
              v-if="item.list"
              v-for="(i, index) in item.list"
              v-bind:key="index"
            >{{ user.events[activeEvent.key].items[item.key] === (index + 1) ? '○' : ''}}</td>
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
td.num {
  text-align: right;
}
td.value {
  text-align: center;
}
</style>

<script>
import {getActiveEvent} from '../common'

export default {
  data () {
    return {
      seq: 0
    }
  },
  methods: {
  },
  computed: {
    res () {
      return this.$store.state.resources
    },
    users () {
      return this.$store.state.users
    },
    memberships () {
      return this.$store.state.memberships
    },
    branches () {
      return this.$store.state.branches
    },
    activeEvent () {
      return getActiveEvent(this.$store.state)
    }
  }
}
</script>
