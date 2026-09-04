import assert from "node:assert/strict";
import test from "node:test";
import { fold, slugify, splitIntoPassages, tidy, tokenize, truncate } from "../src/lib/text.ts";

test("fold strips Vietnamese tone marks", () => {
  assert.equal(fold("Điện – Điện lạnh"), "dien – dien lanh");
  assert.equal(fold("Kỹ thuật chế biến món ăn"), "ky thuat che bien mon an");
  // đ/Đ are single code points, so NFD alone would leave them untouched.
  assert.equal(fold("ĐÀO TẠO"), "dao tao");
});

test("fold makes accent-less typing match accented content", () => {
  assert.equal(fold("Trường Cao đẳng"), fold("Truong Cao dang"));
});

test("slugify produces url-safe Vietnamese slugs", () => {
  assert.equal(slugify("Công nghệ ô tô"), "cong-nghe-o-to");
  assert.equal(slugify("Tài chính – Ngân hàng"), "tai-chinh-ngan-hang");
  assert.equal(slugify("   "), "");
});

test("tokenize drops stopwords and question words", () => {
  const terms = tokenize("Học phí ngành công nghệ thông tin là bao nhiêu?");
  assert.ok(!terms.includes("bao"), "bao is a question word");
  assert.ok(!terms.includes("nhieu"), "nhieu is a question word");
  assert.ok(terms.includes("cong"));
  assert.ok(terms.includes("nghe"));
});

test("tokenize keeps meaningful single-topic words", () => {
  assert.deepEqual(tokenize("Logistics"), ["logistics"]);
});

test("splitIntoPassages respects the size budget even without punctuation", () => {
  const passages = splitIntoPassages("a".repeat(2500), 900, 100);
  assert.ok(passages.length > 1, "a wall of text must still be split");
  for (const passage of passages) {
    assert.ok(passage.length <= 900, `passage too long: ${passage.length}`);
  }
});

test("splitIntoPassages keeps short text as a single passage", () => {
  assert.deepEqual(splitIntoPassages("Một câu ngắn."), ["Một câu ngắn."]);
  assert.deepEqual(splitIntoPassages("   "), []);
});

test("tidy collapses spaces but keeps paragraph breaks", () => {
  assert.equal(tidy("a   b\n\n\n\nc  "), "a b\n\nc");
});

test("truncate adds an ellipsis only when it cuts", () => {
  assert.equal(truncate("ngắn", 10), "ngắn");
  assert.ok(truncate("x".repeat(50), 10).endsWith("…"));
  assert.equal(truncate("x".repeat(50), 10).length, 10);
});
