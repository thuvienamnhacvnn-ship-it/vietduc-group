import assert from "node:assert/strict";
import test from "node:test";
import { isFallback, localePath, t, tList } from "../src/lib/i18n/config.ts";
import { DEFAULT_SETTINGS, socialHref, telHref, resolveSiteUrl } from "../src/lib/site-config.ts";
import { levelLabel, modeLabel } from "../src/lib/format.ts";

test("localised text falls back to Vietnamese rather than rendering empty", () => {
  const field = { vi: "Cao đẳng", en: "College" };
  assert.equal(t(field, "en"), "College");
  assert.equal(t(field, "de"), "Cao đẳng");
  assert.equal(t(null, "vi"), "");
});

test("a blank translation is treated as missing", () => {
  const field = { vi: "Có nội dung", de: "   " };
  assert.equal(t(field, "de"), "Có nội dung");
  assert.equal(isFallback(field, "de"), true);
  assert.equal(isFallback(field, "vi"), false);
});

test("localised lists fall back as a whole", () => {
  const field = { vi: ["một", "hai"], en: [] };
  assert.deepEqual(tList(field, "en"), ["một", "hai"]);
});

test("locale paths never double the leading slash", () => {
  assert.equal(localePath("vi", "/"), "/vi");
  assert.equal(localePath("de", "/chuong-trinh"), "/de/chuong-trinh");
  assert.equal(localePath("en", "truong"), "/en/truong");
});

test("an unconfigured social channel produces no link at all", () => {
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS.social)) {
    assert.equal(value, "", `${key} must ship empty`);
    assert.equal(socialHref(key, value), null, `${key} must not fabricate a URL`);
  }
});

test("social hrefs are built only from what an editor entered", () => {
  assert.equal(socialHref("facebook", "https://facebook.com/vdg"), "https://facebook.com/vdg");
  assert.equal(socialHref("facebook", "facebook.com/vdg"), "https://facebook.com/vdg");
  assert.equal(socialHref("whatsapp", "+84 912 345 678"), "https://wa.me/84912345678");
  assert.equal(socialHref("zalo", "0912345678"), "https://zalo.me/0912345678");
  assert.equal(socialHref("youtube", "   "), null);
});

test("telephone links strip formatting but keep the plus", () => {
  assert.equal(telHref("024 3 123 6868"), "tel:02431236868");
  assert.equal(telHref("+84 24 3123 6868"), "tel:+842431236868");
  assert.equal(telHref(""), null);
});

test("site url resolution trims trailing slashes and has a usable default", () => {
  assert.equal(resolveSiteUrl("https://example.com/"), "https://example.com");
  assert.ok(resolveSiteUrl("").startsWith("http"));
});

test("facet labels are translated, and unknown values pass through", () => {
  assert.equal(levelLabel("cao_dang", "vi"), "Cao đẳng");
  assert.equal(levelLabel("cao_dang", "de"), "College");
  assert.equal(levelLabel("khong_biet", "vi"), "khong_biet");
  assert.equal(modeLabel(null, "vi"), "");
  assert.equal(modeLabel("abroad", "en"), "Includes a phase abroad");
});
