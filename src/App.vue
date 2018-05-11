<template>
  <v-app>
    <v-toolbar
      color="grey lighten-2"
      app
      v-if="page !== 'loading'"
    >
      <v-toolbar-title v-text="res.titleSite"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <div
          id="sign-in-as"
          v-if="me.email &&
                page !== 'loading'"
        >
          <v-icon>account_circle</v-icon> {{ me.email }}
        </div>
        <div
          id="announcement"
          v-if="res.alert &&
                page !== 'loading'"
        >
          {{ res.alert }}
        </div>
        <Loading v-if="page === 'loading'"/>
        <SignIn v-if="page === 'signIn'"/>
        <MainForm v-if="page === 'mainForm'"/>
        <RawJson v-if="page === 'rawJson'"/>
        <debug v-if="page === 'debug'"/>
      </v-container>
    </v-content>
    <v-navigation-drawer
      persistent
      :right="true"
      v-model="rightDrawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          @click="signOut"
          :disabled="page === 'loading' ||
                     page === 'signIn' || 
                     page === 'debug'"
        >
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>サインアウト</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <div
          v-show="me && accounts[me.uid] && accounts[me.uid].admin"
        >
          <v-subheader>管理者メニュー</v-subheader>
          <v-list-tile
            value="true"
            @click="rawJsonOnOff"
          >
            <v-list-tile-action>
              <v-icon>find_in_page</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{
                page === 'rawJson' ? 'Raw json Off' : 'Raw json On'
              }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>
        <v-list-tile
          value="true"
          @click="debugOnOff"
          v-show="nodeEnv === 'development'"
        >
          <v-list-tile-action>
            <v-icon>bug_report</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{
              page === 'debug' ? 'Debug Off' : 'Debug On'
            }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      color="grey lighten-2"
      :fixed="trye"
      app
      v-if="page !== 'loading'"
    >
      <span id="copyright">
        &copy;
        {{ res.copyrightYears }}
        <a v-bind:href="res.copyrightLink" target="_blank">
          {{ res.copyrightHolder }}
        </a>
      .</span>
    </v-footer>
  </v-app>
</template>

<style>
body {
  font-size: 120%;
}
h2 {
  font-weight: normal;
  color: white;
  background-color: dimgray;
  padding: 1px 8px 1px 8px;
  margin: 16px 0 16px 0;
}
h3 {
  font-weight: normal;
  color: white;
  background-color: dimgray;
  padding: 1px 6px 1px 6px;
  margin: 12px 0 12px 0;
}
h4 {
  font-weight: normal;
  color: white;
  background-color: dimgray;
  padding: 1px 4px 1px 4px;
  margin: 8px 0 8px 0;
}
.floated_cancel {
  float: right;
  padding: 48px 48px 0 0;
}
</style>

<style scoped>
#sign-in-as {
  text-align: right;
}
#announcement {
  color: red;
}
#copyright {
  padding: 0 4px 0 4px;
}
</style>

<script>
import Loading from './components/Loading'
import SignIn from './components/SignIn'
import MainForm from './components/MainForm'
import RawJson from './components/RawJson'
import Debug from './components/Debug'

export default {
  data () {
    return {
      rightDrawer: false
    }
  },
  methods: {
    signOut () {
      if (this.page === 'loading' ||
          this.page === 'signIn' ||
          this.page === 'debug') {
        return
      }
      this.$store.state.firebase.auth().signOut()
      .then(() => {
        // Sign-out successful.
        this.rightDrawer = false
      })
      .catch((error) => {
        window.alert(error)
        this.rightDrawer = false
      })
    },
    rawJsonOnOff () {
      if (this.page !== 'rawJson') {
        this.$store.commit('setPage', 'rawJson')
      } else {
        this.$store.commit('backPage')
      }
      this.rightDrawer = false
      window.scrollTo({top: 0})
    },
    debugOnOff () {
      if (this.page !== 'debug') {
        this.$store.commit('setPage', 'debug')
      } else {
        this.$store.commit('backPage')
      }
      this.rightDrawer = false
      window.scrollTo({top: 0})
    }
  },
  name: 'App',
  components: {
    Loading,
    SignIn,
    MainForm,
    RawJson,
    Debug
  },
  computed: {
    res () {
      return this.$store.state.resources
    },
    page () {
      return this.$store.state.site.page
    },
    accounts () {
      return this.$store.state.accounts
    },
    me () {
      return this.$store.state.me
    },
    nodeEnv () {
      return this.$store.state.site.nodeEnv
    }
  }
}
</script>
