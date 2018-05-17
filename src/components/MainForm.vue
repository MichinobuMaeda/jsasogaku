<template>
  <div>
    <h2><v-icon dark>face</v-icon> {{ res.titleProfile }}</h2>
    <v-form
      v-model="personValid"
      ref="person"
      v-if="personEdit || (!selectedUser.ver)"
    >
      <v-text-field
        :label="res.labelUserName"
        v-model="selectedUser.name"
        :rules="requiredRules"
        required
      ></v-text-field>
      <v-select
        :label="res.labelMembership"
        v-model="selectedUser.membership"
        :rules="requiredRules"
        required
        :items="$store.state.memberships"
        item-value="key"
      ></v-select>
      <v-select
        :label="res.labelBranch"
        v-model="selectedUser.branch"
        :rules="requiredRules"
        required
        :items="$store.state.branches"
        item-value="key"
      ></v-select>
      <v-text-field
        :label="res.labelZip"
        v-model="selectedUser.zip"
        :rules="zipRules"
        required
      ></v-text-field>
      <v-text-field
        :label="res.labelAddress"
        v-model="selectedUser.address"
        :rules="requiredRules"
        required
        multi-line=true
      ></v-text-field>
      <v-text-field
        :label="res.labelTel"
        v-model="selectedUser.tel"
        :rules="telRules"
        type="tel"
      ></v-text-field>
      <v-text-field
        :label="res.labelFax"
        v-model="selectedUser.fax"
        :rules="telRules"
        type="tel"
      ></v-text-field>
      <v-text-field
        :label="res.labelCellPhone"
        v-model="selectedUser.cell"
        :rules="telRules"
        type="tel"
      ></v-text-field>
      <v-text-field
        :label="res.labelEmail"
        v-model="selectedUser.email"
        :rules="emailRules"
        type="email"
      ></v-text-field>
      <v-text-field
        :label="res.labelProfileNote"
        v-model="selectedUser.note"
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
         v-if="selectedUser.ver"
        @click="reset"
      >
        {{ res.labelCancel }}
      </v-btn>
    </v-form> 
    <div
      v-else
    >
      <div>{{ selectedUser.name }}</div>
      <div><v-icon>people_outline</v-icon> {{
        $store.state.memberships.reduce(
          (ret, cur) => cur.key === selectedUser.membership ? cur.text : ret,
          ''
        )
      }}</div>
      <div><v-icon>group</v-icon> {{
        $store.state.branches.reduce(
        (ret, cur) => cur.key === selectedUser.branch ? cur.text : ret,
          ''
        )
      }}</div>
      <v-divider></v-divider>
      <div>〒{{ selectedUser.zip }}</div>
      <div
        v-for="(value, index) in selectedUser.address.split('\n')"
        v-bind:key="index"
      >
        {{ value }}
      </div>
      <v-divider></v-divider>
      <div v-if="selectedUser.tel">
        <v-icon>phone</v-icon>
        {{ selectedUser.tel }}
      </div>
      <div v-if="selectedUser.fax">
        Fax {{ selectedUser.fax }}
      </div>
      <div v-if="selectedUser.cell">
        <v-icon>phone_android</v-icon>
        {{ selectedUser.cell }}
      </div>
      <div v-if="selectedUser.email">
        <v-icon>email</v-icon> {{ selectedUser.email }}
      </div>
      <div
        v-if="selectedUser.note"
        v-for="(value, index) in selectedUser.note.split('\n')"
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
        v-if="!selectedEvent"
      >
        <v-icon>event_busy</v-icon>
        {{ res.statusNoActiveEvent }}
      </h3>
      <div
        v-else
      >
        <h3>
          <v-icon dark>event_available</v-icon> 
          {{ selectedEvent.name }}
        </h3>
        <p>
          {{ selectedEvent.desc }}
        </p>
        <div
          v-if="selectedUser.ver"
        >
          <div
            v-if="!selectedUser.events ||
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
                <div v-for="(text, index) in res.guideEventEntry" v-bind:key="index">
                  {{ text }}
                </div>
                <div
                  v-for="item in selectedEvent.items"
                  v-bind:key="item.key"
                  v-if="item.category === 'GA'"
                >
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
                  v-for="item in selectedEvent.items"
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
                    (ret1, cur1) => selectedEvent.items.reduce(
                      (ret2, cur2) => cur2.key === cur1 &&
                        cur2.category === 'lecture' &&
                        selectedUserEvent.items[cur1]
                          ? true : ret2, false
                    ) ? ++ret1 : ret1, 0
                  )
                }} ]</div>
                <div
                  v-for="item in selectedEvent.items"
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
                v-if="selectedUser.ver"
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
}
.big-number {
  font-family: monospace;
  font-size: 32px;
  padding: 0 6px 0 6px;
  color: black;
  background-color: white;
}
</style>

<script>
import {
  SELECT_USER,
  REGEX_EMAIL, REGEX_ZIP, REGEX_TEL
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
             this.res.validationEmaiFormat
      ]
    }
  },
  methods: {
    submit () {
      onSubmitUser(this.$store.state)
      this.personEdit = false
    },
    reset () {
      this.$store.commit(SELECT_USER, this.selectedUser)
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
    selectedUser () {
      return this.$store.state.site.selectedUser
    },
    selectedEvent () {
      return this.$store.state.site.selectedEvent
    },
    selectedUserEvent () {
      return this.$store.state.site.selectedUser
        .events[this.$store.state.site.selectedEvent.key]
    }
  }
}
</script>
