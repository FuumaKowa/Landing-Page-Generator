# Do Good Agent Landing Page Builder

This project is a local prototype for an AI-assisted landing page builder system for Do Good Sdn Bhd agents.

The system allows agents to customize their own landing page, submit it for admin review, revise it when requested, and receive a published page link after admin approval.

## Project Purpose

The purpose of this project is to create a controlled landing page generation system for Do Good agents.

Instead of asking agents to handle code, hosting, or design manually, the system provides a visual builder where agents can fill in their information and preview their landing page in real time.

The final workflow is planned to support live published landing pages using one central company subdomain.

Planned live URL structure:

```txt
landing.dogood.asia/a/agent-slug
```
## Current Prototype Status

This version is still running locally.

Data is stored using browser localStorage, not a real database yet.

Current local system includes:
```txt
Agent Builder
Admin Dashboard
Published Page Viewer
Local Backup System
```
Main Files
```
index.html
style.css
script.js

admin.html
admin.css
admin.js

page.html

data/
  agent.json

assets/
  Do Good Asia Logo.png
```
## Agent Builder

Main file:
```
index.html
```
The agent builder allows agents to customize their landing page in real time.

Current builder features:
```
Theme selection
Target audience selection
Page structure presets
Hero style presets
English / Chinese language switching
Section toggling
Agent details editing
Product details editing
Package details editing
Image URL input
Custom WhatsApp message
Package checkout link
Live landing page preview
Customer preview mode
Request submission
Revision notice display
Draft saving
JSON import
JSON export
HTML export
```
## Admin Dashboard

Main file:
```
admin.html

The admin dashboard allows admin to review and manage submitted landing page requests.

Current admin features:

Submitted request list
Published page list
Status filters
Search by agent name, WhatsApp, product, package, or submission ID
Sorting
Internal admin notes
Agent revision messages
Payment confirmation
Approval
Publishing
Rejection
Needs changes workflow
Copy revision link
Copy published page link
Delete test submissions
Backup export
Backup import
Backup reminder
```
## Published Page Viewer

Main file:
```
page.html
```
The published page viewer is used to preview submitted or published landing pages without showing the builder controls.

Submitted request preview:
```
page.html?submission=submission-id
```
Published page preview:
```
page.html?slug=agent-slug
```
Later, this local preview system will be replaced with live public routes such as:
```
landing.dogood.asia/a/agent-slug
```
## Current Workflow

1. Agent Creates Page
```
Agent opens builder
Agent customizes landing page
Agent previews page in real time
Agent submits landing page request
Request is saved locally
```
2. Admin Reviews Page
```
Admin opens dashboard
Admin previews submitted request
Admin reviews content and compliance
Admin writes internal note if needed
Admin writes revision message if needed
```
3. Revision Workflow
```
Admin marks request as Needs Changes
Admin copies revision link
Agent opens revision link
Agent sees revision notice
Agent edits page
Agent resubmits same request
Request returns to Pending Review
```
4. Payment and Approval Workflow
```
Agent sends payment proof manually
Admin confirms payment
Admin approves page
Admin publishes page
Admin copies published page link
```
## Local Storage Keys

The local prototype currently uses these browser storage keys:
```
dogoodAgentLandingDraft
dogoodLandingSubmissions
dogoodPublishedLandingPages
```
These are temporary and will later be replaced by Supabase database tables.

## Backup System

Because this prototype uses browser localStorage, data can be lost if browser storage is cleared.

The admin dashboard includes:
```
Export Backup
Import Backup
Export Backup Now
```
The backup file contains:
```
Submitted requests
Published pages
Export date
Data counts
Prototype version
```
Example backup filename:
```
dogood-landing-backup-2026-05-13-requests-5-published-2.json
```
## Planned Hosting Direction

The system should use one central company subdomain instead of separate domains for each agent.

Recommended structure:
```
landing.dogood.asia
landing.dogood.asia/a/agent-slug
```
Recommended stack:
```
Cloudflare Pages
Supabase
Supabase Storage or Cloudflare R2
Planned Live Workflow
Agent customizes page
Agent submits request
Data is saved to Supabase
Admin reviews request
Admin confirms payment
Admin approves request
Page becomes public
Agent receives live link
```
## Planned Database Tables

Recommended Supabase tables:
```
agents
landing_page_submissions
published_landing_pages
payments
```
## Core Statuses

Recommended request statuses:
```
draft
pending_review
pending_payment
approved
published
rejected
needs_changes
```
Recommended payment statuses:
```
unpaid
payment_submitted
payment_confirmed
```
Recommended approval statuses:
```
not_approved
approved
published
```
## Business Model Direction

Agents should not pay for separate hosting or separate domains.

Recommended model:
```
Agents pay Do Good / admin
Do Good pays one central hosting bill
All agent pages are managed under one system
```
Possible pricing models:
```
One-time setup fee
Monthly service fee
Yearly maintenance fee
Package-based fee
```
## Important Compliance Note

Because this project is related to wellness products, agents should avoid unsafe medical claims.

Avoid claims such as:
```
cure disease
treat disease
prevent disease
reduce cholesterol
fix diabetes
replace medication
guaranteed health result
```
The landing page should use safer wellness-support language.

## Current Limitation

This is a local prototype.

Current limitations:
```
No real database yet
No authentication yet
No online hosting yet
No real payment gateway
No real image upload system
Data depends on browser localStorage
Published links are local preview links only
```
## Next Development Phase

The next major development phase is Supabase integration.

Priority steps:
```
Create Supabase project
Create database tables
Move submissions from localStorage to Supabase
Move published pages from localStorage to Supabase
Add admin authentication
Add image upload storage
Prepare Cloudflare Pages deployment
Configure landing.dogood.asia
```
