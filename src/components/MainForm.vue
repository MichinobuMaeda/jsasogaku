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
        selectedUserEvent(user).number
      }}</span>
    </div>
    <v-form
      v-model="entryValid"
      ref="entry"
    >
      <v-radio-group
        v-model="selectedUserEvent(user).entry"
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
        v-if="selectedUserEvent(user).entry"
      >
        <v-card :color="COLOR.CARD">
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
            v-model="selectedUserEvent(user).items[item.key]"
            :error="!selectedUserEvent(user).items[item.key]"
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
              v-model="selectedUserEvent(user).items[item.key]"
            ></v-text-field>
          </div>
          <div
            v-else
          >
            <v-checkbox
              :label="item.key + ': ' + item.name + (item[user.membership] ? ' ¥' + item[user.membership].toLocaleString() : '')"
              v-model="selectedUserEvent(user).items[item.key]"
            ></v-checkbox>
          </div>
        </div>
        <div>{{ res.guideEventNote }}</div>
        <v-text-field
          :label="res.labelEventNote"
          v-model="selectedUserEvent(user).note"
          :multi-line="true"
        ></v-text-field>
        <h4>{{ res.titleLectureEntry }}</h4>
        <v-card :color="COLOR.CARD">
          <v-card-text>
            <div v-for="(text, index) in res.guideLectureEntry" v-bind:key="index">
              {{ text }}
            </div>
          </v-card-text>
          <v-card-text>
            <div>{{ res.labelLectureEntryCount }} [ {{
              Object.keys(selectedUserEvent(user).items).reduce(
                (ret1, cur1) => activeEvent.items.reduce(
                  (ret2, cur2) => cur2.key === cur1 &&
                    cur2.category === 'lecture' &&
                    selectedUserEvent(user).items[cur1]
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
            v-model="selectedUserEvent(user).items[item.key]"
          ></v-checkbox>
        </div>
        <h4>{{ res.titleExcursion }}</h4>
        <v-card :color="COLOR.CARD">
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
            v-model="selectedUserEvent(user).items[item.key]"
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
        :disabled="!entryValid || !selectedUserEvent(user).summary"
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
import {mapGetters} from 'vuex'
import {M, PAGE, EXCEPTION, DB, GETTERS} from '../constants'
import {onSubmitUser} from '../handlers'
import {userForEdit} from '../common'
import UserProfile from './UserProfile'

export default {
  data () {
    return {
      user: userForEdit(this.$store.state),
      entryValid: false,
      requiredRules: [
        v => !!v || this.res.validationRequired
      ]
    }
  },
  methods: {
    async submit () {
      try {
        await onSubmitUser(this.collection(DB.USERS), this.$store.state, this.user)
        this.$store.commit(M.SET_PAGE, PAGE.USER_SHOW)
      } catch (error) {
        if (error.code === 'permission-denied' ||
            error.name === EXCEPTION.DELETED.name) {
          window.alert(this.$store.state.resources.errorConflictDeleted)
        } else if (error.name === EXCEPTION.CONFLICT.name) {
          window.alert(this.$store.state.resources.errorConflictUpdated)
        } else {
          window.alert(error)
        }
        window.location.href = window.location.href
      }
    },
    reset () {
      this.$store.commit(M.SET_PAGE, PAGE.USER_SHOW)
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  },
  components: {
    UserProfile
  },
  computed: {
    ...mapGetters(GETTERS)
  }
}
</script>
