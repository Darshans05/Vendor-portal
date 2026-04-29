/**
 * authService.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles vendor login via OData entity: Z_VENDORLOGIN_DS
 *
 * SAP OData URL:
 *   Z_VENDORLOGIN_DSSet(Lifnr='100000',Password='CHENNAI@123')?$format=json
 *
 * Expected Response (d object):
 *   { Lifnr: '100000', Password: '...', Status: 'Success' }
 */

const { odataGet, extractSingle } = require('../utils/odataClient');
const { padLifnr } = require('./profileService');

/**
 * Authenticate a vendor against SAP.
 * @param {string} lifnr     Raw vendor ID (e.g. "100000")
 * @param {string} password  Vendor password
 * @returns {{ success: boolean, lifnr: string, message: string }}
 */
const login = async (lifnr, password) => {
  try {
    const paddedLifnr = padLifnr(lifnr);
    // Build OData key predicate for login entity
    const entityPath = `Z_VENDORLOGIN_DSSet(Lifnr='${encodeURIComponent(paddedLifnr)}',Password='${encodeURIComponent(password)}')`;

    const response = await odataGet(entityPath);
    const data = extractSingle(response);

    console.log('[Auth] SAP login response:', JSON.stringify(data));

    const status = data?.Status ?? data?.STATUS ?? '';

    if (status === 'Success' || status === 'SUCCESS' || status === 'S' || status === 's') {
      return {
        success: true,
        lifnr: lifnr,
        message: data?.Message || data?.MESSAGE || 'Login successful'
      };
    } else {
      const errMsg = data?.Message || data?.MESSAGE || 'Invalid credentials';
      throw new Error(errMsg);
    }
  } catch (error) {
    // Re-throw with SAP-specific message if available
    throw new Error(error.sapMessage || error.message || 'Login failed');
  }
};

module.exports = { login };
