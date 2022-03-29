<template>
  <div v-if="!contractAddress">
    <div
      class="grid w-[20rem] grid-cols-2 space-x-2 rounded-xl bg-gray-200 p-2"
      x-data="app"
    >
      <div>
        <input
          id="1"
          v-model="option"
          type="radio"
          name="option"
          value="new"
          class="peer hidden"
          checked
        >
        <label
          for="1"
          class="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white"
        >New Game </label>
      </div>

      <div>
        <input
          id="2"
          v-model="option"
          type="radio"
          name="option"
          value="join"
          class="peer hidden"
        >
        <label
          for="2"
          class="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white"
        >Join Game</label>
      </div>
    </div>

    <div class="flex flex-wrap my-4">
      <div v-if="option === 'new'">
        <input
          id="secondPlayer"
          v-model="secondPlayer"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-3"
          type="text"
          placeholder="Second Player"
          @change="setSecondPlayer(secondPlayer)"
        >
      </div>

      <div
        v-if="option === 'join'"
        class="my-3 flex"
      >
        <input
          id="gameContract"
          v-model="joinAddress"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-3"
          type="text"
          placeholder="Game Address"
        >

        <button
          class="text-xs font-semibold rounded-full px-4 py-1 leading-normal bg-white border border-purple text-purple hover:bg-purple hover:text-white"
          @click="joinGame(joinAddress)"
        >
          Join
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { HexPrefixed } from '../store/types'


export default defineComponent({
  setup() {
    const store = useStore()
    async function joinGame(contractAddress: HexPrefixed){
      store.commit('setLoading', true)
      await store.dispatch('joinGame', contractAddress)
      store.commit('setLoading', false)
    }

    const setSecondPlayer = (player2: HexPrefixed) => {
      store.commit('setSecondPlayer', player2)
    }

    return {
      joinGame,
      setSecondPlayer,
      contractAddress: computed(function () {
        return store.state.contractAddress
      }),
    }
  },
  data() {
    return {
      joinAddress: null,
      secondPlayer: null,
      option:'new',
    }
  },
})

</script>

<style>
input:checked ~ .radio {
  color:white;
  background-color: blue;
}
</style>
