<template>
  <div>
    <h2><v-icon dark>event</v-icon> {{ res.titleEvents }}</h2>
    <p v-for="(text, index) in res.guideAdminEvnets" v-bind:key="index">
      {{ text }}
    </p>
    <div
      v-for="event in list"
      v-bind:key="event.key"
      :class="event.status === 'active' ? '' : 'blue-grey lighten-4'"
    >
      <v-layout row wrap>
        <v-flex xs7 class="column">
          <v-text-field
            :label="res.labelEventCode"
            v-model="event.key"
            :disabled="true"
          ></v-text-field>
        </v-flex>
        <v-flex xs5>
          <v-select
            :items="eventStatus"
            v-model="event.status"
            label="Status"
            item-value="text"
            class="white"
          ></v-select>
        </v-flex>
      </v-layout>
      <v-text-field
        :label="res.labelEventName"
        v-model="event.name"
        :readonly="event.status !== 'active'"
      ></v-text-field>
      <v-text-field
        :label="res.labelEventDesc"
        v-model="event.desc"
        :readonly="event.status !== 'active'"
      ></v-text-field>
      <div
        v-if="event.status === 'active'"
        v-for="(item, index) in event.items"
        v-bind:key="index"
      >
        <v-layout row wrap>
          <v-flex xs4 class="column">
            <v-text-field
              prepend-icon="label"
              label="Code"
              v-model="item.key"
              :readonly="event.status !== 'active'"
            ></v-text-field>
          </v-flex>
          <v-flex xs4 class="column">
            <v-select
              :items="itemCategories"
              v-model="item.category"
              label="Category"
              item-value="text"
              :readonly="event.status !== 'active'"
            ></v-select>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              label="default"
              v-model="item.default"
              :readonly="event.status !== 'active'"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <div
          v-if="item.list"
        >
          <div
            v-for="(listItem, index) in item.list"
            v-bind:key="index"
          >
            <v-text-field
              :label="(index + 1).toString() + ':' + res.labelEventItemName"
              v-model="item.list[index].name"
              :readonly="event.status !== 'active'"
            ></v-text-field>
            <v-layout row wrap>
              <v-flex
                xs4
                v-for="m in memberships"
                v-bind:key="m.key"
                class="column"
              >
                <v-text-field
                  :label="m.text"
                  v-model="item.list[index][m.key]"
                  prefix="¥"
                  :readonly="event.status !== 'active'"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </div>
        </div>
        <div
          v-else
        >
          <v-text-field
            :label="res.labelEventItemName"
            v-model="item.name"
            :readonly="event.status !== 'active'"
          ></v-text-field>
          <v-layout row wrap>
            <v-flex
              xs4
              v-for="m in memberships"
              v-bind:key="m.key"
              class="column"
            >
              <v-text-field
                :label="m.text"
                v-model="item[m.key]"
                prefix="¥"
                :readonly="event.status !== 'active'"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </div>
      </div>
      <v-btn
        color="primary"
        :disabled="submitted"      
        @click="submit(event.key)"
      >
        {{ res.labelSave }}
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.column {
  padding-right: 6px;
}
</style>


<script>
import {DB_EVENTS, BACK_PAGE} from '../common'
import {onSubmitEvents} from '../handlers'

export default {
  data () {
    return {
      list: this.$store.state.events.map(event => ({
        key: event.key,
        name: event.name,
        desc: event.desc,
        status: event.status,
        items: event.items.map(item => ({...item}))
      })),
      eventStatus: [
        {text: 'active'},
        {text: 'closed'}
      ],
      itemCategories: [
        {text: 'GA'},
        {text: 'excursion'},
        {text: 'lecture'}
      ],
      submitted: false
    }
  },
  methods: {
    submit (key) {
      this.submitted = true
      this.$store.commit(BACK_PAGE)
      window.scrollTo({top: 0})
      return onSubmitEvents(
        this.$store.state.firebase.firestore().collection(DB_EVENTS),
        this.list.reduce((ret, cur) => cur.key === key ? cur : ret, null),
        this.$store.state.memberships
      )
    }
  },
  computed: {
    res () {
      return this.$store.state.resources
    },
    memberships () {
      return this.$store.state.memberships
    }
  }
}
</script>