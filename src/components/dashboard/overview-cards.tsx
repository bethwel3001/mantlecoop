import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Landmark, Users, ArrowUpRight, Percent } from 'lucide-react';

const kpiData = [
  {
    title: 'Total Value Locked',
    value: '$1,250,430',
    change: '+12.5%',
    icon: Landmark,
  },
  {
    title: 'Active Loans',
    value: '$340,120',
    change: '+8.2%',
    icon: Users,
  },
  {
    title: 'Total Members',
    value: '487',
    change: '+23',
    icon: Users,
  },
  {
    title: 'Avg. Yield APY',
    value: '5.75%',
    change: '+0.25%',
    icon: Percent,
  },
];

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => (
        <Card 
          key={kpi.title} 
          className="bg-card/70 border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_theme(colors.primary/20%)]"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-5 w-5 text-primary drop-shadow-[0_0_5px_theme(colors.primary)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpi.value}</div>
            <p className="text-xs text-green-400 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              {kpi.change} vs last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
