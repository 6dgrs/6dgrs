import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const home = source("index.html");
const homeScript = source("app.js");
const join = source("join/index.html");
const joinScript = source("join/join.js");
const aasaText = source(".well-known/apple-app-site-association");
const aasaRoot = source("apple-app-site-association");
const vercel = JSON.parse(source("vercel.json"));
const aasa = JSON.parse(aasaText);

assert.match(home, /href="join\/"/);
assert.doesNotMatch(homeScript, /TALLY_FORM_URL|data-beta-cta/);
assert.match(join, /Private beta/);
assert.match(join, /Request beta access/);
assert.match(join, /You’ve been invited to a Plan on 6dgrs/);
assert.match(join, /Plan details stay private/);
assert.doesNotMatch(join, /host name|attendee|location|plan title/i);
assert.match(join, /name="referrer" content="no-referrer"/);
assert.doesNotMatch(joinScript, /fetch\(|localStorage|sessionStorage|console\.|analytics/i);
assert.match(joinScript, /\^\[0-9a-f\]\{64\}\$/i);
assert.match(joinScript, /sixdgrs:\/\/join\?token=/);
assert.match(joinScript, /history\.replaceState/);

assert.equal(aasaRoot, aasaText);
assert.deepEqual(aasa.applinks.details[0].appIDs, ["99X548LRU4.app.6dgrs.mobile"]);
assert.equal(aasa.applinks.details[0].components.length, 4);
assert.ok(aasa.applinks.details[0].components.every((component) => component["/"] === "/join" || component["/"] === "/join/"));
assert.ok(vercel.headers.some((rule) => rule.source === "/.well-known/apple-app-site-association"));
assert.ok(vercel.headers.some((rule) => rule.source === "/join(.*)"));

function runJoin(search, hash) {
  const elements = new Map([
    ['[data-state="ordinary"]', { hidden: true }],
    ['[data-state="invitation"]', { hidden: true }],
    ['[data-state="unavailable"]', { hidden: true }],
    ['[data-open-app]', { href: "sixdgrs://join" }]
  ]);
  const replacements = [];
  const context = {
    URLSearchParams,
    document: { querySelector: (selector) => elements.get(selector) },
    window: {
      location: { search, hash },
      history: { replaceState: (...args) => replacements.push(args) }
    }
  };
  vm.runInNewContext(joinScript, context);
  return { elements, replacements };
}

const token = "a".repeat(64);
const ordinary = runJoin("", "");
assert.equal(ordinary.elements.get('[data-state="ordinary"]').hidden, false);

const fragment = runJoin("", `#token=${token}`);
assert.equal(fragment.elements.get('[data-state="invitation"]').hidden, false);
assert.equal(fragment.elements.get('[data-open-app]').href, `sixdgrs://join?token=${token}`);
assert.equal(fragment.replacements.length, 0);

const legacyQuery = runJoin(`?token=${token}`, "");
assert.equal(legacyQuery.elements.get('[data-state="invitation"]').hidden, false);
assert.equal(legacyQuery.replacements[0][2], `/join#token=${token}`);

const invalid = runJoin("?token=not-a-token", "");
assert.equal(invalid.elements.get('[data-state="unavailable"]').hidden, false);
assert.equal(invalid.elements.get('[data-open-app]').href, "sixdgrs://join");

console.log("PASS P2 website ordinary join, secure invitation handoff, AASA and runtime states");
