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
import { FileDown, ArrowDownLeft, ArrowUpRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const paymentHistory = [
  {
    transactionId: 'TXN-a1b2c3d4',
    type: 'Loan Repayment',
    amount: '$150.25',
    date: '2024-07-28',
    direction: 'out',
  },
  {
    transactionId: 'TXN-e5f6g7h8',
    type: 'Yield Distribution',
    amount: '$75.50',
    date: '2024-07-25',
    direction: 'in',
  },
  {
    transactionId: 'TXN-i9j0k1l2',
    type: 'Deposit',
    amount: '$500.00',
    date: '2024-07-20',
    direction: 'in',
  },
  {
    transactionId: 'TXN-m3n4o5p6',
    type: 'Loan Disbursement',
    amount: '$10,000.00',
    date: '2024-07-15',
    direction: 'in',
  },
  {
    transactionId: 'TXN-q7r8s9t0',
    type: 'Withdrawal',
    amount: '$200.00',
    date: '2024-07-12',
    direction: 'out',
  },
  {
    transactionId: 'TXN-u1v2w3x4',
    type: 'Membership Fee',
    amount: '$25.00',
    date: '2024-07-01',
    direction: 'out',
  },
];

const getTypeMeta = (type: string) => {
    switch (type) {
      case 'Loan Repayment':
      case 'Withdrawal':
      case 'Membership Fee':
        return { 
          icon: <Minus className="h-4 w-4 text-destructive" />,
          variant: 'destructive' as const,
          sign: '-'
        };
      case 'Yield Distribution':
      case 'Deposit':
      case 'Loan Disbursement':
        return { 
          icon: <Plus className="h-4 w-4 text-green-400" />,
          variant: 'secondary' as const,
          sign: '+'
        };
      default:
        return {
          icon: null,
          variant: 'outline' as const,
          sign: ''
        };
    }
  };

export default function PaymentHistoryPage() {
  return (
    <Card className="bg-card/70 border-border/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>A detailed log of all your transactions.</CardDescription>
        </div>
        <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export History
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentHistory.map((payment) => {
              const { icon, variant, sign } = getTypeMeta(payment.type);
              return (
              <TableRow key={payment.transactionId}>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                            {icon}
                        </div>
                        <div>
                            <div className="font-medium">{payment.type}</div>
                            <div className="text-xs text-muted-foreground">{payment.transactionId} &bull; {payment.date}</div>
                        </div>
                    </div>
                </TableCell>
                <TableCell className={`text-right font-medium font-mono ${sign === '+' ? 'text-green-400' : 'text-destructive'}`}>
                  {sign} {payment.amount}
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}