<template>
  <div>
    <h2><v-icon dark>account_circle</v-icon> {{ res.titleSignIn }}</h2>
    <p v-for="(text, index) in res.guideSignIn" v-bind:key="index">
      {{ text }}
    </p>
    <v-form v-model="valid" ref="form">
      <v-text-field
        label="E-mail"
        v-model="email"
        :rules="emailRules"
        required
      ></v-text-field>
      <p>{{ res.warningBeforeSignIn }}</p>
      <v-btn
        color="primary"
        @click="submit"
        :disabled="!valid"
      >
        {{ 
          res.labelSubmitAuthEmail }}
      </v-btn>
    </v-form>
    <h2><v-icon dark>message</v-icon> {{ res.titleSiteGude }}</h2>
    <p v-for="(text, index) in res.guideSite" v-bind:key="index">
      {{ text }}
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      valid: false,
      email: '',
      emailRules: [
        v => !!v || this.res.validationRequired,
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            this.res.validationEmaiFormat
      ],
      checkbox: false
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        let email = this.email
        return this.$store.state.firebase.auth().sendSignInLinkToEmail(email, {
          url: window.location.href,
          handleCodeInApp: true
        })
        .then(() => {
          // Save the email address for auth.
          window.localStorage.setItem('emailForSignIn', email)
          window.alert(this.$store.state.resources.statusSubmittedAuthEmail)
        })
        .catch(error => {
          window.alert(error)
        })
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
