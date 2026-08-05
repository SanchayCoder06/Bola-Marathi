/**
 * BOLA Marathi — Content Fetcher Utility
 * 
 * Scrapes and pulls authentic Marathi learning resources (vocabulary, idioms, 
 * example sentences) from public domain APIs like Wikimedia/Wiktionary 
 * and official Maharashtra State Board learning seeds.
 */

import fs from 'fs';
import path from 'path';

const SEED_URLS = {
  wiktionary: "https://mr.wiktionary.org/w/api.php",
  wikipedia: "https://mr.wikipedia.org/w/api.php"
};

const DEFAULT_TERMS = ["नमस्कार", "धन्यवाद", "पुणे", "मुंबई", "महाराष्ट्र", "भाषा", "शिक्षण", "ज्ञान", "संस्कृती", "प्रवास"];

async function fetchWiktionaryDetails(term) {
  const url = `${SEED_URLS.wiktionary}?action=query&prop=extracts|info&exintro=1&explaintext=1&titles=${encodeURIComponent(term)}&format=json&origin=*`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1') return null;
    
    return {
      word: term,
      extract: pages[pageId].extract || '',
      url: `https://mr.wiktionary.org/wiki/${encodeURIComponent(term)}`
    };
  } catch (e) {
    console.error(`Failed to fetch details for ${term}:`, e);
    return null;
  }
}

async function runFetcher() {
  console.log("🚀 Starting authentic Marathi content crawler...");
  console.log("Sources targeted: Wiktionary API (mr.wiktionary.org)");
  
  const results = [];
  
  for (const term of DEFAULT_TERMS) {
    console.log(`🔍 Crawling definition for: ${term}...`);
    const details = await fetchWiktionaryDetails(term);
    if (details) {
      results.push(details);
    }
    // Respect API rate limits
    await new Promise(r => setTimeout(r, 400));
  }
  
  const targetDir = path.join(process.cwd(), 'data', 'dictionary');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const targetPath = path.join(targetDir, 'crawled_content.json');
  fs.writeFileSync(targetPath, JSON.stringify(results, null, 2), 'utf-8');
  
  console.log(`\n✅ Scraper successfully completed!`);
  console.log(`Saved ${results.length} authentic records to: data/dictionary/crawled_content.json`);
}

// Execute if run directly via Node
runFetcher().catch(err => {
  console.error("Fetcher error:", err);
});
