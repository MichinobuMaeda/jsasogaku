<template>
  <div>
    <h2><v-icon dark>people_outline</v-icon> {{ res.labelMembership }}</h2>
    <v-card color="COLOR.CARD">
      <v-card-text>
        <div v-for="(text, index) in res.guideAdminMembership" v-bind:key="index">
          {{ text }}
        </div>
      </v-card-text>
    </v-card>
    <div v-for="item in list" v-bind:key="item.key">
      <v-text-field
        :label="item.key"
        v-model="item.text"
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
import {mapGetters} from 'vuex'
import {M, DB, GETTERS} from '../constants'
import {createSparseList} from '../common'
import {onSubmitList} from '../handlers'

export default {
  data () {
    return {
      list: createSparseList(
          this.$store.state.memberships, 1, 99, 'm', 2
        ).map(item => ({
          ...item,
          org: item.text
        })),
      submitted: false
    }
  },
  methods: {
    async submit () {
      try {
        this.submitted = true
        await onSubmitList(
          this.collection(DB.MEMBERSHIPS),
          this.list
        )
        this.$store.commit(M.BACK_PAGE)
        window.scrollTo({top: 0})
      } catch (error) {
        window.alert(error)
      }
    }
  },
  computed: {
    ...mapGetters(GETTERS)
  }
}
</script>
