<template>
  <div>
    <h2>
      <v-icon dark>face</v-icon>
      {{ user.uid === me.uid ? res.titleProfile : res.titleUserList }}
    </h2>
    <v-form
      v-model="personValid"
      ref="person"
    >
      <div
        v-if="accounts[me.uid].admin"
      >
        <div
          v-if="user.key"
        >
          <div class="guide"><v-icon :color="colorinfo">warning</v-icon> {{res.guideAdminProfile}}</div>
          <v-text-field
            v-if="accounts[me.uid].admin"
            label="Account ID"
            v-model="user.uid"
          ></v-text-field>
        </div>
        <div
          v-else
        >
          {{ user.uid }}
        </div>
      </div>
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
  </div>
</template>

<style scoped>
.guide {
  color: #5D4037;
}
.column {
  padding-right: 6px;
}
</style>

<script>
import {
  REGEX_EMAIL, REGEX_ZIP, REGEX_TEL, SET_PAGE, PAGE, SELECT_USER,
  DB_USERS, EXCEPTION_CONFLICT, EXCEPTION_DELETED,
  getUserForEdit, updateUserSummary, getFirestore
} from '../common'
import {onSubmitNewUser, onSubmitUser} from '../handlers'
import UserProfile from './UserProfile'
import UserSummary from './UserSummary'

export default {
  data () {
    return {
      personValid: false,
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
      user: getUserForEdit(this.$store.state)
    }
  },
  methods: {
    async submit () {
      let db = getFirestore(this.$store.state.firebase)
      let collection = db.collection(DB_USERS)
      if (this.user.ver) {
        try {
          let db = getFirestore(this.$store.state.firebase)
          let collection = db.collection(DB_USERS)
          await onSubmitUser(
            collection,
            updateUserSummary(this.$store.state, this.user)
          )
          this.$store.commit(SET_PAGE, PAGE.USER_SHOW)
          window.scrollTo({top: 0, behavior: 'smooth'})
        } catch (error) {
          if (error.code === 'permission-denied' ||
              error.name === EXCEPTION_DELETED.name) {
            window.alert(this.$store.state.resources.errorConflictDeleted)
          } else if (error.name === EXCEPTION_CONFLICT.name) {
            window.alert(this.$store.state.resources.errorConflictUpdated)
          } else {
            window.alert(error)
          }
          window.location.href = window.location.href
        }
      } else {
        let id = await onSubmitNewUser(collection, this.user)
        this.$store.commit(SELECT_USER, id)
      }
      this.$store.commit(SET_PAGE, PAGE.USER_SHOW)
      window.scrollTo({top: 0, behavior: 'smooth'})
    },
    reset () {
      this.$store.commit(SET_PAGE, PAGE.USER_SHOW)
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  },
  components: {
    UserProfile,
    UserSummary
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
    colorinfo () {
      return 'brown'
    }
  }
}
</script>
