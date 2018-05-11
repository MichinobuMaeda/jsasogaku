<template>
  <div>
    <h1>JSA</h1>
    <div id="loading">
      <v-progress-linear
        :indeterminate=true
        color="grey"
      ></v-progress-linear>
    </div>
    <p id="loading-message">{{ $store.state.site.loadingMessage }}</p>
  </div>
</template>

<style scoped>
h1 {
  margin: 32px 0 32px 0;
  text-align: center;
}
#loading {
  margin: 32px 0 32px 0;
}
#loading-message {
  text-align: center;  
}
</style>

<script>
export default {
  data () {
    return {}
  }
}
</script>
