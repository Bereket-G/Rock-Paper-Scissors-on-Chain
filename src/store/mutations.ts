import { GameStatus, HexPrefixed, IContractState, IRootState, Move } from './types'
import { ethers } from 'ethers'

export default {
  setAccount(state: IRootState, account: HexPrefixed) {
    state.account = ethers.utils.getAddress(account) as HexPrefixed
  },
  setAccountBalance(state: IRootState, accountBalance: string) {
    state.accountBalance = accountBalance
  },
  setContractAddress(state: IRootState, contractAddress: HexPrefixed) {
    state.contractAddress = contractAddress
  },
  setContractState(state: IRootState, contractState: IContractState) {
    state.contractState = contractState
  },
  setLoading(state: IRootState, loading: boolean) {
    state.loading = loading
  },
  setMove(state: IRootState, move: Move) {
    state.selectedMove = move
  },
  setTxHash(state: IRootState, txHash: string) {
    state.txHash = txHash
  },
  setSecondPlayer(state: IRootState, secondPlayer: HexPrefixed) {
    state.secondPlayer = secondPlayer
  },
  setGameStatus(state: IRootState, gameStatus: GameStatus) {
    state.gameStatus = gameStatus
  },
}
