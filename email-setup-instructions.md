# EmailJS Setup Instructions for AI BABA AUTO DETAILING AND TINTING

## Current Setup Status: ✅ CONFIGURED

### Your EmailJS Configuration:
- **Service ID:** service_ncbdkar
- **Booking/Quote Template ID:** template_0juuvi8 (for bookings and quotes)
- **Contact Template ID:** template_k76wbuh (for contact messages)
- **Public Key:** Hv_nsHADG1EbCkUIQ

## Email Template Setup

You are currently using **two templates**:
- **template_0juuvi8** for booking and quote confirmations
- **template_k76wbuh** for contact message confirmations

### Template Variables Used:
The system sends different information based on the type of request:

**For Bookings:**
- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{booking_id}}` - Unique booking ID
- `{{package}}` - Selected package
- `{{date}}` - Booking date
- `{{time}}` - Booking time
- `{{vehicle_details}}` - Vehicle information
- `{{phone}}` - Customer phone

**For Quotes:**
- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{quote_id}}` - Unique quote ID
- `{{vehicle_year}}` - Vehicle year
- `{{vehicle_make}}` - Vehicle make
- `{{vehicle_model}}` - Vehicle model
- `{{service_type}}` - Type of service requested
- `{{tint_shade}}` - Requested tint shade
- `{{phone}}` - Customer phone

**For Contact Messages:**
- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{message_id}}` - Unique message ID
- `{{original_message}}` - Customer's message
- `{{phone}}` - Customer phone

**Company Information (available in all):**
- `{{company_name}}` - AI BABA AUTO DETAILING AND TINTING
- `{{company_phone}}` - +1 (437) 545-7974
- `{{company_address}}` - 127 Manville Road, Unit 1, Scarborough, ON

## Recommended Template Content

Your template should be flexible enough to handle all three types. Here's a suggested template:

**Subject:** {{#booking_id}}Booking Confirmation{{/booking_id}}{{#quote_id}}Quote Request Received{{/quote_id}}{{#message_id}}Message Received{{/message_id}} - AI BABA AUTO DETAILING AND TINTING

**Content:**
```
Dear {{to_name}},

Thank you for contacting AI BABA AUTO DETAILING AND TINTING!

{{#booking_id}}
🎉 BOOKING CONFIRMED
Booking ID: {{booking_id}}
Package: {{package}}
Date: {{date}}
Time: {{time}}
Vehicle: {{vehicle_details}}

We'll call you within 2 hours to confirm all details.
{{/booking_id}}

{{#quote_id}}
💰 QUOTE REQUEST RECEIVED
Quote ID: {{quote_id}}
Vehicle: {{vehicle_year}} {{vehicle_make}} {{vehicle_model}}
Service: {{service_type}}
Tint Shade: {{tint_shade}}

You'll receive your detailed quote within 1-2 hours.
{{/quote_id}}

{{#message_id}}
💌 MESSAGE RECEIVED
Message ID: {{message_id}}
Your Message: "{{original_message}}"

Our team will respond within 24 hours.
{{/message_id}}

📞 Contact: {{phone}}
📧 Email: {{to_email}}

COMPANY INFO:
🏢 {{company_address}}
📱 {{company_phone}}
🕒 Hours: Monday-Sunday 10 AM - 9 PM

Thank you for choosing {{company_name}}!

Best regards,
AI BABA AUTO DETAILING AND TINTING Team
```

## System Status: 
✅ **FULLY CONFIGURED** - Your email confirmation system is now ready and will automatically send confirmations for all bookings, quotes, and contact messages!

## Testing:
1. Submit a test booking/quote/contact form
2. Check your email (including spam folder)
3. Verify all information appears correctly
4. Monitor EmailJS dashboard for delivery status

**Note:** EmailJS free plan allows 200 emails per month. Monitor your usage in the EmailJS dashboard.