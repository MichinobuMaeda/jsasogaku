<template>
  <div>
    <h2><v-icon dark>message</v-icon> {{ res.titleResources }}</h2>
    <v-card color="grey lighten-3">
      <v-card-text>
        <div v-for="(text, index) in res.guideAdminResource" v-bind:key="index">
          {{ text }}
        </div>
      </v-card-text>
    </v-card>
    <div v-for="item in list" v-bind:key="item.key">
      <v-text-field
        :label="item.key"
        v-model="item.text"
        :multi-line="item.isArray"
      ></v-text-field>
    </div>
    <v-btn
      color="primary"
      :disabled="submitted"      
      @click="submit"
    >
      {{ res.labelSave }}
    </v-btn>
  </div>
</template>

<script>
import {BACK_PAGE, DB_RESOURCES} from '../common'
import {onSubmitList} from '../handlers'

const isArray = arr => Object.prototype.toString.call(arr) === '[object Array]'
const arrayToText = arr => isArray(arr)
          ? arr.join('\n')
          : arr

export default {
  data () {
    return {
      list: Object.keys(this.$store.state.resources).sort().map(key => ({
        key,
        text: arrayToText(this.$store.state.resources[key]),
        org: arrayToText(this.$store.state.resources[key]),
        isArray: isArray(this.$store.state.resources[key])
      })),
      submitted: false
    }
  },
  methods: {
    submit () {
      this.submitted = true
      this.$store.commit(BACK_PAGE)
      window.scrollTo({top: 0})
      return onSubmitList(
        this.$store.state.firebase.firestore().collection(DB_RESOURCES),
        this.list,
        true
      )
    }
  },
  computed: {
    res () {
      return this.$store.state.resources
    }
  }
}
</script>
