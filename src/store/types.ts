import {BigNumber} from 'ethers'

export enum Move {
    Null,
    ROCK,
    PAPER,
    SCISSORS,
    SPOCK,
    LIZARD
}
export type HexPrefixed = `0x${string}`;

export interface IContractState {
    j1?: HexPrefixed,
    j2?: HexPrefixed,
    c1Hash?: string,
    c2: Move,
    stake?: BigNumber,
    lastAction?: BigNumber
}

export interface IRootState {
    account?: HexPrefixed,
    error?: string,
    loading: boolean,
    contractAddress?: HexPrefixed,
    contractState: IContractState,
    selectedMove: Move,
    secondPlayer?: HexPrefixed,
    gameStatus: GameStatus,
    txHash?: string,
    accountBalance?: string,
}

export enum GameStatus {
  NEW  = 'NEW',
  WAITING_FOR_SECOND_PLAYER_TO_MOVE= 'WAITING_FOR_SECOND_PLAYER_TO_MOVE',
  WAITING_FIRST_PLAYER_TO_SOLVE= 'WAITING_FIRST_PLAYER_TO_SOLVE',
  COMPLETED= 'COMPLETED',
}
