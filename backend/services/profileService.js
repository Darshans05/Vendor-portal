/**
 * profileService.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Fetches vendor master data via OData entity: Z_PROFILE_DS
 *
 * SAP OData URL:
 *   Z_PROFILE_DSSet(Lifnr='0000100034')?$format=json
 *
 * Returns a single d object with vendor master fields.
 */

const { odataGet, extractSingle } = require('../utils/odataClient');

/**
 * Pad LIFNR to 10 characters with leading zeros (SAP internal format).
 * e.g. "100000" → "0000100000"
 */
const padLifnr = (lifnr) => String(lifnr).trim().padStart(10, '0');

/**
 * Fetch vendor profile/master data.
 * @param {string} lifnr  Vendor ID (raw or padded)
 * @returns {object}      Vendor profile object
 */
const getProfile = async (lifnr) => {
  try {
    const paddedLifnr = padLifnr(lifnr);
    const entityPath = `/Z_PROFILE_DSSet(Lifnr='${paddedLifnr}')`;

    const response = await odataGet(entityPath);
    return extractSingle(response);
  } catch (error) {
    console.error(`[Profile Error] Failed for ${lifnr}:`, error.message);
    throw new Error(error.sapMessage || error.message || 'Failed to fetch vendor profile');
  }
};

module.exports = { getProfile, padLifnr };
