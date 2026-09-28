import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path) => readFileSync(resolve(process.cwd(), path), "utf8");
const home = read("index.html");
const terms = read("terms/index.html");
const privacy = read("privacy/index.html");
const community = read("community-guidelines/index.html");
const safety = read("safety/index.html");
const faq = read("faq/index.html");

for (const document of [terms, privacy, community, safety, faq]) {
  assert.match(document, /href="\.\.\/"/);
  assert.match(document, /6dgrs/);
}

for (const email of ["hello@6dgrs.app", "safety@6dgrs.app", "privacy@6dgrs.app", "feedback@6dgrs.app"]) {
  assert.match(`${home}${faq}`, new RegExp(`mailto:${email.replaceAll(".", "\\.")}`));
}

assert.match(terms, /temporary Around signals/);
assert.match(terms, /Plan invitation or secure share link/);
assert.match(privacy, /Last updated: 28 September 2026/);
assert.match(privacy, /Plan invitations and access grants/);
assert.match(privacy, /optional Trip or Plan cover media/);
assert.match(privacy, /temporary Around signals/);
assert.match(privacy, /positive venue recommendations/);
assert.match(privacy, /Product feedback is retained for 12 months/);
assert.match(community, /Publish Around only when you genuinely choose/);
assert.match(community, /recommend a venue only when it reflects your own genuine positive experience/);
assert.match(safety, /Around does not prove somebody’s live presence/);
assert.match(faq, /What is Around\?/);
assert.match(faq, /What are network recommendations\?/);
assert.match(faq, /verified in-app Settings flow/);
assert.match(faq, /Use the separate safety, privacy and deletion routes/);
assert.doesNotMatch(`${terms}${privacy}${community}${safety}${faq}`, /now available on the App Store|guaranteed safe|identity verified by 6dgrs/);

console.log("PASS P3-WEB-1 legal accuracy, support routing and private-beta product contracts");
