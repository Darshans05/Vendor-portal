/**
 * financeService.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles Invoice, Pay Aging, Credit/Debit Memo, and Invoice PDF fetching.
 *
 * SAP OData URLs:
 *   Z_VENDORINVOICE_DSSet?$filter=Lifnr eq '0000100034'&$format=json
 *   Z_VENDOR_PAYAGING_DSSet?$filter=Lifnr eq '0000100034'&$format=json
 *   Z_VENDORCDMEMO_DSSet?$filter=Lifnr eq '0000100034'&$format=json
 *   Z_VENDORINVOICE_DSSet(Lifnr='0000100034')/$value   ← PDF stream
 */

const { odataGet, odataGetStream, extractResults } = require('../utils/odataClient');
const { padLifnr } = require('./profileService');

/**
 * Fetch Invoice list for a vendor.
 * Entity: Z_VENDORINVOICE_DS
 */
const getInvoice = async (lifnr) => {
  try {
    const paddedLifnr = padLifnr(lifnr);
    const response = await odataGet('Z_VENDORINVOICE_DSSet', {
      $filter: `Lifnr eq '${paddedLifnr}'`
    });
    return extractResults(response);
  } catch (error) {
    throw new Error(error.sapMessage || error.message || 'Failed to fetch invoice data');
  }
};

/**
 * Fetch Payment Aging data for a vendor.
 * Entity: Z_VENDOR_PAYAGING_DS
 */
const getPayAging = async (lifnr) => {
  try {
    const paddedLifnr = padLifnr(lifnr);
    const response = await odataGet('Z_VENDOR_PAYAGING_DSSet', {
      $filter: `Lifnr eq '${paddedLifnr}'`
    });
    return extractResults(response);
  } catch (error) {
    throw new Error(error.sapMessage || error.message || 'Failed to fetch payment aging data');
  }
};

/**
 * Fetch Credit/Debit Memo list for a vendor.
 * Entity: Z_VENDORCDMEMO_DS
 */
const getCDMemo = async (lifnr) => {
  try {
    const paddedLifnr = padLifnr(lifnr);
    const response = await odataGet('Z_VENDORCDMEMO_DSSet', {
      $filter: `Lifnr eq '${paddedLifnr}'`
    });
    return extractResults(response);
  } catch (error) {
    throw new Error(error.sapMessage || error.message || 'Failed to fetch credit/debit memo data');
  }
};

/**
 * Fetch Invoice PDF as binary buffer.
 * Uses OData media link ($value) or GET_STREAM endpoint.
 * @param {string} lifnr  Vendor ID
 * @returns {Buffer}      PDF binary data
 */
const getInvoicePDF = async (lifnr) => {
  try {
    const paddedLifnr = padLifnr(lifnr);
    // Try OData media link first
    const entityPath = `Z_VENDORINVOICE_DSSet(Lifnr='${paddedLifnr}')/$value`;
    const response = await odataGetStream(entityPath);

    if (!response.data || response.data.byteLength === 0) {
      throw new Error('Empty PDF response from SAP');
    }

    return Buffer.from(response.data);
  } catch (error) {
    throw new Error(error.sapMessage || error.message || 'Failed to fetch invoice PDF');
  }
};

module.exports = { getInvoice, getPayAging, getCDMemo, getInvoicePDF };
