<template>
  <div>
    <div
      v-if="(contractAddress || secondPlayer) && !isTimedOut"
      class="border m-6 rounded-lg bg-white mx-auto shadow-lg rounded-lg overflow-hidden"
    >
      <div
        v-if="gameStatus === GameStatus.WAITING_FOR_SECOND_PLAYER_TO_MOVE && !isSecondPlayer"
        class="p-4"
      >
        <p> Share the game address and let your mate stake same amount and choose their move ! </p>
      </div>

      <p
        v-if="gameStatus.WAITING_FIRST_PLAYER_TO_SOLVE && selectedMove === MOVES.Null"
        class="px-4 py-4"
      >
        Please Confirm the move you played when create the game instance !
      </p>

      <div class="mx-auto px-6 py-4 items-center">
        <div
          v-if="showOptions"
          class="text-center sm:text-left sm:flex-grow"
        >
          <div class="mb-4">
            <p v-if="gameStatus === GameStatus.WAITING_FIRST_PLAYER_TO_SOLVE && account === contractState.j1">
              Sorry we lost your first choice ! Please select what you have submitted when creating the game instance.
            </p>
            <p
              v-else
              class="text-xl leading-tight"
            >
              Go for it !!!
            </p>
          </div>

          <button
            class="mx-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            :class="{ 'boarder-transparent text-white bg-blue-500': selectedMove === MOVES.ROCK }"
            @click="setMove(MOVES.ROCK)"
          >
            Rock
          </button>

          <button
            class="mx-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            :class="{ 'boarder-transparent text-white bg-blue-500': selectedMove === MOVES.PAPER }"
            @click="setMove(MOVES.PAPER)"
          >
            Paper
          </button>

          <button
            class="mx-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            :class="{ 'boarder-transparent text-white bg-blue-500': selectedMove === MOVES.SCISSORS }"
            @click="setMove(MOVES.SCISSORS)"
          >
            Scissors
          </button>

          <button
            class="mx-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            :class="{ 'boarder-transparent text-white bg-blue-500': selectedMove === MOVES.SPOCK }"
            @click="setMove(MOVES.SPOCK)"
          >
            Spock
          </button>

          <button
            class="mx-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            :class="{ 'boarder-transparent text-white bg-blue-500': selectedMove === MOVES.LIZARD }"
            @click="setMove(MOVES.LIZARD)"
          >
            Lizard
          </button>
        </div>

        <div v-if="gameStatus === GameStatus.NEW">
          <div
            v-if="!isSecondPlayer"
            class="my-5 max-w-xs"
          >
            <label class="px-4"> Stake amount ( Ether ) </label>
            <input
              id="stakeAmount"

              v-model="stake"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-3"
              type="Number"
            >
          </div>
          <div
            v-else
            class="my-5 max-w-xs"
          >
            <span> Staked {{ toEth(contractState.stake) }} Ether </span>
          </div>
        </div>
      </div>

      <div class="flex float-right m-4">
        <div class="inline-block mr-2 mt-2">
          <button
            v-if="gameStatus === GameStatus.WAITING_FIRST_PLAYER_TO_SOLVE && !isSecondPlayer"
            type="button"
            class="focus:outline-none text-gray-600 text-sm py-2.5 px-5 rounded-md border border-gray-600 hover:bg-gray-50"
            @click="solveGame()"
          >
            Solve !
          </button>

          <button
            v-if="showOptions && gameStatus !== GameStatus.WAITING_FIRST_PLAYER_TO_SOLVE"
            type="button"
            class="focus:outline-none text-gray-600 text-sm py-2.5 px-5 rounded-md border border-gray-600 hover:bg-gray-50"
            @click="makeMove()"
          >
            Go !
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { Move, GameStatus } from '../store/types'
import { ethers } from 'ethers'

export default defineComponent({
  props: {
    msg: {
      type: String,
      default: '',
    },
  },
  setup() {
    const store = useStore()

    async function makeMove(){
      if (Number(this.stake) <= 0 && !this.isSecondPlayer){
        return alert('Come on, stake some amount!')
      }
      if(this.contractAddress){
        // play as second player
        store.dispatch('play')
      } else {
        // create new game instance
        if(!this.secondPlayer){
          return alert('Please set the second player address !')
        }
        await store.dispatch('createNewGameInstance', {stake: this.stake})
        await store.dispatch('loadContractState')
      }
    }
    return {
      makeMove,
      setMove: (move: Move) => {
        store.commit('setMove', move)
      },
      solveGame: () => {
        store.dispatch('solveGame')
      },
      contractAddress: computed(function () {
        return store.state.contractAddress
      }),
      selectedMove: computed(function () {
        return store.state.selectedMove
      }),
      secondPlayer: computed(function () {
        return store.state.secondPlayer
      }),
      account: computed(function () {
        return store.state.account
      }),
      contractState: computed(function () {
        return store.state.contractState
      }),
      gameStatus: computed(function () {
        return store.state.gameStatus
      }),
      isSecondPlayer: computed(function() {
        return store.state.contractState.j2 === store.state.account
      }),
      isTimedOut: computed(function() {
        return store.getters.isTimedOut
      }),
    }
  },
  data() {
    return {
      MOVES: Move,
      GameStatus,
      stake: 0,
    }
  },
  computed: {
    showOptions() {
      return (this.gameStatus === GameStatus.NEW ||
      (this.gameStatus === GameStatus.WAITING_FIRST_PLAYER_TO_SOLVE && this.selectedMove === this.MOVES.Null && !this.isSecondPlayer) ||
      (this.gameStatus === GameStatus.WAITING_FOR_SECOND_PLAYER_TO_MOVE && this.isSecondPlayer))
    },
  },
  watch: {
    contractAddress() {
      if(this.secondPlayer === this.account){
        this.stake = this.contractState.stake
      }
    },
  },
  methods: {
    toEth(amount){
      return amount ? ethers.utils.formatEther(amount) : 0
    },
  },
})

</script>
