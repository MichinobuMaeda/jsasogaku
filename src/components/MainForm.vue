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
        v => /^[-0-9]+$/.test(v) || this.res.validationZipNo
      ],
      telRules: [
        v => !v || /^[-0-9]*$/.test(v) || this.res.validationPhoneNo
      ],
      emailRules: [
        v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
             this.res.validationEmaiFormat
      ]
    }
  },
  methods: {
    submit () {
      let {id, ver, ...user} = this.selectedUser
      const timestamp = new Date()
      const db = this.$store.state.firebase.firestore()

      // Recalc the sum.
      const activeEvent = this.selectedEvent
      let userEvent = this.selectedUser.events[activeEvent.key]
      if (userEvent) {
        userEvent.cost = !userEvent.entry
          ? 0
          : Object.keys(userEvent.items).reduce(
            (ret1, cur1) => ret1 + activeEvent.items.reduce(
              (ret2, cur2) => ret2 + (cur2.key === cur1
                ? userEvent.items[cur1]
                  ? Array.isArray(cur2.list)
                    ? cur2.list[userEvent.items[cur1] - 1][this.selectedUser.membership] || 0
                    : (cur2[this.selectedUser.membership] || 0)
                  : 0
                : 0)
              , 0
            ), 0
          )
      }
      // If add the new user data.
      if (!ver) {
        db.collection('users').doc().set({
          ...user,
          ver: ver + 1,
          createdAt: timestamp,
          updatedAt: timestamp
        })
        this.personEdit = false

      // If update the user data.
      } else {
        // Get the saved user date.
        let docRef = db.collection('users').doc(id || 'dummy')
        // Start transaction.
        db.runTransaction(async transaction => {
          try {
            let doc = await transaction.get(docRef)
            // If the user data restored.
            if (doc.exists) {
              // If the version of user data is invalid.
              if (doc.data().ver !== ver) {
                /* eslint-disable no-throw-literal */
                throw this.res.errorConflictUpdated

              // If the version of user data is valid.
              } else {
                // Update the user data
                await transaction.update(docRef, {
                  ...user,
                  ver: ver + 1,
                  updatedAt: timestamp
                })
              }

            // If the user data is not exists.
            } else {
              /* eslint-disable no-throw-literal */
              window.alert(this.res.errorConflictDeleted)
              window.location.href = window.location.href
            }
          } catch (error) {
            if (error.code === 'permission-denied') {
              window.alert(this.res.errorConflictDeleted)
              window.location.href = window.location.href
            } else {
              window.alert(error)
              this.$store.commit('selectUser', this.selectedUser)
            }
          } finally {
            this.personEdit = false
            window.scrollTo({top: 0, behavior: 'smooth'})
          }
        })
      }
    },
    reset () {
      this.$store.commit('selectUser', this.selectedUser)
      this.personEdit = false
    },
    toggleEditPerson () {
      this.personEdit = !this.personEdit
    },
    getReceiptNo () {
      this.disabledGetReceiptNo = true
      const db = this.$store.state.firebase.firestore()
      let docRefCounter = db.collection('counters').doc(
        this.selectedEvent.key
      )
      let docRefUser = db.collection('users').doc(
        this.selectedUser.id
      )
      // Start transaction.
      db.runTransaction(async transaction => {
        let timestamp = new Date()
        try {
          let docCounter = await transaction.get(docRefCounter)
          let docUser = await transaction.get(docRefUser)
          // If the receipt number counter is exists,
          if (docCounter.exists) {
            // Get the new number
            let count = docCounter.data().count + 1
            await transaction.update(docRefCounter, {count})
            // Save the user data.
            await transaction.update(docRefUser, {
              events: {
                [this.selectedEvent.key]: {
                  number: count,
                  cost: 0,
                  entry: 1,
                  items: this.selectedEvent.items.reduce(
                    (ret, cur) => ({...ret, [cur.key]: cur.default}), {}
                  )
                }
              },
              ver: docUser.data().ver + 1,
              updatedAt: timestamp
            })

          // If the receipt number counter is not exists,
          } else {
            /* eslint-disable no-throw-literal */
            throw this.res.errorMissReceiptNoCounter
          }
        } catch (error) {
          window.alert(error)
        }
      })
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
