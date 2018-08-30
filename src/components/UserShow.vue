<template>
  <div>
    <v-radio-group
      v-if="!accounts[me.uid].admin && users.length > 1"
      v-model="$store.state.site.activeUser"
      v-on:change="selectUser()"
    >
      <v-radio
        v-for="user in users"
        v-bind:key="user.key"
        :label="user.name"
        :value="user.key"
      ></v-radio>
    </v-radio-group>
    <h2>
      <v-icon dark>face</v-icon>
      {{ activeUser.uid === me.uid ? res.titleProfile : res.titleUserList }}
    </h2>
    <UserProfile/>
    <v-btn
      color="primary"
      @click="editUser"
    >
      {{ res.labelEdit }}
    </v-btn>
        <v-card :color="COLOR.CARD">
          <v-card-text>
            <div v-for="(text, index) in res.guideRegistered" v-bind:key="index">
              {{ text }}
            </div>
          </v-card-text>
        </v-card>
    <div
      v-if="!accounts[me.uid].admin"
    >
      <div>{{ res.guideAddUser }}</div>
      <v-btn
        dark
        color="blue-grey"
        @click="addUser"
      >
        {{ res.labelAddUser }}
      </v-btn>
    </div>

    <h2><v-icon dark>assignment</v-icon> {{ res.titleReceiptInformation }}</h2>
    <h3
      v-if="!activeEvent.key"
    >
      <v-icon dark>event_busy</v-icon>
      {{ res.statusNoActiveEvent }}
    </h3>
    <div
      v-else
    >
      <h3>
        <v-icon dark>event_available</v-icon> 
        {{ activeEvent.name }}
      </h3>
      <p>
        {{ activeEvent.desc }}
      </p>
      <div
        v-if="!activeUser.events ||
              !selectedUserEvent(activeUser)"
      >
        <v-btn
          color="primary"
          @click="getReceiptNo"
          :disabled="requestedReceiptNo"
        >
          {{ res.labelGetReceiptNo }}
        </v-btn>
      </div>
      <div
        v-else
      >
        <div class="summary">
          {{ res.labelReceiptNo }}
          <span class="big-number"> {{
            selectedUserEvent(activeUser).number
          }}</span>
        </div>
        <UserSummary/>
        <v-btn
          color="primary"
          @click="editEntry"
        >
          {{ res.labelEdit }}
        </v-btn>
      </div>
    </div>
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
import {M, PAGE, DB, GETTERS} from '../constants'
import {getReceiptNo} from '../handlers'
import UserProfile from './UserProfile'
import UserSummary from './UserSummary'

export default {
  data () {
    return {
      requestedReceiptNo: false
    }
  },
  methods: {
    editUser () {
      this.$store.commit(M.SET_PAGE, PAGE.USER_EDIT)
      window.scrollTo({top: 0})
    },
    editEntry () {
      this.$store.commit(M.SET_PAGE, PAGE.MAIN_FORM)
      window.scrollTo({top: 0})
    },
    addUser () {
      this.$store.commit(M.SELECT_USER, null)
      this.$store.commit(M.SET_PAGE, PAGE.USER_EDIT)
      window.scrollTo({top: 0})
    },
    async getReceiptNo () {
      this.requestedReceiptNo = true
      try {
        let counters = this.collection(DB.COUNTERS)
        let users = this.collection(DB.USERS)
        let ReceiptNo = await getReceiptNo(
          counters,
          users,
          this.$store.state.site.activeEvent,
          this.activeUser
        )
        if (!ReceiptNo) {
          window.alert(this.$store.state.resources.errorMissReceiptNoCounter)
        }
        this.$store.commit(M.SET_PAGE, PAGE.MAIN_FORM)
        window.scrollTo({top: 0})
      } catch (error) {
        window.alert(error)
      }
    },
    selectUser () {
      this.$store.commit(M.SELECT_USER, this.$store.state.site.activeUser)
    }
  },
  components: {
    UserProfile,
    UserSummary
  },
  computed: {
    ...mapGetters(GETTERS)
  }
}
</script>
