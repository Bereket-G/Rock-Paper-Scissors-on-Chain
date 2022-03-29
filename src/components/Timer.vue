<template>
  <div v-if="lastAction && ![GameStatus.COMPLETED, GameStatus.NEW].includes(gameStatus) && contractState.stake > 0">
    <p
      v-if="[GameStatus.WAITING_FIRST_PLAYER_TO_SOLVE, GameStatus.WAITING_FOR_SECOND_PLAYER_TO_MOVE].includes(gameStatus)"
    >
      Opponent should move within 5 min ( 300 seconds ) else funds will be reverted.
    </p>

    <span> Counting Time ! {{ leftTimeOut }} seconds </span>
  </div>
</template>

<script lang="ts">


import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GameStatus } from '../store/types'
import { FIVE_MINUTES_IN_SECONDS } from '../utils/constant'

export default defineComponent({
  setup() {
    const store = useStore()

    return {
      contractAddress: computed(function() {
        return store.state.contractState
      }),
      contractState: computed(function() {
        return store.state.contractState
      }),
      gameStatus: computed(function() {
        return store.state.gameStatus
      }),
      lastAction: computed(function() {
        return store.state.contractState.lastAction
      }),
      isSecondPlayer: computed(function() {
        return store.state.contractState.j2 === store.state.account
      }),
      timedOutRevertFunds: async () => {
        await store.dispatch('timedOutRevertFunds')
      },
    }
  },
  data() {
    return {
      GameStatus,
      leftTimeOut: 0,
      timerId: null,
    }
  },
  mounted() {
    console.info(this.$store.getters.isTimedOut)
    if(!this.$store.getters.isTimedOut){
      this.startTimer()
    } else {
      this.checkTimedOut()
    }
  },
  methods: {
    startTimer: function () {
      this.timerId = setInterval(async () => {
        if (!this.lastAction) return
        this.leftTimeOut = Math.max((Math.ceil(Date.now() / 1000)) - this.lastAction.toNumber(), this.leftTimeOut + 1)
        await this.checkTimedOut()
      }, 1000)
    },
    checkTimedOut: async function() {
      if (this.leftTimeOut > FIVE_MINUTES_IN_SECONDS && !this.contractState.stake.isZero()) {
        if(!this.isSecondPlayer && this.gameStatus === GameStatus.WAITING_FOR_SECOND_PLAYER_TO_MOVE){
          await this.stopTimer()
          alert('Timed out you can redeem your funds!')
          await this.timedOutRevertFunds()
        }
      }
    },
    stopTimer: async function() {
      await clearInterval(this.timerId)
    },
  },
})
</script>
