// Disable SSL certificate validation for SAP HTTP (non-HTTPS) connections
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.set('etag', false); // Disable ETag to prevent 304 Not Modified
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Disable all caching for API routes
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// ─── Root Route ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1 style="color: #1a56db;">Vendor Portal API is running</h1>
      <p>Base URL: <code>/api</code></p>
      <p>Status: <span style="color: green; font-weight: bold;">Online</span></p>
    </div>
  `);
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Vendor Portal Middleware',
    timestamp: new Date().toISOString(),
    port: PORT,
    sap_odata: process.env.SAP_ODATA_BASE_URL ? 'Configured' : 'Missing'
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message || 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Vendor Portal Backend running on http://localhost:${PORT}`);
  console.log(`   SAP OData Base: ${process.env.SAP_ODATA_BASE_URL}`);
});
