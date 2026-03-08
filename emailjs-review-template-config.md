
# EmailJS Review Request Template Configuration

## Template ID: template_gxa6yio

### Template Variables to Set in EmailJS Dashboard:

**Subject:** 🌟 How was your AI BABA AUTO DETAILING AND TINTING experience, {{to_name}}?

**HTML Content:** 
Use the content from `email-feedback-template.html` and replace the following placeholders:

- `{{service_date}}` → `{{service_date}}`
- `{{service_type}}` → `{{service_type}}`
- `{{customer_name}}` → `{{to_name}}`
- `{{customer_email}}` → `{{to_email}}`
- `{{review_link}}` → `{{review_link}}`
- `{{unsubscribe_link}}` → `{{user_unsubscribe}}`

### Template Parameters to Send from JavaScript:

```javascript
const templateParams = {
    to_name: 'Customer Name',
    to_email: 'customer@email.com',
    service_date: '2024-01-15',
    service_type: 'Premium Ceramic Tinting',
    review_link: 'https://your-domain.com/review.html',
    company_name: 'AI BABA AUTO DETAILING AND TINTING',
    company_phone: '+1 (437) 545-7974',
    company_address: '127 Manville Road, Unit 1, Scarborough, ON'
};
```

### Features:
- ⭐ Interactive star rating (1-5 stars)
- 🎨 Brand-consistent design with AI BABA colors
- 📱 Mobile-responsive layout
- 🔗 Direct links to review page with pre-filled data
- ✨ Hover effects and smooth animations
- 🏢 Complete business information
- 📧 Professional email formatting

### Integration:
This template integrates with your existing review system in `review.html` and can be triggered from the staff dashboard's "Ask for Review" section.
