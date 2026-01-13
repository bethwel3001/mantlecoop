import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { YieldPerformance } from '@/components/dashboard/yield-performance';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { GovernanceProposals } from '@/components/dashboard/governance-proposals';
import { AILoanTool } from '@/components/dashboard/ai-loan-tool';

export default function Home() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="p-4 sm:p-6 lg:p-8 space-y-8">
            <OverviewCards />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <YieldPerformance />
              </div>
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <GovernanceProposals />
              </div>
              <div className="lg:col-span-2">
                <AILoanTool />
              </div>
            </div>
        </main>
      </SidebarInset>
    </>
  );
}
