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

export interface WalletResponse {
  id: string;
  name: string;
  network: string;
  addresses: string[];
  defaultAddress: string | null;
  balances: Record<string, number>;
} 

export async function GET(request: Request, { params }: { params: { id: string } }) {
  let walletResponse: WalletResponse;
  try {
    const walletId = params.id;
    const wallet = await Wallet.fetch(walletId);
    const addresses = await wallet.listAddresses();
    const addressIds = await Promise.all(addresses.map(async (address) => address.getId()));
    const defaultAddress = await wallet.getDefaultAddress();
    const defaultAddressId = defaultAddress ? defaultAddress.getId() : null;
    
    walletResponse = {
      id: wallet.getId() as string,
      name: "My Wallet",
      network: formatNetworkId(wallet.getNetworkId()),
      addresses: addressIds,
      defaultAddress: defaultAddressId,
      balances: {},
    };

    return NextResponse.json(walletResponse);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
  }
}
