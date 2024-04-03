'use client';
import * as React from 'react';
import { WagmiConfig } from 'wagmi';
import { chains, config } from '../wagmi';
// import { DAPP_CONFIG } from '../../contracts';
// import type { AccountAvatarInfo } from '../../types';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  type ProvidersProps = {
    children: React.ReactNode;
  };

  return <WagmiConfig config={config}>{mounted && children}</WagmiConfig>;
}
