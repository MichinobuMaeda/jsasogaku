<template>
  <div>
    <div
      v-if="me && accounts[me.uid] && accounts[me.uid].admin"
    >{{ activeUser.uid }}</div>
    <div>{{ activeUser.name }}</div>
    <div><v-icon>people_outline</v-icon> {{
      $store.state.memberships.reduce(
        (ret, cur) => cur.key === activeUser.membership ? cur.text : ret,
        ''
      )
    }}
    &nbsp;
    <v-icon>people</v-icon> {{
      $store.state.branches.reduce(
      (ret, cur) => cur.key === activeUser.branch ? cur.text : ret,
        ''
      )
    }}</div>
    <div :class="COLOR.CARD">〒{{ activeUser.zip }}</div>
    <div :class="COLOR.CARD">{{ activeUser.pref }} {{ activeUser.city }}</div>
    <div :class="COLOR.CARD">{{ activeUser.street }}</div>
    <div :class="COLOR.CARD">{{ activeUser.bldg }}</div>
    <div v-if="activeUser.email">
      <v-icon>email</v-icon> {{ activeUser.email }}
    </div>
    <div v-if="activeUser.tel">
      <v-icon>phone</v-icon>
      {{ activeUser.tel }}
    </div>
    <div v-if="activeUser.fax">
      Fax {{ activeUser.fax }}
    </div>
    <div
      v-if="activeUser.note"
      :class="COLOR.CARD"
      v-for="(value, index) in activeUser.note.split('\n')"
      v-bind:key="index"
    >
      {{ value || '&nbsp;' }}
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
import {mapGetters} from 'vuex'
import {GETTERS} from '../constants'

export default {
  data () {
    return {}
  },
  methods: {
  },
  computed: {
    ...mapGetters(GETTERS)
  }
}
</script>
