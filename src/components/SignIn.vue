<template>
  <div>
    <h2><v-icon dark>account_circle</v-icon> {{ res.titleSignIn }}</h2>
    <div>
      <p v-for="(text, index) in res.guideSignIn" v-bind:key="index">
        {{ text }}
      </p>
    </div>
    <v-form v-model="valid" ref="form">
      <v-text-field
        id="email"
        :label="res.labelEmail"
        v-model="email"
        :rules="emailRules"
        required
      ></v-text-field>
      <p>{{ res.warningBeforeSignIn }}</p>
      <v-btn
        color="primary"
        @click="submit"
        :disabled="!valid || submitted"
      >
        {{ 
          res.labelSubmitAuthEmail }}
      </v-btn>
      <div>
        <p v-for="(text, index) in res.guidePassword" v-bind:key="index">
          {{ text }}
        </p>
      </div>
      <v-text-field
        id="password"
        v-model="password"
        :label="res.labelPassword"
        :append-icon="passwordVisible ? 'visibility' : 'visibility_off'"
        :append-icon-cb="() => (passwordVisible = !passwordVisible)"
        :type="passwordVisible ? 'text' : 'password'"
      ></v-text-field>
      <v-btn
        color="warning"
        @click="signUpWithPassword"
        :disabled="!valid || submitted || !password || password.length < 8 || !password.match(/\d/) || !password.match(/\D/)"
      >
        {{ res.labelPasswordSingUp }}
      </v-btn>
      <v-btn
        color="primary"
        @click="signInWithPassword"
        :disabled="!valid || submitted || !password || password.length < 8 || !password.match(/\d/) || !password.match(/\D/)"
      >
        {{ res.labelPasswordSingIn }}
      </v-btn>
      <div>
        <p v-for="(text, index) in res.guidePasswordReset" v-bind:key="index">
          {{ text }}
        </p>
      </div>
      <v-btn
        color="error"
        @click="resetPassword"
        :disabled="!valid || submitted"
      >
        {{ res.labelPasswordReset }}
      </v-btn>
    </v-form>
    <h2><v-icon dark>message</v-icon> {{ res.titleSiteGuide }}</h2>
    <div>
      <p v-for="(text, index) in res.guideSite" v-bind:key="index">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {EMAIL_FOR_SIGN_IN, REGEX, GETTERS} from '../constants'

export default {
  data () {
    return {
      valid: false,
      submitted: false,
      email: '',
      emailRules: [
        v => !!v || this.res.validationRequired,
        v => REGEX.EMAIL.test(v) ||
            this.res.validationEmailFormat
      ],
      password: '',
      passwordVisible: false,
      checkbox: false
    }
  },
  methods: {
    async submit () {
      if (!this.$refs.form.validate()) {
        return
      }
      try {
        let email = this.email
        this.submitted = true
        await this.$store.state.firebase.auth().sendSignInLinkToEmail(email, {
          url: window.location.href,
          handleCodeInApp: true
        })
        // Save the email address for auth.
        window.localStorage.setItem(EMAIL_FOR_SIGN_IN, email)
        window.alert(this.res.statusSubmittedAuthEmail)
      } catch (error) {
        this.submitted = false
        window.alert(error)
      }
    },
    async signUpWithPassword () {
      try {
        this.submitted = true
        await this.$store.state.firebase.auth().createUserWithEmailAndPassword(
          this.email,
          this.password
        )
        window.alert(this.res.statusSignUp)
        window.location.href = window.location.href
      } catch (error) {
        this.submitted = false
        window.alert(error)
      }
    },
    async signInWithPassword () {
      try {
        this.submitted = true
        await this.$store.state.firebase.auth().signInWithEmailAndPassword(
          this.email,
          this.password
        )
        window.alert(this.res.statusSignIn)
        window.location.href = window.location.href
      } catch (error) {
        this.submitted = false
        window.alert(error)
      }
    },
    async resetPassword () {
      try {
        this.submitted = true
        await this.$store.state.firebase.auth().sendPasswordResetEmail(
          this.email,
          {
            url: window.location.href
          }
        )
        window.alert(this.res.statusSendPasswordResetEmail)
      } catch (error) {
        this.submitted = false
        window.alert(error)
      }
    }
  },
  computed: {
    ...mapGetters(GETTERS)
  }
}
</script>
