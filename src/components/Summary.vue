<template>
  <div>
    <h2><v-icon dark>list</v-icon> {{ res.titleSummary }}</h2>
    <v-card color="COLOR.CARD">
      <v-card-text>
        <div v-for="(text, index) in res.guideAdminSummary" v-bind:key="index">
          {{ text }}
        </div>
      </v-card-text>
    </v-card>
    <h3
      v-if="!activeEvent.key"
    >
      <v-icon dark>event_busy</v-icon>
      {{ res.statusNoActiveEvent }}
    </h3>
    <div
      v-else
    >
      <h3>
        <v-icon dark>event_available</v-icon> 
        {{ activeEvent.name }}
      </h3>
      <v-expansion-panel>
        <v-expansion-panel-content>
          <div slot="header">{{ res.labelAcceptsSummary }}</div>
          <table>
            <tr>
              <th>{{ res.labelBranch }}</th>
              <th>{{ res.labelMembership }}</th>
              <th>{{ res.labelUserName }}</th>
              <th
                v-for="(item, index) in costSummaryList.items"
                v-bind:key="index"
              >
                {{ item }}
              </th>
              <th>{{ res.labelSum }}</th>
            </tr>
            <tr
              v-for="user in costSummaryList.list"
              v-bind:key="user.key"
            >
              <td>{{ branch(user.branch) }}</td>
              <td>{{ membership(user.membership) }}</td>
              <td>{{ user.name }}</td>
              <td
                class="num"
                v-for="(item, index) in costSummaryList.items"
                v-bind:key="index"
              >
                {{ user.items[item] ? user.items[item].toLocaleString() : '' }}
              </td>
              <td
                class="num"
              >
                {{ user.total.toLocaleString() }}
              </td>
            </tr>
            <tr>
              <th colspan="3">{{ res.labelSumTotal }}</th>
              <td
                class="num"
                v-for="(item, index) in costSummaryList.items"
                v-bind:key="index"
              >
                {{ costSummaryList.summary[item].toLocaleString() }}
              </td>
              <td
                class="num"
              >
                {{ Object.values(costSummaryList.summary).reduce((ret, cur) => ret += cur, 0).toLocaleString() }}
              </td>
            </tr>
          </table>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">{{ res.titleLectureEntry }}</div>
          <table>
            <tr>
              <th>{{ res.labelBranch }}</th>
              <th>{{ res.labelMembership }}</th>
              <th>{{ res.labelUserName }}</th>
              <th
                v-for="(item, index) in lectureSummaryList.items"
                v-bind:key="index"
              >
                {{ item }}
              </th>
              <th>
                {{ res.labelSum }}
              </th>
            </tr>
            <tr
              v-for="user in lectureSummaryList.list"
              v-bind:key="user.key"
            >
              <td>{{ branch(user.branch) }}</td>
              <td>{{ membership(user.membership) }}</td>
              <td>{{ user.name }}</td>
              <td
                class="num"
                v-for="(item, index) in lectureSummaryList.items"
                v-bind:key="index"
              >
                {{ user.items[item] || '' }}
              </td>
              <td
                class="num"
              >
                {{ Object.values(user.items).reduce((ret, cur) => ret += cur, 0) }}
              </td>
            </tr>
            <tr>
              <th colspan="3">{{ res.labelSumTotal }}</th>
              <td
                class="num"
                v-for="(item, index) in lectureSummaryList.items"
                v-bind:key="index"
              >
                {{ lectureSummaryList.summary[item] }}
              </td>
              <td
                class="num"
              >
                {{ Object.values(lectureSummaryList.summary).reduce((ret, cur) => ret += cur, 0) }}
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
              <th>{{ res.labelBranch }}</th>
              <th>{{ res.labelMembership }}</th>
              <th>{{ res.labelUserName }}</th>
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
                    user.events[activeEvent.key].summary &&
                    user.events[activeEvent.key].summary.items.reduce(
                      (ret, cur) => cur.key === item.key ? true : ret, false
                    )"
            >
              <td>{{ branch(user.branch) }}</td>
              <td>{{ membership(user.membership) }}</td>
              <td>{{ user.name }}</td>
              <td
                class="value"
                v-if="item.list"
                v-for="(i, index) in item.list"
                v-bind:key="index"
              >{{ user.events[activeEvent.key].summary.items.reduce(
                      (ret, cur) => cur.key === item.key ? cur : ret, {}
                    ).value === (index + 1) ? '○' : ''}}</td>
            </tr>
          </table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
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
th {
  text-align: center;
}
td.num {
  text-align: right;
}
td.value {
  text-align: center;
}
</style>

<script>
import {mapGetters} from 'vuex'
import {GETTERS} from '../constants'

export default {
  data () {
    return {}
  },
  methods: {},
  computed: {
    ...mapGetters(GETTERS)
  }
}
</script>
