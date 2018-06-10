<template>
  <div>
    <h2><v-icon dark>people</v-icon> {{ res.labelBranch }}</h2>
    <v-card color="grey lighten-3">
      <v-card-text>
        <div v-for="(text, index) in res.guideAdminBranch" v-bind:key="index">
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
import {BACK_PAGE, DB_BRANCHES, createSparseList, getFirestore} from '../common'
import {onSubmitList} from '../handlers'

export default {
  data () {
    return {
      list: createSparseList(
          this.$store.state.branches, 1, 99, 'b', 2
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
          getFirestore(this.$store.state.firebase).collection(DB_BRANCHES),
          this.list
        )
        this.$store.commit(BACK_PAGE)
        window.scrollTo({top: 0})
      } catch (error) {
        window.alert(error)
      }
    }
  },
  computed: {
    res () {
      return this.$store.state.resources
    }
  }
}
</script>
