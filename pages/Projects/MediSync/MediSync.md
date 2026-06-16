---
order: 1
navLabel: MediSync
navBlurb: Hospital management system
title: MediSync
summary: Full-stack hospital management system.
tech: [React, TypeScript, Express, PostgreSQL, AWS S3, Cornerstone.js, JWT, Tailwind CSS, Vite, GitHub Actions, Render]
link: open MediSync | https://medisync-hms.onrender.com/
galaxy: Engineering
system: Web apps
---

<div class="cred-row">
<pre>DEMO PATIENT
  Name  : Alex Morgan
  Email : alex.morgan.demo@gmail.com
  PIN   : 123456</pre>
<pre>DEMO DOCTOR
  Name       : Dr. Demo
  Staff Code : DOC-005
  PIN        : 123456</pre>
</div>

A full-stack platform that simulates a private hospital's core software: a secure multi-role staff portal, a separate patient portal, and a real DICOM medical-image viewer running in the browser.

- **Roles & portals:** admin, doctor, receptionist, and radiologist staff plus a patient portal, all PIN-protected, covering appointments, records, vitals, prescriptions, and billing.
- **Security:** two separate JWT flows (httpOnly cookies for staff, Bearer tokens for patients), bcrypt-hashed PINs, brute-force lockout, and per-IP rate limiting.
- **Imaging:** private AWS S3 DICOM storage streamed through the server and rendered in-browser via Cornerstone.js, with zoom, pan, and window/level controls.
- **Engineering:** a TypeScript monorepo deployed as one Express + React service on Render, Neon PostgreSQL with versioned migrations, and GitHub Actions CI/CD.
