<template>
  <div>
    <div style="float: right; padding: 48px 48px 0 0;">
      <v-btn fab dark small fixed color="primary" @click="cancel">
        <v-icon dark>clear</v-icon>
      </v-btn>
    </div>
    <h2><v-icon dark>find_in_page</v-icon> Raw json</h2>
    <pre>{{ state }}</pre>
  </div>
</template>

<script>
export default {
  data () {
    let {
      memberships,
      branches,
      events,
      accounts,
      users
    } = this.$store.state
    return {
      state: JSON.stringify({
        memberships,
        branches,
        events,
        accounts,
        users
      }, true, 2)
    }
  },
  methods: {
    cancel () {
      this.$store.commit('backPage')
      window.scrollTo({top: 0})
    }
  }
}
</script>
