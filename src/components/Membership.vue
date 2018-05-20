<template>
  <div>
    <div class="floated_cancel">
      <v-btn fab dark small fixed color="primary"
        :disabled="submitted || canceled"
        @click="cancel"
      >
        <v-icon dark>clear</v-icon>
      </v-btn>
    </div>
    <h2><v-icon dark>people_outline</v-icon> {{ res.labelMembership }}</h2>
    <div v-for="item in list" v-bind:key="item.key">
      <v-text-field
        :label="item.key"
        v-model="item.text"
      ></v-text-field>
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
import {BACK_PAGE, DB_MEMBERSHIPS, createSparseList} from '../common'
import {onSubmitList} from '../handlers'

export default {
  data () {
    return {
      list: createSparseList(
          this.$store.state.memberships, 1, 99, 'm', 2
        ).map(item => ({
          ...item,
          org: item.text,
          deleted: false
        })),
      submitted: false,
      canceled: false
    }
  },
  methods: {
    cancel () {
      this.canceled = true
      this.$store.commit(BACK_PAGE)
      window.scrollTo({top: 0})
    },
    submit () {
      this.submitted = true
      this.$store.commit(BACK_PAGE)
      window.scrollTo({top: 0})
      return onSubmitList(
        this.$store.state.firebase.firestore().collection(DB_MEMBERSHIPS),
        this.list
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
