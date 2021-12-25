import { useMemo } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Provider, Program, Idl } from '@project-serum/anchor';

import idl from 'idl/crypto_elka.json';

const preflightCommitment = 'processed';
const commitment = 'processed';
const programID = new PublicKey(idl.metadata.address);

export const useCryptoElkaProgram = () => {
  const wallet = useAnchorWallet();

  const { connection } = useConnection();

  const provider = useMemo(() => {
    if (!wallet) return;
    return new Provider(connection, wallet, { preflightCommitment, commitment });
  }, [wallet, connection]);

  const program = useMemo(() => {
    if (!provider) return;
    return new Program(idl as Idl, programID, provider);
  }, [provider]);

  return program;
};
