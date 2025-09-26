// // TODO: Replace any with inferred types.
//
// "use client";
//
// import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
// import {
//   Account,
//   createSolanaClient,
//   getProgramDerivedAddress,
//   SolanaClient,
//   type Address,
//   type Instruction,
// } from "gill";
//
// import { getAssociatedTokenAccountAddress, getInitializeMintInstruction } from "gill/programs";
// import { GILL_HOOK_CLIENT_KEY } from "../const.js";
//
// type InstructionBuilder<TInput = any> = (input: TInput, config?: { programAddress?: Address }) => Instruction;
//
// type ProgramHookConfig<TInstructions extends Record<string, InstructionBuilder<any>>> = {
//   instructions: TInstructions;
//   programAddress?: Address;
// };
//
// type UseProgramInput<
//   TInstructions extends Record<string, InstructionBuilder<any>>,
//   TInstructionName extends keyof TInstructions,
// > = UseMutationOptions<Instruction, Error, Parameters<TInstructions[TInstructionName]>[0]> & {
//   instruction: TInstructionName;
// };
//
// /**
//  * @example:
//    const { accounts, instructions } = useProgram({
//     // uses -> createSolanaClient(), rpc.getLatestBlockhash(), createTransaction(),sendTransaction()
//     // and wraps transaction into useMutate(), so user is able to fire transaction when needed
//     // + use error handling and other nice perks from tanstack-query
//     // object where each field is Instruction | Instruction[]
//     instructions: {
//       init: getInitializeInstruction,
//       increment: [getIncrementInstruction],
//       decrement: [getDecrementInstruction, getSetValueInstruction],
//     },
//     // fetches accounts and stores in React.Context or nanostore
//     accounts: [
//       // PDA with seeds -> uses: getProgramDerivedAddress()
//       { title: 'counter', type: 'PDA', seeds: [COUNTER_SEED] },
//       // if we have some ATA or mint account -> uses: getAssociatedTokenAccountAddress()
//       { title: 'counterToken', type: 'ATA', mintAddress: COUNTER_TOKEN_MINT_PUBKEY },
//       // if we need account internal data -> uses: getAssociatedTokenAccountAddress()
//       // and then uses fetcher function provided by user (which is codama generated)
//       { title: 'config', seed: [COUNTER_CONFIG_SEED], getter: fetchCounterConfig },
//     ],
//     programAddress: TESTCASE_PROGRAM_ADDRESS,
//   })
//
//   const { mutate, isLoading, isError } = await instructions.increment({
//     counter: accounts.counter,
//     amount: 100,
//   })
// */
// export function createProgramHook<TInstructions extends Record<string, InstructionBuilder<any>>>(
//   config: ProgramHookConfig<TInstructions>,
// ) {
//   return function useProgram<TInstructionName extends keyof TInstructions>(
//     input: UseProgramInput<TInstructions, TInstructionName>,
//   ) {
//     const queryClient = useQueryClient();
//     const { instruction, ...options } = input;
//     const instructionFn = config.instructions[instruction];
//
//     const mutation = () =>
//       useMutation({
//         ...options,
//         // eslint-disable-next-line -- no await yet.
//         mutationFn: async (instructionInput: Parameters<TInstructions[TInstructionName]>[0]) => {
//           const instruction = instructionFn(instructionInput, {
//             programAddress: config.programAddress,
//           });
//
//           instruction.accounts
//             ?.map((account) => account.address)
//             ?.forEach((address) => {
//               void queryClient.invalidateQueries({
//                 queryKey: [GILL_HOOK_CLIENT_KEY, "some_cache_key", address],
//               });
//             });
//
//           return instruction;
//         },
//       });
//     const instructions: Array<Record<string, Function>> = {
//       init: getInitializeMintInstruction,
//     };
//     instructions.map((i) => mutation(i));
//   };
// }
