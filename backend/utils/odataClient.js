/**
 * odataClient.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Reusable axios instance pre-configured for the SAP OData V2 service.
 * All service files import this client instead of building axios calls manually.
 */

const axios = require('axios');

// ─── Create axios instance with SAP base config ───────────────────────────────
const baseURL = (process.env.SAP_ODATA_BASE_URL || '').replace(/\/+$/, '') + '/';

const odataClient = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  auth: {
    username: process.env.SAP_USERNAME,
    password: process.env.SAP_PASSWORD
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// ─── Request Interceptor (logging) ───────────────────────────────────────────
odataClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      // Build full URL for logging
      const bURL = config.baseURL || '';
      const separator = (bURL.endsWith('/') || config.url?.startsWith('/')) ? '' : '/';
      const fullPath = `${bURL}${separator}${config.url}`;
      
      const params = new URLSearchParams(config.params).toString();
      const finalUrl = `${fullPath}${params ? '?' + params : ''}`;
      
      console.log(`[OData →] ${config.method?.toUpperCase()} ${finalUrl}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor (logging) ──────────────────────────────────────────
odataClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[OData ←] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const sapMsg =
      error.response?.data?.error?.message?.value ||
      error.response?.data?.error?.message ||
      error.message ||
      'Unknown SAP error';
    console.error(`[OData ✗] ${error.response?.status || 'NETWORK'} — ${sapMsg}`);
    // Attach a clean message for upstream handlers
    error.sapMessage = sapMsg;
    return Promise.reject(error);
  }
);

/**
 * Perform an OData GET for a list or single entity.
 * @param {string} entityPath  e.g. "Z_VENDORRFQ_DSSet" or "Z_PROFILE_DSSet(Lifnr='...')"
 * @param {object} params      Additional query params (will be merged with $format=json)
 * @returns {Promise<import('axios').AxiosResponse>}
 */
const odataGet = (entityPath, params = {}) => {
  // Clean entityPath to remove leading slash if it exists (since baseURL has a trailing slash)
  const cleanPath = entityPath.startsWith('/') ? entityPath.substring(1) : entityPath;
  
  return odataClient.get(cleanPath, {
    params: { 
      '$format': 'json', 
      'sap-client': '100',
      ...params 
    }
  });
};

/**
 * Perform an OData GET for a binary stream (PDF / media link).
 * @param {string} entityPath  e.g. "Z_VENDORINVOICE_DSSet(Lifnr='...')/$value"
 * @returns {Promise<import('axios').AxiosResponse>}
 */
const odataGetStream = (entityPath, params = {}) => {
  // Clean entityPath to remove leading slash
  const cleanPath = entityPath.startsWith('/') ? entityPath.substring(1) : entityPath;

  return odataClient.get(cleanPath, {
    params: {
      'sap-client': '100',
      ...params
    },
    responseType: 'arraybuffer',
    headers: { Accept: 'application/pdf' }
  });
};

/**
 * Safely extract d.results array from OData list response.
 * Returns [] if SAP returns empty / no results.
 */
const extractResults = (response) => {
  const d = response?.data?.d;
  if (!d) return [];
  
  // Standard OData V2 list format
  if (Array.isArray(d.results)) {
    return d.results;
  }
  
  // Some SAP configurations might return the array directly in 'd'
  if (Array.isArray(d)) {
    return d;
  }

  // Fallback for empty results object
  return [];
};

/**
 * Safely extract single d object from OData single-entity response.
 * Returns {} if not found.
 */
const extractSingle = (response) => {
  return response?.data?.d ?? {};
};

module.exports = { odataClient, odataGet, odataGetStream, extractResults, extractSingle };
