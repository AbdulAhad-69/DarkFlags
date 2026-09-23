import fs from "node:fs";

async function verify() {
  const res = await fetch("http://127.0.0.1:8080/");
  console.log("HTTP Status:", res.status);
  const text = await res.text();
  console.log("Byte length:", text.length);

  const checks = [
    ["Verdict headline H1", text.includes('id="heroBadge"')],
    ["Bits value element", text.includes('id="heroBitsVal"')],
    ["Overview counter stripHigh", text.includes('id="stripHigh"')],
    ["Active domain filter wrap", text.includes('id="activeDomainFilterWrap"')],
    ["Network state disabled", text.includes('id="netStateDisabled"')],
    ["Network state active", text.includes('id="netStateActive"')],
    ["Nav rail toggle button", text.includes('id="btnToggleNavRail"')],
    ["Canonical PROBE_META definitions", text.includes('PROBE_META = {')],
    ["Canonical getProbeDefinition()", text.includes('function getProbeDefinition(')],
    ["updateOverviewCounters() call in publish", text.includes('updateOverviewCounters();')],
    ["Separated search input", text.includes('id="probeSearch"')],
    ["Domain filter clear button", text.includes('id="btnClearDomainFilter"')],
    ["Spectrum track", text.includes('id="spectrumTrack"')],
    ["Spectrum live target", text.includes('id="spectrumLiveTarget"')],
    ["Atlas grid", text.includes('id="atlasGrid"')]
  ];

  let passed = 0;
  for (const [desc, ok] of checks) {
    console.log(`${ok ? "PASS" : "FAIL"}: ${desc}`);
    if (ok) passed++;
  }

  console.log(`\nPassed ${passed} of ${checks.length} live server checks.`);
  if (passed !== checks.length) {
    process.exit(1);
  }
}

verify();
