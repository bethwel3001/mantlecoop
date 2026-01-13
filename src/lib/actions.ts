'use server';

import { aiLoanEligibilityCheck, AiLoanEligibilityCheckInput } from '@/ai/flows/ai-loan-eligibility-check';

interface EligibilityState {
  isEligible?: boolean;
  reason?: string;
  error?: string;
  accountHistory?: string;
}

export async function checkLoanEligibility(
  prevState: EligibilityState,
  formData: FormData
): Promise<EligibilityState> {
  const accountHistory = formData.get('accountHistory') as string;

  if (!accountHistory || accountHistory.trim().length < 50) {
    return {
      error: 'Please provide a more detailed account history (at least 50 characters).',
      accountHistory: prevState.accountHistory,
    };
  }

  try {
    const input: AiLoanEligibilityCheckInput = { accountHistory };
    const result = await aiLoanEligibilityCheck(input);
    return { ...result, accountHistory };
  } catch (e) {
    console.error(e);
    return {
      error: 'An unexpected error occurred. Please try again later.',
      accountHistory,
    };
  }
}
