import axios from 'axios';
import CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';

import { TransferAda } from '../model';

export const sendADATransaction = async (body: TransferAda, graphQLUrl: string) => {
  const fromAddress = CardanoWasm.Address.from_bech32(body.from);
  const toAddress = CardanoWasm.Address.from_bech32(body.to);

  const fromUTxOs = (
    await axios.post(graphQLUrl, {
      query: `{ utxos (where: {
          address: {
            _eq: "${body.from}"
          }
        }) {
          txHash
          index
          value
        }
      }`,
    })
  ).data.data.utxos;

  let fromQuantity = 0;
  for (const utxo of fromUTxOs) {
    fromQuantity += parseInt(utxo.value);
  }

  if (fromQuantity < body.amount) {
    return { error: 'Insufficient fund' };
  }
  const prvKey = CardanoWasm.Bip32PrivateKey.from_128_xprv(
      Buffer.from(body.privateKey, 'hex')
    ).to_raw_key();

  const txBuilder = CardanoWasm.TransactionBuilder.new(
    CardanoWasm.LinearFee.new(
      CardanoWasm.BigNum.from_str('44'),
      CardanoWasm.BigNum.from_str('155381'),
    ),
    CardanoWasm.BigNum.from_str('1000000'),
    CardanoWasm.BigNum.from_str('500000000'),
    CardanoWasm.BigNum.from_str('2000000'),
  );
  const { tip } = (
    await axios.post(graphQLUrl, {
      query: '{ cardano { tip { number slotNo epoch { number } }} }',
    })
  ).data.data.cardano;
  txBuilder.set_ttl(tip.slotNo + 200);

  let total = 0;
  for (const utxo of fromUTxOs) {
    let amount = parseInt(utxo.value);
    if (total + amount > body.amount) {
      amount = body.amount - total;
    }
    txBuilder.add_key_input(
      prvKey.to_public().hash(),
      CardanoWasm.TransactionInput.new(
        CardanoWasm.TransactionHash.from_bytes(Buffer.from(utxo.txHash, 'hex')),
        utxo.index
      ),
      CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(String(amount))),
    )
    total += amount;
    if (total === body.amount) break;
  }

  txBuilder.add_output(
    CardanoWasm.TransactionOutput.new(
      toAddress,
      CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(String(body.amount))),
    ),
  );
  const tmpOutput = CardanoWasm.TransactionOutput.new(
    fromAddress,
    CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(String('1000000'))),
  );
  const fee = parseInt(txBuilder.min_fee().to_str()) + parseInt(txBuilder.fee_for_output(tmpOutput).to_str());
  txBuilder.add_output(CardanoWasm.TransactionOutput.new(
    fromAddress,
    CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(String(fromQuantity - body.amount - fee))),
  ));
  txBuilder.set_fee(CardanoWasm.BigNum.from_str(String(fee)));

  const txBody = txBuilder.build();
  const txHash = CardanoWasm.hash_transaction(txBody);

  const vkeyWitnesses = CardanoWasm.Vkeywitnesses.new();
  vkeyWitnesses.add(CardanoWasm.make_vkey_witness(txHash, prvKey));
  const witnesses = CardanoWasm.TransactionWitnessSet.new();
  witnesses.set_vkeys(vkeyWitnesses);

  const transaction =  CardanoWasm.Transaction.new(txBody, witnesses);
  return { transaction };
};
