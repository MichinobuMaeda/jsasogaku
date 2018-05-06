<template>
  <v-app>
    <v-toolbar
      color="grey lighten-2"
      app
      v-if="$store.state.site.page !== 'loading'"
    >
      <v-toolbar-title v-text="$store.state.resources.resSiteTitle"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <div
          id="sign-in-as"
          v-if="$store.state.me.email &&
                $store.state.site.page !== 'loading'"
        >
          <v-icon>account_circle</v-icon> {{ $store.state.me.email }}
        </div>
        <div
          id="announcement"
          v-if="$store.state.resources.resAnnouncement &&
                $store.state.site.page !== 'loading'"
        >
          {{ $store.state.resources.resAnnouncement }}
        </div>
        <Loading v-if="$store.state.site.page === 'loading'"/>
        <SignIn v-if="$store.state.site.page === 'signIn'"/>
        <MainForm v-if="$store.state.site.page === 'mainForm'"/>
        <RawJson v-if="$store.state.site.page === 'rawJson'"/>
        <debug v-if="$store.state.site.page === 'debug'"/>
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
          :disabled="$store.state.site.page === 'loading' ||
                     $store.state.site.page === 'signIn' || 
                     $store.state.site.page === 'debug'"
        >
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>サインアウト</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <div
          v-show="$store.state.me && $store.state.accounts[$store.state.me.uid] && $store.state.accounts[$store.state.me.uid].admin"
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
                $store.state.site.page === 'rawJson' ? 'Raw json Off' : 'Raw json On'
              }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>
        <v-list-tile
          value="true"
          @click="debugOnOff"
          v-show="$store.state.site.nodeEnv === 'development'"
        >
          <v-list-tile-action>
            <v-icon>bug_report</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{
              $store.state.site.page === 'debug' ? 'Debug Off' : 'Debug On'
            }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      color="grey lighten-2"
      :fixed="trye"
      app
      v-if="$store.state.site.page !== 'loading'"
    >
      <span id="copyright">
        &copy;
        {{ $store.state.resources.resCopyrightYears }}
        <a v-bind:href="$store.state.resources.resCopyrightLink" target="_blank">
          {{ $store.state.resources.resCopyrightHolder }}
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
      if (this.$store.state.site.page === 'loading' ||
          this.$store.state.site.page === 'signIn' ||
          this.$store.state.site.page === 'debug') {
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
      if (this.$store.state.site.page !== 'rawJson') {
        this.$store.commit('setPage', 'rawJson')
      } else {
        this.$store.commit('backPage')
      }
      this.rightDrawer = false
      window.scrollTo({top: 0})
    },
    debugOnOff () {
      if (this.$store.state.site.page !== 'debug') {
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
  }
}
</script>
