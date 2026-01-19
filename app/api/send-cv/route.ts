import { NextRequest, NextResponse } from 'next/server'

// This is a template API route. You'll need to integrate with an email service.
// Options: Resend, SendGrid, Nodemailer, Formspree, etc.

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // TODO: Integrate with your email service
    // Example with Resend (https://resend.com):
    /*
    import { Resend } from 'resend'
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: email,
      subject: 'Your CV Download - Portfolio',
      html: `
        <h1>Hello ${name}!</h1>
        <p>Thank you for your interest. Please find my CV attached.</p>
        <p>Best regards,<br>Your Name</p>
      `,
      attachments: [
        {
          filename: 'CV.pdf',
          path: '/path/to/your/cv.pdf',
        },
      ],
    })
    */

    // Example with SendGrid:
    /*
    import sgMail from '@sendgrid/mail'
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    
    await sgMail.send({
      to: email,
      from: 'your-email@example.com',
      subject: 'Your CV Download - Portfolio',
      text: `Hello ${name}! Thank you for your interest.`,
      html: `<h1>Hello ${name}!</h1><p>Thank you for your interest.</p>`,
      attachments: [
        {
          content: Buffer.from(cvFile).toString('base64'),
          filename: 'CV.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    })
    */

    // For now, we'll simulate success
    // In production, replace this with actual email sending
    console.log(`CV request from ${name} (${email})`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(
      { 
        success: true, 
        message: 'CV sent successfully',
        // In production, you might want to log this to a database
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending CV:', error)
    return NextResponse.json(
      { error: 'Failed to send CV. Please try again later.' },
      { status: 500 }
    )
  }
}
