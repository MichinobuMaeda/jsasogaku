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
          <div class="guide"><v-icon :color="COLOR.INFO">warning</v-icon> {{res.guideAdminProfile}}</div>
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
          <div class="guide" xs><v-icon :color="COLOR.INFO">info</v-icon> {{res.guideMembership}}</div>
          <div class="guide"><v-icon :color="COLOR.INFO">info</v-icon> {{res.guideBranch}}</div>
        </v-flex>
        <v-flex xs12 sm6 md6 lg6 xl6 class="column">
          <v-text-field
            :label="res.labelUserName"
            v-model="user.name"
            :rules="requiredRules"
            :error="!user.name"
            required
          ></v-text-field>
        </v-flex>
        <v-flex xs12 hidden-sm-and-up class="column">
          <div class="guide" xs><v-icon :color="COLOR.INFO">info</v-icon> {{res.guideMembership}}</div>
          <div class="guide" xs><v-icon :color="COLOR.INFO">info</v-icon> {{res.guideBranch}}</div>
        </v-flex>
        <v-flex xs7 sm3 md3 lg3 xl3 class="column">
          <v-select
            :label="res.labelMembership"
            v-model="user.membership"
            :rules="requiredRules"
            :error="!user.membership"
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
            :error="!user.branch"
            required
            :items="$store.state.branches"
            item-value="key"
          ></v-select>
        </v-flex>
      </v-layout>
      <div class="guide"><v-icon :color="COLOR.INFO">info</v-icon> {{res.guideAddress}}</div>
      <v-text-field
        :label="res.labelZip"
        v-model="user.zip"
        :rules="zipRules"
        :error="!user.zip"
        required
        prefix="〒"
      ></v-text-field>
      <v-text-field
        :label="res.labelPref"
        v-model="user.pref"
        :rules="requiredRules"
        :error="!user.pref"
        required
      ></v-text-field>
      <v-text-field
        :label="res.labelCity"
        v-model="user.city"
        :rules="requiredRules"
        :error="!user.city"
        required
      ></v-text-field>
      <v-text-field
        :label="res.labelStreet"
        v-model="user.street"
        :rules="requiredRules"
        :error="!user.street"
        required
      ></v-text-field>
      <v-text-field
        :label="res.labelBldg"
        v-model="user.bldg"
      ></v-text-field>
      <div class="guide"><v-icon :color="COLOR.INFO">info</v-icon> {{res.guideContactMethod}}</div>
      <div class="guide"><v-icon :color="COLOR.INFO">info</v-icon> {{res.guideEmail}}</div>
      <v-text-field
        :label="res.labelEmail"
        v-model="user.email"
        :rules="emailRules"
        :error="!user.email"
        required
        type="email"
      ></v-text-field>
      <v-text-field
        :label="res.labelTel"
        v-model="user.tel"
        :rules="telRules"
        :error="!user.tel"
        required
        type="tel"
      ></v-text-field>
      <v-text-field
        :label="res.labelFax"
        v-model="user.fax"
        :rules="faxRules"
        type="tel"
      ></v-text-field>
      <div class="guide"><v-icon :color="COLOR.INFO">info</v-icon> {{res.guideNote}}</div>
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
import {mapGetters} from 'vuex'
import {REGEX, PAGE, M, DB, EXCEPTION, GETTERS} from '../constants'
import {onSubmitNewUser, onSubmitUser} from '../handlers'
import {userForEdit} from '../common'
import UserProfile from './UserProfile'
import UserSummary from './UserSummary'

export default {
  data () {
    return {
      user: userForEdit(this.$store.state),
      personValid: false,
      requiredRules: [
        v => !!v || this.res.validationRequired
      ],
      zipRules: [
        v => !!v || this.res.validationRequired,
        v => REGEX.ZIP.test(v) || this.res.validationZipNo
      ],
      telRules: [
        v => !!v || this.res.validationRequired,
        v => !v || REGEX.TEL.test(v) || this.res.validationPhoneNo
      ],
      faxRules: [
        v => !v || REGEX.TEL.test(v) || this.res.validationPhoneNo
      ],
      emailRules: [
        v => !!v || this.res.validationRequired,
        v => !v || REGEX.EMAIL.test(v) ||
             this.res.validationEmailFormat
      ]
    }
  },
  methods: {
    async submit () {
      let collection = this.collection(DB.USERS)
      if (this.user.ver) {
        try {
          await onSubmitUser(collection, this.$store.state, this.user)
          this.$store.commit(M.SET_PAGE, PAGE.USER_SHOW)
          window.scrollTo({top: 0, behavior: 'smooth'})
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
      } else {
        let id = await onSubmitNewUser(collection, this.user)
        this.$store.commit(M.SELECT_USER, id)
      }
      this.$store.commit(M.SET_PAGE, PAGE.USER_SHOW)
      window.scrollTo({top: 0, behavior: 'smooth'})
    },
    reset () {
      this.$store.commit(M.SET_PAGE, PAGE.USER_SHOW)
      window.scrollTo({top: 0, behavior: 'smooth'})
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
