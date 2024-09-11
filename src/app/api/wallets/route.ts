import { NextResponse } from 'next/server';
import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';
import { formatNetworkId } from '@/utils/stringUtils';

if (!process.env.API_KEY_NAME || !process.env.API_KEY_SECRET) {
  throw new Error("API_KEY_NAME and API_KEY_SECRET must be set");
}

export const coinbase = new Coinbase({
  apiKeyName: process.env.API_KEY_NAME,
  privateKey: process.env.API_KEY_SECRET,
});

export interface WalletListResponse {
  id: string;
  name: string;
  network: string;
} 

export async function GET() {
  try {
    const wallets = await Wallet.listWallets();
    const walletListResponse = wallets.map((wallet) => ({
      id: wallet.getId(),
      name: "My Wallet",
      network: formatNetworkId(wallet.getNetworkId()),
    }));
    return NextResponse.json(walletListResponse);
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json({ error: 'Failed to fetch wallets' }, { status: 500 });
  }
}