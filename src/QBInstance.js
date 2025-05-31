import QuickBooks from 'node-quickbooks';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

let qboInstance = null;

export async function getQuickBooksInstance() {
  if (qboInstance) {
    return qboInstance; // agar pehle se bana hai to wapas de do
  }

  try {
    const { CLIENT_ID, CLIENT_SECRET, ENV } = process.env;

    // token.json read karo
    const tokenData = await fs.readFile('token.json', 'utf-8');
    const { access_token, refresh_token, realmId } = JSON.parse(tokenData);

    const isSandbox = ENV === 'sandbox';

    qboInstance = new QuickBooks(
      CLIENT_ID,
      CLIENT_SECRET,
      access_token,
      false,         
      realmId,
      isSandbox,
      true,         
      null,          
      '2.0',         
      refresh_token
    );

    return qboInstance;
  } catch (err) {
    console.error('Error creating QuickBooks instance:', err);
    throw err;
  }
}
