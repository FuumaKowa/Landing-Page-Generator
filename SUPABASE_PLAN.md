````markdown
# Supabase Migration Plan

This document explains the planned Supabase database structure and migration direction for the Do Good Agent Landing Page Builder.

The current prototype uses browser `localStorage`. Supabase will replace `localStorage` for submitted requests, published pages, agent data, admin review, and future payment tracking.

## Migration Purpose

The purpose of this migration is to move the system from a local prototype into a live multi-agent platform.

Current local system:

```txt
Agent Builder
Admin Dashboard
Published Page Viewer
Local Backup System
````

Planned live system:

```txt
Agent Builder
Admin Dashboard
Published Agent Pages
Supabase Database
Supabase Auth
Supabase Storage or Cloudflare R2
Cloudflare Pages Hosting
```

## Planned Live Domain

The system should use one central company subdomain.

Recommended structure:

```txt
landing.dogood.asia
landing.dogood.asia/a/agent-slug
```

Agents should not need their own domains.

## Current Local Storage Keys

Current `localStorage` keys:

```txt
dogoodAgentLandingDraft
dogoodLandingSubmissions
dogoodPublishedLandingPages
```

These will be replaced by Supabase tables.

## Recommended Supabase Tables

```txt
agents
landing_page_submissions
published_landing_pages
payments
admin_users
```

## Table 1: agents

This table stores basic agent information.

Suggested columns:

```txt
id
full_name
slug
whatsapp_number
email
status
created_at
updated_at
```

Suggested status values:

```txt
active
inactive
suspended
```

Example row:

```json
{
  "id": "uuid",
  "full_name": "Daniel",
  "slug": "daniel",
  "whatsapp_number": "601123456789",
  "email": "agent@example.com",
  "status": "active"
}
```

## Table 2: landing_page_submissions

This table stores landing page requests submitted by agents.

Suggested columns:

```txt
id
agent_id
slug
status
payment_status
approval_status
revision_message
admin_note
page_data
submitted_at
resubmitted_at
reviewed_at
updated_at
created_at
```

Suggested status values:

```txt
draft
pending_review
needs_changes
pending_payment
approved
published
rejected
```

Suggested payment status values:

```txt
unpaid
payment_submitted
payment_confirmed
```

Suggested approval status values:

```txt
not_approved
approved
published
```

The `page_data` column should store the full landing page configuration as JSON.

Example `page_data`:

```json
{
  "agentName": "Daniel",
  "whatsappNumber": "601123456789",
  "theme": "natural-cream",
  "language": "en",
  "heroStyle": "product-focus",
  "structure": "standard",
  "targetAudience": "Working adults",
  "productName": "Do Good Premium Natural Complex Enzyme 131",
  "productDescription": "A simple wellness drink for daily routine support.",
  "packageName": "Starter Wellness Package",
  "packagePrice": "RM188",
  "packageCheckoutLink": "https://dogood.asia/Checkout?cl=8f14e45fceea167a5a36dedd4bea2543",
  "packageButtonText": "Checkout Package",
  "productImage": "image-url",
  "agentPhoto": "image-url",
  "whatsappMessage": "Hi, I want to know more about Do Good."
}
```

## Table 3: published_landing_pages

This table stores approved and published landing pages.

Suggested columns:

```txt
id
submission_id
agent_id
slug
public_path
status
page_data
published_at
updated_at
created_at
```

Suggested status values:

```txt
published
unpublished
archived
```

Example public path:

```txt
/a/daniel
```

Example live URL:

```txt
landing.dogood.asia/a/daniel
```

## Table 4: payments

This table stores payment records for agent landing page services.

Suggested columns:

```txt
id
agent_id
submission_id
amount
currency
payment_method
payment_status
payment_reference
proof_url
paid_at
confirmed_at
created_at
updated_at
```

Suggested payment status values:

```txt
unpaid
payment_submitted
payment_confirmed
rejected
refunded
```

For the first live version, payment can still be handled manually.

Manual payment flow:

```txt
Agent pays through bank transfer or DuitNow
Agent sends proof to admin
Admin checks proof
Admin marks payment as confirmed
System allows approval and publishing
```

Payment gateway can be added later.

Possible future gateways:

```txt
Billplz
ToyyibPay
SenangPay
iPay88
Stripe
DuitNow QR
```

## Table 5: admin_users

This table stores admin user profiles after Supabase Auth is added.

Suggested columns:

```txt
id
auth_user_id
full_name
email
role
status
created_at
updated_at
```

Suggested role values:

```txt
super_admin
admin
reviewer
```

Suggested status values:

```txt
active
inactive
```

## Supabase Storage

Images should not stay as random external URLs forever.

Recommended storage option:

```txt
Supabase Storage
```

Possible buckets:

```txt
agent-photos
product-images
landing-page-assets
payment-proofs
```

Alternative future option:

```txt
Cloudflare R2
```

## Image Upload Flow

Planned flow:

```txt
Agent uploads image
Image is saved to Supabase Storage
System stores public image URL in page_data
Admin reviews image
Published page uses stored image URL
```

## Admin Approval Flow

Planned live flow:

```txt
Agent submits landing page request
Submission status becomes pending_review
Admin reviews page
Admin either approves, rejects, or requests changes
If needs changes, admin writes revision message
Agent revises and resubmits
Admin confirms payment
Admin approves
Admin publishes
Published page becomes available at /a/agent-slug
```

## Protection Rules

Approval rules:

```txt
Cannot approve if payment is not confirmed
Cannot approve if request still needs changes
Cannot approve rejected request
Cannot approve already published request
```

Publishing rules:

```txt
Cannot publish if payment is not confirmed
Cannot publish if request is not approved
Cannot publish rejected request
Cannot publish request that still needs changes
```

Published page rules:

```txt
Published pages should not be edited directly in the same workflow
Published page updates should use a separate update workflow later
```

## Agent Revision Flow

Planned revision flow:

```txt
Admin marks request as needs_changes
Admin writes revision message
Agent receives revision link
Agent opens builder with existing page data
Agent sees revision notice
Agent edits page
Agent resubmits same request
Request returns to pending_review
Revision message is cleared
```

## Published Page Flow

Local prototype:

```txt
page.html?slug=agent-slug
```

Planned live version:

```txt
landing.dogood.asia/a/agent-slug
```

The published page should:

```txt
Read slug from URL
Fetch published page data from Supabase
Render landing page using page_data
Show 404-style message if slug does not exist
```

## Data Migration Direction

Current storage layer:

```txt
storage.js
```

Current purpose:

```txt
Centralize localStorage functions
Prepare system for Supabase migration
```

Future direction:

```txt
Replace localStorage functions with Supabase queries
Keep the builder and admin logic mostly unchanged
```

Example current local function:

```txt
DoGoodStorage.getSubmissions()
```

Future Supabase version:

```txt
DoGoodStorage.getSubmissions()
```

The function name can stay similar, but the internal implementation will use Supabase instead of `localStorage`.

## Recommended Supabase Implementation Order

```txt
1. Create Supabase project
2. Create database tables
3. Create storage buckets
4. Add Supabase client file
5. Move submitted requests from localStorage to Supabase
6. Move published pages from localStorage to Supabase
7. Add admin authentication
8. Add image upload
9. Add payment proof upload
10. Deploy frontend to Cloudflare Pages
11. Connect landing.dogood.asia
```

## Suggested Files for Supabase Phase

```txt
supabase.js
storage.js
auth.js
admin.js
script.js
page.html
```

Possible structure:

```txt
js/
  supabase.js
  storage.js
  auth.js
  builder.js
  admin.js
  page.js
```

This can be done later after the current local prototype is stable.

## Row Level Security Direction

Supabase Row Level Security should be enabled before real deployment.

Possible access rules:

```txt
Public users can only read published landing pages
Agents can create and update their own submissions
Admins can read and update all submissions
Admins can publish approved pages
Only admins can confirm payments
Only admins can delete or archive records
```

For early testing, rules can be simpler, but production should not expose admin data publicly.

## Current Local Prototype Limitation

Current limitations before Supabase:

```txt
Data only exists in one browser
No real login system
No real database
No real cloud storage
No real live routes
No real payment tracking
No multi-device admin access
No protected admin dashboard
```

## Next Development Step

The next major technical step is to create the Supabase project and database tables.

After that, the first real migration target should be:

```txt
landing_page_submissions
```

This is the most important table because it connects the agent builder to the admin dashboard.
