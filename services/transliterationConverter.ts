/**
 * Provides functionality to convert simple Roman transliteration of Arabic
 * into a more academic format with proper diacritics.
 */

// A map for full phrases to handle complex cases and ensure high accuracy.
const PHRASE_MAP: { [key: string]: string } = {
    'bismillahir rahmanir raheem': 'Bismillāhir-Raḥmānir-Raḥīm',
    'alhamdu lillahi rabbil aalameen': 'Alḥamdu lillāhi Rabbil-ʿĀlamīn',
    'ar-rahmanir-raheem': 'Ar-Raḥmānir-Raḥīm',
    'maliki yawmid deen': 'Māliki Yawmid-Dīn',
    "iyyaka na'budu wa iyyaka nasta'een": 'Iyyāka Naʿbudu wa iyyāka Nastaʿīn',
    'ihdinas siratal mustaqeem': 'Ihdinā Ṣirāṭal-Mustaqīm',
    "siratal ladhina an'amta alaihim ghairil maghdubi alaihim walad dallin": 'Ṣirāṭal-ladhīna Anʿamta ʿalayhim Ghayril-maghḍūbi ʿalayhim wa laḍ-Ḍāllīn',
    'sallallahu alayhi wasallam': 'Ṣallallāhu ʿalayhi wa sallam',
    'la ilaha illallah': 'Lā ilāha illallāh'
};

// A map for individual words not covered in the complex phrases.
const WORD_MAP: { [key: string]: string } = {
    'subhanallah': 'Subḥānallāh',
    'alhamdulillah': 'Alḥamdu lillāh',
    'allahu': 'Allāhu',
    'akbar': 'Akbar',
    'astaghfirullah': 'Astaghfirullāh',
    'muhammad': 'Muḥammad',
    'rasulullah': 'Rasūlullāh',
    'ramadan': 'Ramaḍān',
    'kareem': 'Kareem',
    'quran': 'Qurʾān',
    'hadith': 'Ḥadīth',
    'dhikr': 'Dhikr',
    'salah': 'Ṣalāh',
    'zakah': 'Zakāh',
    'bismillah': 'Bismillāh',
};

const DIACRITIC_REGEX = /[āīūḥṣḍṭẓʿʾĀĪŪḤṢḌṬẒ]/;
const STATS_REGEX = {
    longVowels: /[āīūĀĪŪ]/g,
    emphatics: /[ṣḍṭẓṢḌṬẒ]/g,
    gutturals: /[ḥʿḤʿ]/g,
    hamza: /[ʾ]/g,
};

/**
 * Converts a simple transliteration string to its academic equivalent.
 * @param simpleText The input string without diacritics.
 * @returns The converted string with diacritics.
 */
export const convertToAcademicTransliteration = (simpleText: string): string => {
    const lowerText = simpleText.toLowerCase();
    
    // 1. Check for a full phrase match for higher accuracy on complex sentences.
    if (PHRASE_MAP[lowerText]) {
        return PHRASE_MAP[lowerText];
    }
    
    // 2. If not a full phrase, process word by word.
    const words = simpleText.split(/(\s+)/); // Split by space, keeping spaces for reconstruction.
    const convertedWords = words.map(word => {
        const cleanWord = word.trim();
        if (cleanWord === '') return word; // It's a space or multiple spaces.
        
        const mappedWord = WORD_MAP[cleanWord.toLowerCase()];
        
        if (mappedWord) {
            // Preserve the capitalization of the first letter if it was originally uppercase.
            const firstCharIsUpper = cleanWord.charAt(0) === cleanWord.charAt(0).toUpperCase();
            if (firstCharIsUpper) {
                return mappedWord.charAt(0).toUpperCase() + mappedWord.slice(1);
            }
            return mappedWord;
        }
        
        return word; // Return the original word if no mapping is found.
    });
    
    return convertedWords.join('');
};

/**
 * Checks if a string contains any academic diacritical marks.
 * @param text The text to check.
 * @returns True if diacritics are found, false otherwise.
 */
export const hasProperDiacritics = (text: string): boolean => {
    return DIACRITIC_REGEX.test(text);
};

/**
 * Gathers statistics on the types of diacritics present in a string.
 * @param text The text to analyze.
 * @returns An object with counts of different diacritical characters.
 */
export const getTransliterationStats = (text: string): { [key: string]: number } => {
    const stats: { [key: string]: number } = {};
    for (const key in STATS_REGEX) {
        stats[key] = (text.match(STATS_REGEX[key as keyof typeof STATS_REGEX]) || []).length;
    }
    return stats;
};

/**
 * A set of examples for testing and demonstration.
 */
export const TRANSLITERATION_EXAMPLES = [
    { simple: "Quran", academic: "Qurʾān" },
    { simple: "Hadith", academic: "Ḥadīth" },
    { simple: "Dhikr", academic: "Dhikr" },
    { simple: "Salah", academic: "Ṣalāh" },
    { simple: "Zakah", academic: "Zakāh" },
];
