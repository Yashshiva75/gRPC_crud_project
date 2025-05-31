import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import open from 'open';
import fs from 'fs/promises';

dotenv.config();

const app = express();
const port = 3000;
const client_id = process.env.CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;
const client_secret = process.env.CLIENT_SECRET;

const scopes = [
  "com.intuit.quickbooks.accounting"
].join(" ");

const authUri = `https://appcenter.intuit.com/connect/oauth2?client_id=${client_id}&redirect_uri=${encodeURIComponent(
  redirect_uri
)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=12345`;

app.get("/", (req, res) => {
  res.send(`<a href="${authUri}">Connect to QuickBooks</a>`);
});

app.get("/callback", async (req, res) => {
  const { code, realmId } = req.query;

  try {
    const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

    const tokenResponse = await axios.post(
      "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirect_uri,
      }),
      {
        headers: {
          "Authorization": `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    console.log("✅ Access Token:", access_token);
    console.log("🔁 Refresh Token:", refresh_token);
    console.log("🏢 Realm ID:", realmId);

    // 🔽 Save these 3 to token.json using fs
    const tokenData = {
      access_token,
      refresh_token,
      realmId
    };

    await fs.writeFile('token.json', JSON.stringify(tokenData, null, 2));
    console.log("💾 Tokens saved to token.json");

    res.send("✅ OAuth successful! Tokens saved in token.json.");
  } catch (err) {
    console.error("❌ Error exchanging code:", err.response?.data || err.message);
    res.send("OAuth failed.");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  open("http://localhost:3000");
});
