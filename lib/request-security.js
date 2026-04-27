const dns = require('dns').promises;
const net = require('net');
const ipaddr = require('ipaddr.js');

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const BLOCKED_HOSTS = new Set(['localhost', 'localhost.localdomain']);
const MIN_DIMENSION = 100;
const MAX_DIMENSION = 2000;
const MAX_URL_LENGTH = 2048;

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function normalizeHostname(hostname) {
  return hostname
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .replace(/\.$/, '')
    .toLowerCase();
}

function isPublicAddress(address) {
  if (!ipaddr.isValid(address)) {
    return false;
  }

  const parsed = ipaddr.parse(address);

  if (parsed.kind() === 'ipv6' && parsed.isIPv4MappedAddress()) {
    return isPublicAddress(parsed.toIPv4Address().toString());
  }

  return parsed.range() === 'unicast';
}

async function resolveHostAddresses(hostname) {
  if (net.isIP(hostname)) {
    return [hostname];
  }

  const records = await dns.lookup(hostname, {
    all: true,
    verbatim: true
  });

  return records.map((record) => record.address);
}

async function assertPublicHttpUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || rawUrl.trim().length === 0 || rawUrl.length > MAX_URL_LENGTH) {
    throw badRequest('invalid url');
  }

  let url;

  try {
    url = new URL(rawUrl);
  } catch (e) {
    throw badRequest('invalid url');
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw badRequest('only http and https urls are allowed');
  }

  if (url.username || url.password) {
    throw badRequest('url credentials are not allowed');
  }

  const hostname = normalizeHostname(url.hostname);

  if (BLOCKED_HOSTS.has(hostname) || hostname.endsWith('.localhost')) {
    throw badRequest('local urls are not allowed');
  }

  const addresses = await resolveHostAddresses(hostname);

  if (addresses.length === 0 || addresses.some((address) => !isPublicAddress(address))) {
    throw badRequest('private or reserved hosts are not allowed');
  }

  return url;
}

function parseScreenshotDimension(value, fallback, fieldName) {
  const dimension = value === undefined || value === ''
    ? Number(fallback)
    : Number(value);

  if (!Number.isFinite(dimension)) {
    throw badRequest(`${fieldName} must be a number`);
  }

  const rounded = Math.floor(dimension);

  if (rounded < MIN_DIMENSION || rounded > MAX_DIMENSION) {
    throw badRequest(`${fieldName} must be between ${MIN_DIMENSION} and ${MAX_DIMENSION}`);
  }

  return rounded;
}

module.exports = {
  assertPublicHttpUrl,
  parseScreenshotDimension
};
