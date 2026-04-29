/**
 * api.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Central API router for the Vendor Portal middleware.
 *
 * Routes:
 *   POST   /api/login
 *   GET    /api/profile/:lifnr
 *   GET    /api/dashboard/rfq/:lifnr
 *   GET    /api/dashboard/po/:lifnr
 *   GET    /api/dashboard/gr/:lifnr
 *   GET    /api/finance/invoice/:lifnr
 *   GET    /api/finance/payaging/:lifnr
 *   GET    /api/finance/cdmemo/:lifnr
 *   GET    /api/finance/invoice-pdf/:lifnr
 */

const express = require('express');
const router = express.Router();

// ─── Controllers ──────────────────────────────────────────────────────────────
const { loginController } = require('../controllers/authController');
const { getProfileHandler } = require('../controllers/profileController');
const { rfqController, poController, grController } = require('../controllers/dashboardController');
const { invoiceController, payAgingController, cdMemoController, invoicePdfController } = require('../controllers/financeController');

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post('/login', loginController);

// ─── Profile ──────────────────────────────────────────────────────────────────
router.get('/profile/:lifnr', getProfileHandler);

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get('/dashboard/rfq/:lifnr', rfqController);
router.get('/dashboard/po/:lifnr', poController);
router.get('/dashboard/gr/:lifnr', grController);

// ─── Finance ──────────────────────────────────────────────────────────────────
router.get('/finance/invoice/:lifnr', invoiceController);
router.get('/finance/payaging/:lifnr', payAgingController);
router.get('/finance/cdmemo/:lifnr', cdMemoController);
router.get('/finance/invoice-pdf/:lifnr/:belnr', invoicePdfController);

module.exports = router;
