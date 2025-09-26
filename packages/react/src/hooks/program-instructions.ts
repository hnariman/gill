import { useMutation } from "@tanstack/react-query";
import {
  createSolanaClient,
  createTransaction,
  getBase58Decoder,
  Instruction,
  signAndSendTransactionMessageWithSigners,
  SolanaClient,
  TransactionSendingSigner,
} from "gill";
import { useSolanaClient } from "./client.js";

type TInstructionGetter = () => Instruction;

type IUseInstructionProps = {
  instructions: TInstructionGetter | TInstructionGetter[];
};

export function useProgramInstruction({ instructions: instructionGetter }: IUseInstructionProps) {
  // user may pass array of codama generated instruction getters
  const getters: TInstructionGetter[] = Array.isArray(instructionGetter) ? instructionGetter : [instructionGetter];
  const { rpc } = useSolanaClient();

  const ix = getters.map((i) => i());

  return useMutation({
    mutationFn: async (signer: TransactionSendingSigner) => {
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
      const tx = createTransaction({
        feePayer: signer,
        instructions: ix,
        latestBlockhash,
        version: 0,
      });
      const signature = await signAndSendTransactionMessageWithSigners(tx);
      return getBase58Decoder().decode(signature);
    },
  });
}
