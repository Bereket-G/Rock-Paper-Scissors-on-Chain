import { BigNumber, ethers } from 'ethers'
import { Hasher as HashContractSources, HASHER_CONTRACT_ADDRESS } from './constant'
import { Move } from '../store/types'

export const hash = async (injectedProvider: any, selectedMove: Move, salt: BigNumber): Promise<string> => {
  try {
    const provider = new ethers.providers.Web3Provider(injectedProvider)
    const signer = provider.getSigner()
    const HashHelperContract = new ethers.Contract(
      HASHER_CONTRACT_ADDRESS,
      HashContractSources.abi,
      signer,
    )
    return await HashHelperContract.hash(selectedMove, salt)
  } catch (error) {
    console.error(error)
    throw error
  }
}
