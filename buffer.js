// buffer.js
import { Buffer } from "https://jspm.dev/buffer";
window.Buffer = Buffer;
globalThis.Buffer = Buffer;
console.log("✅ Buffer polyfill ready");
