/**
 * authController.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles POST /api/login
 */

const { login } = require('../services/authService');

const loginController = async (req, res) => {
  const { lifnr, password } = req.body;

  if (!lifnr || !password) {
    return res.status(400).json({
      success: false,
      message: 'LIFNR (Vendor ID) and Password are required'
    });
  }

  try {
    const result = await login(lifnr.trim(), password);
    return res.status(200).json({
      success: true,
      message: result.message,
      lifnr: result.lifnr
    });
  } catch (error) {
    console.error('[Login Error]', error.message);
    return res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

module.exports = { loginController };
