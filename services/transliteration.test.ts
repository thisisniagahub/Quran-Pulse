/**
 * Test file for Transliteration Converter
 * Run these tests to verify conversion quality
 */

import { 
  convertToAcademicTransliteration, 
  hasProperDiacritics,
  getTransliterationStats,
  TRANSLITERATION_EXAMPLES 
} from './transliterationConverter';

console.log('='.repeat(80));
console.log('TRANSLITERATION CONVERTER TEST SUITE');
console.log('='.repeat(80));
console.log('');

// Test 1: Surah Al-Fatihah (Complete)
console.log('📖 TEST 1: SURAH AL-FATIHAH');
console.log('-'.repeat(80));

const fatihahSimple = [
  "Bismillahir Rahmanir Raheem",
  "Alhamdu lillahi rabbil aalameen",
  "Ar-Rahmanir-Raheem",
  "Maliki yawmid deen",
  "Iyyaka na'budu wa iyyaka nasta'een",
  "Ihdinas siratal mustaqeem",
  "Siratal ladhina an'amta alaihim ghairil maghdubi alaihim walad dallin"
];

const fatihahExpected = [
  "Bismillāhir-Raḥmānir-Raḥīm",
  "Alḥamdu lillāhi Rabbil-ʿĀlamīn",
  "Ar-Raḥmānir-Raḥīm",
  "Māliki Yawmid-Dīn",
  "Iyyāka Naʿbudu wa iyyāka Nastaʿīn",
  "Ihdinā Ṣirāṭal-Mustaqīm",
  "Ṣirāṭal-ladhīna Anʿamta ʿalayhim Ghayril-maghḍūbi ʿalayhim wa laḍ-Ḍāllīn"
];

fatihahSimple.forEach((simple, index) => {
  const converted = convertToAcademicTransliteration(simple);
  const expected = fatihahExpected[index];
  const match = converted === expected;
  
  console.log(`Ayah ${index + 1}:`);
  console.log(`  Input:    ${simple}`);
  console.log(`  Output:   ${converted}`);
  console.log(`  Expected: ${expected}`);
  console.log(`  Status:   ${match ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

// Test 2: Common Islamic Phrases
console.log('🕌 TEST 2: COMMON ISLAMIC PHRASES');
console.log('-'.repeat(80));

const commonPhrases = [
  { simple: "Subhanallah", expected: "Subḥānallāh" },
  { simple: "Alhamdulillah", expected: "Alḥamdu lillāh" },
  { simple: "Allahu Akbar", expected: "Allāhu Akbar" },
  { simple: "Astaghfirullah", expected: "Astaghfirullāh" },
  { simple: "La ilaha illallah", expected: "Lā ilāha illallāh" },
  { simple: "Muhammad Rasulullah", expected: "Muḥammad Rasūlullāh" },
  { simple: "Sallallahu alayhi wasallam", expected: "Ṣallallāhu ʿalayhi wa sallam" },
  { simple: "Ramadan Kareem", expected: "Ramaḍān Kareem" },
];

commonPhrases.forEach(({ simple, expected }) => {
  const converted = convertToAcademicTransliteration(simple);
  const match = converted === expected;
  
  console.log(`"${simple}"`);
  console.log(`  → ${converted}`);
  console.log(`  Expected: ${expected}`);
  console.log(`  ${match ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

// Test 3: Diacritical Detection
console.log('🔍 TEST 3: DIACRITICAL MARK DETECTION');
console.log('-'.repeat(80));

const testTexts = [
  "Bismillah",  // No diacritics
  "Bismillāh",  // Has diacritics
  "Alhamdulillah",  // No diacritics
  "Alḥamdu lillāh",  // Has diacritics
];

testTexts.forEach(text => {
  const hasDiacritics = hasProperDiacritics(text);
  const stats = getTransliterationStats(text);
  
  console.log(`Text: "${text}"`);
  console.log(`  Has Diacritics: ${hasDiacritics ? '✅ Yes' : '❌ No'}`);
  console.log(`  Stats:`, stats);
  console.log('');
});

// Test 4: Examples from TRANSLITERATION_EXAMPLES
console.log('📚 TEST 4: BUILT-IN EXAMPLES');
console.log('-'.repeat(80));

TRANSLITERATION_EXAMPLES.forEach(({ simple, academic }, index) => {
  const converted = convertToAcademicTransliteration(simple);
  const match = converted === academic;
  
  console.log(`Example ${index + 1}:`);
  console.log(`  Input:    ${simple}`);
  console.log(`  Output:   ${converted}`);
  console.log(`  Expected: ${academic}`);
  console.log(`  Status:   ${match ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

// Test 5: Batch Conversion (Ayahs)
console.log('📦 TEST 5: BATCH AYAH CONVERSION');
console.log('-'.repeat(80));

const mockAyahs = [
  { number: 1, text: "Bismillahir Rahmanir Raheem", numberInSurah: 1 },
  { number: 2, text: "Alhamdu lillahi rabbil aalameen", numberInSurah: 2 },
  { number: 3, text: "Ar-Rahmanir-Raheem", numberInSurah: 3 },
];

console.log('Before conversion:');
mockAyahs.forEach(ayah => {
  console.log(`  ${ayah.numberInSurah}. ${ayah.text}`);
  console.log(`     Has diacritics: ${hasProperDiacritics(ayah.text) ? '✅' : '❌'}`);
});

console.log('');

const converted = mockAyahs.map(ayah => ({
  ...ayah,
  text: convertToAcademicTransliteration(ayah.text)
}));

console.log('After conversion:');
converted.forEach(ayah => {
  console.log(`  ${ayah.numberInSurah}. ${ayah.text}`);
  console.log(`     Has diacritics: ${hasProperDiacritics(ayah.text) ? '✅' : '❌'}`);
});

console.log('');
console.log('='.repeat(80));
console.log('TEST SUITE COMPLETE');
console.log('='.repeat(80));

// Summary
const allTests = [
  ...fatihahSimple.map((simple, i) => 
    convertToAcademicTransliteration(simple) === fatihahExpected[i]
  ),
  ...commonPhrases.map(({ simple, expected }) => 
    convertToAcademicTransliteration(simple) === expected
  ),
  ...TRANSLITERATION_EXAMPLES.map(({ simple, academic }) => 
    convertToAcademicTransliteration(simple) === academic
  ),
];

const passed = allTests.filter(Boolean).length;
const total = allTests.length;
const percentage = ((passed / total) * 100).toFixed(1);

console.log('');
console.log(`RESULTS: ${passed}/${total} tests passed (${percentage}%)`);
console.log('');

if (passed === total) {
  console.log('🎉 ALL TESTS PASSED! Transliteration converter working perfectly!');
} else {
  console.log('⚠️  Some tests failed. Review the output above for details.');
}
