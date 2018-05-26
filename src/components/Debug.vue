<template>
  <div>
    <h2><v-icon dark>find_in_page</v-icon> store.state</h2>
    <pre>{{ state }}</pre>
  </div>
</template>

<style scoped>
pre {
  font-size: 90%;
}
</style>

<script>
export default {
  data () {
    let {firebase, ...obj} = this.$store.state
    return {
      state: JSON.stringify(obj, true, 2),
      canceled: false
    }
  },
  methods: {
  }
}
</script>
