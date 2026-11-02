# Premium insurance advisor website

A responsive, family-focused information/enquiry website for Aitha Roshan Kumar. **Independent advisor website, not the official Tata AIA corporate site.** No licensed company logo has been used.

## Quick start

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and enter genuine SMTP host, port, authentication, sender and enquiry recipient values.
4. Run `npm start` and open `http://localhost:3000`.

Without SMTP configuration, the website can be explored and direct Call/Email links work, but the form **does not claim to have delivered enquiries** and returns a transparent configuration message. The WhatsApp button only appears after setting `VERIFIED_WHATSAPP_NUMBER` to an actually verified WhatsApp-enabled number with country code (e.g. `91XXXXXXXXXX`). Do not infer WhatsApp ownership from a phone number.

## Launch checklist

- Confirm in writing permission to use the insurer's trade name, brand styling and any corporate assets; obtain and insert an approved logo only after permission. Current design intentionally uses typographic branding and states it is independent.
- Confirm advisor status, appointment and any applicable regulatory disclosure requirements. The public page currently labels advisor credentials pending verification.
- Arrange hosting with HTTPS/TLS, production secrets, a protected mailbox, retention/deletion policy and monitoring; never put SMTP credentials in frontend files or commit `.env`.
- Configure tested SMTP delivery and send a test enquiry before advertising the form.
- Verify the WhatsApp number and configure it in `.env`.
- Replace externally hosted Unsplash photos with approved, licensed and optimized local assets if necessary; verify suitability of all imagery and credits. The site depends on external images and Google Fonts for visuals.
- Review the privacy policy and terms with competent legal/compliance review, including applicable Indian data protection and insurer advertising standards. Secure customer consent and avoid sensitive personal details.
- Validate product availability, terms, and any insurer-approved advertising copy at launch. No policy-specific promises are made here.

## Verified public references (27 October 2026)

- Insurer registration and corporate address: https://www.tataaia.com/contact-us.html
- Official plan categories: https://www.tataaia.com/life-insurance-plans.html
- Riders reference: https://www.tataaia.com/life-insurance-plans/life-insurance-riders.html
- Company awards: https://www.tataaia.com/about-us/awards-and-recognition.html

This project is a functional launch foundation, not automatically compliant or fully deployed. The site should not go live for collecting customer information until the launch checklist is completed.
