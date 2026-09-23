import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

const requiredChecks = [
  ["Accessible Skip Link", 'class="skip-link"'],
  ["App Header Brand & Logo", 'src="/logo.png"'],
  ["Quiet Header Tagline", 'class="header-tagline"'],
  ["Header Status Pill", 'id="globalStatusPill"'],
  ["Header Re-run Action", 'id="btnRerun"'],
  ["68px Icon Navigation Rail", 'class="nav-rail"'],
  ["Rail SVG Technical Icons", html.includes('<svg') && html.includes('Overview')],
  ["Layer 1 Diagnostic Readout", 'class="diagnostic-readout"'],
  ["Distinctiveness Verdict Badge", 'id="heroBadge"'],
  ["Entropy Bits Metric", 'id="heroBits"'],
  ["Model Caveat Notice", "MODEL ESTIMATE"],
  ["Measurement Strip (Typographic)", 'class="measurement-strip"'],
  ["Tier Hashes Strip", 'class="tier-hashes-strip"'],
  ["Hardware Hash Cell", 'id="hashHw"'],
  ["Fingerprint Signal Map Spectrum", 'id="spectrumTrack"'],
  ["Signal Map Live Readout", 'id="spectrumLiveTarget"'],
  ["Layer 2 Distinctiveness Drivers", 'id="contributors"'],
  ["Contributors Ordered List", 'id="contributorsList"'],
  ["Editorial Scientific Context", 'class="editorial-context"'],
  ["Layer 3 Exposure Atlas", 'id="exposure-atlas"'],
  ["Exposure Atlas Grid", 'id="atlasGrid"'],
  ["Layer 4 Forensic Evidence Workspace", 'id="evidence-workspace"'],
  ["Search Bar", 'id="probeSearch"'],
  ["Filter Pills Group", 'data-filter="all"'],
  ["Sort Selector", 'id="sortSelect"'],
  ["Evidence Table Body", 'id="evidenceTableBody"'],
  ["Section 5 Network Disclosure", 'id="network-disclosure"'],
  ["Pre-Flight Disclosure Box", 'class="preflight-box"'],
  ["Network Run Action", 'id="btnRunNetworkLookups"'],
  ["Network Local-Only Action", 'id="btnKeepLocalOnly"'],
  ["Network Telemetry Grid", 'class="net-telemetry-grid"'],
  ["Section 6 Methodology Accordion", 'id="methodology"'],
  ["Methodology Accordion Triggers", 'class="accordion-trigger"'],
  ["Evidence Inspector Drawer", 'id="probeInspector"'],
  ["Inspector Close Action", 'id="inspectCloseBtn"'],
  ["Inspector Observed Readout", 'id="inspectObserved"'],
  ["Inspector Technical Audit Grid", 'id="inspectMethod"'],
  ["Inspector Raw Telemetry Body", 'id="inspectEvidenceBody"'],
  ["Collection Code Viewer", 'id="inspectCodePre"'],
  ["Inspector Copy Values Action", 'id="btnCopyEvidenceValues"'],
  ["Inspector Copy JSON Action", 'id="btnCopyEvidenceJson"'],
  ["Inspector Share Link Action", 'id="btnCopyShareLink"']
];

console.log("=== FORENSIC OBSERVATORY ARCHITECTURAL VERIFICATION ===");
let failed = 0;
for (const [desc, snippet] of requiredChecks) {
  const pass = html.includes(snippet);
  console.log(`${pass ? "PASS" : "FAIL"}: ${desc}`);
  if (!pass) failed++;
}

// Verify all 33 probes
const allProbesPresent = Array.from({ length: 33 }, (_, i) => String(i + 1).padStart(2, "0"))
  .every(num => html.includes(`reg("${num}"`));
console.log(`${allProbesPresent ? "PASS" : "FAIL"}: All 33 Probes Intact (reg 01 through reg 33)`);
if (!allProbesPresent) failed++;

// Verify 12 functional domains in PROBE_META
const domains = [
  "Navigator & Platform", "Graphics & Rendering", "Audio & Speech", "Screen & Display",
  "Fonts & Typography", "Media & Codecs", "Storage & Cookies", "Permissions & APIs",
  "Environment & Math", "Input & Behavioral", "Defense & Hardening", "Network & Leaks"
];
const allDomainsPresent = domains.every(d => html.includes(d));
console.log(`${allDomainsPresent ? "PASS" : "FAIL"}: All 12 Functional Domain Taxonomies Intact`);
if (!allDomainsPresent) failed++;

console.log("\n========================================================");
if (failed === 0) {
  console.log("SUCCESS: All 44 Forensic Observatory structural & probe verifications passed!");
} else {
  console.error(`FAILED: ${failed} checks failed.`);
  process.exit(1);
}

// Live Server Verification
try {
  const res = await fetch("http://127.0.0.1:8080/");
  console.log(`\nLive Server HTTP Status: ${res.status}`);
  const text = await res.text();
  console.log(`Live Server Served Bytes: ${text.length}`);
  console.log(`Live Server Contains Signal Map: ${text.includes('id="spectrumTrack"')}`);
  console.log(`Live Server Contains Pre-Flight Disclosure: ${text.includes('class="preflight-box"')}`);
  console.log(`Live Server Contains Inspector Code Viewer: ${text.includes('id="inspectCodePre"')}`);
} catch (e) {
  console.log(`Server fetch note: ${e.message}`);
}
