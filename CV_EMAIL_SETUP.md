# CV Email Setup Guide

The Download CV feature requires an email service to send CVs to users. Here are setup options:

## Option 1: Resend (Recommended - Easy Setup)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
4. Update `app/api/send-cv/route.ts` with the Resend code (see comments)

## Option 2: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```
4. Install: `npm install @sendgrid/mail`
5. Update `app/api/send-cv/route.ts` with SendGrid code

## Option 3: Nodemailer (Gmail/SMTP)

1. Install: `npm install nodemailer`
2. Add to `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```
3. Update the API route accordingly

## Option 4: Formspree (No Backend Needed)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a form and get the endpoint
3. Update `DownloadCVModal.tsx` to POST directly to Formspree endpoint

## Current Status

The API route currently logs requests to console. Update it with your chosen email service to enable actual email sending.
