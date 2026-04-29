/**
 * profileController.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles GET /api/profile/:lifnr
 */

const { getProfile } = require('../services/profileService');

const getProfileHandler = async (req, res) => {
  try {
    const lifnr = req.params.lifnr;

    const data = await getProfile(lifnr);

    res.json(data); // 🔥 VERY IMPORTANT

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProfileHandler };
