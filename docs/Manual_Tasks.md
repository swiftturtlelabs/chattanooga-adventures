# Manual Tasks from Site Build Plan

## Pre-Requisite Tasks (Do These Before AI Implementation)

These must be completed first because AI-written code and tests depend on them being in place.

### 1. Enable Cloud Firestore in Firebase Console
- Go to the [Firebase Console](https://console.firebase.google.com/) for the `chattanooga-adventures` project
- Navigate to **Build > Firestore Database** and create the database (start in production mode since the plan includes custom security rules)
- Required before: Firestore security rules can be deployed, integration/API tests can run, adventure data can be seeded

### 2. Create EmailJS Account and Configure Service ✅
- Sign up at [emailjs.com](https://emailjs.com/) (free tier: 200 emails/month)
- Add a Gmail service connected to `swiftturtlelabs@gmail.com`
- Create an email template for the contact form (fields: from_name, from_email, subject, message)
- Copy the **Public Key**, **Service ID**, and **Template ID**
- IDs are now stored in `js/firebase-config.js`
- Required before: The support form (`support.html`) can send emails

### 3. Add Firebase Web App Config to js/firebase-config.js
- Go to the [Firebase Console](https://console.firebase.google.com/) → **Project Settings** → **Your apps** → select the Web app
- Copy the `apiKey`, `messagingSenderId`, and `appId` values
- Replace the `TODO_REPLACE_WITH_*` placeholders in `js/firebase-config.js` with these values
- These are client-side keys and safe to commit
- Required before: Any Firestore reads will work (adventure reveal, secret page)

---

## Non-Blocking Manual Tasks (Do Alongside or After AI Work)

### 4. Seed Firestore with Adventure Data
- Populate the `boxes/original` document and its `adventures` subcollection in Firestore with real adventure content
- Run the seed script: `node scripts/seed-firestore.js path/to/service-account.json`
- The seed script includes 3 sample adventures (Ruby Falls, Incline Railway, Rock City)
- Full content can be added anytime directly in Firestore

### 5. Configure GitHub Branch Protection Rules
- Go to the GitHub repo **Settings > Branches > Branch protection rules**
- For both `main` and `test` branches:
  - Require status checks to pass: `Lint & Unit Tests` (from unit_tests.yml), `e2e-tests / E2E & Integration Tests` (from deploy workflow calling e2e_tests.yml)
  - Require at least 1 approving review on pull requests
  - Block direct pushes to `main`
- This is configured in GitHub's UI, not in code (ref: [plan Section 9](Site_Build_Plan.md), task 18)

### 6. Verify `FIREBASE_SERVICE_ACCOUNT` GitHub Secret
- The existing deploy workflows already reference `secrets.FIREBASE_SERVICE_ACCOUNT`
- Confirm this secret is set and working (deploys to test/production should already be functioning)
- If not, add the full Firebase service account JSON as a repository secret

### 7. Provide Real "Where to Buy" Content
- The home page "Where to buy" section uses placeholder data (Scenic City Souvenirs, River Walk Gift Shop, Online Store Coming Soon)
- When ready, provide actual retail locations or purchase links to replace the placeholders in `index.html`

### 8. Provide Full Adventure Content
- The initial build uses 3 sample adventures (Ruby Falls, Incline Railway, Rock City)
- When ready, provide the full list of adventure titles and descriptions for each box
- These get added directly to Firestore (no code changes needed)

### 9. Review and Update Visual Regression Baselines
- After the site design is finalized and you're happy with the look, run `npx playwright test --update-snapshots` to lock in the baseline screenshots
- These baselines are committed to the repo and CI will flag unexpected visual changes going forward

### 10. (Optional Future) Add Adventure/Home Page Images
- The plan focuses on text content only
- Add images to Firestore documents or as static assets when ready

### 11. (Optional Future) Set Up Error Monitoring
- Add client-side error monitoring (e.g., Sentry free tier) for production observability
- Catches Firestore fetch failures, JS errors, and other runtime issues that tests cannot predict

### 12. (Optional Future) Custom Email Domain
- Set up MX record for `support@chattanooga-adventures.com`
- Not needed now since EmailJS handles email delivery
