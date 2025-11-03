import React, { useState } from 'react';
import { generateGenericContent } from '../services/geminiService';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { SearchCheckIcon, SparklesIcon } from './icons/Icons';
import { AGENT_DEFINITIONS } from '../lib/agents';

export const HalalCheckerView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agent = {
      ...AGENT_DEFINITIONS.aiCompanion.gemini, // Use a generic agent
      systemInstruction: 'You are an AI assistant providing information on Halal food ingredients based on general Islamic principles. Your primary language is Bahasa Melayu.'
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);
    
    const prompt = `You are an AI assistant specialized in providing information about Halal food status based on general Islamic principles.
    Analyze the following product or ingredient: "${query}".
    Provide a summary in Bahasa Melayu in markdown format, covering:
    1.  **Asal-usul**: The origin of the ingredient/product.
    2.  **Status Umum**: Its general Halal status (Halal, Haram, Syubhah/Mushbooh).
    3.  **Perkara Penting**: Key points for a consumer to look out for (e.g., source of gelatin, alcohol content, method of slaughter).
    
    IMPORTANT: Start your response with a clear disclaimer in bold: "**Penafian: Maklumat ini dijana oleh AI dan bukan sijil Halal rasmi. Untuk pengesahan, sila rujuk badan pensijilan Halal yang sah seperti JAKIM.**"`;
    
    try {
      const response = await generateGenericContent(prompt, agent);
      setResult(response);
    } catch (err) {
      setError('Gagal mendapatkan maklumat. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
          <SearchCheckIcon className="w-8 h-8" />
          Penyemak Halal (AI)
        </h2>
        <p className="text-foreground-light/80 dark:text-foreground-dark/80">Dapatkan maklumat awal tentang status halal produk atau bahan.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cth: Gelatin, E471, Monosodium Glutamate..."
          className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary"
        />
        <Button type="submit" disabled={isLoading} className="gap-2">
          <SparklesIcon /> {isLoading ? 'Menyemak...' : 'Semak'}
        </Button>
      </form>

      {error && <p className="text-center text-primary">{error}</p>}

      {result && (
        <Card>
          <CardContent className="p-6">
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};