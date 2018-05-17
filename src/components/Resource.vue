<template>
  <div>
    <div class="floated_cancel">
      <v-btn fab dark small fixed color="primary" @click="cancel">
        <v-icon dark>clear</v-icon>
      </v-btn>
    </div>
    <h2><v-icon dark>message</v-icon> {{ res.titleResources }}</h2>
    <div v-for="item in list" v-bind:key="item.key">
      <v-text-field
        :label="item.key"
        v-model="item.text"
        :multi-line="item.isArray"
      ></v-text-field>
    </div>
    <v-btn
      color="primary"
      @click="submit"
      :disabled="submitted"      
    >
      {{ res.labelSave }}
    </v-btn>
  </div>
</template>

<style scoped>
pre {
  font-size: 90%;
}
</style>

<script>
import {BACK_PAGE} from '../common'
import {onSubmitResources} from '../handlers'

const isArray = arr => Object.prototype.toString.call(arr) === '[object Array]'
const arrayToText = arr => isArray(arr)
          ? arr.join('\n')
          : arr

export default {
  data () {
    return {
      list: Object.keys(this.$store.state.resources).map(key => ({
        key,
        text: arrayToText(this.$store.state.resources[key]),
        org: arrayToText(this.$store.state.resources[key]),
        isArray: isArray(this.$store.state.resources[key])
      })),
      submitted: false
    }
  },
  methods: {
    cancel () {
      this.$store.commit(BACK_PAGE)
      window.scrollTo({top: 0})
    },
    submit () {
      this.submitted = true
      this.$store.commit(BACK_PAGE)
      window.scrollTo({top: 0})
      return onSubmitResources(this.$store.state, this.list)
    }
  },
  computed: {
    res () {
      return this.$store.state.resources
    }
  }
}
</script>
