<template>
  <div>
    <h2><v-icon dark>account_circle</v-icon> {{ res.titleSignIn }}</h2>
    <p v-for="(text, index) in res.guideSignIn" v-bind:key="index">
      {{ text }}
    </p>
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
    </v-form>
    <h2><v-icon dark>message</v-icon> {{ res.titleSiteGuide }}</h2>
    <p v-for="(text, index) in res.guideSite" v-bind:key="index">
      {{ text }}
    </p>
  </div>
</template>

<script>
import {
  EMAIL_FOR_SIGN_IN, REGEX_EMAIL
} from '../common'

export default {
  data () {
    return {
      valid: false,
      submitted: false,
      email: '',
      emailRules: [
        v => !!v || this.res.validationRequired,
        v => REGEX_EMAIL.test(v) ||
            this.res.validationEmailFormat
      ],
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
    }
  },
  computed: {
    res () {
      return this.$store.state.resources
    }
  }
}
</script>
