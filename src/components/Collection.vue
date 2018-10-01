<template>
  <div>
    <h2><v-icon dark>payment</v-icon> {{ res.titleCollection }}</h2>
    <v-card color="COLOR.CARD">
      <v-card-text>
        <div v-for="(text, index) in res.guideAdminCollection" v-bind:key="index">
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
      <table>
        <tr>
          <th>{{ res.labelReceiptNo }}</th>
          <th>{{ res.labelBranch }}</th>
          <th>{{ res.labelMembership }}</th>
          <th>{{ res.labelUserName }}</th>
          <th>{{ res.labelSum }}</th>
          <th class="payment">{{ res.labelPaymentAmount }}</th>
          <th><span class="red--text">{{ res.labelPaymentBlance }}</span></th>
          <th
            v-for="(item, index) in costSummaryList.items"
            v-bind:key="index"
          >
            {{ item }}
          </th>
        </tr>
        <tr
          v-for="user in costSummaryList.list"
          v-bind:key="user.key"
        >
          <td class="num">{{ user.events[activeEvent.key].number }}</td>
          <td>{{ branch(user.branch) }}</td>
          <td>{{ membership(user.membership) }}</td>
          <td>{{ user.name }}</td>
          <td
            class="num payment"
          >
            {{ user.total.toLocaleString() }}
          </td>
          <td
            class="num"
          >
            <span
              v-if="targetNumber === user.events[activeEvent.key].number"
            >
              <v-text-field
                v-model="targetPayment"
                prefix="¥"
                :rules="numberRules"
              ></v-text-field>
            </span>
            <span
              v-else
            >
              {{ user.payment.toLocaleString() }}
            </span>
            <v-btn
              small
              color="primary"
              v-if="targetNumber === user.events[activeEvent.key].number && !startUpdate"
              @click="save(user)"
            >
              {{ res.labelSave }}
            </v-btn>
            <v-btn
              small
              color="primary"
              v-else-if="targetNumber === user.events[activeEvent.key].number && startUpdate"
              disabled
            >
              {{ res.labelSave }}
            </v-btn>
            <v-btn
              flat icon color="blue darken-1"
              v-else
              @click="selectTarget(user)"
            >
              <v-icon>edit</v-icon>
            </v-btn>
          </td>
          <td
            class="num"
          >
            <span v-if="(user.total - user.payment) !== 0" class="red--text">
              {{ (user.total - user.payment).toLocaleString() }}
            </span>
            <span v-else>
              0
            </span>
          </td>
          <td
            class="num"
            v-for="(item, index) in costSummaryList.items"
            v-bind:key="index"
          >
            {{ user.items[item] ? user.items[item].toLocaleString() : '' }}
          </td>
        </tr>
        <tr>
          <th colspan="4">{{ res.labelSumTotal }}</th>
          <td
            class="num"
          >
            {{ Object.values(costSummaryList.summary).reduce((ret, cur) => ret += cur, 0).toLocaleString() }}
          </td>
          <td
            class="num"
          >
            {{ costSummaryList.list.reduce((ret, cur) => ret += cur.payment, 0).toLocaleString() }}
          </td>
          <td
            class="num"
          >
            <span v-if="costSummaryList.list.reduce((ret, cur) => ret += (cur.total - cur.payment), 0) !== 0" class="red--text">
              {{ costSummaryList.list.reduce((ret, cur) => ret += (cur.total - cur.payment), 0).toLocaleString() }}
            </span>
            <span v-else>
              0
            </span>
          </td>
          <td
            class="num"
            v-for="(item, index) in costSummaryList.items"
            v-bind:key="index"
          >
            {{ costSummaryList.summary[item].toLocaleString() }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.num {
  font-family: "Lucida Console", Monaco, monospace;
}
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
th.payment, td.payment  {
  width: 8em;
}
</style>

<script>
import {mapGetters} from 'vuex'
import {GETTERS, DB, REGEX} from '../constants'
import {updateUserPayment} from '../handlers'

export default {
  data () {
    return {
      targetNumber: 0,
      targetPayment: 0,
      startUpdate: false,
      numberRules: [
        v => !!v || this.res.validationRequired,
        v => REGEX.INTEGER.test(v) || this.res.validationInteger
      ]
    }
  },
  methods: {
    selectTarget (user) {
      this.targetNumber = user.events[this.activeEvent.key].number
      this.targetPayment = user.events[this.activeEvent.key].payment || 0
    },
    async save (user) {
      this.startUpdate = true
      await updateUserPayment(this.collection(DB.USERS), user, this.activeEvent, this.targetPayment)
      this.targetNumber = 0
      this.targetPayment = 0
      this.startUpdate = false
    }
  },
  computed: {
    ...mapGetters(GETTERS)
  }
}
</script>
