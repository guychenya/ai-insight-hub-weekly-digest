import React, { useState, useEffect, useCallback } from 'react';
import { AIResource, GroundingSource } from './types';
import { generateAIDigest, clearAllArticles } from './services/geminiService';
import DigestHeader from './components/DigestHeader';
import ProjectCard from './components/ProjectCard';
import SubscriptionForm from './components/SubscriptionForm';
import Loader from './components/Loader';
import SourceCitations from './components/SourceCitations';
import GenerationProgress from './components/GenerationProgress';
import InsightFilters from './components/InsightFilters';
import { IconAlertTriangle, IconSparkles, IconTrash } from './components/IconComponents';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [articles, setArticles] = useState<AIResource[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<AIResource[]>([]);
  const [sources, setSources] = useState<GroundingSource[] | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  const fetchArticles = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/get-articles');
      if (!response.ok) throw new Error('Failed to fetch articles.');
      const data = await response.json();
      
      // Convert date strings from JSON back to Date objects
      const articlesWithDates = data.articles.map((article: any) => ({
        ...article,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt),
      }));
      
      setArticles(articlesWithDates);
      setFilteredArticles(articlesWithDates);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Could not load AI digest.');
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleGenerateDigest = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setSources(null);
    try {
      // 1. Generate new content from Gemini
      const { articles: newArticles, sources: newSources } = await generateAIDigest();
      setSources(newSources);

      // 2. Save the new articles to the database
      const saveResponse = await fetch('/.netlify/functions/save-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: newArticles }),
      });
      
      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.message || 'Failed to save new articles to the database.');
      }
      
      // 3. Refresh the list from the database to show all articles
      await fetchArticles();

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console and ensure your API key is configured correctly.');
    } finally {
      setIsGenerating(false);
    }
  }, [fetchArticles]);

  const handleClearArticles = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear all AI insights? This action cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    setError(null);
    try {
      const result = await clearAllArticles();
      console.log(result.message);
      
      // Refresh the articles list to show empty state
      await fetchArticles();
      
      // Clear sources as well
      setSources(null);
      
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to clear articles.');
    } finally {
      setIsClearing(false);
    }
  }, [fetchArticles]);

  const handleFilterChange = useCallback((filtered: AIResource[]) => {
    setFilteredArticles(filtered);
  }, []);

  const isLoading = isFetching || authLoading;

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans antialiased">
        <header className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
            <div className="container mx-auto flex justify-between items-center">
                <div />
                <div className="absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hidden sm:block">AI Insight Hub</h1>
                </div>
                <Auth />
            </div>
        </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <DigestHeader />

          <div className="mt-12 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGenerateDigest}
                disabled={isGenerating || isClearing}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 shadow-lg shadow-blue-500/10"
              >
                <span className="absolute -inset-full top-0 block -translate-y-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-3xl group-hover:translate-y-0 group-hover:opacity-30 transition-all duration-500"></span>
                <span className="relative flex items-center">
                  <IconSparkles className="w-6 h-6 mr-3 transition-transform duration-500 group-hover:rotate-12" />
                  {isGenerating ? 'Generating...' : 'Generate & Save New Digest'}
                </span>
              </button>

              {articles.length > 0 && (
                <button
                  onClick={handleClearArticles}
                  disabled={isGenerating || isClearing}
                  className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-red-300 transition-all duration-200 bg-red-900/20 border border-red-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-900/40 hover:border-red-500/50"
                >
                  <span className="relative flex items-center">
                    <IconTrash className="w-4 h-4 mr-2" />
                    {isClearing ? 'Clearing...' : 'Clear All Insights'}
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-12">
            {/* Show generation progress when actively generating */}
            {isGenerating && <GenerationProgress isGenerating={isGenerating} />}
            
            {/* Show regular loader for other loading states (fetching articles) */}
            {isLoading && !isGenerating && <Loader />}
            
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative flex items-start" role="alert">
                <IconAlertTriangle className="w-5 h-5 mr-3 mt-1 flex-shrink-0"/>
                <div>
                  <strong className="font-bold">An Error Occurred!</strong>
                  <span className="block sm:inline ml-1">{error}</span>
                </div>
              </div>
            )}
            
            {!isLoading && !isGenerating && !error && articles.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No articles found.</p>
                    <p>Click the button above to generate the first digest!</p>
                </div>
            )}
            
            {!isGenerating && articles.length > 0 && (
              <>
                <InsightFilters 
                  articles={articles} 
                  onFilterChange={handleFilterChange}
                />
                
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No articles match your filters.</p>
                    <p>Try adjusting your filter criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {filteredArticles.map((article, index) => (
                      <ProjectCard key={article.id} resource={article} index={index} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          
          {sources && sources.length > 0 && (
             <div className="mt-16 border-t border-gray-700 pt-10">
                <SourceCitations sources={sources} />
            </div>
          )}
          
          <div className="mt-16 border-t border-gray-700 pt-10">
            <SubscriptionForm user={user} />
          </div>

          {/* Footer with Love signature */}
          <footer className="mt-16 border-t border-gray-700 pt-8 pb-8">
            <div className="text-center space-y-4">
              <p className="text-gray-500 text-sm flex items-center justify-center space-x-2">
                <span>Built with</span>
                <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>by</span>
                <a 
                  href="https://www.guyc.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-300 hover:to-purple-400 transition-all duration-300 font-medium"
                >
                  Guy Chenya
                </a>
              </p>
              
              <div className="text-xs text-gray-600 max-w-2xl mx-auto">
                <p className="mb-2">
                  This is a demonstration application showcasing AI-powered content generation capabilities using Vibe-Coding methodologies. 
                  All content is generated for demonstration purposes only.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center items-center space-x-6 text-xs text-gray-500">
                <a href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                <span className="text-gray-700">•</span>
                <a href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                <span className="text-gray-700">•</span>
                <span>© 2025 Guy Chenya</span>
              </div>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
};

export default App;