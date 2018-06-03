<template>
  <div>
    <h2><v-icon dark>face</v-icon> {{ res.titleUserList }}</h2>
    <v-card color="grey lighten-3">
      <v-card-text>
        <div v-for="(text, index) in res.guideAdminUser" v-bind:key="index">
          {{ text }}
        </div>
      </v-card-text>
    </v-card>
    <table>
      <tr>
        <th class="account-id">Account ID</th>
        <th>{{ res.labelUserName }}</th>
        <th>{{ res.labelMembership }}</th>
        <th>{{ res.labelBranch }}</th>
        <th>{{ res.labelEmail }}</th>
      </tr>
      <tr v-for="item in list" v-bind:key="item.key">
        <td>{{ item.uid }}</td>
        <td>
          <v-btn flat icon color="primary" @click="edit(item.key)">
            <v-icon>edit</v-icon>
          </v-btn>
          {{ item.name }}
        </td>
        <td>{{ memberships.reduce((ret, cur) => cur.key === item.membership ? cur.text : ret, null) }}</td>
        <td>{{ branches.reduce((ret, cur) => cur.key === item.branch ? cur.text : ret, null) }}</td>
        <td>{{ item.email }}</td>
      </tr>
      <tr>
        <td colspan="5">
          <v-btn flat icon color="primary" @click="edit(null)">
            <v-icon>add</v-icon>
          </v-btn>
          {{ res.labelAddNoAccountUser }}
        </td>
      </tr>
    </table>
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
import {BACK_PAGE, SELECT_USER} from '../common'
// import {onSubmitAccounts} from '../handlers'

export default {
  data () {
    return {
      list: Object.keys(this.$store.state.users).sort().map(key => ({
        key,
        ...this.$store.state.users[key]
      })),
      submitted: false
    }
  },
  methods: {
    edit (key) {
      this.$store.commit(SELECT_USER, key)
      this.$store.commit(BACK_PAGE)
      window.scrollTo({top: 0})
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
    }
  }
}
</script>
