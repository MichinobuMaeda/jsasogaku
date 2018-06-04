<template>
  <div>
    <v-radio-group
      v-if="!accounts[me.uid].admin && users.length > 1"
      v-model="activeUser"
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
      {{ user.uid === me.uid ? res.titleProfile : res.titleUserList }}
    </h2>
    <v-form
      v-model="personValid"
      ref="person"
      v-if="personEdit || (!user.ver)"
    >
      <div class="guide"><v-icon :color="colorinfo">warning</v-icon> {{res.guideAdminProfile}}</div>
      <v-text-field
        v-if="accounts[me.uid].admin"
        label="Account ID"
        v-model="user.uid"
      ></v-text-field>
      <v-layout row wrap>
        <v-flex xs12 hidden-xs-only class="column">
          <div class="guide"><v-icon :color="colorinfo">info</v-icon> {{res.guideBranch}}</div>
        </v-flex>
        <v-flex xs12 sm6 md6 lg6 xl6 class="column">
          <v-text-field
            :label="res.labelUserName"
            v-model="user.name"
            :rules="requiredRules"
            required
          ></v-text-field>
        </v-flex>
        <v-flex xs12 hidden-sm-and-up class="column">
          <div class="guide" xs><v-icon :color="colorinfo">info</v-icon> {{res.guideBranch}}</div>
        </v-flex>
        <v-flex xs7 sm3 md3 lg3 xl3 class="column">
          <v-select
            :label="res.labelMembership"
            v-model="user.membership"
            :rules="requiredRules"
            required
            :items="$store.state.memberships"
            item-value="key"
          ></v-select>
        </v-flex>
        <v-flex xs5 sm3 md3 lg3 xl3>
          <v-select
            :label="res.labelBranch"
            v-model="user.branch"
            :rules="requiredRules"
            required
            :items="$store.state.branches"
            item-value="key"
          ></v-select>
        </v-flex>
      </v-layout>
      <div class="guide"><v-icon :color="colorinfo">info</v-icon> {{res.guideAddress}}</div>
      <v-text-field
        :label="res.labelZip"
        v-model="user.zip"
        :rules="zipRules"
        required
        prefix="〒"
      ></v-text-field>
      <v-text-field
        :label="res.labelPref"
        v-model="user.pref"
        :rules="requiredRules"
        required
      ></v-text-field>
      <v-text-field
        :label="res.labelCity"
        v-model="user.city"
        :rules="requiredRules"
        required
      ></v-text-field>
      <v-text-field
        :label="res.labelStreet"
        v-model="user.street"
        :rules="requiredRules"
        required
      ></v-text-field>
      <v-text-field
        :label="res.labelBldg"
        v-model="user.bldg"
      ></v-text-field>
      <div class="guide"><v-icon :color="colorinfo">info</v-icon> {{res.guideContactMethod}}</div>
      <div class="guide"><v-icon :color="colorinfo">info</v-icon> {{res.guideEmail}}</div>
      <v-text-field
        :label="res.labelEmail"
        v-model="user.email"
        :rules="emailRules"
        required
        type="email"
      ></v-text-field>
      <v-text-field
        :label="res.labelTel"
        v-model="user.tel"
        :rules="telRules"
        required
        type="tel"
      ></v-text-field>
      <v-text-field
        :label="res.labelFax"
        v-model="user.fax"
        :rules="faxRules"
        type="tel"
      ></v-text-field>
      <div class="guide"><v-icon :color="colorinfo">info</v-icon> {{res.guideNote}}</div>
      <v-text-field
        :label="res.labelProfileNote"
        v-model="user.note"
        :multi-line="true"
        :hint="res.guideNote"
      ></v-text-field>
      <v-btn
        color="primary"
        @click="submit"
        :disabled="!personValid"
      >
        {{ res.labelSave }}
      </v-btn>
      <v-btn
         v-if="user.ver"
        @click="reset"
      >
        {{ res.labelCancel }}
      </v-btn>
    </v-form> 
    <div
      v-else
    >
      <div
        v-if="me && accounts[me.uid] && accounts[me.uid].admin"
      >{{ user.uid }}</div>
      <div>{{ user.name }}</div>
      <div><v-icon>people_outline</v-icon> {{
        $store.state.memberships.reduce(
          (ret, cur) => cur.key === user.membership ? cur.text : ret,
          ''
        )
      }}
      &nbsp;
      <v-icon>people</v-icon> {{
        $store.state.branches.reduce(
        (ret, cur) => cur.key === user.branch ? cur.text : ret,
          ''
        )
      }}</div>
      <div class="grey lighten-3">〒{{ user.zip }}</div>
      <div class="grey lighten-3">{{ user.pref }} {{ user.city }}</div>
      <div class="grey lighten-3">{{ user.street }}</div>
      <div class="grey lighten-3">{{ user.bldg }}</div>
      <div v-if="user.email">
        <v-icon>email</v-icon> {{ user.email }}
      </div>
      <div v-if="user.tel">
        <v-icon>phone</v-icon>
        {{ user.tel }}
      </div>
      <div v-if="user.fax">
        Fax {{ user.fax }}
      </div>
      <div
        v-if="user.note"
        class="grey lighten-3"
        v-for="(value, index) in user.note.split('\n')"
        v-bind:key="index"
      >
        {{ value || '&nbsp;' }}
      </div>
      <v-btn
        color="primary"
        @click="personEdit = true"
      >
        {{ res.labelEdit }}
      </v-btn>
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
          v-if="user.ver"
        >
          <div
            v-if="!user.events ||
                  !selectedUserEvent"
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
                selectedUserEvent.number
              }}</span>
            </div>
            <v-form
              v-model="entryValid"
              ref="entry"
              v-if="entryEdit"
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
                <div class="summary">
                  {{ res.labelAcceptsSummary }}
                  <span class="big-number"> ¥{{
                    selectedUserEvent.cost.toLocaleString()
                  }}-</span>
                </div>
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
                    :rules="requiredRules"
                  >
                    <v-radio
                      v-for="(data, index) in item.list"
                      v-bind:key="index"
                      :label="item.key + (index + 1) + ': ' + data.name"
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
                      :label="item.key + ': ' + item.name"
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
                    :label="item.key + ': ' + item.name"
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
              >
                {{ res.labelCancel }}
              </v-btn>
            </v-form>
            <div
              v-else
            >
              <table>
                <tr>
                  <th>項目</th>
                  <th>金額</th>
                </tr>
                <tr
                  v-for="item in summary.items"
                  v-bind:key="item.key"
                >
                  <td>{{ item.key + '. ' + activeEvent.items.reduce((ret, cur) => cur.key === item.key ? cur.name : ret , '') }}</td>
                  <td class="num">{{ item.cost ? item.cost.toLocaleString() : '-' }}</td>
                </tr>
                <tr>
                  <th>合計</th>
                  <td class="num">{{ summary.total.toLocaleString() }}</td>
                </tr>
              </table>
              <v-btn
                color="primary"
                @click="entryEdit = true"
              >
                {{ res.labelEdit }}
              </v-btn>
            </div>
          </div>
        </div>
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
table {
  border-collapse: collapse;
}
th, td {
  border: solid 1px black;
  padding: 1px 2px 1px 2px;
}
td.num {
  text-align: right;
}
</style>

<script>
import {
  SELECT_USER, REGEX_EMAIL, REGEX_ZIP, REGEX_TEL,
  getActiveEvent, getUser, isEntry, getSummary
} from '../common'
import {onSubmitUser, getReceiptNo} from '../handlers'

export default {
  data () {
    return {
      personEdit: false,
      personValid: false,
      entryEdit: !isEntry(this.$store.state),
      entryValid: false,
      summary: getSummary(this.$store.state, getUser(this.$store.state)),
      requestedReceiptNo: false,
      requiredRules: [
        v => !!v || this.res.validationRequired
      ],
      zipRules: [
        v => !!v || this.res.validationRequired,
        v => REGEX_ZIP.test(v) || this.res.validationZipNo
      ],
      telRules: [
        v => !!v || this.res.validationRequired,
        v => !v || REGEX_TEL.test(v) || this.res.validationPhoneNo
      ],
      faxRules: [
        v => !v || REGEX_TEL.test(v) || this.res.validationPhoneNo
      ],
      emailRules: [
        v => !!v || this.res.validationRequired,
        v => !v || REGEX_EMAIL.test(v) ||
             this.res.validationEmailFormat
      ],
      activeUser: this.$store.state.site.activeUser,
      user: getUser(this.$store.state)
    }
  },
  methods: {
    async submit () {
      this.summary = getSummary(this.$store.state, this.user)
      await onSubmitUser(this.$store.state, this.user, this.summary)
      this.activeUser = this.$store.state.site.activeUser
      this.personEdit = false
      this.entryEdit = !isEntry(this.$store.state)
      window.scrollTo({top: 0, behavior: 'smooth'})
    },
    reset () {
      window.scrollTo({top: 0})
      this.user = getUser(this.$store.state)
      this.personEdit = false
      this.entryEdit = !isEntry(this.$store.state)
    },
    addUser () {
      this.$store.commit(SELECT_USER, null)
      this.user = getUser(this.$store.state)
    },
    getReceiptNo () {
      this.requestedReceiptNo = true
      getReceiptNo(this.$store.state, this.user)
    },
    selectUser () {
      this.$store.commit(SELECT_USER, this.activeUser)
      this.user = getUser(this.$store.state)
    }
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
