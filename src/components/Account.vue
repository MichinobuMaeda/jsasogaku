<template>
  <div>
    <h2><v-icon dark>account_circle</v-icon> {{ res.titleAccounts }}</h2>
    <v-card color="grey lighten-3">
      <v-card-text>
        <div v-for="(text, index) in res.guideAdminAccount" v-bind:key="index">
          {{ text }}
        </div>
      </v-card-text>
    </v-card>
    <table>
      <tr>
        <th>{{ res.labelAccountValid }}</th>
        <th>{{ res.labelAdmin }}</th>
        <th>{{ res.labelEmail }}</th>
        <th class="account-id">Account ID</th>
        <th>{{ res.labelUserName }}</th>
        <th>{{ res.labelMembership }}</th>
        <th>{{ res.labelBranch }}</th>
      </tr>
      <tr v-for="item in list" v-bind:key="item.key">
        <td class="valid">
          <v-btn
            flat icon
            @click="toggleValid(item.key)"
            :color="item.valid ? 'black' : 'red'"
          >
            <v-icon v-if="item.valid">check</v-icon>
            <v-icon v-else>close</v-icon>
          </v-btn>
        </td>
        <td class="admin">
          <v-btn
            flat icon
            @click="toggleAdmin(item.key)"
            :color="item.admin ? 'red' : 'black'"
          >
            <v-icon v-if="item.admin">grade</v-icon>
            <v-icon v-else>remove</v-icon>
          </v-btn>
        </td>
        <td class="email">{{ item.email }}</td>
        <td class="account-id">{{ item.key }}</td>
        <td>
          <div
            v-for="user in users.filter(user => user.uid === item.key)"
            v-bind:key="user.key"
          >
            {{ user.name }}
          </div>
        </td>
        <td>
          <div
            v-for="user in users.filter(user => user.uid === item.key)"
            v-bind:key="user.key"
          >
            {{ memberships.reduce((ret, cur) => cur.key === user.membership ? cur.text : ret, null) }}
          </div>
        </td>
        <td>
          <div
            v-for="user in users.filter(user => user.uid === item.key)"
            v-bind:key="user.key"
          >
            {{ branches.reduce((ret, cur) => cur.key === user.branch ? cur.text : ret, null) }}
          </div>
        </td>
      </tr>
    </table>
    <v-btn
      color="primary"
      :disabled="submitted"      
      @click="submit"
    >
      {{ res.labelSave }}
    </v-btn>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  border: solid 1px black;
  padding: 1px 4px 1px 4px;
}
td.valid, td.admin {
  text-align: center;
}
td.account-id {
  font-family: 'Courier New', Courier, monospace;
  font-size: 90%;
}
</style>

<script>
import {BACK_PAGE, DB_ACCOUNTS, getFirestore} from '../common'
import {onSubmitAccounts} from '../handlers'

export default {
  data () {
    return {
      list: Object.keys(this.$store.state.accounts).sort().map(key => ({
        key,
        ...this.$store.state.accounts[key],
        orgValid: this.$store.state.accounts[key].valid,
        orgAdmin: this.$store.state.accounts[key].admin
      })),
      submitted: false
    }
  },
  methods: {
    toggleValid (key) {
      this.list = this.list.map(item =>
        item.key === key ? {...item, valid: !item.valid} : item
      )
    },
    toggleAdmin (key) {
      this.list = this.list.map(item =>
        item.key === key ? {...item, admin: !item.admin} : item
      )
    },
    submit () {
      this.submitted = true
      this.$store.commit(BACK_PAGE)
      window.scrollTo({top: 0})
      return onSubmitAccounts(
        getFirestore(this.$store.state.firebase).collection(DB_ACCOUNTS),
        this.list
      )
    }
  },
  computed: {
    res () {
      return this.$store.state.resources
    },
    memberships () {
      return this.$store.state.memberships
    },
    branches () {
      return this.$store.state.branches
    },
    users () {
      return this.$store.state.users
    }
  }
}
</script>
