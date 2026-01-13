'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle, XCircle, Bot, LoaderCircle } from 'lucide-react';

import { checkLoanEligibility } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Check Eligibility'
      )}
    </Button>
  );
}

export function AILoanTool() {
  const [state, formAction, isPending] = useActionState(checkLoanEligibility, {
    accountHistory: `Average balance: $2,500 over last 12 months.\nAll payments on time.\nOne overdraft 3 years ago.\nRegular monthly deposits of $5,000.\nEmployed for 5 years at the same company.`,
  });

  return (
    <Card className="bg-card/70 border-border/50 backdrop-blur-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-primary drop-shadow-[0_0_5px_theme(colors.primary)]" />
          AI Loan Eligibility Tool
        </CardTitle>
        <CardDescription>
          Enter account history to get an AI-powered eligibility assessment.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountHistory">Account History</Label>
            <Textarea
              id="accountHistory"
              name="accountHistory"
              placeholder="Provide a summary of the account history, including balances, payments, overdrafts, etc."
              rows={5}
              required
              defaultValue={state.accountHistory}
              className="bg-background/50"
            />
          </div>
          {state?.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          <SubmitButton />
        </form>

        {!isPending && state && (state.isEligible !== undefined) && (
          <div className="mt-4 pt-4 border-t border-border/50">
            {state.isEligible ? (
              <Alert className="border-chart-4/50 bg-transparent text-foreground shadow-[0_0_15px_theme(colors.chart.4/30%)]">
                <CheckCircle className="h-4 w-4 text-chart-4" />
                <AlertTitle className="text-chart-4">Eligible for Loan</AlertTitle>
                <AlertDescription className="text-muted-foreground">{state.reason}</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="bg-destructive/10">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Not Eligible for Loan</AlertTitle>
                <AlertDescription>{state.reason}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
