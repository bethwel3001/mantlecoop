import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const proposals = [
  {
    title: 'Proposal #1: Adjust Loan Interest Rate',
    description: 'Proposing to lower the interest rate for new loans from 8% to 7.5% to encourage borrowing.',
    status: 'Active',
    votesFor: 72,
    votesAgainst: 15,
    endsIn: '3 days',
  },
  {
    title: 'Proposal #2: Integrate New Yield Strategy (Aave)',
    description: 'Allocate 20% of the vault\'s capital to Aave on Mantle for enhanced yield generation.',
    status: 'Active',
    votesFor: 88,
    votesAgainst: 5,
    endsIn: '5 days',
  },
];

export function GovernanceProposals() {
  return (
    <Card className="bg-card/70 border-border/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Active Governance Proposals</CardTitle>
        <CardDescription>Participate in the cooperative's decision-making process.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {proposals.map((proposal) => {
          const totalVotes = proposal.votesFor + proposal.votesAgainst;
          const forPercentage = (proposal.votesFor / totalVotes) * 100;
          
          return (
            <div key={proposal.title} className="p-4 rounded-lg border border-border/70 bg-background/50">
              <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{proposal.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{proposal.description}</p>
                  </div>
                  <Badge variant="outline" className="border-accent text-accent">{proposal.status}</Badge>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>For ({proposal.votesFor})</span>
                  <span>Against ({proposal.votesAgainst})</span>
                </div>
                <Progress value={forPercentage} className="h-2" />
              </div>
              <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3"/>
                    Ends in {proposal.endsIn}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Vote For</Button>
                    <Button variant="secondary" size="sm">Vote Against</Button>
                  </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
