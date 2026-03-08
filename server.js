const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// In-memory storage (in production, use a database)
let bookings = [];
let quotes = [];
let messages = [];
let staffSessions = new Map();

// Staff credentials (in production, hash passwords and use database)
const staffCredentials = {
    'admin': { password: 'aibaba2024', role: 'Administrator', name: 'Admin User' },
    'manager': { password: 'mgr2024', role: 'Manager', name: 'Manager User' },
    'tech': { password: 'tech2024', role: 'Technician', name: 'Tech User' }
};

// Generate session token
function generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Middleware to check staff authentication
function authenticateStaff(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || !staffSessions.has(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.staff = staffSessions.get(token);
    next();
}

// Routes

// Staff login
app.post('/api/staff/login', (req, res) => {
    const { staffId, password } = req.body;

    if (!staffId || !password) {
        return res.status(400).json({ error: 'Staff ID and password required' });
    }

    const staff = staffCredentials[staffId.toLowerCase()];
    if (!staff || staff.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate session token
    const token = generateSessionToken();
    const sessionData = {
        staffId: staffId.toLowerCase(),
        role: staff.role,
        name: staff.name,
        loginTime: new Date().toISOString()
    };

    staffSessions.set(token, sessionData);

    // Auto-expire session after 8 hours
    setTimeout(() => {
        staffSessions.delete(token);
    }, 8 * 60 * 60 * 1000);

    res.json({
        success: true,
        token,
        staff: sessionData
    });
});

// Staff logout
app.post('/api/staff/logout', authenticateStaff, (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    staffSessions.delete(token);
    res.json({ success: true });
});

// Handle contact form submissions
app.post('/api/contact', (req, res) => {
  const contactData = req.body;

  // Generate unique message ID
  const messageId = 'MSG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

  // Add metadata
  contactData.id = messageId;
  contactData.submittedAt = new Date().toISOString();
  contactData.status = 'pending';
  contactData.timeAgo = 'Just now';

  // Store message
  messages.push(contactData);
  console.log('New contact message received:', contactData);

  res.json({ 
    success: true, 
    messageId: messageId,
    message: 'Contact message submitted successfully' 
  });
});

// Handle booking submissions
app.post('/api/bookings', (req, res) => {
  const bookingData = req.body;

  // Generate unique booking ID
  const bookingId = 'BKG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

  // Add metadata
  bookingData.id = bookingId;
  bookingData.submittedAt = new Date().toISOString();
  bookingData.status = 'pending';
  bookingData.timeAgo = 'Just now';

  // Store booking
  bookings.push(bookingData);

  console.log('New booking received:', bookingData);

  res.json({ 
    success: true, 
    bookingId: bookingId,
    message: 'Booking submitted successfully' 
  });
});

// Handle quote submissions
app.post('/api/quotes', (req, res) => {
  const quoteData = req.body;

  // Generate unique quote ID
  const quoteId = 'QTE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

  // Add metadata
  quoteData.id = quoteId;
  quoteData.submittedAt = new Date().toISOString();
  quoteData.status = 'pending';
  quoteData.timeAgo = 'Just now';

  // Store quote
  quotes.push(quoteData);

  console.log('New quote received:', quoteData);

  res.json({ 
    success: true, 
    quoteId: quoteId,
    message: 'Quote request submitted successfully' 
  });
});

// Get dashboard data
app.get('/api/staff/dashboard', authenticateStaff, (req, res) => {
    const today = new Date().toDateString();
    const todayBookings = bookings.filter(b => 
        new Date(b.submittedAt).toDateString() === today
    ).length;

    const monthlyRevenue = bookings
        .filter(b => b.status === 'completed' && 
            new Date(b.submittedAt).getMonth() === new Date().getMonth())
        .reduce((sum, b) => {
            const packagePrices = { '3windows': 300, '5windows': 325, '7windows': 375 };
            return sum + (packagePrices[b.package] || 0);
        }, 0);

    const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
    const totalMessages = messages.length;

    res.json({
        todayBookings,
        monthlyRevenue,
        customerSatisfaction: 98,
        pendingQuotes,
        totalMessages,
        recentActivity: [
            ...bookings.slice(-3).map(b => ({
                type: 'booking',
                message: `New booking: ${b.name} - ${b.vehicleDetails}`,
                time: b.submittedAt
            })),
            ...quotes.slice(-3).map(q => ({
                type: 'quote',
                message: `Quote request: ${q.name} - ${q.vehicleMake} ${q.vehicleModel}`,
                time: q.submittedAt
            })),
            ...messages.slice(-3).map(m => ({
                type: 'contact',
                message: `Contact message: ${m.name} - ${m.message.substring(0, 50)}...`,
                time: m.submittedAt
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
    });
});

// Get all bookings for staff
app.get('/api/staff/bookings', authenticateStaff, (req, res) => {
    res.json({
        bookings: bookings.map(booking => ({
            ...booking,
            timeAgo: getTimeAgo(booking.submittedAt)
        }))
    });
});

// Get all quotes for staff
app.get('/api/staff/quotes', authenticateStaff, (req, res) => {
    res.json({
        quotes: quotes.map(quote => ({
            ...quote,
            timeAgo: getTimeAgo(quote.submittedAt)
        }))
    });
});

// Get all messages for staff
app.get('/api/staff/messages', authenticateStaff, (req, res) => {
    res.json({
        messages: messages.map(message => ({
            ...message,
            timeAgo: getTimeAgo(message.submittedAt)
        }))
    });
});

// Update booking status
app.patch('/api/staff/bookings/:id', authenticateStaff, (req, res) => {
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id);
    if (bookingIndex === -1) {
        return res.status(404).json({ error: 'Booking not found' });
    }

    bookings[bookingIndex] = { 
        ...bookings[bookingIndex], 
        ...req.body,
        updatedBy: req.staff.staffId,
        updatedAt: new Date().toISOString()
    };

    res.json({ success: true, booking: bookings[bookingIndex] });
});

// Update quote status and price
app.patch('/api/staff/quotes/:id', authenticateStaff, (req, res) => {
    const quoteIndex = quotes.findIndex(q => q.id === req.params.id);
    if (quoteIndex === -1) {
        return res.status(404).json({ error: 'Quote not found' });
    }

    quotes[quoteIndex] = { 
        ...quotes[quoteIndex], 
        ...req.body,
        updatedBy: req.staff.staffId,
        updatedAt: new Date().toISOString()
    };

    res.json({ success: true, quote: quotes[quoteIndex] });
});

// Helper function to calculate time ago
function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
}

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve staff dashboard
app.get('/staff-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'staff-dashboard.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI BABA Server running on http://0.0.0.0:${PORT}`);
    console.log('Staff Portal: Professional backend system activated');
});