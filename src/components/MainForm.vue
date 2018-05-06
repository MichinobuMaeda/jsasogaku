<template>
  <div>
    <h2><v-icon dark>face</v-icon> 本人情報</h2>
    <v-form
      v-model="personValid"
      ref="person"
      v-if="personEdit || (!$store.state.site.selectedUser.ver)"
    >
      <v-text-field
        label="氏名"
        v-model="$store.state.site.selectedUser.name"
        :rules="requiredRules"
        required
      ></v-text-field>
      <v-select
        label="会員種別"
        v-model="$store.state.site.selectedUser.membership"
        :rules="requiredRules"
        required
        :items="$store.state.memberships"
        item-value="key"
      ></v-select>
      <v-select
        label="所属支部"
        v-model="$store.state.site.selectedUser.branch"
        :rules="requiredRules"
        required
        :items="$store.state.branches"
        item-value="key"
      ></v-select>
      <v-text-field
        label="郵便番号"
        v-model="$store.state.site.selectedUser.zip"
        :rules="zipRules"
        required
      ></v-text-field>
      <v-text-field
        label="住所"
        v-model="$store.state.site.selectedUser.address"
        :rules="requiredRules"
        required
        multi-line=true
      ></v-text-field>
      <v-text-field
        label="Tel"
        v-model="$store.state.site.selectedUser.tel"
        :rules="telRules"
      ></v-text-field>
      <v-text-field
        label="Fax"
        v-model="$store.state.site.selectedUser.fax"
        :rules="telRules"
      ></v-text-field>
      <v-text-field
        label="携帯"
        v-model="$store.state.site.selectedUser.cell"
        :rules="telRules"
      ></v-text-field>
      <v-text-field
        label="E-mail"
        v-model="$store.state.site.selectedUser.email"
        :rules="emailRules"
      ></v-text-field>
      <v-text-field
        label="その他（連絡上の注意など）"
        v-model="$store.state.site.selectedUser.note"
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
         v-if="$store.state.site.selectedUser.ver"
        @click="reset"
      >
        取り消し
      </v-btn>
    </v-form> 
    <div
      v-else
    >
      <div>{{ $store.state.site.selectedUser.name }}</div>
      <div><v-icon>people_outline</v-icon> {{
        $store.state.memberships.reduce(
          (ret, cur) => cur.key === $store.state.site.selectedUser.membership ? cur.text : ret,
          ''
        )
      }}</div>
      <div><v-icon>group</v-icon> {{
        $store.state.branches.reduce(
        (ret, cur) => cur.key === $store.state.site.selectedUser.branch ? cur.text : ret,
          ''
        )
      }}</div>
      <v-divider></v-divider>
      <div>〒{{ $store.state.site.selectedUser.zip }}</div>
      <div
        v-for="(value, index) in $store.state.site.selectedUser.address.split('\n')"
        v-bind:key="index"
      >
        {{ value }}
      </div>
      <v-divider></v-divider>
      <div v-if="$store.state.site.selectedUser.tel">
        <v-icon>phone</v-icon>
        {{ $store.state.site.selectedUser.tel }}
      </div>
      <div v-if="$store.state.site.selectedUser.fax">
        Fax {{ $store.state.site.selectedUser.fax }}
      </div>
      <div v-if="$store.state.site.selectedUser.cell">
        <v-icon>phone_android</v-icon>
        {{ $store.state.site.selectedUser.cell }}
      </div>
      <div v-if="$store.state.site.selectedUser.email">
        <v-icon>email</v-icon> {{ $store.state.site.selectedUser.email }}
      </div>
      <div
        v-if="$store.state.site.selectedUser.note"
        v-for="(value, index) in $store.state.site.selectedUser.note.split('\n')"
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
        v-if="!$store.state.site.selectedEvent"
      >
        <v-icon>event_busy</v-icon>
        受付中のイベントはありません。
      </h3>
      <div
        v-else
      >
        <h3>
          <v-icon dark>event_available</v-icon> 
          {{ $store.state.site.selectedEvent.name }}
        </h3>
        <p>
          {{ $store.state.site.selectedEvent.desc }}
        </p>
        <div
          v-if="$store.state.site.selectedUser.ver"
        >
          <div
            v-if="!$store.state.site.selectedUser.events ||
                  !$store.state.site.selectedUser.events[$store.state.site.selectedEvent.key]"
          >
            <v-btn
              color="primary"
              @click="getEntryNo"
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
                $store.state.site.selectedUser.events[
                  $store.state.site.selectedEvent.key
                ].number
              }}</span>
            </div>
            <v-form
              v-model="entryValid"
              ref="entry"
            >
              <v-radio-group
                v-model="$store.state.site.selectedUser.events[$store.state.site.selectedEvent.key].entry"
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
                v-if="$store.state.site.selectedUser.events[$store.state.site.selectedEvent.key].entry"
              >
                <div class="summary">
                  諸費用合計
                  <span class="big-number"> ¥{{
                    $store.state.site.selectedUser.events[
                      $store.state.site.selectedEvent.key
                    ].cost.toLocaleString()
                  }}-</span>
                </div>
                <p>下の「保存」ボタンを押すと諸費用合計を再計算します。</p>
                <div>会員は、「１日参加」は選択できません。また、会員の予稿集費用は参加費に含まれます。</div>
                <div
                  v-for="item in $store.state.site.selectedEvent.items"
                  v-bind:key="item.key"
                  v-if="item.category === 'GA'"
                >
                  <v-radio-group
                    v-if="item.list"
                    v-model="$store.state.site.selectedUser.events[$store.state.site.selectedEvent.key].items[item.key]"
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
                    v-model="$store.state.site.selectedUser.events[$store.state.site.selectedEvent.key].items[item.key]"
                  ></v-checkbox>
                  </div>
                </div>
                <h4>エクスカーション</h4>
                <div
                  v-for="item in $store.state.site.selectedEvent.items"
                  v-bind:key="item.key"
                  v-if="item.category === 'excursion'"
                >
                  <v-checkbox
                    :label="item.key + ': ' + item.name"
                    v-model="$store.state.site.selectedUser.events[$store.state.site.selectedEvent.key].items[item.key]"
                  ></v-checkbox>
                </div>
                <h4>分科会講演申込</h4>
                <div>講演を申し込む分科会を選択して、講演の題名を記入して下さい。３個までです。</div>
                <div>申込数 [ {{
                  Object.keys($store.state.site.selectedUser.events[$store.state.site.selectedEvent.key].items).reduce(
                    (ret1, cur1) => $store.state.site.selectedEvent.items.reduce(
                      (ret2, cur2) => cur2.key === cur1 &&
                        cur2.category === 'lecture' &&
                        $store.state.site.selectedUser.events[$store.state.site.selectedEvent.key].items[cur1]
                          ? true : ret2, false
                    ) ? ++ret1 : ret1, 0
                  )
                }} ]</div>
                <div
                  v-for="item in $store.state.site.selectedEvent.items"
                  v-bind:key="item.key"
                  v-if="item.category === 'lecture'"
                >
                  <v-text-field
                    :label="item.key + ': ' + item.name"
                    v-model="$store.state.site.selectedUser.events[$store.state.site.selectedEvent.key].items[item.key]"
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
                v-if="$store.state.site.selectedUser.ver"
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
      let {id, ver, ...user} = this.$store.state.site.selectedUser
      const timestamp = new Date()
      const db = this.$store.state.firebase.firestore()

      // 参加費再計算
      const activeEvent = this.$store.state.site.selectedEvent
      let userEvent = this.$store.state.site.selectedUser.events[activeEvent.key]
      if (userEvent) {
        userEvent.cost = !userEvent.entry
          ? 0
          : Object.keys(userEvent.items).reduce(
            (ret1, cur1) => ret1 + activeEvent.items.reduce(
              (ret2, cur2) => ret2 + (cur2.key === cur1
                ? userEvent.items[cur1]
                  ? Array.isArray(cur2.list)
                    ? cur2.list[userEvent.items[cur1] - 1][this.$store.state.site.selectedUser.membership] || 0
                    : (cur2[this.$store.state.site.selectedUser.membership] || 0)
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
              this.$store.commit('selectUser', this.$store.state.site.selectedUser)
            }
          } finally {
            this.personEdit = false
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          }
        })
      }
    },
    reset () {
      this.$store.commit('selectUser', this.$store.state.site.selectedUser)
      this.personEdit = false
    },
    toggleEditPerson () {
      this.personEdit = !this.personEdit
    },
    getEntryNo () {
      // 受付番号のカウンターを取得する。
      const db = this.$store.state.firebase.firestore()
      let docRefCounter = db.collection('counters').doc(
        this.$store.state.site.selectedEvent.key
      )
      let docRefUser = db.collection('users').doc(
        this.$store.state.site.selectedUser.id
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
                [this.$store.state.site.selectedEvent.key]: {
                  number: count,
                  cost: 0,
                  entry: 1,
                  items: this.$store.state.site.selectedEvent.items.reduce(
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
  }
}
</script>
