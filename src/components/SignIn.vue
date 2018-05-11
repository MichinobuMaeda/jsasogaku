<template>
  <div>
    <h2><v-icon dark>account_circle</v-icon> ログイン</h2>
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
      <p>メールアドレスの綴りに間違いがないことを確認して下さい。</p>
      <v-btn
        color="primary"
        @click="submit"
        :disabled="!valid"
      >
        送信
      </v-btn>
    </v-form>
    <h2><v-icon dark>message</v-icon> ご案内</h2>
    <p v-for="(text, index) in res.guideSite" v-bind:key="index">
      {{ text }}
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    email: '',
    emailRules: [
      v => !!v || '入力必須',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '半角英数字 aaaa@bbb.ccc 形式'
    ],
    checkbox: false
  }),
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        let email = this.email
        return this.$store.state.firebase.auth().sendSignInLinkToEmail(email, {
          url: window.location.href,
          handleCodeInApp: true
        })
        .then(function () {
          // 認証に利用したメールアドレスを保存する。
          window.localStorage.setItem('emailForSignIn', email)
          window.alert('認証用のURLを記載したメールを送信しました。このページは閉じて下さい。')
        })
        .catch(function (error) {
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
