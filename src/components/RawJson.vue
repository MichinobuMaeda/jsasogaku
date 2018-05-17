<template>
  <div>
    <div class="floated_cancel">
      <v-btn fab dark small fixed color="primary" @click="cancel">
        <v-icon dark>clear</v-icon>
      </v-btn>
    </div>
    <h2><v-icon dark>find_in_page</v-icon> Raw json</h2>
    <pre>{{ state }}</pre>
  </div>
</template>

<style scoped>
pre {
  font-size: 90%;
}
</style>


<script>
import {BACK_PAGE} from '../common'

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
      this.$store.commit(BACK_PAGE)
      window.scrollTo({top: 0})
    }
  }
}
</script>
