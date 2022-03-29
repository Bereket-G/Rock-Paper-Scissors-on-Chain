<template>
  <div id="app">
    <loading
      :active="loading"
    />
    <Home />
  </div>
</template>

<script lang="ts">
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { computed, defineComponent } from 'vue'
import Home from './components/Home.vue'
import { useStore } from 'vuex'

export default defineComponent({
  components: { Home, Loading },
  setup() {
    const store = useStore()
    return {
      loading: computed(function () {
        return store.state.loading || (store.state.contractAddress && !store.state.contractState.lastAction)
      }),
    }
  },
})
</script>
