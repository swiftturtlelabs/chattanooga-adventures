# Production Smoke Test

Run this checklist from a **separate device** (phone, tablet, or different computer) after every production deploy to `chattanooga-adventures.web.app`. Check each item off as you go.

**Tip:** Open this file on your testing device via the GitHub repo so you can follow along.

---

## 1. Home Page

- [ ] Navigate to `https://chattanooga-adventures.web.app` -- page loads without errors
- [ ] Hero section displays with tagline and no broken layout
- [ ] "What is it" and "Where to buy" sections are visible and readable
- [ ] Footer is visible with link to Support page
- [ ] Support link in footer navigates to the support page
- [ ] Page scrolls smoothly on mobile (no horizontal overflow)
- [ ] Text is readable without zooming on a phone screen

## 2. Adventure Reveal Page

- [ ] Navigate to `https://chattanooga-adventures.web.app/adventure?box=original&adventure=1`
- [ ] Teaser state loads: "Your Next Adventure Awaits!" text and Reveal button are visible
- [ ] Tap/click the Reveal button -- adventure title and description animate in
- [ ] Adventure content is readable and properly formatted
- [ ] Navigate to `https://chattanooga-adventures.web.app/adventure` (no params) -- friendly error message appears with a link back to home
- [ ] Navigate to `https://chattanooga-adventures.web.app/adventure?box=fake&adventure=999` -- friendly error message appears

## 3. Support Page

- [ ] Navigate to `https://chattanooga-adventures.web.app/support`
- [ ] Form loads with all fields: Name, Email, Subject dropdown, Message
- [ ] Subject dropdown contains all options (General, Missing Card, Damaged Box, Suggestion, Other)
- [ ] Try submitting empty form -- validation errors appear
- [ ] Fill in all fields and submit -- success message appears
- [ ] Verify email was received at `swiftturtlelabs@gmail.com`

## 4. Secret Adventures Page

- [ ] Navigate to `https://chattanooga-adventures.web.app/adventures` directly -- page loads with adventure tiles grouped by box
- [ ] Tiles are displayed in a responsive grid (2 columns on phone portrait)
- [ ] Tap a tile -- navigates to that adventure's reveal page and it works correctly

## 5. Easter Egg

- [ ] Go back to the home page
- [ ] Tap the site title ("Chattanooga Adventures") 7 times rapidly (within ~3 seconds)
- [ ] Confirm a visual hint appears (flash or color change) and you are redirected to `/adventures`

## 6. 404 Page

- [ ] Navigate to `https://chattanooga-adventures.web.app/nonexistent-page`
- [ ] A styled 404 error page appears (not a browser default error)
- [ ] Page includes a link back to home

## 7. Cross-Browser / Device Checks

- [ ] Repeat sections 1-3 on at least one additional browser or device (e.g., Safari on iPhone, Chrome on Android, Firefox on desktop)
- [ ] Confirm no layout issues, broken buttons, or missing content across browsers

## 8. Accessibility Quick Checks

- [ ] On a desktop browser, navigate the home page using only the keyboard (Tab, Shift+Tab, Enter)
- [ ] Confirm all interactive elements (links, buttons) receive visible focus outlines
- [ ] Confirm the skip-to-content link appears on focus (Tab from the very top of the page)
- [ ] On mobile, confirm all tap targets (buttons, links, tiles) are easy to tap without accidentally hitting neighbors

## 9. Performance Quick Checks

- [ ] Pages load within a few seconds on a normal mobile connection
- [ ] No visible layout shift after initial load (content doesn't jump around)
- [ ] Reveal animation on the adventure page is smooth (no jank or stutter)

---

## Notes

- If any check fails, note the device, browser, and what you observed, then file it as a GitHub issue.
- This checklist covers the pages and features defined in the [Site Build Plan](Site_Build_Plan.md). Update it as new pages or features are added.
