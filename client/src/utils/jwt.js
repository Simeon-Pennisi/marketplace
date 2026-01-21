// // Utility functions for decoding JWT tokens and extracting expiry information
// function base64UrlToBase64(base64Url) {
//   // Convert URL-safe chars back to standard Base64 chars
//   let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

//   // Add padding if missing
//   const pad = base64.length % 4;
//   if (pad) base64 += "=".repeat(4 - pad);

//   return base64;
// }

// export function decodeJwt(token) {
//   if (!token) return null;

//   try {
//     const payloadBase64Url = token.split(".")[1];
//     const payloadBase64 = base64UrlToBase64(payloadBase64Url);
//     const payloadJson = atob(payloadBase64);
//     return JSON.parse(payloadJson);
//   } catch {
//     return null;
//   }
// }

// export function getTokenExpiryDate(token) {
//   const payload = decodeJwt(token);
//   if (!payload?.exp) return null;
//   return new Date(payload.exp * 1000);
// }

// export function getTokenRemainingMs(token) {
//   const expiry = getTokenExpiryDate(token);
//   if (!expiry) return null;
//   return expiry.getTime() - Date.now();
// }

function base64UrlToBase64(base64Url) {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);
  return base64;
}

export function decodeJwt(token) {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadBase64Url = parts[1];
    const payloadBase64 = base64UrlToBase64(payloadBase64Url);
    const payloadJson = atob(payloadBase64);

    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export function getTokenExpiryDate(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return null;
  return new Date(payload.exp * 1000);
}
