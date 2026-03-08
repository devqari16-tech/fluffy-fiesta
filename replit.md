# AI BABA Services Inc - Window Tinting & Auto Detailing Website

## Overview

This is a multi-service business website for AI BABA Services Inc, a Toronto-based company offering window tinting, car detailing, ceramic coating, and commercial/residential window film services. The site includes a customer-facing booking and quote system, a staff dashboard for business management, and email notification integrations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static HTML Pages**: Multi-page architecture with separate HTML files for each service (window-tinting.html, detailing.html, ceramic-coating.html, commercial-residential.html)
- **CSS Framework**: Custom CSS with CSS variables for theming (style.css), using Poppins font family
- **JavaScript**: Vanilla JavaScript for interactivity (script.js), no frontend framework
- **UI Components**: Mobile-responsive navigation with hamburger menu, service selector page, pricing sections, booking forms

### Backend Architecture
- **Server**: Express.js server (server.js) running on port 5000
- **Data Storage**: In-memory storage for bookings, quotes, messages, and staff sessions (suitable for development; needs database for production)
- **Authentication**: Session-based staff authentication with token generation using crypto module
- **Staff Roles**: Three-tier role system (Administrator, Manager, Technician) with hardcoded credentials

### Key Pages and Purpose
- **index.html**: Main landing page with business overview and SEO optimization
- **service-selector.html**: Interactive service selection interface
- **staff-dashboard.html**: Admin panel for managing bookings, quotes, and customer data
- **review.html / reviews-page.html**: Customer review submission and display system
- **simulator.html**: Window tinting visualization tool
- **reset-password.html**: Staff password reset functionality

### Design Patterns
- CSS custom properties (variables) for consistent theming across pages
- Responsive design with mobile-first approach using media queries
- Schema.org structured data for SEO optimization on all service pages
- Modular page structure with consistent header/footer components

## External Dependencies

### Third-Party Services
- **EmailJS**: Email notification service for booking confirmations, quotes, and review requests
  - Service ID: service_ncbdkar
  - Multiple templates for different email types (bookings, quotes, contacts, reviews)
  - Public Key: Hv_nsHADG1EbCkUIQ

### CDN Dependencies
- **Google Fonts**: Poppins font family
- **Font Awesome 6.0.0**: Icon library
- **GTranslate**: Multi-language translation widget

### SEO Integrations
- Google Search Console verification (google936ba2f2d835f16b.html)
- Structured data (Schema.org) for LocalBusiness and Service types
- robots.txt and sitemap.xml for search engine crawling

### No Database Currently
The application uses in-memory storage. For production deployment, a persistent database solution should be implemented to store:
- Customer bookings and quotes
- Staff credentials (currently hardcoded)
- Session management
- Review data