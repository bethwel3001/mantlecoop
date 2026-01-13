import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const activities = [
  { type: 'Deposit', amount: '$500.00', user: '0x1a2b...c3d4', time: '2m ago' },
  { type: 'Loan Repayment', amount: '$150.25', user: '0x5e6f...g7h8', time: '1h ago' },
  { type: 'Withdrawal', amount: '$200.00', user: '0x9i0j...k1l2', time: '3h ago' },
  { type: 'Loan Request', amount: '$1,000.00', user: '0x3m4n...o5p6', time: '5h ago' },
  { type: 'Deposit', amount: '$1,200.00', user: '0x7q8r...s9t0', time: '1d ago' },
];

export function RecentActivity() {
  const getActivityMeta = (type: string) => {
    switch (type) {
      case 'Deposit':
      case 'Loan Repayment':
        return { 
          icon: <ArrowDownLeft className="h-4 w-4 text-green-400" />,
          variant: 'secondary' as const
        };
      case 'Withdrawal':
        return { 
          icon: <ArrowUpRight className="h-4 w-4 text-yellow-400" />,
          variant: 'outline' as const
        };
      case 'Loan Request':
        return { 
          icon: <ArrowUpRight className="h-4 w-4 text-blue-400" />,
          variant: 'default' as const
        };
      default:
        return {
          icon: null,
          variant: 'secondary' as const
        };
    }
  };

  return (
    <Card className="bg-card/70 border-border/50 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>An immutable audit trail of on-chain events.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity, index) => {
              const { icon, variant } = getActivityMeta(activity.type);
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        {icon}
                      </div>
                      <div>
                        <div className="font-medium">{activity.type}</div>
                        <div className="text-xs text-muted-foreground">{activity.user} &bull; {activity.time}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{activity.amount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
