import { createStore, Store } from 'vuex'
import { GameStatus, IRootState, Move } from './types'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'


const store: Store<IRootState> = createStore<IRootState>({
  state: {
    account: undefined,
    error: undefined,
    loading: false,
    contractAddress: undefined,
    selectedMove: Move.Null,
    secondPlayer: undefined,
    gameStatus: GameStatus.NEW,
    accountBalance: undefined,
    txHash: undefined,
    contractState: {
      j1: undefined,
      j2: undefined,
      c1Hash: undefined,
      c2: Move.Null,
      stake: undefined,
      lastAction: undefined,
    },
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
})
export default store
