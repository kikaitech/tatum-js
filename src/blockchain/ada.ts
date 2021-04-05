import { get, post } from '../connector/tatum'
import {CardanoBlockChainInfo, TransactionHash, CardanoAccount, CardanoBlock, CardanoTransaction, CardanoGenerateWallet} from '../model';

/**
 * For more details, see <a href="https://tatum.io/apidoc#operation/CardanoBroadcast" target="_blank">Tatum API documentation</a>
 */
export const cardanoBroadcast = async (txData: string): Promise<TransactionHash> =>
  post(`/v3/cardano/broadcast`, { txData });

/**
 * For more details, see <a href="https://tatum.io/apidoc#operation/CardanoGetBlockChainInfo" target="_blank">Tatum API documentation</a>
 */
export const cardanoGetBlockChainInfo = async (): Promise<CardanoBlockChainInfo> => get(`/v3/cardano/info`);

/**
 * For more details, see <a href="https://tatum.io/apidoc#operation/CardanoGenerateWallet" target="_blank">Tatum API documentation</a>
 */
export const cardanoGenerateWallet = async (mnemonic?: string): Promise<CardanoGenerateWallet> =>
  post(`/v3/cardano/wallet`, { mnemonic });

/**
 * For more details, see <a href="https://tatum.io/apidoc#operation/CardanoGetBlock" target="_blank">Tatum API documentation</a>
 */
export const cardanoGetBlock = async (hash: string): Promise<CardanoBlock> => get(`/v3/cardano/block/${hash}`);

/**
 * For more details, see <a href="https://tatum.io/apidoc#operation/CardanoGetTransaction" target="_blank">Tatum API documentation</a>
 */
export const cardanoGetTransaction = async (hash: string): Promise<CardanoTransaction> => get(`/v3/cardano/transaction/${hash}`);

/**
 * For more details, see <a href="https://tatum.io/apidoc#operation/CardanoGetAccount" target="_blank">Tatum API documentation</a>
 */
export const cardanoGetAccount = async (address: string): Promise<CardanoAccount> => get(`/v3/cardano/account/${address}`);

/**
 * For more details, see <a href="https://tatum.io/apidoc#operation/CardanoGetTransactionsByAccount" target="_blank">Tatum API documentation</a>
 */
export const cardanoGetTransactionsByAccount = async (address: string, limit: number, offset: number): Promise<CardanoTransaction[]> =>
  get(`/v3/cardano/account/${address}/transactions?limit=${limit}?offset=${offset}`);

/**
 * For more details, see <a href="https://tatum.io/apidoc#operation/CardanoGetAddressByXpub " target="_blank">Tatum API documentation</a>
 */
export const cardanoGetAddressByXpub = async (xpub: string, index: number): Promise<CardanoTransaction[]> =>
  get(`/v3/cardano/address/${xpub}/${index}`);

/**
 * For more details, see <a href="https://tatum.io/apidoc#operation/CardanoGeneratePrivateKey" target="_blank">Tatum API documentation</a>
 */
export const cardanoGeneratePrivateKey = async (mnemonic: string, index: number): Promise<{ key: string }> =>
  post(`/v3/cardano/wallet/priv`, { mnemonic, index });

/**
 * For more details, see <a href="https://tatum.io/apidoc#operation/CardanoSendTransaction" target="_blank">Tatum API documentation</a>
 */
export const cardanoSendTransaction = async (from: string, privateKey: string, to: string, amount: number): Promise<TransactionHash> =>
  post(`/v3/cardano/transaction`, { from, privateKey, to, amount });
