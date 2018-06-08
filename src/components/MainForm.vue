<template>
  <div>
    <h2>
      <v-icon dark>face</v-icon>
      {{ user.uid === me.uid ? res.titleProfile : res.titleUserList }}
    </h2>
    <UserProfile/>
    <h2><v-icon dark>assignment</v-icon> {{ res.titleReceiptInformation }}</h2>
    <h3>
      <v-icon dark>event_available</v-icon> 
      {{ activeEvent.name }}
    </h3>
    <p>
      {{ activeEvent.desc }}
    </p>
    <div class="summary">
      {{ res.labelReceiptNo }}
      <span class="big-number"> {{
        selectedUserEvent.number
      }}</span>
    </div>
    <v-form
      v-model="entryValid"
      ref="entry"
    >
      <v-radio-group
        v-model="selectedUserEvent.entry"
      >
        <v-radio
          :label="res.labelEntryOn"
          :value="1"
        ></v-radio>
        <v-radio
          :label="res.labelEntryOff"
          :value="0"
        ></v-radio>
      </v-radio-group>
      <div
        v-if="selectedUserEvent.entry"
      >
        <v-card :color="lightgrey">
          <v-card-text>
            <div v-for="(text, index) in res.guideEventEntry" v-bind:key="index">
              {{ text }}
            </div>
          </v-card-text>
        </v-card>
        <div
          v-for="item in activeEvent.items"
          v-bind:key="item.key"
          v-if="item.category === 'GA'"
        >
          <h5
            v-if="item.list"
          >
            {{ item.name  }}
          </h5>
          <v-radio-group
            v-if="item.list"
            v-model="selectedUserEvent.items[item.key]"
            :error="!selectedUserEvent.items[item.key]"
            :rules="requiredRules"
          >
            <v-radio
              v-for="(data, index) in item.list"
              v-bind:key="index"
              :label="item.key + (index + 1) + ': ' + data.name + (data[user.membership] ? ' ¥' + data[user.membership].toLocaleString() : '')"
              :value="index + 1"
            ></v-radio>
          </v-radio-group>
          <div
            v-else-if="item.default === ''"
          >
            <v-text-field
              :label="item.key + ': ' + item.name"
              v-model="selectedUserEvent.items[item.key]"
            ></v-text-field>
          </div>
          <div
            v-else
          >
            <v-checkbox
              :label="item.key + ': ' + item.name + (item[user.membership] ? ' ¥' + item[user.membership].toLocaleString() : '')"
              v-model="selectedUserEvent.items[item.key]"
            ></v-checkbox>
          </div>
        </div>
        <div>{{ res.guideEventNote }}</div>
        <v-text-field
          :label="res.labelEventNote"
          v-model="selectedUserEvent.note"
          :multi-line="true"
        ></v-text-field>
        <h4>{{ res.titleLectureEntry }}</h4>
        <v-card :color="lightgrey">
          <v-card-text>
            <div v-for="(text, index) in res.guideLectureEntry" v-bind:key="index">
              {{ text }}
            </div>
          </v-card-text>
          <v-card-text>
            <div>{{ res.labelLectureEntryCount }} [ {{
              Object.keys(selectedUserEvent.items).reduce(
                (ret1, cur1) => activeEvent.items.reduce(
                  (ret2, cur2) => cur2.key === cur1 &&
                    cur2.category === 'lecture' &&
                    selectedUserEvent.items[cur1]
                      ? true : ret2, false
                ) ? ++ret1 : ret1, 0
              )
            }} ]</div>
          </v-card-text>
        </v-card>
        <div
          v-for="item in activeEvent.items"
          v-bind:key="item.key"
          v-if="item.category === 'lecture'"
        >
          <v-checkbox
            :label="item.key + ': ' + item.name"
            v-model="selectedUserEvent.items[item.key]"
          ></v-checkbox>
        </div>
        <h4>{{ res.titleExcursion }}</h4>
        <v-card :color="lightgrey">
          <v-card-text>
            <div v-for="(text, index) in res.guideExcursion" v-bind:key="index">
              {{ text }}
            </div>
          </v-card-text>
        </v-card>
        <div
          v-for="item in activeEvent.items"
          v-bind:key="item.key"
          v-if="item.category === 'excursion'"
        >
          <v-checkbox
            :label="item.key + ': ' + item.name + (item[user.membership] ? ' ¥' + item[user.membership].toLocaleString() : '')"
            v-model="selectedUserEvent.items[item.key]"
          ></v-checkbox>
        </div>
      </div>
      <v-btn
        color="primary"
        @click="submit"
        :disabled="!entryValid"
      >
        {{ res.labelSave }}
      </v-btn>
      <v-btn
        v-if="user.ver"
        @click="reset"
        :disabled="!entryValid || !selectedUserEvent.summary"
      >
        {{ res.labelCancel }}
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
.summary {
  border: solid 1px #999999;
  background-color: #999999;
  color: white;
  padding: 0 12px 0 12px;
  margin: 0 0 6px 0;
}
.big-number {
  font-family: monospace;
  font-size: 32px;
  padding: 0 6px 0 6px;
  color: black;
  background-color: white;
}
h5 {
  font-weight: normal;
  font-size: 18px;
  margin: 6px 0 0 0;
}
.guide {
  color: #5D4037;
}
.column {
  padding-right: 6px;
}
</style>

<script>
import {
  SET_PAGE, PAGE, getActiveEvent, getUserForEdit
} from '../common'
import {onSubmitUser} from '../handlers'
import UserProfile from './UserProfile'

export default {
  data () {
    return {
      entryValid: false,
      requiredRules: [
        v => !!v || this.res.validationRequired
      ],
      user: getUserForEdit(this.$store.state)
    }
  },
  methods: {
    async submit () {
      await onSubmitUser(this.$store.state, this.user)
      this.$store.commit(SET_PAGE, PAGE.USER_SHOW)
      window.scrollTo({top: 0, behavior: 'smooth'})
    },
    reset () {
      this.$store.commit(SET_PAGE, PAGE.USER_SHOW)
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  },
  components: {
    UserProfile
  },
  computed: {
    res () {
      return this.$store.state.resources
    },
    accounts () {
      return this.$store.state.accounts
    },
    users () {
      return this.$store.state.users
    },
    me () {
      return this.$store.state.me
    },
    activeEvent () {
      return getActiveEvent(this.$store.state)
    },
    selectedUserEvent () {
      return this.user.events[this.$store.state.site.activeEvent]
    },
    colorinfo () {
      return 'brown'
    },
    lightgrey () {
      return 'grey lighten-3'
    }
  }
}
</script>
