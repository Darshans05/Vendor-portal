/**
 * financeController.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles:
 *   GET /api/finance/invoice/:lifnr
 *   GET /api/finance/payaging/:lifnr
 *   GET /api/finance/cdmemo/:lifnr
 *   GET /api/finance/invoice-pdf/:lifnr
 */

const { getInvoice, getPayAging, getCDMemo, getInvoicePDF } = require('../services/financeService');

const invoiceController = async (req, res) => {
  const { lifnr } = req.params;
  try {
    const data = await getInvoice(lifnr);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const payAgingController = async (req, res) => {
  const { lifnr } = req.params;
  try {
    const data = await getPayAging(lifnr);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cdMemoController = async (req, res) => {
  const { lifnr } = req.params;
  try {
    const data = await getCDMemo(lifnr);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const invoicePdfController = async (req, res) => {
  const { lifnr } = req.params;
  try {
    const pdfBuffer = await getInvoicePDF(lifnr);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice_${lifnr}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { invoiceController, payAgingController, cdMemoController, invoicePdfController };
