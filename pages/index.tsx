import { useEffect, useState, useCallback, useRef } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react';

import { useCryptoElkaProgram } from 'hooks/useCryptoElkaProgram';

const loader = (
  <svg
    className="animate-spin ml-3 mr-3 h-5 w-5 text-gray"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Home: NextPage = () => {
  const { wallet, publicKey } = useWallet();
  const program = useCryptoElkaProgram();

  const [ballAccounts, setBallAccounts] = useState<
    anchor.ProgramAccount<{ place: number; message: string, creator: PublicKey }>[]
  >([]);
  const [isBallAccountsLoading, setIsBallAccountsLoading] = useState(false);
  const fetchBallAccounts = useCallback(async () => {
    if (!program) return;
    setIsBallAccountsLoading(true);
    try {
      const ballAccounts = await program.account.ball.all();
      setBallAccounts(ballAccounts as any);
    } catch (e) {
      console.log('fetch ballAccounts error', e);
    } finally {
      setIsBallAccountsLoading(false);
    }
  }, [program]);
  useEffect(() => {
    fetchBallAccounts();
  }, [fetchBallAccounts, wallet]);

  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePlaceBallSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!program) return;

      setIsSubmitting(true);

      const placeNumber = e.target.elements.placeNumber.value;
      const message = e.target.elements.message.value;

      const ballAccountKeys = anchor.web3.Keypair.generate();
      const ballNftAccountKeys = anchor.web3.Keypair.generate();

      try {
        await program.rpc.placeBall(placeNumber, message, {
          accounts: {
            ball: ballAccountKeys.publicKey,
            ballNft: ballNftAccountKeys.publicKey,
            creator: program.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          },
          signers: [ballAccountKeys, ballNftAccountKeys],
        });
        formRef.current?.reset();
        fetchBallAccounts();
      } catch (e) {
        console.log('placeBall error', e);
      } finally {
        setIsSubmitting(false);
      }
    },
    [program, fetchBallAccounts],
  );
  return (
    <div>
      <Head>
        <title>NFT Christmas Tree</title>
      </Head>

      <main className="prose">
        <h1>Welcome to NFT Christmas Tree</h1>

        <div className="flex space-x-4">
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>

        {wallet && (
          <>
            <hr />
            <h3 className="flex items-center">
              Balls
              {isBallAccountsLoading && loader}
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {ballAccounts.map(({ account }, index) => {
                const isMine = publicKey?.equals(account.creator);
                return (
                  <div
                    key={index}
                    className={`w-full p-6 ${isMine ? 'bg-green-50' : 'bg-white'} rounded-xl shadow-lg flex items-center space-x-4`}
                  >
                    <div>
                      <div className="text-xl font-medium text-black">
                        {account.place}
                      </div>
                      <p className="text-gray-500 m-0">
                        {account.message || '-'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr />

            <h3>Place the ball</h3>
            <form
              ref={formRef}
              className="w-full space-y-4"
              onSubmit={handlePlaceBallSubmit}
            >
              <input
                type="number"
                name="placeNumber"
                placeholder="Place number #"
                disabled={isSubmitting}
                className="form-input text-black px-4 py-3 w-full rounded-md border-2 border-gray-300 focus:ring-green-400 focus:border-green-400"
                required
              />

              <input
                type="text"
                name="message"
                placeholder="Message"
                maxLength={280}
                disabled={isSubmitting}
                className="form-input text-black px-4 py-3 w-full rounded-md border-2 border-gray-300 focus:ring-green-400 focus:border-green-400"
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="
              flex items-center justify-center
              w-full
              px-3 py-2
              border-2 border-gray-300 dark:border-gray-800
              focus:ring-green-400 focus:border-green-400
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              text-xl
              rounded-md"
              >
                {isSubmitting && loader}
                Place
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
