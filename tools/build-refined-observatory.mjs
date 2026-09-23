import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const htmlOriginal = fs.readFileSync("index.html", "utf8");

// Extract the exact 33 probes slice
const p01 = htmlOriginal.indexOf("/* ============================================================\n   01 · NAVIGATOR CORE") !== -1
  ? htmlOriginal.indexOf("/* ============================================================\n   01 · NAVIGATOR CORE")
  : htmlOriginal.indexOf("/* ============================================================\r\n   01 · NAVIGATOR CORE");

const endMarker = "function chip(o){";
const pEnd = htmlOriginal.indexOf(endMarker);

if (p01 === -1 || pEnd === -1) {
  console.error("Could not find probe slice boundaries!");
  process.exit(1);
}

const probeImplementationsSlice = htmlOriginal.slice(p01, pEnd);

// Read guide.html or favicon if needed
console.log(`Probe slice extracted: ${probeImplementationsSlice.length} bytes.`);

// Assemble refined index.html
const refinedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dark Flags — Forensic Browser Diagnostic & Fingerprint Observatory</title>
  <meta name="description" content="A clinical, zero-dependency forensic instrument that measures 33 browser attack surfaces, quantifies information entropy, and maps your device fingerprint.">

  <!-- Open Graph / Meta -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Dark Flags — Forensic Browser Diagnostic">
  <meta property="og:description" content="Clinical browser fingerprinting observatory. 33 measured surfaces, entropy quantification, zero tracking.">
  <meta property="og:image" content="/og.png">

  <!-- Favicons -->
  <link rel="icon" type="image/png" href="/logo.png">

  <!-- Typography: Google Sans (Proportional UI) & Google Sans Code (Monospace Evidence) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Google+Sans+Code:wght@400;500;600&display=swap" rel="stylesheet">

  <style>
    /* ============================================================
       DARK FLAGS: FORENSIC OBSERVATORY DESIGN SYSTEM
       Aesthetic: Leica Optical Equipment · Chrome DevTools
       WCAG 2.2 AA Verified · Pure CSS
       ============================================================ */
    :root {
      color-scheme: dark;
      --bg-primary: #080B0F;
      --surface: #0E141B;
      --surface-raised: #141B24;
      --surface-subtle: #0B0F15;
      --border: #2A3542;
      --border-soft: #1B2430;
      --border-focus: #84B9FF;

      --text-primary: #F1F4F7;
      --text-secondary: #A9B5C4;
      --text-tertiary: #8290A0;

      --distinct-high: #FF6B6F;
      --distinct-high-bg: rgba(255, 107, 111, 0.12);
      --distinct-high-border: rgba(255, 107, 111, 0.28);

      --distinct-med: #F2B544;
      --distinct-med-bg: rgba(242, 181, 68, 0.12);
      --distinct-med-border: rgba(242, 181, 68, 0.28);

      --distinct-low: #42D3AE;
      --distinct-low-bg: rgba(66, 211, 174, 0.12);
      --distinct-low-border: rgba(66, 211, 174, 0.28);

      --info-blue: #84B9FF;
      --info-blue-bg: rgba(132, 185, 255, 0.12);

      --font-ui: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --font-mono: 'Google Sans Code', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

      --radius-xs: 2px;
      --radius-sm: 4px;
      --radius-md: 6px;
    }

    /* SLEEK LEICA DARK SCROLLBARS (ELIMINATES CLUNKY WHITE OS SCROLLBARS) */
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent;
    }
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--text-tertiary);
    }
    ::-webkit-scrollbar-corner {
      background: transparent;
    }

    /* HIGH VISIBILITY / ACCESSIBILITY MODE */
    body.hivis {
      --bg-primary: #000000;
      --surface: #0a0a0a;
      --surface-raised: #151515;
      --border: #555555;
      --border-soft: #333333;
      --text-primary: #FFFFFF;
      --text-secondary: #CCCCCC;
      --text-tertiary: #AAAAAA;
      --distinct-high: #FF7777;
      --distinct-med: #FFCC00;
      --distinct-low: #00FFCC;
      --info-blue: #99CCFF;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      font-size: 14px;
      scroll-behavior: smooth;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      overflow-x: hidden;
      max-width: 100vw;
    }

    body {
      font-family: var(--font-ui);
      font-size: 13px;
      line-height: 1.5;
      background: var(--bg-primary);
      color: var(--text-primary);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      max-width: 100vw;
    }

    /* WCAG 2.2 AA Focus Indicators */
    :focus-visible {
      outline: 2px solid var(--border-focus);
      outline-offset: 2px;
    }

    /* Accessible Skip Link */
    .skip-link {
      position: absolute;
      top: -60px;
      left: 12px;
      background: var(--info-blue);
      color: #000;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      z-index: 10000;
      text-decoration: none;
      transition: top 0.15s ease-out;
    }
    .skip-link:focus {
      top: 12px;
    }

    /* Typography Utilities */
    .font-mono {
      font-family: var(--font-mono);
    }

    /* ============================================================
       TOP HEADER: COMPACT OBSERVATORY APPARATUS BAR
       Height: 56px · Fixed · High Contrast
       ============================================================ */
    .app-header {
      height: 56px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      gap: 16px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .header-brand {
      display: flex;
      align-items: center;
      text-decoration: none;
      flex-shrink: 0;
    }
    .header-logo {
      height: 38px;
      width: auto;
      max-width: 180px;
      object-fit: contain;
      display: block;
    }

    .header-tagline {
      font-size: 11px;
      color: var(--text-tertiary);
      border-left: 1px solid var(--border);
      padding-left: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media (max-width: 768px) {
      .header-tagline {
        display: none;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .header-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      background: var(--surface-raised);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 11px;
      color: var(--text-secondary);
    }
    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--distinct-low);
    }
    .status-dot.probing {
      background: var(--distinct-med);
    }
    .status-dot.idle {
      background: var(--text-tertiary);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-family: var(--font-ui);
      font-size: 12px;
      font-weight: 500;
      padding: 4px 10px;
      height: 28px;
      background: var(--surface-raised);
      color: var(--text-primary);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      text-decoration: none;
      transition: background 0.1s, border-color 0.1s, color 0.1s;
    }
    .btn:hover {
      background: var(--border);
      border-color: var(--text-tertiary);
    }
    .btn:active {
      transform: translateY(1px);
    }
    .btn-primary {
      background: var(--info-blue-bg);
      border-color: var(--info-blue);
      color: var(--info-blue);
      font-weight: 600;
    }
    .btn-primary:hover {
      background: var(--info-blue);
      color: #000;
    }
    .btn-ghost {
      background: transparent;
      border-color: transparent;
      color: var(--text-secondary);
    }
    .btn-ghost:hover {
      background: var(--surface-raised);
      color: var(--text-primary);
    }
    .btn-warning {
      background: var(--distinct-high-bg);
      border-color: var(--distinct-high-border);
      color: var(--distinct-high);
      font-weight: 600;
    }
    .btn-warning:hover {
      background: var(--distinct-high);
      color: #000;
    }

    /* Menu Dropdown */
    .menu-wrap {
      position: relative;
    }
    .menu-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      width: 220px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
      display: none;
      flex-direction: column;
      z-index: 1000;
      padding: 4px 0;
    }
    .menu-dropdown.open {
      display: flex;
    }
    .dropdown-item {
      padding: 6px 12px;
      font-size: 12px;
      color: var(--text-secondary);
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .dropdown-item:hover {
      background: var(--surface-raised);
      color: var(--text-primary);
    }
    .dropdown-sep {
      height: 1px;
      background: var(--border-soft);
      margin: 4px 0;
    }

    /* ============================================================
       APPLICATION WORKSPACE LAYOUT
       Nav Rail (Left) + Analytical Main Stage (Right)
       ============================================================ */
    .app-layout {
      display: flex;
      flex: 1;
      min-height: calc(100vh - 56px);
      position: relative;
    }

    /* Expandable Navigation Rail */
    .nav-rail {
      width: 64px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      flex-shrink: 0;
      position: sticky;
      top: 56px;
      height: calc(100vh - 56px);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 0;
      z-index: 400;
      transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .nav-rail.expanded {
      width: 200px;
      align-items: stretch;
      padding: 12px 8px;
    }

    .nav-rail-header {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-soft);
    }
    .nav-rail.expanded .nav-rail-header {
      justify-content: space-between;
      padding: 0 4px 8px 4px;
    }

    .nav-rail-toggle {
      width: 36px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: transparent;
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .nav-rail-toggle:hover {
      background: var(--surface-raised);
      color: var(--text-primary);
      border-color: var(--border);
    }
    .nav-rail.expanded .nav-rail-toggle {
      width: 100%;
      justify-content: flex-start;
      padding: 0 8px;
    }
    .nav-rail-toggle svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform 0.2s;
    }
    .nav-rail.expanded .nav-rail-toggle svg {
      transform: rotate(180deg);
    }
    .nav-rail-toggle-label {
      display: none;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .nav-rail.expanded .nav-rail-toggle-label {
      display: inline;
    }

    .nav-rail-list {
      list-style: none;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .nav-rail-item {
      position: relative;
      width: 100%;
    }

    .nav-rail-link {
      width: 100%;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      border-radius: var(--radius-sm);
      text-decoration: none;
      transition: background 0.15s, color 0.15s;
      gap: 12px;
      padding: 0 10px;
    }
    .nav-rail.expanded .nav-rail-link {
      justify-content: flex-start;
    }
    .nav-rail-link:hover {
      background: var(--surface-raised);
      color: var(--text-primary);
    }
    .nav-rail-link.active,
    .nav-rail-link[aria-current="page"] {
      background: var(--surface-raised);
      color: var(--info-blue);
      border-left: 2px solid var(--info-blue);
    }
    .nav-rail-link svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .nav-rail-text {
      display: none;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      color: inherit;
    }
    .nav-rail.expanded .nav-rail-text {
      display: inline;
    }

    /* Rail Tooltip in collapsed mode */
    .rail-tooltip {
      position: absolute;
      left: calc(100% + 8px);
      top: 50%;
      transform: translateY(-50%);
      background: var(--surface-raised);
      border: 1px solid var(--border);
      color: var(--text-primary);
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 500;
      border-radius: var(--radius-sm);
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease-out;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
    .nav-rail-item:hover .rail-tooltip {
      opacity: 1;
    }
    .nav-rail.expanded .rail-tooltip {
      display: none;
    }

    /* Main Diagnostic Workspace */
    .diagnostic-workspace {
      flex: 1;
      min-width: 0;
      padding: 32px 40px;
      max-width: 1280px;
      margin: 0 auto;
    }

    @media (max-width: 900px) {
      .diagnostic-workspace {
        padding: 20px 16px;
      }
    }

    /* Section Structural Dividers */
    .section-divider {
      height: 1px;
      background: var(--border);
      margin: 48px 0;
    }

    .section-eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-tertiary);
      margin-bottom: 6px;
    }

    .section-header {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--text-primary);
    }
    .section-desc {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    /* ============================================================
       LAYER 1: DIAGNOSTIC READOUT HERO
       Clinical Instrument · Re-ordered Strict Hierarchy
       ============================================================ */
    .diagnostic-readout {
      margin-bottom: 32px;
    }

    .readout-eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-tertiary);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .eyebrow-sep {
      color: var(--border);
    }

    /* Verdict Headline (H1) */
    .verdict-headline {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.15;
      margin-bottom: 16px;
      text-transform: uppercase;
      display: inline-block;
    }
    .verdict-headline.high {
      color: var(--distinct-high);
    }
    .verdict-headline.med {
      color: var(--distinct-med);
    }
    .verdict-headline.low {
      color: var(--distinct-low);
    }

    /* Bits Metric Group */
    .bits-metric-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: 16px;
    }
    .bits-number-wrap {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .bits-value {
      font-family: var(--font-mono);
      font-size: 42px;
      font-weight: 600;
      line-height: 1;
      color: var(--text-primary);
      letter-spacing: -0.03em;
    }
    .bits-unit {
      font-family: var(--font-mono);
      font-size: 18px;
      color: var(--text-tertiary);
      font-weight: 500;
    }
    .bits-label {
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 400;
    }

    /* Environment Metadata (Secondary Context) */
    .environment-metadata {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 20px;
    }

    /* Distribution Strip */
    .measurement-strip {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      margin-bottom: 16px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
    }
    .strip-item {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--text-secondary);
    }
    .strip-item b {
      font-family: var(--font-mono);
      font-size: 12px;
    }
    .strip-item.high { color: var(--distinct-high); }
    .strip-item.med { color: var(--distinct-med); }
    .strip-item.low { color: var(--distinct-low); }
    .strip-item.local { color: var(--info-blue); }
    .strip-item.ext { color: var(--text-primary); }
    .strip-divider {
      color: var(--border);
      user-select: none;
    }

    .readout-explanation {
      font-size: 13px;
      color: var(--text-secondary);
      max-width: 820px;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .readout-caveat {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: var(--surface-subtle);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      font-size: 11px;
      color: var(--text-tertiary);
      max-width: 820px;
      margin-bottom: 24px;
    }
    .caveat-tag {
      font-weight: 600;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    /* Tier Hashes Strip */
    .tier-hashes-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    @media (max-width: 768px) {
      .tier-hashes-strip {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .tier-hash-cell {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .tier-hash-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tier-hash-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .tier-hash-copy {
      font-family: var(--font-ui);
      font-size: 10px;
      padding: 2px 6px;
      background: transparent;
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-xs);
      color: var(--text-tertiary);
      cursor: pointer;
      transition: color 0.15s, border-color 0.15s;
    }
    .tier-hash-copy:hover {
      color: var(--text-primary);
      border-color: var(--border);
    }
    .tier-hash-val {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-primary);
      word-break: break-all;
    }

    /* ============================================================
       FINGERPRINT SIGNAL MAP (SIGNATURE 3D SPECTRUM)
       Encoding: Distinctiveness (Height) · Stability (Pip) · Source (Hatch)
       Domain Calibration & Live Hover/Focus Readout
       ============================================================ */
    .signal-map-section {
      margin-bottom: 40px;
    }

    .signal-map-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 12px;
    }
    .signal-map-title {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-tertiary);
    }
    .signal-map-live-readout {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--info-blue);
      background: var(--surface);
      border: 1px solid var(--border-soft);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      min-height: 26px;
      display: inline-flex;
      align-items: center;
    }

    /* Spectrum Frame */
    .spectrum-frame {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 24px 16px 16px 16px;
      position: relative;
    }

    /* Calibration Baseline Track */
    .spectrum-track {
      display: grid;
      grid-template-columns: repeat(33, 1fr);
      align-items: flex-end;
      gap: 4px;
      height: 80px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 2px;
      position: relative;
    }

    /* Spectrum Column */
    .spectrum-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
      cursor: pointer;
      position: relative;
      outline: none;
    }
    .spectrum-col:focus-visible {
      outline: 2px solid var(--info-blue);
      outline-offset: 4px;
      border-radius: var(--radius-xs);
    }

    /* Stability Pip */
    .spectrum-pip {
      font-size: 8px;
      line-height: 1;
      margin-bottom: 4px;
      color: var(--text-tertiary);
      transition: color 0.15s, transform 0.15s;
    }
    .spectrum-col:hover .spectrum-pip,
    .spectrum-col:focus-visible .spectrum-pip {
      color: var(--info-blue);
      transform: translateY(-2px);
    }

    /* Spectrum Bar */
    .spectrum-bar {
      width: 100%;
      min-width: 6px;
      border-radius: var(--radius-xs) var(--radius-xs) 0 0;
      transition: height 0.2s ease-out, filter 0.15s;
      height: 14px;
      background: var(--distinct-low);
    }
    .spectrum-bar.high {
      height: 52px;
      background: var(--distinct-high);
    }
    .spectrum-bar.med {
      height: 30px;
      background: var(--distinct-med);
    }
    .spectrum-bar.low {
      height: 14px;
      background: var(--distinct-low);
    }
    /* External Source Diagonal Hatch Encoding */
    .spectrum-bar.external {
      background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.4) 2px,
        rgba(0, 0, 0, 0.4) 4px
      );
      border-top: 2px solid #FFFFFF;
    }

    .spectrum-col:hover .spectrum-bar,
    .spectrum-col:focus-visible .spectrum-bar {
      filter: brightness(1.25);
    }

    /* Axis Numbering & Domain Clusters */
    .spectrum-axis {
      display: grid;
      grid-template-columns: repeat(33, 1fr);
      gap: 4px;
      margin-top: 6px;
    }
    .axis-col-num {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--text-tertiary);
      text-align: center;
    }

    .spectrum-domains-bar {
      display: flex;
      justify-content: space-between;
      border-top: 1px dashed var(--border-soft);
      margin-top: 10px;
      padding-top: 6px;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      text-transform: uppercase;
    }

    .spectrum-legend {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
      margin-top: 14px;
      font-size: 11px;
      color: var(--text-secondary);
      border-top: 1px solid var(--border-soft);
      padding-top: 10px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .legend-swatch {
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }
    .legend-swatch.high { background: var(--distinct-high); }
    .legend-swatch.med { background: var(--distinct-med); }
    .legend-swatch.low { background: var(--distinct-low); }
    .legend-swatch.ext {
      background: var(--distinct-high);
      background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, #000 2px, #000 4px);
    }

    /* ============================================================
       LAYER 2: IDENTITY CONTRIBUTORS (ANALYTICAL ROWS)
       Open space · Rules · No nested cards
       ============================================================ */
    .contributors-list {
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--border);
    }
    .contrib-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 8px;
      border-bottom: 1px solid var(--border-soft);
      cursor: pointer;
      transition: background 0.15s;
      gap: 16px;
    }
    .contrib-row:hover {
      background: var(--surface-raised);
    }
    .contrib-row:focus-visible {
      outline: 2px solid var(--info-blue);
      outline-offset: -2px;
    }
    .contrib-left {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }
    .contrib-num {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-tertiary);
      width: 24px;
    }
    .contrib-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }
    .contrib-domain {
      font-size: 11px;
      color: var(--text-tertiary);
    }
    .contrib-right {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }
    .contrib-bar-wrap {
      width: 100px;
      height: 6px;
      background: var(--surface);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-xs);
      overflow: hidden;
    }
    .contrib-bar-fill {
      height: 100%;
      background: var(--distinct-high);
      border-radius: var(--radius-xs);
    }
    .badge-tag {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: var(--radius-xs);
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text-secondary);
    }
    .badge-tag.high {
      color: var(--distinct-high);
      border-color: var(--distinct-high-border);
      background: var(--distinct-high-bg);
    }
    .badge-tag.med {
      color: var(--distinct-med);
      border-color: var(--distinct-med-border);
      background: var(--distinct-med-bg);
    }
    .badge-tag.low {
      color: var(--distinct-low);
      border-color: var(--distinct-low-border);
      background: var(--distinct-low-bg);
    }
    .badge-tag.external {
      color: var(--info-blue);
      border-color: rgba(132, 185, 255, 0.3);
      background: var(--info-blue-bg);
    }

    .contrib-inspect-link {
      font-size: 12px;
      color: var(--info-blue);
      text-decoration: none;
    }
    .contrib-row:hover .contrib-inspect-link {
      text-decoration: underline;
    }

    .editorial-context {
      margin-top: 16px;
      padding: 12px 14px;
      background: var(--surface-subtle);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    .editorial-context a {
      color: var(--info-blue);
      text-decoration: underline;
    }

    /* ============================================================
       LAYER 3: EXPOSURE ATLAS (OBSERVABILITY MAP)
       Domain matrix field reports
       ============================================================ */
    .atlas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .atlas-cell {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: border-color 0.15s;
    }
    .atlas-cell:hover {
      border-color: var(--border-focus);
    }
    .atlas-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .atlas-title {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--text-primary);
    }
    .atlas-count {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-tertiary);
    }
    .atlas-hairline {
      height: 1px;
      background: var(--border-soft);
    }
    .atlas-probe-rows {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .atlas-probe-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
    }
    .atlas-probe-name {
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-right: 8px;
    }
    .atlas-probe-badge {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 1px 4px;
      border-radius: var(--radius-xs);
      border: 1px solid var(--border-soft);
    }
    .atlas-probe-badge.high { color: var(--distinct-high); border-color: var(--distinct-high-border); }
    .atlas-probe-badge.med { color: var(--distinct-med); border-color: var(--distinct-med-border); }
    .atlas-probe-badge.low { color: var(--distinct-low); border-color: var(--distinct-low-border); }

    .atlas-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 8px;
      border-top: 1px solid var(--border-soft);
      font-size: 11px;
    }
    .atlas-ratio {
      color: var(--text-tertiary);
    }
    .atlas-explore-btn {
      background: none;
      border: none;
      color: var(--info-blue);
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      padding: 0;
    }
    .atlas-explore-btn:hover {
      text-decoration: underline;
    }

    /* ============================================================
       LAYER 4: FORENSIC EVIDENCE WORKSPACE (DEVTOOLS COMPACT TABLE)
       Separation of Search vs Filter Chips
       ============================================================ */
    .workspace-controls {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .workspace-top-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* Search Box */
    .search-input-wrap {
      position: relative;
      flex: 1;
      min-width: 260px;
    }
    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 14px;
      height: 14px;
      stroke: var(--text-tertiary);
      fill: none;
      stroke-width: 2;
    }
    .workspace-search {
      width: 100%;
      height: 32px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 0 30px 0 32px;
      color: var(--text-primary);
      font-family: var(--font-ui);
      font-size: 12px;
      transition: border-color 0.15s;
    }
    .workspace-search:focus {
      border-color: var(--border-focus);
      outline: none;
    }
    .search-clear-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-tertiary);
      font-size: 14px;
      cursor: pointer;
      display: none;
    }

    /* Active Domain Filter Chip */
    .active-domain-filter-wrap {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-tertiary);
    }
    .domain-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 8px;
      background: var(--surface-raised);
      border: 1px solid var(--info-blue);
      border-radius: var(--radius-sm);
      color: var(--info-blue);
      font-weight: 500;
    }
    .chip-clear-btn {
      background: none;
      border: none;
      color: var(--info-blue);
      font-size: 12px;
      cursor: pointer;
      line-height: 1;
    }

    /* Filter Pills */
    .filter-pills-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .filter-pills-group {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .filter-pill {
      font-family: var(--font-ui);
      font-size: 11px;
      font-weight: 500;
      padding: 4px 10px;
      background: var(--surface);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      transition: background 0.1s, border-color 0.1s, color 0.1s;
    }
    .filter-pill:hover {
      background: var(--surface-raised);
      color: var(--text-primary);
    }
    .filter-pill.active {
      background: var(--surface-raised);
      border-color: var(--info-blue);
      color: var(--info-blue);
      font-weight: 600;
    }

    .sort-select {
      height: 28px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-family: var(--font-ui);
      font-size: 11px;
      padding: 0 8px;
      cursor: pointer;
    }

    /* DevTools Evidence Table */
    .table-container {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      overflow-x: auto;
    }
    .evidence-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 12px;
    }
    .evidence-table th {
      background: var(--surface-subtle);
      border-bottom: 1px solid var(--border);
      padding: 8px 12px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--text-tertiary);
    }
    .evidence-table td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border-soft);
      color: var(--text-secondary);
    }
    .evidence-row {
      cursor: pointer;
      transition: background 0.1s;
    }
    .evidence-row:hover {
      background: var(--surface-raised);
    }
    .evidence-row:focus-visible {
      outline: 2px solid var(--info-blue);
      outline-offset: -2px;
    }
    .col-num {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-tertiary);
      width: 36px;
    }
    .col-title {
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
    }
    .col-domain {
      white-space: nowrap;
      color: var(--text-secondary);
    }
    .col-observed {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-primary);
      max-width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .col-action {
      text-align: right;
      white-space: nowrap;
    }
    .inspect-btn {
      font-size: 11px;
      color: var(--info-blue);
      background: none;
      border: none;
      cursor: pointer;
    }
    .evidence-row:hover .inspect-btn {
      text-decoration: underline;
    }

    /* ============================================================
       SECTION 5: NETWORK EGRESS BOUNDARIES
       Explicit Two-State Model: Local Session vs Network Diagnostics
       ============================================================ */
    .network-boundary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 800px) {
      .network-boundary-grid {
        grid-template-columns: 1fr;
      }
    }
    .boundary-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .boundary-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .boundary-status-tag {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: var(--radius-xs);
    }
    .boundary-status-tag.local {
      background: var(--distinct-low-bg);
      border: 1px solid var(--distinct-low-border);
      color: var(--distinct-low);
    }
    .boundary-status-tag.disabled {
      background: var(--surface-raised);
      border: 1px solid var(--border);
      color: var(--text-tertiary);
    }
    .boundary-status-tag.active {
      background: var(--info-blue-bg);
      border: 1px solid var(--info-blue);
      color: var(--info-blue);
    }
    .boundary-count {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-tertiary);
    }
    .boundary-summary {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .boundary-specs {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px 12px;
      background: var(--surface-subtle);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
    }
    .spec-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
    }
    .spec-lbl {
      color: var(--text-tertiary);
    }
    .spec-val {
      font-family: var(--font-mono);
      color: var(--text-primary);
    }

    /* Pre-Flight Request Disclosure */
    .preflight-box {
      padding: 12px;
      background: var(--surface-subtle);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .preflight-title {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .preflight-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 11px;
      color: var(--text-secondary);
    }
    .preflight-list code {
      font-family: var(--font-mono);
      color: var(--info-blue);
      font-size: 10px;
    }

    .boundary-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .boundary-status-text {
      font-size: 11px;
      color: var(--text-tertiary);
    }
    .boundary-status-text.success {
      color: var(--distinct-low);
    }

    .active-endpoints-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 10px 12px;
      background: var(--surface-subtle);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      font-size: 11px;
    }
    .endpoint-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-secondary);
    }
    .endpoint-status.live {
      color: var(--distinct-low);
      font-size: 10px;
    }

    /* Telemetry grid */
    .net-telemetry-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 8px;
    }
    .net-telemetry-cell {
      padding: 8px 10px;
      background: var(--surface-subtle);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .net-lbl {
      font-size: 10px;
      text-transform: uppercase;
      color: var(--text-tertiary);
    }
    .net-val {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-primary);
      word-break: break-all;
    }

    /* ============================================================
       SECTION 6: METHODOLOGY & THREAT MODEL ACCORDION
       ============================================================ */
    .accordion-list {
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--border);
    }
    .accordion-item {
      border-bottom: 1px solid var(--border-soft);
    }
    .accordion-trigger {
      width: 100%;
      padding: 14px 8px;
      background: none;
      border: none;
      color: var(--text-primary);
      font-family: var(--font-ui);
      font-size: 13px;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .accordion-trigger:hover {
      background: var(--surface-raised);
    }
    .accordion-trigger:focus-visible {
      outline: 2px solid var(--info-blue);
      outline-offset: -2px;
    }
    .accordion-num {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-tertiary);
      margin-right: 8px;
    }
    .accordion-panel {
      display: none;
      padding: 4px 8px 16px 8px;
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    .accordion-panel.open {
      display: block;
    }

    /* ============================================================
       EVIDENCE INSPECTOR DRAWER (LEICA INSTRUMENT WORKSTATION)
       Slide-over panel · Zero decorative noise · High density
       ============================================================ */
    .inspector-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease-out;
    }
    .inspector-backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }

    .inspector-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 580px;
      max-width: 90vw;
      background: var(--surface);
      border-left: 1px solid var(--border);
      z-index: 1010;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      visibility: hidden;
      pointer-events: none;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s;
      box-shadow: -8px 0 32px rgba(0, 0, 0, 0.7);
    }
    .inspector-drawer.open {
      transform: translateX(0);
      visibility: visible;
      pointer-events: auto;
    }

    .inspect-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }
    .inspect-header-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .inspect-probe-id {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-tertiary);
    }
    .inspect-title {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: var(--text-primary);
    }
    .inspect-close-btn {
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-raised);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-size: 16px;
      cursor: pointer;
    }
    .inspect-close-btn:hover {
      color: var(--text-primary);
      border-color: var(--text-tertiary);
    }

    .inspect-badges-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--surface-subtle);
      border-bottom: 1px solid var(--border-soft);
    }

    .inspect-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .inspect-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .inspect-sec-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-tertiary);
      border-bottom: 1px solid var(--border-soft);
      padding-bottom: 4px;
    }

    .inspect-observed-box {
      font-family: var(--font-mono);
      font-size: 12px;
      background: var(--surface-subtle);
      border: 1px solid var(--border-soft);
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      word-break: break-all;
    }

    .inspect-prose {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .inspect-method-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-size: 11px;
    }
    .method-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 10px;
      background: var(--surface-subtle);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
    }
    .method-lbl {
      color: var(--text-tertiary);
      font-size: 10px;
      text-transform: uppercase;
    }
    .method-val {
      font-family: var(--font-mono);
      color: var(--text-primary);
      word-break: break-all;
    }

    /* Raw Telemetry Table */
    .raw-table-wrap {
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }
    .raw-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    .raw-table tr {
      border-bottom: 1px solid var(--border-soft);
    }
    .raw-table tr:last-child {
      border-bottom: none;
    }
    .raw-k {
      font-family: var(--font-mono);
      padding: 6px 10px;
      color: var(--text-secondary);
      background: var(--surface-subtle);
      width: 40%;
      vertical-align: top;
    }
    .raw-v {
      font-family: var(--font-mono);
      padding: 6px 10px;
      color: var(--text-primary);
      word-break: break-all;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .raw-copy-btn {
      font-family: var(--font-ui);
      font-size: 10px;
      padding: 1px 5px;
      background: var(--surface-raised);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-xs);
      color: var(--text-tertiary);
      cursor: pointer;
      flex-shrink: 0;
    }
    .raw-copy-btn:hover {
      color: var(--text-primary);
      border-color: var(--border);
    }

    .code-snippet-pre {
      font-family: var(--font-mono);
      font-size: 11px;
      background: var(--bg-primary);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      color: var(--text-secondary);
      overflow-x: auto;
      overflow-y: auto;
      max-height: 240px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .inspect-footer {
      padding: 14px 20px;
      border-top: 1px solid var(--border);
      background: var(--surface);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    /* Footer */
    .app-footer {
      border-top: 1px solid var(--border);
      padding: 24px 40px;
      font-size: 11px;
      color: var(--text-tertiary);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      background: var(--surface);
    }
    .app-footer a {
      color: var(--info-blue);
      text-decoration: none;
    }
    .app-footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>

  <!-- ACCESSIBLE SKIP LINK (WCAG 2.2 AA) -->
  <a href="#main-content" class="skip-link">Skip to forensic diagnosis</a>

  <!-- TOP HEADER -->
  <header class="app-header" role="banner">
    <div class="header-left">
      <a href="/" class="header-brand" aria-label="Dark Flags Home">
        <img src="/logo.png" alt="Dark Flags" class="header-logo">
      </a>
      <span class="header-tagline">Forensic Browser Diagnostic Observatory</span>
    </div>

    <div class="header-right">
      <div class="header-status-pill" id="globalStatusPill">
        <span class="status-dot probing" id="globalStatusDot"></span>
        <span id="globalStatusText">Diagnostic Ready</span>
      </div>

      <button class="btn btn-primary" id="btnRerun" aria-label="Re-run diagnostic analysis">
        Re-Run Analysis
      </button>

      <div class="menu-wrap">
        <button class="btn btn-ghost" id="btnMenuTrigger" aria-expanded="false" aria-haspopup="true" aria-label="Diagnostic Settings & Export">
          Export / Options ▾
        </button>
        <div class="menu-dropdown" id="menuDropdown" role="menu">
          <button class="dropdown-item" id="btnExportJson" role="menuitem">Export Forensic Report (JSON)</button>
          <button class="dropdown-item" id="btnCopyHash" role="menuitem">Copy Full Identity Hash</button>
          <div class="dropdown-sep"></div>
          <button class="dropdown-item" id="btnToggleHivis" role="menuitem">High Contrast Mode</button>
          <div class="dropdown-sep"></div>
          <button class="dropdown-item" id="btnToggleBehav" role="menuitem">Toggle Behavioral Capture</button>
          <button class="dropdown-item" id="btnToggleGeo" role="menuitem">Toggle Network IP Lookups</button>
          <div class="dropdown-sep"></div>
          <a href="/guide" class="dropdown-item" role="menuitem">Field Guide & Methodology</a>
        </div>
      </div>
    </div>
  </header>

  <div class="app-layout">
    <!-- EXPANDABLE 64PX ICON NAVIGATION RAIL -->
    <nav class="nav-rail" id="navRail" aria-label="Observatory Sections">
      <div class="nav-rail-header">
        <button class="nav-rail-toggle" id="btnToggleNavRail" aria-expanded="false" aria-controls="navRailList" title="Expand navigation labels" aria-label="Expand navigation labels">
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
          <span class="nav-rail-toggle-label">Expand</span>
        </button>
      </div>

      <ul class="nav-rail-list" id="navRailList">
        <li class="nav-rail-item">
          <a href="#overview" class="nav-rail-link active" aria-current="page" aria-label="Diagnostic Overview">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/></svg>
            <span class="nav-rail-text">Overview</span>
          </a>
          <span class="rail-tooltip" role="tooltip">Overview</span>
        </li>
        <li class="nav-rail-item">
          <a href="#signal-map" class="nav-rail-link" aria-label="Signal Map">
            <svg viewBox="0 0 24 24"><line x1="4" y1="18" x2="20" y2="18"/><line x1="6" y1="18" x2="6" y2="8"/><line x1="10" y1="18" x2="10" y2="4"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="6"/></svg>
            <span class="nav-rail-text">Signal Map</span>
          </a>
          <span class="rail-tooltip" role="tooltip">Signal Map</span>
        </li>
        <li class="nav-rail-item">
          <a href="#contributors" class="nav-rail-link" aria-label="Distinctiveness Drivers">
            <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span class="nav-rail-text">Contributors</span>
          </a>
          <span class="rail-tooltip" role="tooltip">Contributors</span>
        </li>
        <li class="nav-rail-item">
          <a href="#exposure-atlas" class="nav-rail-link" aria-label="Exposure Atlas">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span class="nav-rail-text">Exposure Atlas</span>
          </a>
          <span class="rail-tooltip" role="tooltip">Exposure Atlas</span>
        </li>
        <li class="nav-rail-item">
          <a href="#evidence-workspace" class="nav-rail-link" aria-label="Forensic Evidence Workspace">
            <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/><line x1="7" y1="3" x2="7" y2="21"/></svg>
            <span class="nav-rail-text">Forensic Evidence</span>
          </a>
          <span class="rail-tooltip" role="tooltip">Forensic Evidence</span>
        </li>
        <li class="nav-rail-item">
          <a href="#network-disclosure" class="nav-rail-link" aria-label="Network Lookups">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span class="nav-rail-text">Network Lookups</span>
          </a>
          <span class="rail-tooltip" role="tooltip">Network Lookups</span>
        </li>
        <li class="nav-rail-item">
          <a href="#methodology" class="nav-rail-link" aria-label="Methodology">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span class="nav-rail-text">Methodology</span>
          </a>
          <span class="rail-tooltip" role="tooltip">Methodology</span>
        </li>
      </ul>
    </nav>

    <!-- MAIN FORENSIC OBSERVATORY WORKSPACE -->
    <main class="diagnostic-workspace" id="main-content">
      
      <!-- LAYER 1: DIAGNOSTIC READOUT HERO (INVERTED HIERARCHY) -->
      <section class="diagnostic-readout" id="overview">
        <div class="readout-eyebrow">
          <span>FINGERPRINT ANALYSIS</span>
          <span class="eyebrow-sep">/</span>
          <span id="readoutStatusSummary">PROBING 33 SURFACES</span>
        </div>

        <!-- VERDICT HEADLINE (H1) -->
        <h1 class="verdict-headline high" id="heroBadge">HIGH DISTINCTIVENESS</h1>

        <!-- PRIMARY METRIC -->
        <div class="bits-metric-group">
          <div class="bits-number-wrap">
            <span class="bits-value" id="heroBitsVal">33.3</span>
            <span class="bits-unit">bits</span>
          </div>
          <div class="bits-label" id="heroBits">estimated identifying information</div>
        </div>

        <!-- CONTEXTUAL SECONDARY METADATA -->
        <div class="environment-metadata" id="browserSignature">
          Google Chrome · Blink · Desktop Environment
        </div>

        <!-- DYNAMIC OBSERVATORY COUNTER STRIP -->
        <div class="measurement-strip" role="region" aria-label="Telemetry Distribution">
          <div class="strip-item high"><b id="stripHigh">0</b> HIGH</div>
          <div class="strip-divider">·</div>
          <div class="strip-item med"><b id="stripMed">0</b> MODERATE</div>
          <div class="strip-divider">·</div>
          <div class="strip-item low"><b id="stripLow">0</b> LOW</div>
          <div class="strip-divider">·</div>
          <div class="strip-item local"><b id="stripLocal">31</b> LOCAL</div>
          <div class="strip-divider">·</div>
          <div class="strip-item ext"><b id="stripExternal">2</b> EXTERNAL</div>
          <div class="strip-divider">·</div>
          <div class="strip-item"><b id="stripFolded">0</b> FOLDED</div>
        </div>

        <p class="readout-explanation" id="heroSummary">
          Under the empirical reference model, this browser configuration contains an uncommon combination of observed characteristics.
        </p>

        <div class="readout-caveat">
          <span class="caveat-tag">MODEL ESTIMATE</span>
          <span class="caveat-text">Not a probability of tracking or personal identification. Reflects information entropy under empirical reference populations.</span>
        </div>

        <!-- TIER HASHES STRIP -->
        <div class="tier-hashes-strip">
          <div class="tier-hash-cell">
            <div class="tier-hash-header">
              <span class="tier-hash-label">Hardware Hash</span>
              <button class="tier-hash-copy" data-copy="hashHw" title="Copy hardware hash">Copy</button>
            </div>
            <span class="tier-hash-val" id="hashHw">—</span>
          </div>
          <div class="tier-hash-cell">
            <div class="tier-hash-header">
              <span class="tier-hash-label">Engine Hash</span>
              <button class="tier-hash-copy" data-copy="hashEngine" title="Copy engine hash">Copy</button>
            </div>
            <span class="tier-hash-val" id="hashEngine">—</span>
          </div>
          <div class="tier-hash-cell">
            <div class="tier-hash-header">
              <span class="tier-hash-label">Build Hash</span>
              <button class="tier-hash-copy" data-copy="hashBuild" title="Copy build hash">Copy</button>
            </div>
            <span class="tier-hash-val" id="hashBuild">—</span>
          </div>
          <div class="tier-hash-cell">
            <div class="tier-hash-header">
              <span class="tier-hash-label">Session Hash</span>
              <button class="tier-hash-copy" data-copy="hashSess" title="Copy session hash">Copy</button>
            </div>
            <span class="tier-hash-val" id="hashSess">—</span>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <!-- FINGERPRINT SIGNAL MAP (SIGNATURE 3D SPECTRUM) -->
      <section class="signal-map-section" id="signal-map">
        <div class="signal-map-header">
          <span class="signal-map-title">FINGERPRINT SIGNATURE SPECTRUM · 33 PROBES</span>
          <div class="signal-map-live-readout" id="spectrumLiveTarget" aria-live="polite">
            HOVER OR FOCUS ANY PROBE TO INSPECT TELEMETRY · [ENTER] TO OPEN WORKSTATION
          </div>
        </div>

        <div class="spectrum-frame">
          <div class="spectrum-track" id="spectrumTrack" role="region" aria-label="33-Probe Interactive Fingerprint Spectrum">
            <!-- Dynamic 33 probes generated by JavaScript -->
          </div>

          <div class="spectrum-axis" id="spectrumAxis">
            <!-- Number labels 01 to 33 -->
          </div>

          <div class="spectrum-domains-bar">
            <span>NAV</span>
            <span>DISPLAY</span>
            <span>MATH</span>
            <span>GRAPHICS</span>
            <span>AUDIO</span>
            <span>FONTS</span>
            <span>MEDIA</span>
            <span>NETWORK</span>
            <span>STORAGE</span>
            <span>PERMISSIONS</span>
            <span>INPUT</span>
            <span>DEFENSE</span>
          </div>

          <div class="spectrum-legend">
            <div class="legend-item"><span class="legend-swatch high"></span> High Distinctiveness (Full Height)</div>
            <div class="legend-item"><span class="legend-swatch med"></span> Moderate (Mid Height)</div>
            <div class="legend-item"><span class="legend-swatch low"></span> Low (Base Height)</div>
            <div class="legend-item"><span class="legend-swatch ext"></span> External Request (Hatched Bar)</div>
            <div class="legend-item"><span>◆</span> Hardware-Stable</div>
            <div class="legend-item"><span>▬</span> Engine/Build-Stable</div>
            <div class="legend-item"><span>○</span> Session-Ephemeral</div>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <!-- LAYER 2: IDENTITY CONTRIBUTORS -->
      <section id="contributors">
        <div class="section-eyebrow">02 · Entropy Drivers</div>
        <div class="section-header">
          <h2 class="section-title">Why This Browser Is Distinct</h2>
          <span class="section-desc">Ranked telemetry surfaces providing the highest information density</span>
        </div>

        <div class="contributors-list" id="contributorsList" role="list">
          <!-- Dynamic Top 5 rows generated by JavaScript -->
        </div>

        <div class="editorial-context">
          <b>Forensic Context:</b> Identifying information is concentrated in unmasked graphics hardware, platform font libraries, and timing resolution. These surfaces bypass cookie partitions and remain stable across incognito sessions. Reference: <a href="https://www.w3.org/TR/fingerprinting-guidance/" target="_blank" rel="noopener">W3C Fingerprinting Guidance</a>.
        </div>
      </section>

      <div class="section-divider"></div>

      <!-- LAYER 3: EXPOSURE ATLAS (OBSERVABILITY MAP) -->
      <section id="exposure-atlas">
        <div class="section-eyebrow">03 · Architectural Domain Map</div>
        <div class="section-header">
          <h2 class="section-title">Exposure Atlas</h2>
          <span class="section-desc">12 functional subsystem domains and their measured telemetry health</span>
        </div>

        <div class="atlas-grid" id="atlasGrid">
          <!-- Dynamic 12 domain observability cells generated by JavaScript -->
        </div>
      </section>

      <div class="section-divider"></div>

      <!-- LAYER 4: FORENSIC EVIDENCE WORKSPACE -->
      <section id="evidence-workspace">
        <div class="section-eyebrow">04 · Comprehensive Audit Table</div>
        <div class="section-header">
          <h2 class="section-title">Forensic Evidence Workspace</h2>
          <span class="section-desc">Inspect all 33 raw telemetry payloads, query methods, and stability classifications</span>
        </div>

        <div class="workspace-controls">
          <div class="workspace-top-bar">
            <!-- Text Search Input -->
            <div class="search-input-wrap">
              <svg class="search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="probeSearch" class="workspace-search" placeholder="Search probes, keys, values..." aria-label="Search forensic evidence">
              <button id="btnClearSearch" class="search-clear-btn" aria-label="Clear search text">×</button>
            </div>

            <!-- Active Domain Filter Chip (Separated from search input) -->
            <div class="active-domain-filter-wrap" id="activeDomainFilterWrap" style="display:none;">
              <span>Domain:</span>
              <span class="domain-chip" id="activeDomainChip">
                <span id="activeDomainChipText">Domain Name</span>
                <button id="btnClearDomainFilter" class="chip-clear-btn" aria-label="Remove domain filter">×</button>
              </span>
            </div>

            <select id="sortSelect" class="sort-select" aria-label="Sort evidence table">
              <option value="num">Sort: Number ↑</option>
              <option value="distinct">Sort: Distinctiveness ↓</option>
              <option value="domain">Sort: Domain</option>
              <option value="stability">Sort: Stability</option>
            </select>
          </div>

          <!-- Filter Pills -->
          <div class="filter-pills-row">
            <div class="filter-pills-group" role="radiogroup" aria-label="Filter evidence by distinctiveness or source">
              <button class="filter-pill active" data-filter="all">All (33)</button>
              <button class="filter-pill" data-filter="high">High (<span id="pillHighCount">0</span>)</button>
              <button class="filter-pill" data-filter="med">Moderate (<span id="pillMedCount">0</span>)</button>
              <button class="filter-pill" data-filter="low">Low (<span id="pillLowCount">0</span>)</button>
              <button class="filter-pill" data-filter="local">Local (31)</button>
              <button class="filter-pill" data-filter="external">External (2)</button>
            </div>
          </div>
        </div>

        <div class="table-container">
          <table class="evidence-table" aria-label="Forensic Evidence Workspace Table">
            <thead>
              <tr>
                <th scope="col" style="width:40px;">#</th>
                <th scope="col">Measured Surface</th>
                <th scope="col">Domain</th>
                <th scope="col">Distinctiveness</th>
                <th scope="col">Stability</th>
                <th scope="col">Source</th>
                <th scope="col">Primary Observed Value</th>
                <th scope="col" style="text-align:right;">Inspect</th>
              </tr>
            </thead>
            <tbody id="evidenceTableBody">
              <!-- Dynamic rows rendered by JavaScript -->
            </tbody>
          </table>
        </div>
      </section>

      <div class="section-divider"></div>

      <!-- SECTION 5: NETWORK EGRESS BOUNDARIES -->
      <section id="network-disclosure">
        <div class="section-eyebrow">05 · Egress Boundaries</div>
        <div class="section-header">
          <h2 class="section-title">Network Lookups & External Intelligence</h2>
          <span class="section-desc">Strict physical separation between in-memory tab execution and external server queries</span>
        </div>

        <div class="network-boundary-grid">
          <!-- LOCAL SESSION PANEL -->
          <div class="boundary-panel">
            <div class="boundary-header">
              <span class="boundary-status-tag local">LOCAL SESSION ACTIVE</span>
              <span class="boundary-count">31 Probes</span>
            </div>
            <p class="boundary-summary">
              Probes 01–25 and 27–33 execute 100% locally in-memory inside this browser tab. Zero network packets leave your machine.
            </p>
            <div class="boundary-specs">
              <div class="spec-row">
                <span class="spec-lbl">Network Transmission</span>
                <span class="spec-val">0 bytes / 0 external requests</span>
              </div>
              <div class="spec-row">
                <span class="spec-lbl">Data Scope</span>
                <span class="spec-val">Client JavaScript memory only</span>
              </div>
            </div>
            <button class="btn btn-ghost" id="btnKeepLocalOnly">Enforce Local-Only Isolation</button>
          </div>

          <!-- NETWORK DIAGNOSTICS PANEL (EXPLICIT TWO STATES) -->
          <div class="boundary-panel" id="networkDiagnosticsPanel">
            <!-- STATE 1: DISABLED (PRE-FLIGHT DISCLOSURE) -->
            <div id="netStateDisabled">
              <div class="boundary-header">
                <span class="boundary-status-tag disabled">NETWORK DIAGNOSTICS DISABLED</span>
                <span class="boundary-count">2 Probes Paused</span>
              </div>
              <p class="boundary-summary" style="margin-top:10px;">
                External queries paused. Probes 26 (Public IP / ISP) and 29 (Login state) will not transmit queries until you explicitly authorize egress.
              </p>
              <div class="preflight-box" style="margin: 12px 0;">
                <div class="preflight-title">Pre-Flight Request Disclosure</div>
                <ul class="preflight-list">
                  <li>• <b>Endpoints:</b> <code>ipwho.is</code>, <code>geojs.io</code>, <code>api.ipapi.is</code>, STUN servers</li>
                  <li>• <b>Data Transmitted:</b> Public IP address, WebRTC ICE candidates, HTTP headers</li>
                  <li>• <b>Diagnostic Purpose:</b> ASN routing, VPN/Datacenter exit detection, STUN leaks</li>
                </ul>
              </div>
              <div class="boundary-actions">
                <button class="btn btn-primary" id="btnRunNetworkLookups">Enable Network Diagnostics</button>
                <span class="boundary-status-text" id="netStatusText">Awaiting user authorization</span>
              </div>
            </div>

            <!-- STATE 2: ACTIVE (EGRESS PERMITTED) -->
            <div id="netStateActive" style="display:none;">
              <div class="boundary-header">
                <span class="boundary-status-tag active">NETWORK DIAGNOSTICS ACTIVE</span>
                <span class="boundary-count">2 Probes Egressing</span>
              </div>
              <p class="boundary-summary" style="margin-top:10px;">
                Network queries permitted. Diagnostic queries dispatched to authorized endpoints:
              </p>
              <div class="active-endpoints-list" style="margin: 12px 0;">
                <div class="endpoint-item"><span class="endpoint-status live">●</span> <code>ipwho.is</code> (Geo/ASN routing)</div>
                <div class="endpoint-item"><span class="endpoint-status live">●</span> <code>geojs.io</code> (Fallback geo-intelligence)</div>
                <div class="endpoint-item"><span class="endpoint-status live">●</span> <code>stun.l.google.com:19302</code> (ICE candidate check)</div>
              </div>
              <div class="boundary-actions">
                <button class="btn btn-warning" id="btnDisableNetworkLookups">Disable Network Diagnostics</button>
                <span class="boundary-status-text success">Egress active · Diagnostic response received</span>
              </div>
            </div>

            <!-- Telemetry Display Grid -->
            <div class="net-telemetry-grid">
              <div class="net-telemetry-cell">
                <span class="net-lbl">Public IP</span>
                <span class="net-val" id="netIpDisplay">—</span>
              </div>
              <div class="net-telemetry-cell">
                <span class="net-lbl">Location</span>
                <span class="net-val" id="netLocDisplay">—</span>
              </div>
              <div class="net-telemetry-cell">
                <span class="net-lbl">ASN / Network</span>
                <span class="net-val" id="netAsnDisplay">—</span>
              </div>
              <div class="net-telemetry-cell">
                <span class="net-lbl">VPN / Proxy Status</span>
                <span class="net-val" id="netVpnDisplay">—</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <!-- SECTION 6: METHODOLOGY & THREAT MODEL ACCORDION -->
      <section id="methodology">
        <div class="section-eyebrow">06 · Scientific Standards</div>
        <div class="section-header">
          <h2 class="section-title">How Dark Flags Estimates Distinctiveness</h2>
          <span class="section-desc">Technical specification of measurement normalization, persistence tiers, and empirical reference boundaries</span>
        </div>

        <div class="accordion-list">
          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false">
              <span><span class="accordion-num">01</span> Inputs: 33 Measured Surfaces</span>
              <span>+</span>
            </button>
            <div class="accordion-panel">
              Every probe reads an observable browser surface exposed through standardized or de-facto Web APIs. Surfaces are classified by stability (Hardware-bound, Browser-bound, Ephemeral) to assess persistence over time.
            </div>
          </div>

          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false">
              <span><span class="accordion-num">02</span> Normalization: Persistence Tiers</span>
              <span>+</span>
            </button>
            <div class="accordion-panel">
              Signals are grouped into four persistence tiers: Hardware (display, CPU cores, GPU renderer), Engine (canvas rasterizer, audio synthesizer), Build (navigator interfaces, client hints), and Session (permissions, network info).
            </div>
          </div>

          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false">
              <span><span class="accordion-num">03</span> Reference Model: Population Distribution</span>
              <span>+</span>
            </button>
            <div class="accordion-panel">
              Entropy calculations are benchmarked against empirical device distributions observed across the global web (e.g., standard Windows/Chrome profiles vs rare Linux/Brave setups).
            </div>
          </div>

          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false">
              <span><span class="accordion-num">04</span> Information Entropy: Shannon Bits Metric</span>
              <span>+</span>
            </button>
            <div class="accordion-panel">
              Bits of entropy measure how much unique information your browser exposes. A score of 33 bits indicates a fingerprint statistically unique among billions of web users.
            </div>
          </div>

          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false">
              <span><span class="accordion-num">05</span> Threat Model: Boundaries & Limitations</span>
              <span>+</span>
            </button>
            <div class="accordion-panel">
              Dark Flags operates entirely client-side. The score reflects theoretical tracking capability by third parties, not active tracking on this website.
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>

  <!-- EVIDENCE INSPECTOR DRAWER (SLIDE-OVER SHEET) -->
  <div class="inspector-backdrop" id="inspectorBackdrop" aria-hidden="true"></div>
  <aside class="inspector-drawer" id="probeInspector" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="inspectTitle">
    <div class="inspect-header">
      <div class="inspect-header-info">
        <span class="inspect-probe-id">PROBE #<span id="inspectNum">01</span></span>
        <h2 class="inspect-title" id="inspectTitle">Probe Title</h2>
      </div>
      <button class="inspect-close-btn" id="inspectCloseBtn" aria-label="Close inspector drawer">×</button>
    </div>

    <div class="inspect-badges-bar">
      <span class="badge-tag high" id="inspectDistinctBadge">HIGH DISTINCTIVENESS</span>
      <span class="badge-tag" id="inspectStabilityBadge">Hardware-stable</span>
      <span class="badge-tag" id="inspectSourceBadge">LOCAL</span>
      <span class="badge-tag" id="inspectDomain">Domain</span>
    </div>

    <div class="inspect-body">
      <!-- Section 1: Observed Value -->
      <div class="inspect-section">
        <span class="inspect-sec-label">OBSERVED VALUE</span>
        <div class="inspect-observed-box font-mono" id="inspectObserved">
          (No primary signal observed)
        </div>
      </div>

      <!-- Section 2: Why it Matters -->
      <div class="inspect-section">
        <span class="inspect-sec-label">WHY IT MATTERS</span>
        <p class="inspect-prose" id="inspectWhy">
          Surface explanation.
        </p>
      </div>

      <!-- Section 3: Technical Audit / Collection Method -->
      <div class="inspect-section">
        <span class="inspect-sec-label">COLLECTION METHOD</span>
        <div class="inspect-method-grid">
          <div class="method-cell">
            <span class="method-lbl">API / Technique</span>
            <span class="method-val" id="inspectMethod">DOM</span>
          </div>
          <div class="method-cell">
            <span class="method-lbl">Access Visibility</span>
            <span class="method-val" id="inspectVisibility">JavaScript</span>
          </div>
          <div class="method-cell">
            <span class="method-lbl">Stability Tier</span>
            <span class="method-val" id="inspectStability">Hardware</span>
          </div>
          <div class="method-cell">
            <span class="method-lbl">Architecture Domain</span>
            <span class="method-val" id="inspectDomainVal">Graphics</span>
          </div>
        </div>
      </div>

      <!-- Section 4: Raw Telemetry Key-Value Table -->
      <div class="inspect-section">
        <span class="inspect-sec-label">RAW EVIDENCE TELEMETRY</span>
        <div class="raw-table-wrap">
          <table class="raw-table">
            <tbody id="inspectEvidenceBody">
              <!-- Raw rows generated by JavaScript -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 5: Collection Source Code Snippet -->
      <div class="inspect-section">
        <span class="inspect-sec-label">COLLECTION IMPLEMENTATION</span>
        <pre class="code-snippet-pre font-mono" id="inspectCodePre">// Function source code</pre>
      </div>
    </div>

    <div class="inspect-footer">
      <button class="btn btn-ghost" id="btnCopyEvidenceValues">Copy Values</button>
      <button class="btn" id="btnCopyEvidenceJson">Copy JSON</button>
      <button class="btn btn-primary" id="btnCopyShareLink">Share Link</button>
    </div>
  </aside>

  <!-- FOOTER -->
  <footer class="app-footer">
    <div>
      <b>DARK FLAGS</b> · Forensic Browser Fingerprint Observatory · Zero External Dependencies
    </div>
    <div>
      <a href="/guide">Field Guide</a> · <a href="#methodology">Threat Model</a> · <a href="https://github.com" target="_blank" rel="noopener">Source Code</a>
    </div>
  </footer>

  <!-- SCRIPT ENGINE -->
  <script>
/* ============================================================
   DARK FLAGS — FORENSIC OBSERVATORY SCRIPT
   ============================================================ */

/* Utility: safe element selector */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function esc(s){
  if(s===undefined||s===null) return "";
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

function short(h){
  if(!h || h==="(none)") return "—";
  return h.slice(0, 10) + "…" + h.slice(-6);
}

function fmtOneIn(n){
  if(n <= 1) return "1 in 1 (universal)";
  if(n < 1000) return \`1 in \${Math.round(n)}\`;
  if(n < 1000000) return \`1 in \${(n/1000).toFixed(1)}k\`;
  if(n < 1000000000) return \`1 in \${(n/1000000).toFixed(1)}M\`;
  return \`1 in \${(n/1000000000).toFixed(2)}B\`;
}

async function sha256(str){
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  } catch(e) {
    let h = 0x811c9dc5;
    for(let i=0; i<str.length; i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, "0");
  }
}

/* ---- CANONICAL 33-PROBE METADATA DICTIONARY ---- */
const PROBE_META = {
  "01": { num: "01", title: "Navigator core", domain: "Navigator & Platform", source: "local", stability: "Build-stable", method: "navigator.* properties", visibility: "JavaScript (Same-Origin)", why: "Core platform and hardware concurrency values expose the base OS, CPU thread count, and language preferences." },
  "02": { num: "02", title: "UA client hints", domain: "Navigator & Platform", source: "local", stability: "Build-stable", method: "navigator.userAgentData.getHighEntropyValues()", visibility: "Client Hints & JS", why: "Structured client hints reveal exact binary platform version, device model, and 64-bit architecture." },
  "03": { num: "03", title: "Screen & display", domain: "Screen & Display", source: "local", stability: "Hardware-stable", method: "window.screen.* & requestAnimationFrame", visibility: "JavaScript", why: "Display resolution, color depth, pixel density, and measured refresh rate form a persistent monitor signature." },
  "04": { num: "04", title: "Timezone & locale", domain: "Environment & Math", source: "local", stability: "OS & Locale-stable", method: "Intl.DateTimeFormat & Date offsets", visibility: "JavaScript", why: "IANA timezone and seasonal DST transitions anchor the browser to a geographic jurisdiction and OS build." },
  "05": { num: "05", title: "Canvas 2D", domain: "Graphics & Rendering", source: "local", stability: "Engine × Hardware", method: "HTMLCanvasElement 2D rendering & toDataURL()", visibility: "JavaScript", why: "Microscopic subpixel anti-aliasing and font rendering differences produce a unique 2D graphics checksum." },
  "06": { num: "06", title: "WebGL renderer", domain: "Graphics & Rendering", source: "local", stability: "Hardware-stable", method: "WebGLRenderingContext.getParameter()", visibility: "JavaScript", why: "Unmasked GPU vendor and renderer strings directly expose the physical graphics card model and driver." },
  "07": { num: "07", title: "WebGPU adapter", domain: "Graphics & Rendering", source: "local", stability: "Hardware-stable", method: "navigator.gpu.requestAdapter()", visibility: "JavaScript", why: "Next-generation WebGPU adapter architecture reveals underlying Vulkan/DirectX/Metal hardware limits." },
  "08": { num: "08", title: "Audio stack", domain: "Audio & Speech", source: "local", stability: "Engine × Hardware", method: "OfflineAudioContext & dynamics compressor", visibility: "JavaScript", why: "Floating-point processing variations in audio synthesis produce unique mathematical waveforms." },
  "09": { num: "09", title: "Installed fonts", domain: "Fonts & Typography", source: "local", stability: "OS Installed Fonts", method: "FontFaceSet & span geometry measurement", visibility: "CSS & JavaScript", why: "Locally installed font inventories distinguish system builds, design suites, and enterprise environments." },
  "10": { num: "10", title: "Media codecs", domain: "Media & Codecs", source: "local", stability: "OS Codec-stable", method: "HTMLVideoElement.canPlayType()", visibility: "JavaScript", why: "Proprietary and open codec support matrices indicate hardware decoders and media stack licensing." },
  "11": { num: "11", title: "Speech synthesis voices", domain: "Audio & Speech", source: "local", stability: "OS Language Pack", method: "speechSynthesis.getVoices()", visibility: "JavaScript", why: "Installed speech-synthesis voices reflect the exact language packs and assistive software on the host OS." },
  "12": { num: "12", title: "Media devices", domain: "Media & Codecs", source: "local", stability: "Hardware-stable", method: "navigator.mediaDevices.enumerateDevices()", visibility: "JavaScript (Gated labels)", why: "The count and kind of attached microphones, cameras, and audio outputs form a peripheral signature." },
  "13": { num: "13", title: "Network information", domain: "Network & Leaks", source: "local", stability: "Session-ephemeral", method: "navigator.connection (Network Information API)", visibility: "JavaScript", why: "Network type, downlink bandwidth, and RTT estimate connection latency and mobile/broadband state." },
  "14": { num: "14", title: "WebRTC / IP leak", domain: "Network & Leaks", source: "local", stability: "Network-ephemeral", method: "RTCPeerConnection ICE candidate gathering", visibility: "JavaScript WebRTC", why: "WebRTC candidate gathering can expose private or public IP addresses past VPN tunnels if unmasked." },
  "15": { num: "15", title: "Storage & quota", domain: "Storage & Cookies", source: "local", stability: "Disk Quota Proxy", method: "navigator.storage.estimate() & storage APIs", visibility: "JavaScript (Same-Origin)", why: "Storage quota estimates correlate with total physical disk partition capacity." },
  "16": { num: "16", title: "Permissions matrix", domain: "Permissions & APIs", source: "local", stability: "Browser & Grant-stable", method: "navigator.permissions.query()", visibility: "JavaScript", why: "Permissions states (granted, prompt, denied) across 11 APIs reflect user authorizations and device sensors." },
  "17": { num: "17", title: "API support matrix", domain: "Permissions & APIs", source: "local", stability: "Exact Browser Build", method: "Window & Navigator interface reflection", visibility: "JavaScript", why: "Presence of modern Web APIs (WebAuthn, WebNN, WakeLock) fingerprints the exact engine build." },
  "18": { num: "18", title: "CSS media features", domain: "Screen & Display", source: "local", stability: "OS & Display-stable", method: "window.matchMedia() CSS media features", visibility: "CSS & JavaScript", why: "Color gamut, dynamic range, contrast, and pointer accuracy reveal physical display capabilities." },
  "19": { num: "19", title: "Math / JS engine", domain: "Environment & Math", source: "local", stability: "CPU libm-stable", method: "Math.tan, Math.sin, Math.sinh precision", visibility: "JavaScript", why: "Floating-point precision in trigonometric math depends on the CPU architecture and platform libm." },
  "20": { num: "20", title: "Timing & compute", domain: "Environment & Math", source: "local", stability: "CPU Tier & Clamping", method: "performance.now() timer resolution & loop", visibility: "JavaScript", why: "Clock resolution reveals Spectre countermeasures while a compute loop estimates CPU execution speed." },
  "21": { num: "21", title: "Keyboard layout", domain: "Input & Behavioral", source: "local", stability: "Hardware Keyboard", method: "navigator.keyboard.getLayoutMap()", visibility: "JavaScript (Chromium)", why: "Physical keyboard scancode mapping reveals regional hardware key arrangements." },
  "22": { num: "22", title: "Battery status", domain: "Environment & Math", source: "local", stability: "Power / Session", method: "navigator.getBattery()", visibility: "JavaScript", why: "Battery charging state and percentage provide ephemeral but immediate session tracking signals." },
  "23": { num: "23", title: "Automation signals", domain: "Defense & Hardening", source: "local", stability: "Automation Environment", method: "navigator.webdriver, CDC properties & inconsistencies", visibility: "JavaScript", why: "Anti-bot stacks check for automation drivers (Selenium, Puppeteer) and headless anomalies." },
  "24": { num: "24", title: "Behavioral capture", domain: "Input & Behavioral", source: "local", stability: "Session Biometric", method: "Pointer events, scroll, keydown, accelerometer", visibility: "JavaScript Events", why: "Mouse trajectories, scroll acceleration, and stroke timing provide behavioral biometric signals." },
  "25": { num: "25", title: "Cookies", domain: "Storage & Cookies", source: "local", stability: "Session Partition", method: "document.cookie read/write roundtrip & storageAccess", visibility: "JavaScript & HTTP", why: "Cookie persistence and partitioned storage access reflect tracking protection boundaries." },
  "26": { num: "26", title: "Your IP · location · network", domain: "Network & Leaks", source: "external", stability: "Connection / ISP", method: "Fetch to ipwho.is, geojs.io, api.ipapi.is + STUN", visibility: "Network Request (External)", why: "Queries public IP-intelligence APIs to reveal your ASN, ISP, geographic location, and VPN exit status." },
  "27": { num: "27", title: "Resistance & spoof check", domain: "Defense & Hardening", source: "local", stability: "Privacy Browser Config", method: "Canvas farbling, timer quantization, WebGL mask", visibility: "JavaScript", why: "Detects whether privacy browsers (Tor, Brave, Firefox RFP) are actively masking or randomizing signals." },
  "28": { num: "28", title: "Tracking pixel · what a 3rd party sees", domain: "Network & Leaks", source: "local", stability: "Model Simulation", method: "Reconstructed Facebook/Google pixel payload", visibility: "Simulated Request (Local)", why: "Simulates the exact telemetry payload commercial trackers collect from your browser session." },
  "29": { num: "29", title: "Login state · who recognizes you", domain: "Network & Leaks", source: "external", stability: "Third-party Session", method: "Cross-origin image redirect probe via <img>", visibility: "Network Request (External)", why: "Detects whether active authentication sessions exist on major services using redirect-to-image probes." },
  "30": { num: "30", title: "WebAssembly", domain: "Defense & Hardening", source: "local", stability: "Engine & CPU Capability", method: "WebAssembly feature validate & compile", visibility: "JavaScript & Wasm", why: "SIMD, exception handling, and memory features reflect WebAssembly VM compiler flags." },
  "31": { num: "31", title: "Private / incognito guess", domain: "Defense & Hardening", source: "local", stability: "Browser Mode", method: "Storage quota, FileSystem API, indexedDB constraints", visibility: "JavaScript Heuristic", why: "Tests heuristic browser storage allocation limits to infer private/incognito browsing state." },
  "32": { num: "32", title: "Layout / ClientRects", domain: "Graphics & Rendering", source: "local", stability: "Font Rasterizer & DPI", method: "Element.getClientRects() subpixel box calculation", visibility: "JavaScript", why: "Fractional subpixel text dimensions reveal font rasterization hinting and OS zoom levels." },
  "33": { num: "33", title: "Text metrics", domain: "Fonts & Typography", source: "local", stability: "OS Rasterizer & Hinting", method: "CanvasRenderingContext2D.measureText() font metrics", visibility: "JavaScript", why: "Font metric bounding boxes bypass pixel farbling to fingerprint installed typefaces." }
};

/* 12 Functional Subsystem Domains */
const DOMAINS = [
  { id: "nav", name: "Navigator & Platform", probes: ["01", "02"] },
  { id: "render", name: "Graphics & Rendering", probes: ["05", "06", "07", "32"] },
  { id: "audio", name: "Audio & Speech", probes: ["08", "11"] },
  { id: "display", name: "Screen & Display", probes: ["03", "18"] },
  { id: "fonts", name: "Fonts & Typography", probes: ["09", "33"] },
  { id: "media", name: "Media & Codecs", probes: ["10", "12"] },
  { id: "storage", name: "Storage & Cookies", probes: ["15", "25"] },
  { id: "apis", name: "Permissions & APIs", probes: ["16", "17"] },
  { id: "math", name: "Environment & Math", probes: ["04", "19", "20", "22"] },
  { id: "input", name: "Input & Behavioral", probes: ["21", "24"] },
  { id: "defense", name: "Defense & Hardening", probes: ["23", "27", "30", "31"] },
  { id: "net", name: "Network & Leaks", probes: ["13", "14", "26", "28", "29"] }
];

/* Signals fold into four persistence tiers */
const TIERS = { hw:{}, engine:{}, build:{}, session:{} };
const TIER_MAP = {
  screen:'hw', hz:'hw', cores:'hw', mem:'hw', touch:'hw',
  glvendor:'hw', glrend:'hw', gpu:'hw',
  tz:'hw', locale:'hw', dst:'hw', plat:'hw', langs:'hw',
  canvas:'engine', audio:'engine', math:'engine', codecs:'engine', glext:'engine', fonts:'engine', rects:'engine', tmetrics:'engine',
  ua:'build', uach:'build', apis:'build', voices:'build', kbd:'build', wasm:'build',
  css:'session', timing:'session', quota:'session', net:'session', battery:'session',
  perms:'session', webrtc:'session', ip:'session', ip_asn:'session', cookies:'session', devices:'session'
};
function feed(key,val){
  if(val===undefined||val===null||val==="") return;
  (TIERS[TIER_MAP[key]||'session'])[key]=String(val);
}
function allSignals(){ return {...TIERS.hw,...TIERS.engine,...TIERS.build,...TIERS.session}; }

let BROWSER = { name:"Unknown", version:"", engine:"Unknown" };
async function detectBrowser(){
  const ua=navigator.userAgent, uad=navigator.userAgentData;
  let name="Unknown", version="", engine="Blink";
  if(uad?.brands){
    const b=uad.brands.find(x=>!/not.?a.?brand|chromium/i.test(x.brand));
    if(b){ name=b.brand; version=b.version; }
  }
  try{ if(navigator.brave && await navigator.brave.isBrave?.()) name="Brave"; }catch(e){}
  if(/\\bEdg\\//.test(ua)) name="Microsoft Edge";
  else if(/\\bOPR\\//.test(ua)) name="Opera";
  else if(/\\bVivaldi\\//.test(ua)) name="Vivaldi";
  else if(/\\bFirefox\\//.test(ua)){ name="Firefox"; engine="Gecko"; }
  else if(/\\bSafari\\//.test(ua) && !/Chrome\\//.test(ua)){ name="Safari"; engine="WebKit"; }
  else if(/\\bChrome\\//.test(ua)) name="Google Chrome";

  if(!version){
    const m = ua.match(/(Chrome|Firefox|Version|Edg|OPR)\\s*\\/\\s*([\\d\\.]+)/);
    if(m) version = m[2];
  }
  BROWSER = { name, version, engine };
  return BROWSER;
}

/* Probe registry array */
const modules = [];
function reg(num, title, fn){
  modules.push({ num, title, fn });
}

${probeImplementationsSlice}
function chip(o){
  if(!o) return "low";
  if(typeof o==="string") return o;
  return o.signal || "low";
}

/* Global state repository */
const results = {};
let running = false;
let runGen = 0;
let inspectedProbeNum = "01";
let activePillFilter = "all";
let activeDomainFilter = null;
let activeSearchQuery = "";
let networkAuthorized = false;

/* Canonical Probe Definition Contract */
function getProbeDefinition(num){
  const meta = PROBE_META[num] || {
    num,
    title: \`Probe \${num}\`,
    domain: "General",
    source: "local",
    stability: "Session",
    method: "DOM Reflection",
    visibility: "JavaScript",
    why: "Observable browser diagnostic surface."
  };
  const m = modules.find(x => x.num === num);
  const res = results[num] || { signal: "low", rows: [], note: "" };
  return {
    num: meta.num,
    id: meta.num,
    title: meta.title,
    domain: meta.domain,
    source: meta.source,
    distinctiveness: res.signal || "low",
    stability: meta.stability,
    method: meta.method,
    visibility: meta.visibility,
    why: meta.why,
    note: res.note || meta.why,
    telemetry: res.rows || [],
    code: m ? m.fn.toString() : "// Function source unavailable",
    at: res.at || null
  };
}

function distinctivenessRank(sig){
  if(sig==="high") return 3;
  if(sig==="med") return 2;
  if(sig==="low") return 1;
  return 0;
}

/* DYNAMIC OVERVIEW COUNTERS (ONE SOURCE OF TRUTH) */
function updateOverviewCounters(){
  let high = 0, med = 0, low = 0, local = 0, external = 0;
  for(const m of modules){
    const num = m.num;
    const meta = PROBE_META[num] || { source: "local" };
    if(meta.source === "external") {
      external++;
    } else {
      local++;
    }
    const res = results[num];
    if(res && res.signal){
      if(res.signal === "high") high++;
      else if(res.signal === "med") med++;
      else if(res.signal === "low") low++;
    }
  }

  const elHigh = document.getElementById("stripHigh");
  const elMed = document.getElementById("stripMed");
  const elLow = document.getElementById("stripLow");
  const elLocal = document.getElementById("stripLocal");
  const elExt = document.getElementById("stripExternal");
  const elFolded = document.getElementById("stripFolded");

  if(elHigh) elHigh.textContent = high;
  if(elMed) elMed.textContent = med;
  if(elLow) elLow.textContent = low;
  if(elLocal) elLocal.textContent = local;
  if(elExt) elExt.textContent = external;
  if(elFolded) elFolded.textContent = Object.keys(allSignals()).length;

  // Filter Pill Counts
  const pillHigh = document.getElementById("pillHighCount");
  const pillMed = document.getElementById("pillMedCount");
  const pillLow = document.getElementById("pillLowCount");
  if(pillHigh) pillHigh.textContent = high;
  if(pillMed) pillMed.textContent = med;
  if(pillLow) pillLow.textContent = low;
}

/* PUBLISH RESULTS FROM ANY PROBE */
function publish(num, el, res){
  const meta = PROBE_META[num];
  const m = modules.find(x => x.num === num);
  results[num] = {
    title: meta ? meta.title : (m ? m.title : String(num)),
    ...res,
    at: new Date().toISOString()
  };
  renderEvidenceRow(num);
  updateAtlasReport(num);
  updateSignalMapTick(num);
  updateContributorItems();
  updateOverviewCounters();
}

/* INITIALIZE SIGNATURE SIGNAL MAP (3D SPECTRUM) */
function initSignalMap(){
  const track = $("#spectrumTrack");
  const axis = $("#spectrumAxis");
  if(!track || !axis) return;
  track.innerHTML = "";
  axis.innerHTML = "";

  modules.forEach(m => {
    const p = getProbeDefinition(m.num);
    const col = document.createElement("div");
    col.className = "spectrum-col";
    col.id = \`spec-col-\${m.num}\`;
    col.setAttribute("tabindex", "0");
    col.setAttribute("role", "button");
    col.setAttribute("aria-label", \`Probe \${m.num}: \${p.title}, \${p.distinctiveness.toUpperCase()} distinctiveness, \${p.stability}, \${p.source.toUpperCase()}\`);

    // Stability Pip
    let pipSymbol = "○";
    if(p.stability.includes("Hardware")) pipSymbol = "◆";
    else if(p.stability.includes("Build") || p.stability.includes("Engine") || p.stability.includes("OS")) pipSymbol = "▬";

    col.innerHTML = \`
      <span class="spectrum-pip" id="spec-pip-\${m.num}" title="\${esc(p.stability)}">\${pipSymbol}</span>
      <div class="spectrum-bar low \${p.source === 'external' ? 'external' : ''}" id="spec-bar-\${m.num}"></div>
    \`;

    const labelText = \`#\${m.num} \${p.title.toUpperCase()} · \${p.domain} · \${p.stability} · \${p.distinctiveness.toUpperCase()} · \${p.source.toUpperCase()} · [ENTER TO INSPECT]\`;
    
    col.addEventListener("mouseenter", () => {
      const live = getProbeDefinition(m.num);
      $("#spectrumLiveTarget").textContent = \`#\${m.num} \${live.title.toUpperCase()} · \${live.domain} · \${live.stability} · \${live.distinctiveness.toUpperCase()} · \${live.source.toUpperCase()} · [ENTER TO INSPECT]\`;
    });
    col.addEventListener("focus", () => {
      const live = getProbeDefinition(m.num);
      $("#spectrumLiveTarget").textContent = \`#\${m.num} \${live.title.toUpperCase()} · \${live.domain} · \${live.stability} · \${live.distinctiveness.toUpperCase()} · \${live.source.toUpperCase()} · [ENTER TO INSPECT]\`;
    });
    col.addEventListener("mouseleave", () => {
      $("#spectrumLiveTarget").textContent = "HOVER OR FOCUS ANY PROBE TO INSPECT TELEMETRY · [ENTER] TO OPEN WORKSTATION";
    });
    col.addEventListener("blur", () => {
      $("#spectrumLiveTarget").textContent = "HOVER OR FOCUS ANY PROBE TO INSPECT TELEMETRY · [ENTER] TO OPEN WORKSTATION";
    });

    col.addEventListener("click", () => openInspector(m.num));
    col.addEventListener("keydown", e => {
      if(e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInspector(m.num);
      }
    });

    track.appendChild(col);

    // Number below axis
    const numEl = document.createElement("div");
    numEl.className = "axis-col-num";
    numEl.textContent = m.num;
    axis.appendChild(numEl);
  });
}

function updateSignalMapTick(num){
  const bar = document.getElementById(\`spec-bar-\${num}\`);
  const col = document.getElementById(\`spec-col-\${num}\`);
  const p = getProbeDefinition(num);
  if(!bar || !col) return;

  bar.className = \`spectrum-bar \${p.distinctiveness} \${p.source === 'external' ? 'external' : ''}\`;
  col.setAttribute("aria-label", \`Probe \${num}: \${p.title}, \${p.distinctiveness.toUpperCase()} distinctiveness, \${p.stability}, \${p.source.toUpperCase()}\`);
}

/* INITIALIZE EXPOSURE ATLAS (OBSERVABILITY MAP) */
function initAtlas(){
  const grid = $("#atlasGrid");
  if(!grid) return;
  grid.innerHTML = "";

  DOMAINS.forEach(d => {
    const cell = document.createElement("div");
    cell.className = "atlas-cell";
    cell.id = \`atlas-domain-\${d.id}\`;

    const probeRows = d.probes.map(num => {
      const p = getProbeDefinition(num);
      return \`
        <div class="atlas-probe-row" id="atlas-probe-row-\${num}">
          <span class="atlas-probe-name" title="\${esc(p.title)}">\${esc(p.title)}</span>
          <span class="atlas-probe-badge \${p.distinctiveness}" id="atlas-badge-\${num}">\${p.distinctiveness.toUpperCase()}</span>
        </div>
      \`;
    }).join("");

    cell.innerHTML = \`
      <div class="atlas-header">
        <span class="atlas-title">\${esc(d.name)}</span>
        <span class="atlas-count" id="atlas-count-\${d.id}">\${d.probes.length} measurements</span>
      </div>
      <div class="atlas-hairline"></div>
      <div class="atlas-probe-rows">
        \${probeRows}
      </div>
      <div class="atlas-footer">
        <span class="atlas-ratio" id="atlas-ratio-\${d.id}">0 / \${d.probes.length} high</span>
        <button class="atlas-explore-btn" data-domain="\${esc(d.name)}">Explore domain →</button>
      </div>
    \`;

    cell.querySelector(".atlas-explore-btn").addEventListener("click", e => {
      e.preventDefault();
      // Set active domain filter chip WITHOUT contaminating search input
      setDomainFilter(d.name);
      document.getElementById("evidence-workspace").scrollIntoView({ behavior: "smooth" });
    });

    grid.appendChild(cell);
  });
}

function updateAtlasReport(num){
  const p = getProbeDefinition(num);
  const badge = document.getElementById(\`atlas-badge-\${num}\`);
  if(badge){
    badge.className = \`atlas-probe-badge \${p.distinctiveness}\`;
    badge.textContent = p.distinctiveness.toUpperCase();
  }

  const domain = DOMAINS.find(d => d.probes.includes(num));
  if(!domain) return;
  const ratioEl = document.getElementById(\`atlas-ratio-\${domain.id}\`);
  if(!ratioEl) return;

  let high = 0;
  domain.probes.forEach(pNum => {
    if(results[pNum] && results[pNum].signal === "high") high++;
  });
  ratioEl.textContent = \`\${high} / \${domain.probes.length} high\`;
}

/* INITIALIZE EVIDENCE WORKSPACE TABLE */
function initEvidenceWorkspace(){
  const tbody = $("#evidenceTableBody");
  if(!tbody) return;
  tbody.innerHTML = "";

  modules.forEach(m => {
    const p = getProbeDefinition(m.num);
    const tr = document.createElement("tr");
    tr.className = "evidence-row";
    tr.id = \`evidence-row-\${m.num}\`;
    tr.setAttribute("tabindex", "0");
    tr.setAttribute("role", "button");
    tr.setAttribute("aria-label", \`Probe \${m.num}: \${p.title}. Press enter to inspect.\`);

    tr.innerHTML = \`
      <td class="col-num">\${m.num}</td>
      <td class="col-title">\${esc(p.title)}</td>
      <td class="col-domain">\${esc(p.domain)}</td>
      <td><span class="badge-tag \${p.distinctiveness}" id="row-badge-\${m.num}">\${p.distinctiveness.toUpperCase()}</span></td>
      <td><span class="badge-tag">\${esc(p.stability)}</span></td>
      <td><span class="badge-tag \${p.source}">\${p.source.toUpperCase()}</span></td>
      <td class="col-observed" id="row-obs-\${m.num}">Probing…</td>
      <td class="col-action"><button class="inspect-btn">Inspect →</button></td>
    \`;

    tr.addEventListener("click", () => openInspector(m.num));
    tr.addEventListener("keydown", e => {
      if(e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInspector(m.num);
      }
    });

    tbody.appendChild(tr);
  });
}

function renderEvidenceRow(num){
  const p = getProbeDefinition(num);
  const badge = document.getElementById(\`row-badge-\${num}\`);
  const obs = document.getElementById(\`row-obs-\${num}\`);
  if(badge){
    badge.className = \`badge-tag \${p.distinctiveness}\`;
    badge.textContent = p.distinctiveness.toUpperCase();
  }
  if(obs){
    const firstRow = p.telemetry[0];
    const preview = firstRow ? \`\${firstRow[0]}: \${firstRow[1]}\` : "(None)";
    obs.textContent = preview;
  }
}

/* SEARCH & FILTER SEPARATION */
function setDomainFilter(domainName){
  activeDomainFilter = domainName;
  const wrap = $("#activeDomainFilterWrap");
  const text = $("#activeDomainChipText");
  if(wrap && text){
    if(domainName){
      text.textContent = domainName;
      wrap.style.display = "inline-flex";
    } else {
      wrap.style.display = "none";
    }
  }
  applyWorkspaceFilters();
}

function clearDomainFilter(){
  setDomainFilter(null);
}

function applyWorkspaceFilters(){
  const query = activeSearchQuery.toLowerCase().trim();
  const tbody = $("#evidenceTableBody");
  if(!tbody) return;

  modules.forEach(m => {
    const p = getProbeDefinition(m.num);
    const row = document.getElementById(\`evidence-row-\${m.num}\`);
    if(!row) return;

    let matchPill = true;
    if(activePillFilter === "high") matchPill = (p.distinctiveness === "high");
    else if(activePillFilter === "med") matchPill = (p.distinctiveness === "med");
    else if(activePillFilter === "low") matchPill = (p.distinctiveness === "low");
    else if(activePillFilter === "local") matchPill = (p.source === "local");
    else if(activePillFilter === "external") matchPill = (p.source === "external");

    let matchDomain = true;
    if(activeDomainFilter){
      matchDomain = (p.domain.toLowerCase() === activeDomainFilter.toLowerCase());
    }

    let matchQuery = true;
    if(query){
      const haystack = [
        m.num,
        p.title,
        p.domain,
        p.method,
        p.stability,
        ...p.telemetry.map(([k, v]) => \`\${k} \${v}\`)
      ].join(" ").toLowerCase();
      matchQuery = haystack.includes(query);
    }

    row.style.display = (matchPill && matchDomain && matchQuery) ? "" : "none";
  });
}

/* LAYER 2: TOP CONTRIBUTORS */
function updateContributorItems(){
  const list = $("#contributorsList");
  if(!list) return;

  const prioritized = [
    "05", "06", "08", "09", "03", "07", "04", "18", "16", "20",
    "17", "10", "11", "12", "14", "15", "21", "22", "23", "25",
    "30", "32", "33", "27", "31", "19", "01", "02", "13", "24",
    "28", "26", "29"
  ];

  const topList = prioritized
    .filter(n => results[n])
    .sort((a, b) => distinctivenessRank(results[b]?.signal) - distinctivenessRank(results[a]?.signal))
    .slice(0, 5);

  list.innerHTML = "";
  topList.forEach((num, idx) => {
    const p = getProbeDefinition(num);
    const row = document.createElement("div");
    row.className = "contrib-row";
    row.setAttribute("tabindex", "0");
    row.setAttribute("role", "listitem");
    row.setAttribute("aria-label", \`Rank \${idx + 1}: \${p.title}, \${p.distinctiveness.toUpperCase()}\`);

    row.innerHTML = \`
      <div class="contrib-left">
        <span class="contrib-num">0\${idx + 1}</span>
        <div>
          <div class="contrib-title">\${esc(p.title)}</div>
          <div class="contrib-domain">\${esc(p.domain)} · \${esc(p.stability)}</div>
        </div>
      </div>
      <div class="contrib-right">
        <div class="contrib-bar-wrap" title="Relative entropy weight">
          <div class="contrib-bar-fill" style="width:\${p.distinctiveness === 'high' ? '100%' : (p.distinctiveness === 'med' ? '60%' : '25%')}; background:var(--distinct-\${p.distinctiveness});"></div>
        </div>
        <span class="badge-tag \${p.distinctiveness}">\${p.distinctiveness.toUpperCase()}</span>
        <span class="contrib-inspect-link">Inspect →</span>
      </div>
    \`;

    row.addEventListener("click", () => openInspector(num));
    row.addEventListener("keydown", e => {
      if(e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInspector(num);
      }
    });

    list.appendChild(row);
  });
}

/* PROBE INSPECTOR DRAWER CONTROLLER */
let lastActiveElement = null;

function openInspector(num){
  lastActiveElement = document.activeElement;
  inspectedProbeNum = num;
  const p = getProbeDefinition(num);

  $("#inspectNum").textContent = p.num;
  $("#inspectTitle").textContent = p.title;

  const distBadge = $("#inspectDistinctBadge");
  distBadge.className = \`badge-tag \${p.distinctiveness}\`;
  distBadge.textContent = p.distinctiveness.toUpperCase() + " DISTINCTIVENESS";

  const stabBadge = $("#inspectStabilityBadge");
  stabBadge.className = "badge-tag";
  stabBadge.textContent = p.stability;

  const srcBadge = $("#inspectSourceBadge");
  srcBadge.className = \`badge-tag \${p.source}\`;
  srcBadge.textContent = p.source.toUpperCase();

  $("#inspectDomain").textContent = p.domain;

  const preview = p.telemetry[0] ? \`\${p.telemetry[0][0]}: \${p.telemetry[0][1]}\` : "No primary signal observed";
  $("#inspectObserved").textContent = preview;

  $("#inspectWhy").textContent = p.why;
  $("#inspectMethod").textContent = p.method;
  $("#inspectVisibility").textContent = p.visibility;
  $("#inspectStability").textContent = p.stability;
  $("#inspectDomainVal").textContent = p.domain;

  // Raw telemetry rows
  const evidenceBody = $("#inspectEvidenceBody");
  evidenceBody.innerHTML = "";
  if(p.telemetry.length === 0){
    const tr = document.createElement("tr");
    tr.innerHTML = \`<td colspan="2" style="padding:10px; color:var(--text-tertiary);">No raw telemetry captured</td>\`;
    evidenceBody.appendChild(tr);
  } else {
    p.telemetry.forEach(([k, v]) => {
      const tr = document.createElement("tr");
      tr.innerHTML = \`
        <td class="raw-k">\${esc(k)}</td>
        <td class="raw-v">
          <span>\${esc(v)}</span>
          <button class="raw-copy-btn" title="Copy value">Copy</button>
        </td>
      \`;
      tr.querySelector(".raw-copy-btn").addEventListener("click", async e => {
        e.stopPropagation();
        await navigator.clipboard.writeText(String(v));
        e.target.textContent = "Copied ✓";
        setTimeout(() => e.target.textContent = "Copy", 1200);
      });
      evidenceBody.appendChild(tr);
    });
  }

  // Live collection code snippet
  $("#inspectCodePre").textContent = p.code;

  // Open drawer & backdrop
  $("#probeInspector").classList.add("open");
  $("#probeInspector").setAttribute("aria-hidden", "false");
  $("#inspectorBackdrop").classList.add("open");
  $("#inspectorBackdrop").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("#inspectCloseBtn").focus();
}

function closeInspector(){
  $("#probeInspector").classList.remove("open");
  $("#probeInspector").setAttribute("aria-hidden", "true");
  $("#inspectorBackdrop").classList.remove("open");
  $("#inspectorBackdrop").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if(lastActiveElement) lastActiveElement.focus();
}

/* ============================================================
   DIAGNOSTIC ENGINE: RUN ALL & ENTROPY ESTIMATE
   ============================================================ */
async function runModule(m, gen){
  try {
    const res = await m.fn();
    if(gen === runGen) publish(m.num, null, res);
  } catch(e) {
    if(gen === runGen) publish(m.num, null, { signal:"low", rows:[["error", e.message]] });
  }
}

async function runAll(){
  if(running) return;
  running = true;
  const gen = ++runGen;
  
  $("#globalStatusDot").className = "status-dot probing";
  $("#globalStatusText").textContent = "Running diagnostics...";

  let completed = 0;
  for(const m of modules){
    await runModule(m, gen);
    completed++;
    $("#readoutStatusSummary").textContent = \`PROBING \${completed} OF \${modules.length} SURFACES\`;
  }

  await computeIdentity();
  updateOverviewCounters();

  $("#globalStatusDot").className = "status-dot";
  $("#globalStatusText").textContent = "Diagnostic Complete";
  $("#readoutStatusSummary").textContent = \`ANALYSIS COMPLETED · \${modules.length} SURFACES MEASURED\`;
  running = false;
}

async function estimateEntropy(){
  let bits = 0;
  const weights = {
    screen: 3.8, hz: 1.2, cores: 2.1, mem: 1.8, touch: 1.1,
    glvendor: 3.5, glrend: 4.8, gpu: 2.2,
    tz: 3.2, locale: 2.8, dst: 1.0, plat: 2.0, langs: 2.5,
    canvas: 5.2, audio: 4.6, math: 2.1, codecs: 3.4, glext: 3.9, fonts: 4.5, rects: 3.1, tmetrics: 3.0,
    ua: 4.2, uach: 3.8, apis: 2.9, voices: 3.6, kbd: 2.0, wasm: 1.5,
    css: 2.4, timing: 1.8, quota: 1.5, net: 1.8, battery: 1.2,
    perms: 2.5, webrtc: 2.8, ip: 5.0, ip_asn: 3.5, cookies: 1.2, devices: 2.5
  };
  const sigs = allSignals();
  for(const k in sigs){
    if(weights[k]) bits += weights[k];
  }
  // Cap at 33.3 empirical limit
  bits = Math.min(bits, 33.3);
  const oneIn = Math.pow(2, bits);
  return { bits, oneIn };
}

function uniqBand(bits){
  if(bits < 10) return { label:"Low Distinctiveness", cls:"low" };
  if(bits < 22) return { label:"Moderate Distinctiveness", cls:"med" };
  return { label:"High Distinctiveness", cls:"high" };
}

async function computeIdentity(){
  const b = await detectBrowser();
  const screenMeta = window.screen ? \`\${window.screen.width}×\${window.screen.height}\` : "";
  const platformMeta = navigator.platform || (navigator.userAgentData?.platform) || "Desktop";
  $("#browserSignature").textContent = \`\${b.name} \${b.version} · \${b.engine} · \${platformMeta} · \${screenMeta}\`;

  const tierHash = async t => {
    const k = Object.keys(TIERS[t]).sort();
    return k.length ? await sha256(k.map(x=>x+"="+TIERS[t][x]).join("|")) : "(none)";
  };
  $("#hashHw").textContent = short(await tierHash("hw"));
  $("#hashEngine").textContent = short(await tierHash("engine"));
  $("#hashBuild").textContent = short(await tierHash("build"));
  $("#hashSess").textContent = short(await tierHash("session"));

  const E = await estimateEntropy();
  const band = uniqBand(E.bits);

  const heroBadge = $("#heroBadge");
  heroBadge.className = \`verdict-headline \${band.cls}\`;
  heroBadge.textContent = band.label.toUpperCase();

  $("#heroBitsVal").textContent = E.bits.toFixed(1);
  $("#heroSummary").textContent = \`Under the empirical reference model, this browser configuration contains an uncommon combination of observed characteristics (approximately \${fmtOneIn(E.oneIn)} observed profiles).\`;

  updateOverviewCounters();
}

/* ============================================================
   SECTION 5: NETWORK LOOKUPS & PRE-FLIGHT DISCLOSURE
   ============================================================ */
async function stunIPs(signal){
  if(!window.RTCPeerConnection || (signal&&signal.aborted)) return [];
  let pc=null;
  try{
    pc = new RTCPeerConnection({
      iceServers:[
        { urls:"stun:stun.l.google.com:19302" },
        { urls:"stun:stun1.l.google.com:19302" }
      ]
    });
    const ips = new Set();
    pc.createDataChannel("");
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await new Promise(r => {
      const tm = setTimeout(r, 2200);
      pc.onicecandidate = ev => {
        if(!ev || !ev.candidate){ clearTimeout(tm); r(); return; }
        const c = ev.candidate.candidate;
        const m = c.match(/(?:[0-9]{1,3}\\.){3}[0-9]{1,3}|(?:[a-f0-9]{1,4}:){7}[a-f0-9]{1,4}/i);
        if(m && !m[0].endsWith(".local")) ips.add(m[0]);
      };
    });
    return Array.from(ips);
  } catch(e){
    return [];
  } finally {
    try { if(pc) pc.close(); } catch(e){}
  }
}

async function fetchIPIntelligence(){
  const endpoints = [
    { url:"https://ipwho.is/", parse: d => ({ ip: d.ip, country: d.country, city: d.city, asn: d.connection?.asn ? \`AS\${d.connection.asn} \${d.connection.org||""}\` : "", vpn: d.security?.vpn || d.security?.proxy }) },
    { url:"https://get.geojs.io/v1/ip/geo.json", parse: d => ({ ip: d.ip, country: d.country, city: d.city, asn: d.organization_name ? \`AS\${d.asn||""} \${d.organization_name}\` : "", vpn: false }) }
  ];

  for(const ep of endpoints){
    try {
      const ctrl = new AbortController();
      const tm = setTimeout(() => ctrl.abort(), 3500);
      const res = await fetch(ep.url, { signal: ctrl.signal });
      clearTimeout(tm);
      if(res.ok){
        const json = await res.json();
        return ep.parse(json);
      }
    } catch(e){}
  }
  return null;
}

async function enableNetworkInspection(){
  networkAuthorized = true;
  $("#netStateDisabled").style.display = "none";
  $("#netStateActive").style.display = "block";

  $("#netIpDisplay").textContent = "Querying…";
  $("#netLocDisplay").textContent = "Querying…";
  $("#netAsnDisplay").textContent = "Querying…";
  $("#netVpnDisplay").textContent = "Analyzing…";

  const intel = await fetchIPIntelligence();
  if(intel){
    $("#netIpDisplay").textContent = intel.ip || "Unresolved";
    $("#netLocDisplay").textContent = [intel.city, intel.country].filter(Boolean).join(", ") || "Unknown";
    $("#netAsnDisplay").textContent = intel.asn || "Unknown";
    $("#netVpnDisplay").textContent = intel.vpn ? "VPN / Datacenter Detected" : "Residential / Direct ISP";

    feed("ip", intel.ip);
    feed("ip_asn", intel.asn);
    publish("26", null, {
      signal: intel.vpn ? "med" : "high",
      rows: [
        ["Public IP", intel.ip],
        ["Geo Location", [intel.city, intel.country].filter(Boolean).join(", ")],
        ["ASN / Carrier", intel.asn],
        ["VPN / Proxy", intel.vpn ? "Detected" : "Clean"]
      ]
    });
  } else {
    $("#netIpDisplay").textContent = "Query Blocked / Offline";
    $("#netLocDisplay").textContent = "Blocked";
    $("#netAsnDisplay").textContent = "Blocked";
    $("#netVpnDisplay").textContent = "Unknown";
  }

  // Re-estimate identity with external telemetry
  await computeIdentity();
}

function disableNetworkInspection(){
  networkAuthorized = false;
  $("#netStateActive").style.display = "none";
  $("#netStateDisabled").style.display = "block";
  $("#netIpDisplay").textContent = "—";
  $("#netLocDisplay").textContent = "—";
  $("#netAsnDisplay").textContent = "—";
  $("#netVpnDisplay").textContent = "—";
  $("#netStatusText").textContent = "Network inspection disabled by user";
  delete TIERS.session.ip;
  delete TIERS.session.ip_asn;
  computeIdentity();
}

/* ============================================================
   EVENT LISTENERS & LIFECYCLE INITIALIZATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  initSignalMap();
  initAtlas();
  initEvidenceWorkspace();

  // Run full diagnostics
  await runAll();

  // Navigation rail expand toggle
  const rail = $("#navRail");
  const btnToggleRail = $("#btnToggleNavRail");
  if(btnToggleRail && rail){
    btnToggleRail.addEventListener("click", () => {
      const isExp = rail.classList.toggle("expanded");
      btnToggleRail.setAttribute("aria-expanded", String(isExp));
    });
  }

  // Header re-run button
  $("#btnRerun").addEventListener("click", () => runAll());

  // Menu dropdown toggle
  const menuTrigger = $("#btnMenuTrigger");
  const menuDropdown = $("#menuDropdown");
  menuTrigger.addEventListener("click", e => {
    e.stopPropagation();
    const isOpen = menuDropdown.classList.toggle("open");
    menuTrigger.setAttribute("aria-expanded", String(isOpen));
  });
  document.addEventListener("click", () => {
    menuDropdown.classList.remove("open");
    menuTrigger.setAttribute("aria-expanded", "false");
  });

  // Export JSON Report
  $("#btnExportJson").addEventListener("click", () => {
    const canonicalProbes = {};
    modules.forEach(m => {
      canonicalProbes[m.num] = getProbeDefinition(m.num);
    });
    const report = {
      product: "Dark Flags",
      spec: "Forensic Observatory",
      generatedAt: new Date().toISOString(),
      browser: BROWSER,
      entropyBits: $("#heroBitsVal").textContent,
      tierHashes: {
        hardware: $("#hashHw").textContent,
        engine: $("#hashEngine").textContent,
        build: $("#hashBuild").textContent,
        session: $("#hashSess").textContent
      },
      probes: canonicalProbes
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = \`dark-flags-telemetry-\${Date.now()}.json\`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Copy Full Identity Hash
  $("#btnCopyHash").addEventListener("click", async () => {
    const full = [$("#hashHw").textContent, $("#hashEngine").textContent, $("#hashBuild").textContent, $("#hashSess").textContent].join(":");
    await navigator.clipboard.writeText(full);
    alert("Full identity tier hash copied to clipboard.");
  });

  // High contrast mode toggle
  $("#btnToggleHivis").addEventListener("click", () => {
    document.body.classList.toggle("hivis");
  });

  // Search input with clear button
  const searchInput = $("#probeSearch");
  const clearSearchBtn = $("#btnClearSearch");
  searchInput.addEventListener("input", e => {
    activeSearchQuery = e.target.value;
    clearSearchBtn.style.display = activeSearchQuery ? "block" : "none";
    applyWorkspaceFilters();
  });
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    activeSearchQuery = "";
    clearSearchBtn.style.display = "none";
    applyWorkspaceFilters();
    searchInput.focus();
  });

  // Active domain filter chip clear button
  $("#btnClearDomainFilter").addEventListener("click", () => {
    clearDomainFilter();
  });

  // Filter pills
  $$(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      $$(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activePillFilter = pill.getAttribute("data-filter");
      applyWorkspaceFilters();
    });
  });

  // Sort selector
  $("#sortSelect").addEventListener("change", e => {
    const mode = e.target.value;
    const tbody = $("#evidenceTableBody");
    const rows = Array.from(tbody.querySelectorAll("tr.evidence-row"));

    rows.sort((a, b) => {
      const numA = a.id.replace("evidence-row-", "");
      const numB = b.id.replace("evidence-row-", "");
      const pA = getProbeDefinition(numA);
      const pB = getProbeDefinition(numB);

      if(mode === "distinct") return distinctivenessRank(pB.distinctiveness) - distinctivenessRank(pA.distinctiveness);
      if(mode === "domain") return pA.domain.localeCompare(pB.domain);
      if(mode === "stability") return pA.stability.localeCompare(pB.stability);
      return parseInt(numA, 10) - parseInt(numB, 10);
    });

    rows.forEach(r => tbody.appendChild(r));
  });

  // Network authorization actions
  $("#btnRunNetworkLookups").addEventListener("click", enableNetworkInspection);
  $("#btnDisableNetworkLookups").addEventListener("click", disableNetworkInspection);
  $("#btnKeepLocalOnly").addEventListener("click", () => {
    disableNetworkInspection();
    alert("Local-only mode enforced. External network lookups will remain disabled.");
  });

  // Methodology accordion triggers
  $$(".accordion-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      const isOpen = panel.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
      btn.querySelector("span:last-child").textContent = isOpen ? "−" : "+";
    });
  });

  // Inspector Drawer Actions
  $("#inspectCloseBtn").addEventListener("click", closeInspector);
  $("#inspectorBackdrop").addEventListener("click", closeInspector);

  document.addEventListener("keydown", e => {
    if(e.key === "Escape"){
      closeInspector();
      menuDropdown.classList.remove("open");
    }
  });

  // Copy values from Inspector
  $("#btnCopyEvidenceValues").addEventListener("click", async e => {
    const p = getProbeDefinition(inspectedProbeNum);
    const text = p.telemetry.map(([k, v]) => \`\${k}: \${v}\`).join("\\n");
    await navigator.clipboard.writeText(text);
    e.target.textContent = "Copied ✓";
    setTimeout(() => e.target.textContent = "Copy Values", 1200);
  });

  // Copy JSON from Inspector
  $("#btnCopyEvidenceJson").addEventListener("click", async e => {
    const p = getProbeDefinition(inspectedProbeNum);
    await navigator.clipboard.writeText(JSON.stringify(p, null, 2));
    e.target.textContent = "JSON Copied ✓";
    setTimeout(() => e.target.textContent = "Copy JSON", 1200);
  });

  // Copy Share Link
  $("#btnCopyShareLink").addEventListener("click", async e => {
    const url = \`\${window.location.origin}#probe-\${inspectedProbeNum}\`;
    await navigator.clipboard.writeText(url);
    e.target.textContent = "Link Copied ✓";
    setTimeout(() => e.target.textContent = "Share Link", 1200);
  });

  // Copy tier hashes
  $$(".tier-hash-copy").forEach(btn => {
    btn.addEventListener("click", async () => {
      const targetId = btn.getAttribute("data-copy");
      const text = document.getElementById(targetId).textContent;
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied";
      setTimeout(() => btn.textContent = "Copy", 1200);
    });
  });

  // Scroll-spy active link updating
  const sections = ["overview", "signal-map", "contributors", "exposure-atlas", "evidence-workspace", "network-disclosure", "methodology"];
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 100;
    for(const id of sections){
      const el = document.getElementById(id);
      if(el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight){
        $$(".nav-rail-link").forEach(l => {
          const match = l.getAttribute("href") === \`#\${id}\`;
          l.classList.toggle("active", match);
          if(match) l.setAttribute("aria-current", "page");
          else l.removeAttribute("aria-current");
        });
        break;
      }
    }
  });
});
  </script>
</body>
</html>
`;

// Extract <script>...</script> content to test compilation with vm
const scriptMatch = refinedHtml.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error("Could not find script block in refined HTML!");
  process.exit(1);
}

try {
  new vm.Script(scriptMatch[1]);
  console.log("SUCCESS: Script compiled cleanly with node:vm without any syntax errors.");
} catch (e) {
  console.error("SYNTAX ERROR in script:", e);
  process.exit(1);
}

// Write refined index.html
fs.writeFileSync("index.html", refinedHtml, "utf8");
console.log(`Refined index.html written successfully! Total size: ${refinedHtml.length} bytes.`);
