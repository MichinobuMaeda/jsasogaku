<template>
  <div>
    <h2>
      <v-icon dark>face</v-icon>
      {{ activeUser.uid === me.uid ? res.titleProfile : res.titleUserList }}
    </h2>
    <v-form
      v-model="personValid"
      ref="person"
      v-if="personEdit || (!activeUser.ver)"
    >
      <v-text-field
        v-if="accounts[me.uid].admin"
        label="Account ID"
        v-model="activeUser.uid"
      ></v-text-field>
      <v-text-field
        :label="res.labelUserName"
        v-model="activeUser.name"
        :rules="requiredRules"
        required
      ></v-text-field>
      <v-select
        :label="res.labelMembership"
        v-model="activeUser.membership"
        :rules="requiredRules"
        required
        :items="$store.state.memberships"
        item-value="key"
      ></v-select>
      <v-select
        :label="res.labelBranch"
        v-model="activeUser.branch"
        :rules="requiredRules"
        required
        :items="$store.state.branches"
        item-value="key"
      ></v-select>
      <v-text-field
        :label="res.labelZip"
        v-model="activeUser.zip"
        :rules="zipRules"
        required
      ></v-text-field>
      <v-text-field
        :label="res.labelAddress"
        v-model="activeUser.address"
        :rules="requiredRules"
        required
        multi-line=true
      ></v-text-field>
      <v-text-field
        :label="res.labelTel"
        v-model="activeUser.tel"
        :rules="telRules"
        type="tel"
      ></v-text-field>
      <v-text-field
        :label="res.labelFax"
        v-model="activeUser.fax"
        :rules="telRules"
        type="tel"
      ></v-text-field>
      <v-text-field
        :label="res.labelCellPhone"
        v-model="activeUser.cell"
        :rules="telRules"
        type="tel"
      ></v-text-field>
      <v-text-field
        :label="res.labelEmail"
        v-model="activeUser.email"
        :rules="emailRules"
        type="email"
      ></v-text-field>
      <v-text-field
        :label="res.labelProfileNote"
        v-model="activeUser.note"
        multi-line=true
      ></v-text-field>
      <v-btn
        color="primary"
        @click="submit"
        :disabled="!personValid"
      >
        {{ res.labelSave }}
      </v-btn>
      <v-btn
         v-if="activeUser.ver"
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
      <div class="grey lighten-3">〒{{ activeUser.zip }}</div>
      <div class="grey lighten-3"
        v-for="(value, index) in activeUser.address.split('\n')"
        v-bind:key="index"
      >
        {{ value }}
      </div>
      <div v-if="activeUser.tel">
        <v-icon>phone</v-icon>
        {{ activeUser.tel }}
      </div>
      <div v-if="activeUser.fax">
        Fax {{ activeUser.fax }}
      </div>
      <div v-if="activeUser.cell">
        <v-icon>phone_android</v-icon>
        {{ activeUser.cell }}
      </div>
      <div v-if="activeUser.email">
        <v-icon>email</v-icon> {{ activeUser.email }}
      </div>
      <div
        v-if="activeUser.note"
        class="grey lighten-3"
        v-for="(value, index) in activeUser.note.split('\n')"
        v-bind:key="index"
      >
        {{ value || '&nbsp;' }}
      </div>
      <v-btn
        color="primary"
        @click="toggleEditPerson"
      >
        {{ res.labelEdit }}
      </v-btn>
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
          v-if="activeUser.ver"
        >
          <div
            v-if="!activeUser.events ||
                  !selectedUserEvent"
          >
            <v-btn
              color="primary"
              @click="getReceiptNo"
              :disabled="disabledGetReceiptNo"
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
                <v-card color="grey lighten-3">
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
                  multi-line=true
                ></v-text-field>
                <h4>{{ res.titleExcursion }}</h4>
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
                <h4>{{ res.titleLectureEntry }}</h4>
                <div>{{ res.guideLectureEntry }}</div>
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
                <div
                  v-for="item in activeEvent.items"
                  v-bind:key="item.key"
                  v-if="item.category === 'lecture'"
                >
                  <v-text-field
                    :label="item.key + ': ' + item.name"
                    v-model="selectedUserEvent.items[item.key]"
                  ></v-text-field>
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
                v-if="activeUser.ver"
                @click="reset"
              >
                {{ res.labelCancel }}
              </v-btn>
            </v-form>
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
</style>

<script>
import {
  SELECT_USER, REGEX_EMAIL, REGEX_ZIP, REGEX_TEL,
  getActiveUser, getActiveEvent
} from '../common'
import {onSubmitUser, getReceiptNo} from '../handlers'

export default {
  data () {
    return {
      personEdit: false,
      personValid: false,
      entryValid: false,
      disabledGetReceiptNo: false,
      requiredRules: [
        v => !!v || this.res.validationRequired
      ],
      zipRules: [
        v => !!v || this.res.validationRequired,
        v => REGEX_ZIP.test(v) || this.res.validationZipNo
      ],
      telRules: [
        v => !v || REGEX_TEL.test(v) || this.res.validationPhoneNo
      ],
      emailRules: [
        v => !v || REGEX_EMAIL.test(v) ||
             this.res.validationEmailFormat
      ],
      activeUser: this.$store.state.site.activeUser
        ? {...getActiveUser(this.$store.state)}
        : {
          uid: this.$store.state.me.userKey ? null : this.$store.state.me.uid,
          name: '',
          membership: null,
          branch: null,
          zip: '',
          address: '',
          tel: '',
          fax: '',
          cell: '',
          email: this.$store.state.me.userKey ? '' : this.$store.state.me.email,
          note: '',
          events: {},
          ver: 0
        }
    }
  },
  methods: {
    submit () {
      onSubmitUser(this.$store.state, this.activeUser)
      this.personEdit = false
    },
    reset () {
      window.scrollTo({top: 0})
      this.$store.commit(SELECT_USER, this.$store.state.site.activeUser)
      this.personEdit = false
    },
    toggleEditPerson () {
      this.personEdit = !this.personEdit
    },
    getReceiptNo () {
      this.disabledGetReceiptNo = true
      return getReceiptNo(this.$store.state)
    }
  },
  computed: {
    res () {
      return this.$store.state.resources
    },
    accounts () {
      return this.$store.state.accounts
    },
    me () {
      return this.$store.state.me
    },
    activeEvent () {
      return getActiveEvent(this.$store.state)
    },
    selectedUserEvent () {
      return this.activeUser.events[this.$store.state.site.activeEvent]
    }
  }
}
</script>
