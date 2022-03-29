import { BigNumber, ethers } from 'ethers'
import { RPS as RPSContractSources } from '../utils/constant'
import { hash } from '../utils/helpers'
import { parseEther } from 'ethers/lib/utils'
import {
  GameStatus,
  HexPrefixed,
  IContractState,
  IRootState,
  Move,
} from './types'
import { ActionContext } from 'vuex'

let SALT: BigNumber | undefined // undefined till we set it

const { ethereum: injectedEthereumProvider } = window as any
const injectedWeb3Provider = new ethers.providers.Web3Provider(
  injectedEthereumProvider,
)

export default {
  async connect(
    { commit, dispatch, state }: ActionContext<IRootState, IRootState>,
    connect: boolean,
  ) {
    try {
      if (!(await dispatch('checkIfConnected')) && connect && !state.loading) {
        await commit('setLoading', true)
        await dispatch('requestAccess')
      }
      await dispatch('checkNetwork')
    } catch (error) {
      console.log(error)
    }
    await commit('setLoading', false)
  },
  async checkNetwork({ dispatch }: ActionContext<IRootState, IRootState>) {
    const chainId = await injectedEthereumProvider.request({
      method: 'eth_chainId',
    })
    const rinkebyChainId = '0x4'
    if (chainId !== rinkebyChainId) {
      if (!(await dispatch('switchNetwork'))) {
        alert('You are not connected to the Rinkeby Test Network!')
      }
    }
  },
  async switchNetwork() {
    try {
      await injectedEthereumProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      })
      return 1
    } catch (switchError) {
      return 0
    }
  },
  async checkIfConnected({ commit }: ActionContext<IRootState, IRootState>) {
    const accounts = await injectedEthereumProvider.request({
      method: 'eth_accounts',
    })
    if (accounts.length !== 0) {
      commit('setAccount', accounts[0])
      return true
    }
    return false
  },
  async requestAccess({ commit }: ActionContext<IRootState, IRootState>) {
    const accounts = await injectedEthereumProvider.request({
      method: 'eth_requestAccounts',
    })
    commit('setAccount', accounts[0])
  },
  async getContract({ state }: ActionContext<IRootState, IRootState>) {
    try {
      if (!state.contractAddress) {
        return
      }
      const signer = injectedWeb3Provider.getSigner()
      return new ethers.Contract(
        state.contractAddress,
        RPSContractSources.abi,
        signer,
      )
    } catch (error) {
      console.log(error)
      console.log('connected contract not found')
    }
  },
  async createNewGameInstance(
    { commit, dispatch, state }: ActionContext<IRootState, IRootState>,
    { stake }: { stake: string },
  ) {
    console.info('Deploy contract triggered !')
    try {
      if (!SALT) return
      commit('setLoading', true)
      const signer = injectedWeb3Provider.getSigner()
      const deployArgs = {
        _c1Hash: await hash(injectedEthereumProvider, state.selectedMove, SALT),
        _j2: state.secondPlayer,
      }
      const RPSFactory = new ethers.ContractFactory(
        RPSContractSources.abi,
        RPSContractSources.bytecode,
        signer,
      )
      const stakeAmount = stake ? parseEther(stake) : 0
      const RPS = await RPSFactory.deploy(deployArgs._c1Hash, deployArgs._j2, {
        value: stakeAmount,
      })
      await commit('setContractAddress', RPS.address)
      await dispatch('loadContractState')
    } catch (error) {
      console.log(error)
      console.log('Error while deploying contract !')
    }
    commit('setLoading', false)
  },
  async joinGame(
    { commit, dispatch }: ActionContext<IRootState, IRootState>,
    contractAddress: HexPrefixed,
  ) {
    try {
      await commit('setContractAddress', contractAddress)
      await dispatch('loadContractState')
    } catch (error) {
      console.log(error)
    }
  },
  async computeGameStatus({
    commit,
    state,
  }: ActionContext<IRootState, IRootState>) {
    try {
      const contractState: IContractState = state.contractState
      if (!contractState.stake) return
      if (contractState.stake.isZero() && contractState.c2 !== Move.Null) {
        commit('setGameStatus', GameStatus.COMPLETED)
      } else if (state.contractState.c2 && state.contractState.stake) {
        commit('setGameStatus', GameStatus.WAITING_FIRST_PLAYER_TO_SOLVE)
      } else if (state.contractState.stake && !state.contractState.c2) {
        commit('setGameStatus', GameStatus.WAITING_FOR_SECOND_PLAYER_TO_MOVE)
      }
    } catch (error) {
      console.log(error)
    }
  },
  async loadContractState({
    commit,
    dispatch,
    state,
  }: ActionContext<IRootState, IRootState>) {
    try {
      if (!state.contractAddress) return
      const connectedContract = await dispatch('getContract')
      const contractState: IContractState = {
        lastAction: await connectedContract.lastAction(),
        c2: await connectedContract.c2(),
        stake: await connectedContract.stake(),
        j1: ethers.utils.getAddress(
          await connectedContract.j1(),
        ) as HexPrefixed,
        j2: ethers.utils.getAddress(
          await connectedContract.j2(),
        ) as HexPrefixed,
      }
      commit('setContractState', contractState)
      await dispatch('computeGameStatus')
    } catch (error) {
      console.log(error)
    }
  },
  async loadUserBalance({
    commit,
    state,
  }: ActionContext<IRootState, IRootState>) {
    try {
      if (!state.account) return
      const balance = await injectedWeb3Provider.getBalance(
        state.account as string,
      )
      commit('setAccountBalance', ethers.utils.formatEther(balance))
    } catch (error) {
      console.log(error)
    }
  },
  async play({
    commit,
    dispatch,
    state,
  }: ActionContext<IRootState, IRootState>) {
    try {
      commit('setLoading', true)
      const connectedContract = await dispatch('getContract')
      const stakeAmount = state.contractState.stake ?? 0
      await (
        await connectedContract.play(state.selectedMove, { value: stakeAmount })
      ).wait()
      await dispatch('loadContractState')
    } catch (error) {
      console.error(error)
      alert((error as Error).message)
    }
    commit('setLoading', false)
  },
  async solveGame({
    commit,
    dispatch,
    state,
  }: ActionContext<IRootState, IRootState>) {
    try {
      commit('setLoading', true)
      const connectedContract = await dispatch('getContract')
      const solveTx = await connectedContract.solve(state.selectedMove, SALT)
      await solveTx.wait()
      await dispatch('loadContractState')
      commit('setTxHash', solveTx.hash)
    } catch (error) {
      console.log(error)
      alert((error as Error).message)
    }
    commit('setLoading', false)
  },
  async timedOutRevertFunds({
    commit,
    dispatch,
    state,
  }: ActionContext<IRootState, IRootState>) {
    try {
      const contractState: IContractState = state.contractState
      if (!contractState.stake) return
      if (state.loading || contractState.stake.isZero()) return
      const connectedContract = await dispatch('getContract')
      if (state.gameStatus === GameStatus.WAITING_FIRST_PLAYER_TO_SOLVE) {
        commit('setLoading', true)
        await (await connectedContract.j1Timeout()).wait()
      } else if (
        state.gameStatus === GameStatus.WAITING_FOR_SECOND_PLAYER_TO_MOVE
      ) {
        commit('setLoading', true)
        await (await connectedContract.j2Timeout()).wait()
      }
      await dispatch('loadContractState')
    } catch (error) {
      alert((error as Error).message)
      console.log(error)
    }
    commit('setLoading', false)
  },
  async calculateAndSetSalt({ state }: ActionContext<IRootState, IRootState>) {
    const decryptedHex = await injectedEthereumProvider.request({
      method: 'eth_requestAccounts',
      params: ['RANDOM_ENCRYPTED_MESSAGE', state.account],
    })
    SALT = BigNumber.from(decryptedHex[0])
  },
}
