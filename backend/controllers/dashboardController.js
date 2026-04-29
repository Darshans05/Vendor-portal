/**
 * dashboardController.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles:
 *   GET /api/dashboard/rfq/:lifnr
 *   GET /api/dashboard/po/:lifnr
 *   GET /api/dashboard/gr/:lifnr
 */

const { getRFQ, getPO, getGR } = require('../services/dashboardService');

const rfqController = async (req, res) => {
  const { lifnr } = req.params;
  try {
    const data = await getRFQ(lifnr);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const poController = async (req, res) => {
  const { lifnr } = req.params;
  try {
    const data = await getPO(lifnr);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const grController = async (req, res) => {
  const { lifnr } = req.params;
  try {
    const data = await getGR(lifnr);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { rfqController, poController, grController };
