<template>
  <div>
    <h2><v-icon dark>find_in_page</v-icon> store.state</h2>
    <pre>{{ JSON.stringify(debug, true, 2) }}</pre>
  </div>
</template>

<style scoped>
pre {
  font-size: 90%;
}
</style>

<script>
import {mapGetters} from 'vuex'

export default {
  data () {
    return {}
  },
  methods: {},
  computed: {
    ...mapGetters(['debug'])
  }
}
</script>
