/**
 * Generates a SHA-256 hash of a given string.
 * @param message The string to hash.
 * @returns A promise that resolves to the hex-encoded SHA-256 hash.
 */
export const sha256 = async (message: string): Promise<string> => {
  // Encode the message as UTF-8
  const msgBuffer = new TextEncoder().encode(message);
  
  // Hash the message using the SubtleCrypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // Convert the ArrayBuffer to an array of bytes
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Convert bytes to a hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};
