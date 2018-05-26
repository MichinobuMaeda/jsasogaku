<template>
  <div>
    <h2><v-icon dark>event</v-icon> {{ res.titleEvents }}</h2>
    <div v-for="event in list" v-bind:key="event.key">
      <div>{{ res.labelEventCode }}: {{ event.key }}</div>
      <v-text-field
        :label="res.labelEventName"
        v-model="event.name"
      ></v-text-field>
      <v-text-field
        :label="res.labelEventDesc"
        v-model="event.desc"
      ></v-text-field>
      <v-text-field
        :label="res.labelEventStatus"
        v-model="event.status"
      ></v-text-field>
      <div v-for="item in event.items" v-bind:key="item.key">
        <v-text-field
          label="Code"
          v-model="item.key"
        ></v-text-field>
        <v-text-field
          :label="res.labelEventItemName"
          v-model="item.name"
        ></v-text-field>
        <v-text-field
          label="default"
          v-model="item.default"
        ></v-text-field>
      </div>
    </div>
    <v-btn
      color="primary"
      :disabled="submitted || canceled"      
      @click="submit"
    >
      {{ res.labelSave }}
    </v-btn>
  </div>
</template>

<script>
// import {} from '../handlers'

export default {
  data () {
    return {
      list: this.$store.state.events.map(event => ({
        key: event.key,
        name: event.name,
        desc: event.desc,
        status: event.status,
        items: event.items.map(item => ({...item})),
        orgName: event.name,
        orgDesc: event.desc,
        orgStatus: event.status,
        orgItems: event.items.map(item => ({...item}))
      })),
      submitted: false,
      canceled: false
    }
  },
  methods: {
    submit () {
      // this.submitted = true
      // this.$store.commit(BACK_PAGE)
      // window.scrollTo({top: 0})
      // return onSubmitList(
      //   this.$store.state.firebase.firestore().collection(DB_BRANCHES),
      //   this.list
      // )
    }
  },
  computed: {
    res () {
      return this.$store.state.resources
    }
  }
}
</script>
