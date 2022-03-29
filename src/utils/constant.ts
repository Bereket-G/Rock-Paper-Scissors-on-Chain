import RPS_ABI from '../lib/contract/RPS/abi'
import RPS_BYTE_CODE from '../lib/contract/RPS/bytecode'
import HASH_ABI from '../lib/contract/Hasher/abi'

export const HASHER_CONTRACT_ADDRESS =
  '0x8C0765BdC58468EF892EE1E0D757294B5BF9A885'

export const RPS = {
  abi: RPS_ABI,
  bytecode: RPS_BYTE_CODE,
}

export const Hasher = {
  abi: HASH_ABI,
}

export const FIVE_MINUTES_IN_SECONDS = 5*60

