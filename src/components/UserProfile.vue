<template>
  <div>
    <div
      v-if="me && accounts[me.uid] && accounts[me.uid].admin"
    >{{ user.uid }}</div>
    <div>{{ user.name }}</div>
    <div><v-icon>people_outline</v-icon> {{
      $store.state.memberships.reduce(
        (ret, cur) => cur.key === user.membership ? cur.text : ret,
        ''
      )
    }}
    &nbsp;
    <v-icon>people</v-icon> {{
      $store.state.branches.reduce(
      (ret, cur) => cur.key === user.branch ? cur.text : ret,
        ''
      )
    }}</div>
    <div :class="lightgrey">〒{{ user.zip }}</div>
    <div :class="lightgrey">{{ user.pref }} {{ user.city }}</div>
    <div :class="lightgrey">{{ user.street }}</div>
    <div :class="lightgrey">{{ user.bldg }}</div>
    <div v-if="user.email">
      <v-icon>email</v-icon> {{ user.email }}
    </div>
    <div v-if="user.tel">
      <v-icon>phone</v-icon>
      {{ user.tel }}
    </div>
    <div v-if="user.fax">
      Fax {{ user.fax }}
    </div>
    <div
      v-if="user.note"
      :class="lightgrey"
      v-for="(value, index) in user.note.split('\n')"
      v-bind:key="index"
    >
      {{ value || '&nbsp;' }}
    </div>
  </div>
</template>

<style scoped>
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
    accounts () {
      return this.$store.state.accounts
    },
    user () {
      return this.$store.state.users.reduce(
        (ret, cur) => cur.key === this.$store.state.site.activeUser ? cur : ret,
        null
      )
    },
    me () {
      return this.$store.state.me
    },
    lightgrey () {
      return 'grey lighten-3'
    }
  }
}
</script>
