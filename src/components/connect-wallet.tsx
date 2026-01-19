'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <Button onClick={() => disconnect()} variant="outline" size="sm">
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.id}
          onClick={() => connect({ connector })}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Wallet className="h-4 w-4" />
          {connector.name}
        </Button>
      ))}
    </div>
  );
}

export function ConnectWalletCard() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="font-semibold">Connected</span>
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              {address}
            </p>
            <Button onClick={() => disconnect()} variant="destructive">
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">Connect Wallet</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to access MantleCoop
          </p>
          <div className="flex flex-col gap-2">
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => connect({ connector })}
                variant="outline"
                className="w-full gap-2"
              >
                <Wallet className="h-4 w-4" />
                {connector.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
