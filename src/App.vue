<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <div
          id="floated_menu"
          v-if="showMenuButton"
        >
          <v-btn fab dark small fixed color="primary"
            @click="rightDrawer = !rightDrawer"
          >
            <v-icon dark>menu</v-icon>
          </v-btn>
        </div>
        <div
          id="floated_menu"
          v-else-if="!rightDrawer && page !== PAGE.LOADING && page !== PAGE.SIGN_IN"
        >
          <v-btn fab dark small fixed color="error"
            @click="cancel"
          >
            <v-icon dark>clear</v-icon>
          </v-btn>
        </div>
        <h1>{{ res.titleSite }}</h1>
        <div
          id="sign-in-as"
          v-if="me.email &&
                page !== PAGE.LOADING"
        >
          <v-icon>account_circle</v-icon> {{ me.email }}
        </div>
        <div
          id="announcement"
          v-if="res.alert &&
                page !== PAGE.LOADING"
        >
          {{ res.alert }}
        </div>
        <Loading v-if="page === PAGE.LOADING"/>
        <SignIn v-if="page === PAGE.SIGN_IN"/>
        <MainForm v-if="page === PAGE.MAIN_FORM"/>
        <UserEdit v-if="page === PAGE.USER_EDIT"/>
        <UserShow v-if="page === PAGE.USER_SHOW"/>
        <Summary v-if="page === PAGE.SUMMARY"/>
        <Collection v-if="page === PAGE.COLLECTION"/>
        <User v-if="page === PAGE.USER"/>
        <Account v-if="page === PAGE.ACCOUNT"/>
        <Event v-if="page === PAGE.EVENT"/>
        <Membership v-if="page === PAGE.MEMBERSHIP"/>
        <Branch v-if="page === PAGE.BRANCH"/>
        <Resource v-if="page === PAGE.RESOURCE"/>
        <debug v-if="page === PAGE.DEBUG"/>
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
          @click="rightDrawer = false"
        >
          <v-list-tile-action>
            <v-icon>close</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ res.titleCloseMenu }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          value="true"
          @click="refresh"
        >
          <v-list-tile-action>
            <v-icon>refresh</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ res.labelRefresh }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          value="true"
          @click="signOut"
          :disabled="page === PAGE.LOADING ||
                     page === PAGE.SIGN_IN || 
                     page === PAGE.DEBUG"
        >
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ res.titleSignOut }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <div
          v-show="me && accounts[me.uid] && accounts[me.uid].admin"
        >
          <v-subheader>{{ res.titleAdminMenu }}</v-subheader>

          <v-list-tile
            value="true"
            v-for="(item, index) in adminMenuItems"
            v-bind:key="index"
            @click="adminPageOnOff(item.page)"
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ res[item.title] }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

        </div>

        <v-list-tile
          value="true"
          @click="adminPageOnOff(PAGE.DEBUG)"
          v-show="nodeEnv === 'development'"
        >
          <v-list-tile-action>
            <v-icon>bug_report</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Debug</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      color="grey lighten-2"
      :fixed="true"
      app
      v-if="page !== PAGE.LOADING"
    >
      <span id="copyright">
        &copy;
        {{ res.copyrightYears }}
        <a v-bind:href="res.copyrightLink" target="_blank">
          {{ res.copyrightHolder }}
        </a>
      .</span>
      <cookie-law
        theme="blood-orange"
          :message="res.labelEuCookieLawMessage"
          :buttonText="res.labelEuCookieLawOK"
      ></cookie-law>
    </v-footer>
  </v-app>
</template>

<style>
body {
  font-size: 120%;
}
h1 {
  font-weight: normal;
  font-size: 22px;
  padding: 1px 2px 1px 2px;
  margin: 2px 0 2px 0;
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
#floated_menu {
  float: right;
  padding: 0 36px 0 0;
}
table {
  margin: 4px 0 4px 0;
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
import {mapGetters} from 'vuex'
import CookieLaw from 'vue-cookie-law'
import {PAGE, M, GETTERS} from './constants'
import Loading from './components/Loading'
import SignIn from './components/SignIn'
import MainForm from './components/MainForm'
import UserEdit from './components/UserEdit'
import UserShow from './components/UserShow'
import Summary from './components/Summary'
import Collection from './components/Collection'
import User from './components/User'
import Account from './components/Account'
import Event from './components/Event'
import Membership from './components/Membership'
import Branch from './components/Branch'
import Resource from './components/Resource'
import Debug from './components/Debug'

export default {
  data () {
    return {
      rightDrawer: false,
      PAGE,
      nodeEnv: process.env.NODE_ENV,
      adminMenuItems: [
        {
          title: 'titleSummary',
          icon: 'list',
          page: PAGE.SUMMARY
        },
        {
          title: 'titleCollection',
          icon: 'payment',
          page: PAGE.COLLECTION
        },
        {
          title: 'titleUserList',
          icon: 'face',
          page: PAGE.USER
        },
        {
          title: 'titleAccounts',
          icon: 'account_circle',
          page: PAGE.ACCOUNT
        },
        {
          title: 'titleEvents',
          icon: 'event',
          page: PAGE.EVENT
        },
        {
          title: 'labelMembership',
          icon: 'people_outline',
          page: PAGE.MEMBERSHIP
        },
        {
          title: 'labelBranch',
          icon: 'people',
          page: PAGE.BRANCH
        },
        {
          title: 'titleResources',
          icon: 'message',
          page: PAGE.RESOURCE
        }
      ]
    }
  },
  methods: {
    cancel () {
      this.canceled = true
      this.$store.commit(M.BACK_PAGE)
      window.scrollTo({top: 0})
    },
    signOut () {
      if (this.page === PAGE.LOADING ||
          this.page === PAGE.SIGN_IN ||
          this.page === PAGE.DEBUG) {
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
    adminPageOnOff (page) {
      if (this.page !== page) {
        this.$store.commit(M.SET_PAGE, page)
      } else {
        this.$store.commit(M.BACK_PAGE)
      }
      this.rightDrawer = false
      window.scrollTo({top: 0})
    },
    refresh () {
      window.location.href = window.location.href
    }
  },
  name: 'App',
  components: {
    CookieLaw,
    Loading,
    SignIn,
    MainForm,
    UserEdit,
    UserShow,
    Collection,
    Summary,
    User,
    Account,
    Event,
    Membership,
    Branch,
    Resource,
    Debug
  },
  computed: {
    ...mapGetters(GETTERS),
    showMenuButton () {
      return !this.rightDrawer && (
        this.$store.state.site.page === PAGE.MAIN_FORM ||
        this.$store.state.site.page === PAGE.USER_EDIT ||
        this.$store.state.site.page === PAGE.USER_SHOW
      )
    }
  }
}
</script>
