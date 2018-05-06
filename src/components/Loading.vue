<template>
  <div>
    <h1 style="text-align:center;">JSA</h1>
    <div id="loading">
      <v-progress-linear
        :indeterminate=true
        color="grey"
      ></v-progress-linear>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin: 32px 0 32px 0;
}
#loading {
  margin: 32px 0 32px 0;
}
</style>

<script>
export default {
  data () {
    return {}
  }
}
</script>
