# CakeDesk competition demonstration

Based on the user’s proposal and the DEL case materials. This is supporting preparation, not a submitted slide deck. Do not claim real results, endorsements or official pricing.

## A focused nine-minute story

1. **0:40 — Core proposal:** One dependable CakeCard for every cake, regardless of how the customer orders.
2. **1:00 — Diagnose the workflow:** Phone/counter intake → paper details → hand sorting into pickup boxes → production lookup. Lost forms remove the only record; wrong boxes create wrong-day preparation; separate conversations lose changes.
3. **0:55 — Shared record:** Show the CakeCard, attached reference and timestamped history.
4. **1:10 — Customer demonstration:** At `/order`, request a custom floral cake, upload a photo and mark “make these flowers blue.” Submit and point out “awaiting approval.”
5. **1:15 — Staff demonstration:** At `/staff/orders/new`, save a phone order using only essential details. Open the existing floral request from Quotes.
6. **1:10 — Price with human judgment:** Enter materials and decoration labor, review feasibility and send a quote. Open Customer view, approve, return to staff and confirm. Explain deposit conditions and revisions. The application never promises automated feasibility.
7. **1:20 — Rollout, costs and resilience:** Outline the stages below, show production by pickup date, and explain numbered paper fallback plus separate database/image backups.
8. **0:55 — Measurement:** Show Reports. Targets are pilot goals, not achieved results.
9. **0:40 — Recommendation:** Keep the current retail site; digitize staff intake first, then add customer requests and approval conversations.

Use `/demo` to reset fictional data before rehearsal. Open Customer view in a second tab in the same browser/origin. Browser tabs receive local storage updates. The guided demo includes classic, custom floral, phone, design-revision and unavailable-date scenarios. All data is fictional. No real email or payment is sent.

## Feasibility and ownership

| Stage  | Owner                       | Work and validation                                                                                         |
| ------ | --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Week 1 | Bakery owner + counter lead | Map current form fields, price rules, approval permissions, payment and capacity policies; measure baseline |
| Week 2 | Developer + counter lead    | Build/configure staff intake and production records; each employee practices at least five realistic orders |
| Week 3 | Manager + pilot staff       | Supervised limited pilot; reconcile every digital order against existing process; fix confusing fields      |
| Week 4 | Owner + manager             | Adopt primary digital record after validation; retain numbered fallback; review incidents and timing weekly |

Counter staff practice intake, lookup, changes and pickup. Bakers practice finding approved instructions and status changes. Owners/managers receive additional training on quotes, access, deposits, backup restoration and exceptions. Set a named maintenance owner before real deployment. The provided event guide does not supply a readable copy of the paper form; validate fields with the bakery before production.

Illustrative planning budget from the proposal: static hosting $0 at small scale, Supabase Pro approximately $25/month, transactional email $0 within provider free limits, existing tablets/computers reused, payment fees if an optional provider is added. Verify current provider prices and limits before purchase. Development allowance 50–100 hours × $50/hour = $2,500–$5,000, not a vendor quote. Ongoing maintenance and staff training are additional. This local prototype is not a secure production deployment for that monthly hosting cost.

Measure the cost of doing nothing: staff minutes spent locating/sorting orders, remakes, missing orders and corrections. Avoid claiming savings until the baseline and pilot measurements exist.

## Goals and assessment

Pilot goals: 100% of cake orders captured digitally; zero lost or wrong-day incidents per month; routine phone intake in 60–90 seconds; 100% complete confirmed production instructions; at least 90% of custom quotes answered within one business day; daily reconciliation before preparation. Measure entry time, first quote turnaround, incidents, source mix and completed quoted revenue. Demo figures are sample data.

SWOT: strengths are one shared record and human control; weaknesses are training and technical dependence; opportunities are easier custom ordering and less administration; threats are outages, incorrect data and security failures. The initial market is one existing bakery and its current customers; expansion to other independent bakeries is an opportunity, not proven traction or a fabricated market-size statistic. Add your actual team names and roles to the deck; none are invented here.

The rubric allocates 65 points to diagnosis, fit, feasibility and implementation/measurement, and 35 to presentation. Aim for 8–10 minutes. The supplied documents require the slide-deck link to reach DEL by November 7, 2026 at 11:59 PM. Building this website does **not** satisfy submission, and no email has been sent. The event guide/DEL Info give Bear Library while the rubric header names a different location; confirm the venue with the organizer before travel.
