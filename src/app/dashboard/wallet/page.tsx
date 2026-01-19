import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, ArrowDownLeft, Copy, Plus, Minus, QrCode } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const recentTransactions = [
  {
    id: 'txn_1',
    type: 'Received',
    from: '0x1a2b...c3d4',
    amount: '150.00 USDC',
    time: '2 hours ago'
  },
  {
    id: 'txn_2',
    type: 'Sent',
    to: '0x5e6f...g7h8',
    amount: '50.75 USDC',
    time: '1 day ago'
  },
  {
    id: 'txn_3',
    type: 'Staked',
    protocol: 'Aave',
    amount: '1,000.00 USDC',
    time: '3 days ago'
  }
];

export default function WalletPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card className="bg-card/70 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>My Wallet</CardTitle>
            <CardDescription>Your main account for all cooperative activities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-xs text-muted-foreground">Total Balance</Label>
              <p className="text-4xl font-bold">$12,345.67</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Wallet Address</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input readOnly value="0xAbCd...1234" className="font-mono bg-background/50 h-9" />
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Copy className="h-4 w-4" />
                </Button>
                 <Button variant="outline" size="icon" className="h-9 w-9">
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
             <Button className="flex-1">
                <ArrowUpRight className="mr-2 h-4 w-4 transform -rotate-45"/> Send
             </Button>
             <Button variant="secondary" className="flex-1">
                <ArrowDownLeft className="mr-2 h-4 w-4" /> Receive
             </Button>
          </CardFooter>
        </Card>

         <Card className="bg-card/70 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableBody>
                    {recentTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                                        {tx.type === 'Sent' ? <Minus className="text-destructive"/> : <Plus className="text-green-400"/>}
                                    </div>
                                    <div>
                                        <div className="font-medium">{tx.type}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {tx.type === 'Sent' ? `To: ${tx.to}` : (tx.type === 'Received' ? `From: ${tx.from}` : `Protocol: ${tx.protocol}`)}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="font-medium font-mono">{tx.amount}</div>
                                <div className="text-xs text-muted-foreground text-right">{tx.time}</div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="bg-card/70 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Send Funds</CardTitle>
            <CardDescription>Transfer assets to another wallet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input id="recipient" placeholder="0x..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="100.00" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="asset">Asset</Label>
                <p className="font-medium text-sm">USDC</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Review & Send</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
