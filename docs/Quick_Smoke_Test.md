# Quick Smoke Test

A fast pass on the essentials after a production deploy. Run from a phone or separate device. Should take under 2 minutes.

For the full checklist, see [Smoke_Test.md](Smoke_Test.md).

---

- [ ] **Home page loads** -- go to `https://chattanooga-adventures.web.app`, confirm content is visible and not broken
- [ ] **Adventure reveal works** -- go to `https://chattanooga-adventures.web.app/adventure?box=original&adventure=1`, tap Reveal, confirm adventure content appears
- [ ] **Bad adventure URL handled** -- go to `https://chattanooga-adventures.web.app/adventure` (no params), confirm a friendly error shows
- [ ] **Support form loads** -- go to `https://chattanooga-adventures.web.app/support`, confirm the form renders with all fields
- [ ] **404 page works** -- go to `https://chattanooga-adventures.web.app/some-fake-page`, confirm a styled error page appears
- [ ] **No obvious layout issues** -- scroll through each page above, confirm nothing is overlapping, cut off, or horizontally scrolling
