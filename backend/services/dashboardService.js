/**
 * dashboardService.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Fetches RFQ, PO, and GR data for a vendor via OData $filter queries.
 *
 * SAP OData URLs:
 *   Z_VENDORRFQ_DSSet?$filter=Lifnr eq '0000100034'&$format=json
 *   Z_VENDORPO_DSSet?$filter=Lifnr eq '0000100034'&$format=json
 *   Z_VENDORGR_DSSet?$filter=Lifnr eq '0000100034'&$format=json
 *
 * Each returns response.data.d.results[]
 */

const { odataGet, extractResults } = require('../utils/odataClient');
const { padLifnr } = require('./profileService');

/**
 * Fetch RFQ (Request for Quotation) list for a vendor.
 * Entity: Z_VENDORRFQ_DS
 */
const getRFQ = async (lifnr) => {
  try {
    const paddedLifnr = padLifnr(lifnr);
    const response = await odataGet('Z_VENDORRFQ_DSSet', {
      $filter: `Lifnr eq '${paddedLifnr}'`
    });
    return extractResults(response);
  } catch (error) {
    throw new Error(error.sapMessage || error.message || 'Failed to fetch RFQ data');
  }
};

/**
 * Fetch Purchase Order (PO) list for a vendor.
 * Entity: Z_VENDORPO_DS
 */
const getPO = async (lifnr) => {
  try {
    const paddedLifnr = padLifnr(lifnr);
    // 1st Attempt: Padded LIFNR (SAP Standard)
    try {
      const response = await odataGet('Z_VENDORPO_DSSet', {
        $filter: `Lifnr eq '${paddedLifnr}'`
      });
      return extractResults(response);
    } catch (err) {
      console.warn(`[PO Warning] Padded fetch failed for ${lifnr}, retrying with raw format...`);
      // 2nd Attempt: Raw LIFNR (Gateway Fallback)
      const response = await odataGet('Z_VENDORPO_DSSet', {
        $filter: `Lifnr eq '${lifnr}'`
      });
      return extractResults(response);
    }
  } catch (error) {
    console.error(`[PO Error] Both attempts failed for ${lifnr}:`, error.message);
    throw new Error(error.sapMessage || error.message || 'Failed to fetch PO data');
  }
};

/**
 * Fetch Goods Receipt (GR) list for a vendor.
 * Entity: Z_VENDORGR_DS
 */
const getGR = async (lifnr) => {
  try {
    const paddedLifnr = padLifnr(lifnr);
    const response = await odataGet('Z_VENDORGR_DSSet', {
      $filter: `Lifnr eq '${paddedLifnr}'`
    });
    return extractResults(response);
  } catch (error) {
    throw new Error(error.sapMessage || error.message || 'Failed to fetch GR data');
  }
};

module.exports = { getRFQ, getPO, getGR };
