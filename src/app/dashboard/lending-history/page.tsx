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
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const lendingHistory = [
  {
    loanId: 'LN-84392',
    amount: '$5,000.00',
    interestRate: '5.5%',
    date: '2024-06-15',
    status: 'Repaid',
    term: '12 Months'
  },
  {
    loanId: 'LN-79104',
    amount: '$10,000.00',
    interestRate: '4.8%',
    date: '2024-03-01',
    status: 'Active',
    term: '24 Months'
  },
  {
    loanId: 'LN-65231',
    amount: '$2,500.00',
    interestRate: '7.2%',
    date: '2023-11-20',
    status: 'Repaid',
    term: '6 Months'
  },
  {
    loanId: 'LN-58890',
    amount: '$15,000.00',
    interestRate: '5.1%',
    date: '2023-08-10',
    status: 'Repaid',
    term: '36 Months'
  },
    {
    loanId: 'LN-51245',
    amount: '$7,500.00',
    interestRate: '6.0%',
    date: '2023-05-02',
    status: 'Repaid',
    term: '24 Months'
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Repaid':
      return 'secondary';
    case 'Active':
      return 'default';
    case 'Defaulted':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function LendingHistoryPage() {
  return (
    <Card className="bg-card/70 border-border/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
            <CardTitle>Lending History</CardTitle>
            <CardDescription>A record of all your past and active loans.</CardDescription>
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
              <TableHead>Loan ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lendingHistory.map((loan) => (
              <TableRow key={loan.loanId}>
                <TableCell className="font-mono text-muted-foreground">{loan.loanId}</TableCell>
                <TableCell className="font-medium">{loan.amount}</TableCell>
                <TableCell>{loan.interestRate}</TableCell>
                <TableCell>{loan.term}</TableCell>
                <TableCell>{loan.date}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={getStatusVariant(loan.status)}>{loan.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}