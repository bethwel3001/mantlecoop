'use server';
/**
 * @fileOverview An AI tool to check loan eligibility based on account history.
 *
 * - aiLoanEligibilityCheck - A function that checks loan eligibility.
 * - AiLoanEligibilityCheckInput - The input type for the aiLoanEligibilityCheck function.
 * - AiLoanEligibilityCheckOutput - The return type for the aiLoanEligibilityCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiLoanEligibilityCheckInputSchema = z.object({
  accountHistory: z
    .string()
    .describe('The account history of the member.'),
});
export type AiLoanEligibilityCheckInput = z.infer<typeof AiLoanEligibilityCheckInputSchema>;

const AiLoanEligibilityCheckOutputSchema = z.object({
  isEligible: z.boolean().describe('Whether the member is eligible for a loan.'),
  reason: z.string().describe('The reason for the eligibility decision.'),
});
export type AiLoanEligibilityCheckOutput = z.infer<typeof AiLoanEligibilityCheckOutputSchema>;

export async function aiLoanEligibilityCheck(input: AiLoanEligibilityCheckInput): Promise<AiLoanEligibilityCheckOutput> {
  return aiLoanEligibilityCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiLoanEligibilityCheckPrompt',
  input: {schema: AiLoanEligibilityCheckInputSchema},
  output: {schema: AiLoanEligibilityCheckOutputSchema},
  prompt: `You are an AI assistant that helps determine loan eligibility based on account history.

  Given the following account history, determine if the member is eligible for a loan.

  Account History: {{{accountHistory}}}

  Based on the account history, set the isEligible field to true or false. Provide a reason for the decision in the reason field.
  Consider factors such as payment history, average balance, and any other relevant information.
  Make sure the output is valid JSON.`,
});

const aiLoanEligibilityCheckFlow = ai.defineFlow(
  {
    name: 'aiLoanEligibilityCheckFlow',
    inputSchema: AiLoanEligibilityCheckInputSchema,
    outputSchema: AiLoanEligibilityCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
