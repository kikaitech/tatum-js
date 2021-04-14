import { Sotez } from 'sotez';
import { TransferXtz } from '../model';

/**
 * Prepare a signed Xtz transaction with the private key locally. Nothing is broadcasted to the blockchain.
 * @param body content of the transaction to prepare.
 * @returns raw transaction data in hex, to be broadcasted to blockchain.
 */
export const sendXtzTransaction = async (body: TransferXtz, testnet: boolean) => {
  const url = testnet ? 'https://testnet-tezos.giganode.io' : 'https://mainnet-tezos.giganode.io';
  const tezos = new Sotez(url);

  await tezos.importKey(body.privateKey);
  const { hash } = await tezos.transfer({
    to: body.to,
    amount: body.amount,
  });

  await tezos.awaitOperation(hash);
  return hash;
};
