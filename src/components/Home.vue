<template>
  <div class="container mx-auto py-10">
    <div
      class="border m-6 rounded-lg bg-white mx-auto shadow-lg rounded-lg overflow-hidden"
    >
      <div class="sm:flex sm:items-center px-6 py-4">
        <div class="text-center sm:text-left sm:flex-grow">
          <div class="mb-4">
            <p class="text-xl leading-tight">
              Rock Paper Scissors Lizard Spock !!!
            </p>
          </div>
          <new-game />
        </div>
      </div>
    </div>
    <game />

    <div class="border m-6 rounded-lg bg-white mx-auto shadow-lg rounded-lg overflow-hidden">
      <div class="px-6 py-4">
        <p v-if="loading">
          Loading
        </p>
        <p> Account : {{ account }} </p>
        <p v-if="accountBalance">
          Account Balance : {{ accountBalance }} ETH
        </p>
        <p v-if="contractAddress">
          Deployed Contract Address : {{ contractAddress }}
        </p>
        <p v-if="contractState.j1">
          Player 1 : {{ contractState.j1 }}
        </p>
        <p v-if="contractState.j2">
          Player 2 : {{ contractState.j2 }}
        </p>
        <p v-if="contractState.lastAction">
          Last Action : {{ new Date(contractState.lastAction * 1000).toString() }}
        </p>
        <p v-if="contractState.stake">
          Stake : {{ toEth(contractState.stake) }} Ether
        </p>
        <p> Status : {{ gameStatus }} {{ isTimedOut ? "( Timed Out )" : "" }} </p>
        <p v-if="txHash">
          Tx Hash : <a
            :href="`https://rinkeby.etherscan.io/tx/${txHash}`"
            target="_blank"
          > {{ txHash }} </a>
        </p>
        <timer />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Game from './Game.vue'
import NewGame from './NewGame.vue'
import Timer from './Timer.vue'

import { computed, defineComponent } from 'vue'
import {useStore} from 'vuex'
import { ethers } from 'ethers'


export default defineComponent({
  components: { NewGame, Timer, Game },
  setup() {
    const store = useStore()

    function connectMM(){
      store.dispatch('connect', true)
      store.dispatch('calculateAndSetSalt')
    }
    connectMM()

    function refreshContractStateEvery5Sec() {
      setInterval( async () => {
        await store.dispatch('loadContractState')
        await store.dispatch('loadUserBalance')
      }, 5000)
    }
    refreshContractStateEvery5Sec()

    return {
      account:  computed(function () {
        return store.state.account
      }),
      accountBalance:  computed(function () {
        return store.state.accountBalance
      }),
      loading: store.state.loading,
      contractAddress: computed(function () {
        return store.state.contractAddress
      }),
      gameStatus: computed(function () {
        return store.state.gameStatus
      }),
      contractState: computed(function () {
        return store.state.contractState
      }),
      isTimedOut: computed(function () {
        return store.getters.isTimedOut
      }),
      txHash: computed(function () {
        return store.getters.txHash
      }),
    }
  },
  methods:{
    toEth(amount){
      return amount ? ethers.utils.formatEther(amount) : 0
    },
  },
})

</script>
