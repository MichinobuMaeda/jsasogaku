<template>
  <div>
    <div class="floated_cancel">
      <v-btn fab dark small fixed color="primary"
        :disabled="submitted || canceled"
        @click="cancel"
      >
        <v-icon dark>clear</v-icon>
      </v-btn>
    </div>
    <h2><v-icon dark>account_circle</v-icon> {{ res.titleAccounts }}</h2>
    <table>
      <tr>
        <th>{{ res.labelAccountValid }}</th>
        <th>{{ res.labelAdmin }}</th>
        <th>{{ res.labelEmail }}</th>
        <th class="account-id">Account ID</th>
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
      </tr>
    </table>
    <v-btn
      color="primary"
      :disabled="submitted || canceled"      
      @click="submit"
    >
      {{ res.labelSave }}
    </v-btn>
  </div>
</template>

<style scoped>
td.valid, td.admin {
  text-align: center;
}
td.account-id {
  padding-left: 10px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 90%;
}
</style>

<script>
import {BACK_PAGE} from '../common'
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
      submitted: false,
      canceled: false
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
    cancel () {
      this.canceled = true
      this.$store.commit(BACK_PAGE)
      window.scrollTo({top: 0})
    },
    submit () {
      this.submitted = true
      this.$store.commit(BACK_PAGE)
      window.scrollTo({top: 0})
      return onSubmitAccounts(this.$store.state, this.list)
    }
  },
  computed: {
    res () {
      return this.$store.state.resources
    }
  }
}
</script>
