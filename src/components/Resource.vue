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
      }))
    }
  },
  methods: {
    cancel () {
      this.$store.commit('backPage')
      window.scrollTo({top: 0})
    },
    submit () {
      this.list.forEach(item => {
        if (item.text.trim() !== item.org.trim()) {
          const db = this.$store.state.firebase.firestore()
          let docRefRes = db.collection('resources').doc(item.key)
          // Start transaction.
          db.runTransaction(async transaction => {
            try {
              let docRes = await transaction.get(docRefRes)
              if (docRes.exists) {
                let text = item.isArray ? item.text.trim().split('\n') : item.text.trim()
                await transaction.update(docRefRes, {text})
              } else {
                window.alert(this.res.errorConflictDeleted)
              }
            } catch (error) {
              window.alert(error)
            }
          })
        }
      })
    }
  },
  computed: {
    res () {
      return this.$store.state.resources
    }
  }
}
</script>
