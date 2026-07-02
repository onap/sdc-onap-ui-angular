// Render the browsable HTML coverage report from Jest's coverage-final.json.
//
// Why this exists instead of Jest's built-in `html` reporter:
// Jest 23 pulls istanbul-api@1.3.7 -> istanbul-reports@1.5.1, whose HTML report
// template interpolates coverage numbers (e.g. {{metrics.statements.pct}}) that
// live on the CoverageSummary PROTOTYPE (only `data` is an own-property).
// Handlebars >= 4.6.0 blocks prototype-property access by default (a 2019/2020
// security hardening), so every number renders BLANK while the colour classes
// (computed in plain JS) still look right — a report full of empty "%" and "/".
// Pinning handlebars < 4.6 would fix the render but reintroduce known handlebars
// RCE CVEs, unacceptable upstream.
//
// So we let Jest emit the machine-readable formats (json, lcovonly, cobertura)
// and render the human-facing HTML here with a modern, handlebars-FREE
// istanbul-reports@3. This is a dev/CI-only reporting step; it does not touch
// the library build or anything a consumer receives.
//
// Usage: node scripts/render-coverage-html.js [coverageDir]   (default: coverage)

const path = require('path');
const fs = require('fs');
const libCoverage = require('istanbul-lib-coverage');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');

const coverageDir = path.resolve(process.cwd(), process.argv[2] || 'coverage');
const finalJson = path.join(coverageDir, 'coverage-final.json');

if (!fs.existsSync(finalJson)) {
    console.error(
        `[render-coverage-html] ${finalJson} not found. ` +
        'Run the tests with coverage first (npm test -- --coverage).'
    );
    process.exit(1);
}

const map = libCoverage.createCoverageMap(JSON.parse(fs.readFileSync(finalJson, 'utf8')));
const context = libReport.createContext({ dir: coverageDir, coverageMap: map });

reports.create('html', { skipEmpty: false }).execute(context);

console.log(`[render-coverage-html] HTML report written to ${path.join(coverageDir, 'index.html')}`);
