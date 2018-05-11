<template>
  <div>
    <h2><v-icon dark>face</v-icon> 本人情報</h2>
    <v-form
      v-model="personValid"
      ref="person"
      v-if="personEdit || (!selectedUser.ver)"
    >
      <v-text-field
        label="氏名"
        v-model="selectedUser.name"
        :rules="requiredRules"
        required
      ></v-text-field>
      <v-select
        label="会員種別"
        v-model="selectedUser.membership"
        :rules="requiredRules"
        required
        :items="$store.state.memberships"
        item-value="key"
      ></v-select>
      <v-select
        label="所属支部"
        v-model="selectedUser.branch"
        :rules="requiredRules"
        required
        :items="$store.state.branches"
        item-value="key"
      ></v-select>
      <v-text-field
        label="郵便番号"
        v-model="selectedUser.zip"
        :rules="zipRules"
        required
      ></v-text-field>
      <v-text-field
        label="住所"
        v-model="selectedUser.address"
        :rules="requiredRules"
        required
        multi-line=true
      ></v-text-field>
      <v-text-field
        label="Tel"
        v-model="selectedUser.tel"
        :rules="telRules"
      ></v-text-field>
      <v-text-field
        label="Fax"
        v-model="selectedUser.fax"
        :rules="telRules"
      ></v-text-field>
      <v-text-field
        label="携帯"
        v-model="selectedUser.cell"
        :rules="telRules"
      ></v-text-field>
      <v-text-field
        label="E-mail"
        v-model="selectedUser.email"
        :rules="emailRules"
      ></v-text-field>
      <v-text-field
        label="その他（連絡上の注意など）"
        v-model="selectedUser.note"
        multi-line=true
      ></v-text-field>
      <v-btn
        color="primary"
        @click="submit"
        :disabled="!personValid"
      >
        保存
      </v-btn>
      <v-btn
         v-if="selectedUser.ver"
        @click="reset"
      >
        取り消し
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
        編集
      </v-btn>
      <h2><v-icon dark>assignment</v-icon> 受付内容</h2>
      <h3
        v-if="!selectedEvent"
      >
        <v-icon>event_busy</v-icon>
        受付中のイベントはありません。
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
              @click="getEntryNo"
              :disabled="disabledGetEntryNo"
            >
              受付登録開始
            </v-btn>
          </div>
          <div
            v-else
          >
            <div class="summary">
              受付番号
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
                  label="参加申込"
                  :value="1"
                ></v-radio>
                <v-radio
                  label="参加未定または取り消し"
                  :value="0"
                ></v-radio>
              </v-radio-group>
              <div
                v-if="selectedUserEvent.entry"
              >
                <div class="summary">
                  諸費用合計
                  <span class="big-number"> ¥{{
                    selectedUserEvent.cost.toLocaleString()
                  }}-</span>
                </div>
                <p>下の「保存」ボタンを押すと諸費用合計を再計算します。</p>
                <div>会員は、「１日参加」は選択できません。また、会員の予稿集費用は参加費に含まれます。</div>
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
                <h4>エクスカーション</h4>
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
                <h4>分科会講演申込</h4>
                <div>講演を申し込む分科会を選択して、講演の題名を記入して下さい。３個までです。</div>
                <div>申込数 [ {{
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
                保存
              </v-btn>
              <v-btn
                v-if="selectedUser.ver"
                @click="reset"
              >
                取り消し
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
      disabledGetEntryNo: false,
      requiredRules: [
        v => !!v || '入力必須'
      ],
      zipRules: [
        v => !!v || '入力必須',
        v => /^[-0-9]+$/.test(v) || '半角数字と "-"'
      ],
      telRules: [
        v => !v || /^[-0-9]*$/.test(v) || '半角数字と "-"'
      ],
      emailRules: [
        v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
             '半角英数字 aaaa@bbb.ccc 形式'
      ]
    }
  },
  methods: {
    submit () {
      let {id, ver, ...user} = this.selectedUser
      const timestamp = new Date()
      const db = this.$store.state.firebase.firestore()

      // 参加費再計算
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
      // 新規追加の場合、
      if (!ver) {
        db.collection('users').doc().set({
          ...user,
          ver: ver + 1,
          createdAt: timestamp,
          updatedAt: timestamp
        })
        this.personEdit = false

      // 更新の場合、
      } else {
        // Firestore に保存されているユーザ情報を取得する。
        let docRef = db.collection('users').doc(id || 'dummy')
        // トランザクションを開始する。
        db.runTransaction(async transaction => {
          try {
            let doc = await transaction.get(docRef)
            // 存在する場合、
            if (doc.exists) {
              // バージョンが一致しない場合、
              if (doc.data().ver !== ver) {
                /* eslint-disable no-throw-literal */
                throw '他のところで更新され、編集内容が競合しています。最新のデータを取得します。'

              // バージョンが一致する場合、
              } else {
                // データを更新する。
                await transaction.update(docRef, {
                  ...user,
                  ver: ver + 1,
                  updatedAt: timestamp
                })
              }

            // 存在しない場合、
            } else {
              /* eslint-disable no-throw-literal */
              window.alert('データが削除されているようです。不整合の解消のためにページをリロードします。もう一度入力して下さい。')
              window.location.href = window.location.href
            }
          } catch (error) {
            if (error.code === 'permission-denied') {
              window.alert('データが削除されているようです。不整合の解消のためにページをリロードします。もう一度入力して下さい。')
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
    getEntryNo () {
      // 受付番号のカウンターを取得する。
      this.disabledGetEntryNo = true
      const db = this.$store.state.firebase.firestore()
      let docRefCounter = db.collection('counters').doc(
        this.selectedEvent.key
      )
      let docRefUser = db.collection('users').doc(
        this.selectedUser.id
      )
      // トランザクションを開始する。
      db.runTransaction(async transaction => {
        let timestamp = new Date()
        try {
          let docCounter = await transaction.get(docRefCounter)
          let docUser = await transaction.get(docRefUser)
          // 受付番号のカウンターが存在する場合、
          if (docCounter.exists) {
            // 採番する。
            let count = docCounter.data().count + 1
            await transaction.update(docRefCounter, {count})
            // 申込情報を保存する。
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

          // 受付番号のカウンターが存在しない場合、
          } else {
            /* eslint-disable no-throw-literal */
            throw '受付番号の採番の準備ができていません。しばらくお待ちください。'
          }
        } catch (error) {
          window.alert(error)
        }
      })
    }
  },
  computed: {
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
