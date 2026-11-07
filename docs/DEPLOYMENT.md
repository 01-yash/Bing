# Production handoff and acceptance

The delivered application intentionally runs as a self-contained local competition demonstration, as the supplied specification permits when Supabase is not connected. No production backend is configured. Do not switch labels to “production” without replacing the storage and authorization layer.

## Backend work before live orders

Use Supabase Postgres, Auth and private Storage (or equivalent), with server-side functions for public submissions, token verification, messages, quotes and mutations. Model customers, orders, reference_images, image_annotations, quote_versions, messages, order_events, staff_users and availability as separate tables. Use foreign keys and indexes for order reference, status, pickup date and customer. Store timestamps with timezone; the bakery’s business timezone is America/New_York. Order dates in this demonstration are local browser dates.

Public submissions need server validation, rate limits, idempotency keys and transactionally unique references. Resolve race conditions with transactional capacity checks and optimistic revision checks. Return a confirmation only after the database transaction succeeds. Recover drafts without exposing customer information on shared devices. This browser-only app is a single-presenter demonstration, not a concurrent staff system; synchronize real clients through the backend.

Use individual staff accounts. Enforce Owner / Manager / Counter / Baker permissions on every server mutation and database query. Bakers must receive only approved production fields. Store private financial and staff-note data separately from customer-visible records; never return them to customer clients. Client role checks in this demo are illustrative only. Add session expiry, access logging and revocation.

Issue cryptographically random customer-link tokens, store token hashes server-side and verify identity through a separately delivered OTP for sensitive approvals. Scope reads to that order, expire/revoke links and rate-limit attempts. The demonstration’s matching phone check is not a production verification mechanism. No public customer directory is provided.

Store uploaded files in a private bucket. Validate content bytes, MIME, size and permitted formats server-side; use short-lived signed image URLs and an appropriate retention policy. Preserve normalized annotation coordinates. Do not place database service-role keys in the frontend. Configure notifications server-side through Resend or equivalent with explicit sent/failed outcomes. Use existing payment channels or a verified payment-provider webhook; never trust a client payment flag.

## Operational readiness

- Validate every required field against the bakery’s actual physical cake order form; it is not readable in the provided event guide.
- Have the owner approve product combinations, price rules, tax treatment, preparation dates, capacity, holidays, quote expiry, deposit policy and override permissions. Current prices are demo values, not official bakery prices.
- Take scheduled database backups and **separate private image-storage backups**. A database-only backup is insufficient for reference photos. Test restoration into an isolated environment, verify record/image counts and sample approved versions, then document retention, recovery point and recovery time.
- Reconcile every confirmed order daily. For outages, use numbered temporary forms and manually enter and reconcile them afterward. No automatic offline sync is implemented.
- Preserve the existing bakery website and checkout; link the custom-order flow alongside it. Do not replace unrelated retail sales.
- Configure static-host SPA rewrites, TLS, CSP, privacy policy, monitoring, accessibility review, secure logging, supported browsers and maintenance ownership.

## Acceptance mapping

| Requirement                               | Demo implementation / verification                                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| One saved request and ID                  | Browser flow submits once, inspects one persisted record and verifies unique reference                                            |
| Fast phone intake                         | Four essential inputs, persistent partial draft, duplicate acknowledgement; real elapsed entry seconds recorded                   |
| Pending requests excluded from production | Browser test verifies no production commitment before approval and confirmation                                                   |
| Staff quote and customer review           | Complete browser test sends and accepts a quote, rejects an incorrect contact check                                               |
| Approved price and design together        | Immutable quote versions include exact design and approval timestamp                                                              |
| Revised design requires approval          | Test asserts last approved design remains unchanged until acceptance of v2                                                        |
| Correct pickup date                       | Production filters by confirmed pickup date, preparation date independently selectable                                            |
| Ready and collected                       | Browser test performs preparation → ready → picked up                                                                             |
| Search and persistence                    | Name/reference/date searches and reload persistence exercised                                                                     |
| Customer isolation                        | Invalid tokens denied and private costs absent from customer UI; secure cross-user isolation remains a **production requirement** |
| Employee permissions                      | UI role restrictions tested; server-enforced authorization remains a **production requirement**                                   |
| Responsive UI                             | Browser checks 390, 768 and 1440 pixel widths; screenshots saved by test runner                                                   |
| Export and recovery                       | CSV download plus JSON export/restore tested; scheduled database and image backups remain deployment requirements                 |
| Truthful integrations                     | No simulated card, email-delivery or scheduled-backup success; unconfigured connections labeled                                   |

Browser storage is limited and can fail, especially with multiple large images. Failed writes show an error and do not show a saved confirmation. Keep exports; production data belongs in a real database and private storage.
