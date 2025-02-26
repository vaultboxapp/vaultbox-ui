import { Buffer } from 'buffer'; // Import Buffer
import * as kyber from 'crystals-kyber-js';

// Function to convert Uint8Array to base64
function uint8ArrayToBase64(uint8Array) {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
}

async function generateKyber768KeyPair() { // Marked as async because generateKeyPair is likely async
    try {
        console.log("Available in kyber:", Object.keys(kyber));

        // Access the correct module: MlKem768
        const MlKem768 = kyber.MlKem768; // Access the CLASS

        if (!MlKem768) {
            throw new Error("MlKem768 module not found in the library");
        }

        console.log("MlKem768:", MlKem768); // Inspect this!

        // 1. Instantiate the class
        const kyber768Instance = new MlKem768();

        // 2. Call generateKeyPair() on the instance
        const keyPair = await kyber768Instance.generateKeyPair(); // Store the entire return value

        console.log("keyPair:", keyPair); // Inspect this!

        // Extract keys from the array
        const pk = keyPair[0]; // Public key as Uint8Array
        const sk = keyPair[1]; // Private key as Uint8Array

        // Convert Uint8Array to base64
        const publicKey = uint8ArrayToBase64(pk);
        const privateKey = uint8ArrayToBase64(sk);

        console.log("Keys generated successfully");
        return { publicKey, privateKey };

    } catch (error) {
        console.error("Error generating Kyber keys:", error);
        throw error;
    }
}

export { generateKyber768KeyPair };
