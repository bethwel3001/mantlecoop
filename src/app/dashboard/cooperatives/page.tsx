import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, ShieldCheck } from 'lucide-react';

const cooperatives = [
  {
    name: 'Mantle Farmers Union',
    description: 'A cooperative for farmers on the Mantle network to pool resources, share knowledge, and access decentralized financial services.',
    members: 128,
    tvl: '$450,000',
    tags: ['Agriculture', 'DeFi', 'Insurance'],
    logo: 'https://picsum.photos/seed/coop1/100/100'
  },
  {
    name: 'Devs United DAO',
    description: 'A collective of developers building on Mantle. We fund public goods, host hackathons, and support open-source projects.',
    members: 256,
    tvl: '$820,000',
    tags: ['Developers', 'Public Goods', 'Grants'],
    logo: 'https://picsum.photos/seed/coop2/100/100'
  },
  {
    name: 'Green Energy Collective',
    description: 'A cooperative focused on funding and supporting renewable energy projects through decentralized governance and finance.',
    members: 94,
    tvl: '$210,000',
    tags: ['Renewable Energy', 'Sustainability', 'Impact'],
    logo: 'https://picsum.photos/seed/coop3/100/100'
  },
    {
    name: 'Artisan Guild',
    description: 'Empowering artists and creators by providing a decentralized marketplace, royalty management, and community-owned gallery.',
    members: 312,
    tvl: '$150,000',
    tags: ['Art', 'NFTs', 'Community'],
    logo: 'https://picsum.photos/seed/coop4/100/100'
  },
];

export default function CooperativesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Discover Cooperatives</h1>
        <p className="mt-2 text-muted-foreground">Find and join communities that align with your values and goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cooperatives.map((coop) => (
          <Card key={coop.name} className="flex flex-col bg-card/70 border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_theme(colors.primary/20%)]">
            <CardHeader className="flex flex-row items-center gap-4">
              <img src={coop.logo} alt={`${coop.name} logo`} className="w-16 h-16 rounded-lg" data-ai-hint="logo" />
              <div>
                <CardTitle>{coop.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Users className="w-4 h-4 mr-1.5" /> {coop.members} Members
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{coop.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {coop.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{tag}</span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="font-semibold">TVL: {coop.tvl}</div>
              <Button>View & Join</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}