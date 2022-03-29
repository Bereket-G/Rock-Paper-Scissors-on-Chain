import { GameStatus, HexPrefixed, IContractState, IRootState } from './types'
import { FIVE_MINUTES_IN_SECONDS } from '../utils/constant'

export default {
  account: (state: IRootState): HexPrefixed | undefined => state.account,
  error: (state: IRootState): string | undefined => state.error,
  loading: (state: IRootState): boolean => state.loading,
  contractAddress: (state: IRootState): HexPrefixed | undefined => state.contractAddress,
  contractState: (state: IRootState): IContractState | undefined => state.contractState,
  txHash: (state: IRootState): string | undefined => state.txHash,
  isTimedOut:(state: IRootState): boolean | undefined => {
    if(!state.contractState.lastAction || [GameStatus.NEW, GameStatus.COMPLETED].includes(state.gameStatus) ) return false
    return ( (Math.ceil(Date.now() / 1000)) - state.contractState.lastAction.toNumber() ) > FIVE_MINUTES_IN_SECONDS
  },
}
