import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, Zap, Droplets, Leaf } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const yieldOpportunities = [
  {
    name: 'Mantle Staked ETH (mETH)',
    protocol: 'Mantle LSP',
    apy: '3.5%',
    tvl: '$450M',
    assetIcon: <Droplets />,
  },
  {
    name: 'USDC Lending',
    protocol: 'Aave v3',
    apy: '5.2%',
    tvl: '$1.2B',
    assetIcon: <Zap />,
  },
  {
    name: 'Real World Asset Yield',
    protocol: 'Centrifuge',
    apy: '8.1%',
    tvl: '$520M',
    assetIcon: <Leaf />,
  },
];

const myPositions = [
    {
        asset: 'Mantle Staked ETH (mETH)',
        amount: '10.5 mETH',
        value: '$36,750',
        apy: '3.5%',
    },
    {
        asset: 'USDC on Aave',
        amount: '5,000 USDC',
        value: '$5,000',
        apy: '5.2%',
    }
]

export default function YieldPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yield Opportunities</h1>
        <p className="mt-2 text-muted-foreground">
          Put your assets to work and earn yield through various decentralized finance protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yieldOpportunities.map((opp) => (
          <Card key={opp.name} className="flex flex-col bg-card/70 border-border/50 backdrop-blur-sm">
            <CardHeader className="flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary">
                {opp.assetIcon}
              </div>
              <div>
                <CardTitle>{opp.name}</CardTitle>
                <CardDescription>{opp.protocol}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">APY</span>
                    <span className="font-bold text-green-400">{opp.apy}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Value Locked</span>
                    <span className="font-semibold">{opp.tvl}</span>
                </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Stake</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-card/70 border-border/50 backdrop-blur-sm">
        <CardHeader>
            <CardTitle>My Positions</CardTitle>
            <CardDescription>Your current yield-generating positions.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Current APY</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {myPositions.map((pos) => (
                        <TableRow key={pos.asset}>
                            <TableCell className="font-medium">{pos.asset}</TableCell>
                            <TableCell>{pos.amount}</TableCell>
                            <TableCell>{pos.value}</TableCell>
                            <TableCell className="text-green-400">{pos.apy}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">Manage</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}