# Firebase Hosting Setup Guide (Production + Test)

Step-by-step instructions to migrate `chattanooga-adventures.com` from InfinityFree to Firebase Hosting, with a test subdomain at `test.chattanooga-adventures.com`.

> **Context:** The domain is registered through Squarespace (formerly Google Domains). Squarespace's DNS management has issues syncing custom records to the underlying Google Cloud DNS nameservers. This guide uses **Cloudflare** (free tier) as the DNS provider for reliable, fast DNS management.

---

## Step 1: Create the Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project**
3. Name it `chattanooga-adventures` (or similar — this is just the project label)
4. Disable Google Analytics if you don't need it, then click **Create project**

---

## Step 2: Set Up Both Hosting Sites

1. In your Firebase project, go to **Build > Hosting** in the left sidebar
2. Click **Get started** and follow the prompts (you can skip the CLI steps for now)
3. You now have a default site — this will be **production** (e.g., `chattanooga-adventures.web.app`)
4. Click **Add another site** at the bottom of the Hosting dashboard
5. Name the second site `chattanooga-adventures-test`
   - This creates `chattanooga-adventures-test.web.app`
   - This will serve `test.chattanooga-adventures.com`

> **Important:** Write down both site IDs. If they differ from `chattanooga-adventures` and `chattanooga-adventures-test`, update the values in `.firebaserc` in your repo to match.

---

## Step 3: Connect Custom Domains in Firebase

### 3a: Production domain

1. On the Hosting dashboard, find the **chattanooga-adventures** (default/production) site
2. Click **Add custom domain**
3. Enter: `chattanooga-adventures.com`
4. Firebase will show you DNS records to add — **write these down** (you'll add them in Step 6)
5. Repeat and also add `www.chattanooga-adventures.com` as a custom domain

Firebase will provide records like:

| Type | Host/Name | Value |
|------|-----------|-------|
| TXT  | `@` (root) | `hosting-site=chattanooga-adventures` (verification) |
| A    | `@` (root) | `199.36.158.100` |
| CNAME | `www` | `chattanooga-adventures.web.app` (or similar) |

### 3b: Test subdomain

1. On the Hosting dashboard, find the **chattanooga-adventures-test** site
2. Click **Add custom domain**
3. Enter: `test.chattanooga-adventures.com`
4. Firebase will show you DNS records to add — **write these down**

Firebase will provide records like:

| Type | Host/Name | Value |
|------|-----------|-------|
| TXT  | `test` | `hosting-site=chattanooga-adventures-test` (verification) |
| CNAME | `test` | `chattanooga-adventures-test.web.app` (or similar) |

> **Keep the Firebase console open** — you'll come back to click **Verify** after DNS is configured.

---

## Step 4: Set Up Cloudflare (Free DNS Provider)

Squarespace's DNS management doesn't reliably sync custom records to its nameservers. Cloudflare's free tier gives you direct, reliable DNS control with fast propagation.

### 4a: Create a Cloudflare account

1. Go to [Cloudflare](https://dash.cloudflare.com/sign-up) and create a free account
2. Click **Add a site** (or **Add domain**)
3. Enter: `chattanooga-adventures.com`
4. Select the **Free** plan

### 4b: Cloudflare will scan existing records

- Cloudflare will attempt to import your existing DNS records
- **Delete any records it imports** — we'll add the correct Firebase records from scratch in Step 6
- Don't worry about losing anything; the old records were pointing to InfinityFree/Squarespace which are no longer needed

### 4c: Note the Cloudflare nameservers

Cloudflare will assign you two nameservers, something like:

- `anna.ns.cloudflare.com`
- `bob.ns.cloudflare.com`

**Write these down** — you'll enter them in Squarespace in the next step.

---

## Step 5: Point Nameservers to Cloudflare (in Squarespace)

1. Log in to [Squarespace](https://www.squarespace.com)
2. Go to **Settings > Domains > chattanooga-adventures.com**
3. Find the **Nameservers** (or **DNS** / **Advanced DNS**) settings
4. Replace the current nameservers with the two Cloudflare nameservers from Step 4c
5. **Remove any custom DNS records** you previously added in Squarespace (TXT, A, CNAME records for Firebase) — they are no longer needed since Cloudflare will manage DNS
6. Click **Save**

> **Warning:** Once you switch nameservers, there will be a brief period of downtime while DNS propagates. Nameserver changes typically take **15 minutes to a few hours**, though it can take up to 48 hours in rare cases.

> Cloudflare will show your domain as **"Pending"** until it detects the nameserver change. Once detected, it will show **"Active"**.

---

## Step 6: Add DNS Records in Cloudflare

Once Cloudflare shows your domain as **Active** (or even while still Pending — records will work once nameservers propagate):

1. Go to the **DNS** tab in your Cloudflare dashboard for `chattanooga-adventures.com`
2. Delete any auto-imported records from the initial scan
3. Add the following records using the exact values Firebase gave you in Step 3:

### Production domain records

| Type | Name | Content | Proxy status |
|------|------|---------|--------------|
| TXT  | `@`  | `hosting-site=chattanooga-adventures` | *(TXT records are never proxied)* |
| A    | `@`  | `199.36.158.100` | **DNS only** (gray cloud) |
| CNAME | `www` | `chattanooga-adventures.web.app` | **DNS only** (gray cloud) |

### Test subdomain records

| Type | Name | Content | Proxy status |
|------|------|---------|--------------|
| TXT  | `test` | `hosting-site=chattanooga-adventures-test` | *(TXT records are never proxied)* |
| CNAME | `test` | `chattanooga-adventures-test.web.app` | **DNS only** (gray cloud) |

> **Important: Use "DNS only" (gray cloud) for all A and CNAME records.** Do NOT use Cloudflare's proxy (orange cloud). Firebase needs to handle SSL provisioning directly, and Cloudflare's proxy would interfere with Firebase's ACME certificate challenges. You can click the orange cloud icon to toggle it to gray when adding each record.

---

## Step 7: Verify Domains in Firebase

1. Go back to the Firebase Console Hosting dashboard
2. For each custom domain (`chattanooga-adventures.com`, `www.chattanooga-adventures.com`, `test.chattanooga-adventures.com`):
   - Click **Verify** (or the domain entry to check status)
   - If verification fails, DNS may not have propagated yet — wait 5–15 minutes and retry

You can check propagation from PowerShell:

```powershell
# Check if nameservers point to Cloudflare
nslookup -type=NS chattanooga-adventures.com

# Check if TXT records are visible
nslookup -type=TXT chattanooga-adventures.com
nslookup -type=TXT test.chattanooga-adventures.com

# Check if A record points to Firebase
nslookup chattanooga-adventures.com

# Check if CNAMEs are visible
nslookup www.chattanooga-adventures.com
nslookup test.chattanooga-adventures.com
```

> **Cloudflare DNS propagation is fast** — typically within minutes, not hours. If `nslookup -type=NS` still shows old nameservers, the nameserver change hasn't propagated yet.

---

## Step 8: Wait for SSL Provisioning

- Firebase automatically provisions free SSL certificates for all connected custom domains
- This can take **a few minutes up to 24 hours** depending on DNS propagation
- Monitor the status on the Firebase Hosting dashboard — each domain will show:
  - **"Needs setup"** → DNS records not yet detected
  - **"Pending"** → DNS detected, SSL being provisioned
  - **"Connected"** → Everything is live

---

## Step 9: Generate a Service Account Key for GitHub Actions

1. In Firebase Console, click the **gear icon** next to "Project Overview" > **Project settings**
2. Go to the **Service accounts** tab
3. Click **Generate new private key**
4. A JSON file will download — this is your service account key

---

## Step 10: Add the Secret to GitHub

1. Go to your repo on GitHub: `Settings > Secrets and variables > Actions`
2. Click **New repository secret**
3. **Name:** `FIREBASE_SERVICE_ACCOUNT`
4. **Value:** Paste the **entire contents** of the JSON file from Step 9 (including the curly braces)
5. Click **Add secret**

---

## Step 11: Deploy

### Production (main branch)

Push or merge to `main` to trigger the production deploy:

```bash
git push origin main
```

This triggers `.github/workflows/firebase_deploy.yml` which deploys to `chattanooga-adventures.com`.

### Test (test branch)

Push or merge to `test` to trigger the test deploy:

```bash
git push origin test
```

This triggers `.github/workflows/firebase_deploy_test.yml` which deploys to `test.chattanooga-adventures.com`.

---

## Step 12: Verify Everything Works

1. Check the **GitHub Actions** tab on your repo to confirm both deploys succeeded
2. Visit `https://chattanooga-adventures.com` — you should see your production site with a valid SSL certificate
3. Visit `https://www.chattanooga-adventures.com` — should redirect to or serve the same content
4. Visit `https://test.chattanooga-adventures.com` — you should see your test site with a valid SSL certificate

---

## Step 13: Clean Up

Once everything is confirmed working:

1. **Remove old GitHub secrets** — delete `INFINITY_FTP_HOST`, `INFINITY_FTP_USERNAME`, `INFINITY_FTP_PASSWORD` from GitHub repo settings
2. **Cancel InfinityFree hosting** — your site is no longer served from there
3. **Clean up Squarespace DNS** — remove any leftover custom DNS records in Squarespace (they have no effect anymore since nameservers point to Cloudflare, but it's good housekeeping)

---

## Architecture Summary

```
Squarespace (registrar) ──nameservers──> Cloudflare (DNS)
                                            ├── A     @    → 199.36.158.100 (Firebase)
                                            ├── CNAME www  → chattanooga-adventures.web.app
                                            ├── CNAME test → chattanooga-adventures-test.web.app
                                            └── TXT records (verification)

GitHub Repo
  ├── main branch ──push──> Firebase Hosting (production) → chattanooga-adventures.com
  └── test branch ──push──> Firebase Hosting (test)       → test.chattanooga-adventures.com
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Cloudflare still shows "Pending" | Nameserver change hasn't propagated yet — can take up to 48 hours (usually much less). Check with `nslookup -type=NS chattanooga-adventures.com` |
| Firebase says "Verification failed" | DNS records may not have propagated yet — wait 5–15 minutes and retry. Cloudflare is fast but nameserver switch takes longer. |
| Firebase ACME challenge fails | Make sure all A/CNAME records in Cloudflare are set to **"DNS only"** (gray cloud), not proxied (orange cloud) |
| GitHub Action fails with auth error | Double-check that `FIREBASE_SERVICE_ACCOUNT` contains the full JSON (including curly braces) |
| Site loads on `.web.app` but not custom domain | DNS propagation may still be in progress — check with `nslookup chattanooga-adventures.com` |
| SSL certificate not provisioned | Firebase provisions SSL after DNS is verified — give it up to 24 hours |
| Brief downtime during migration | Expected — there's a window between switching nameservers and DNS propagation where the site may be unreachable |
| `DNS_PROBE_FINISHED_NXDOMAIN` in browser | DNS hasn't propagated yet, or your local DNS cache is stale. Try `ipconfig /flushdns` in PowerShell, then retry. |
