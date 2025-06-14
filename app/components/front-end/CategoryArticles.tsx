"use client";

// Component to display articles filtered by category in a 5x5 grid layout
import { useState, useEffect, useRef } from "react";
import { getCategoryArticles } from "@/app/lib/actions/front-end-articles";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import Grid from "@/app/components/front-end/shared/Grid";
import Card from "@/app/components/front-end/shared/Card";
import { FolderIcon } from "@heroicons/react/24/outline";
import DebugDialog from "@/app/components/front-end/shared/DebugDialog";

// Props interface for category filtering
type Props = {
  category?: string;
};

export default function CategoryArticles({ category }: Props) {
  // State management for articles, loading, error, and pagination
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categoryInfo, setCategoryInfo] = useState<{
    name: string;
  } | null>(null);
  const itemsPerPage = 10; // Use same itemsPerPage for both initial load and load more
  const [hasMore, setHasMore] = useState(false);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [stateChanges, setStateChanges] = useState<string[]>([]);
  const articlesRef = useRef<Article[]>([]);

  // Function to add state change to debug log
  const addStateChange = (change: string) => {
    setStateChanges((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${change}`,
    ]);
  };

  // Handle load more click
  const handleLoadMore = () => {
    if (isLoading) return;
    addStateChange(
      `Load More clicked: page ${currentPage} -> ${
        currentPage + 1
      }, articles: ${articles.length}`
    );
    setCurrentPage((prev) => prev + 1);
  };

  // Single useEffect to handle both initial load and pagination
  useEffect(() => {
    const fetchArticles = async () => {
      if (!category) return;

      try {
        addStateChange(`Fetching articles for page ${currentPage}`);
        setIsLoading(true);

        // Reset state when category changes
        if (currentPage === 1) {
          setArticles([]);
          articlesRef.current = [];
          setStateChanges([]);
          setHasMore(false);
          console.log("you are here");
        }

        addStateChange(
          `Fetching with page: ${currentPage}, itemsPerPage: ${itemsPerPage}`
        );

        const result = await getCategoryArticles({
          categoryId: category,
          page: currentPage,
          itemsPerPage: itemsPerPage,
        });

        addStateChange(
          `API Response: ${result.data?.length || 0} articles, total: ${
            result.totalCount
          }`
        );

        if (result.error) {
          throw new Error(result.error);
        }

        const newArticles = result.data || [];

        if (currentPage === 1) {
          // For page 1, just set the articles directly
          addStateChange(`Setting initial articles: ${newArticles.length}`);
          setArticles(newArticles);
          articlesRef.current = newArticles;
        } else {
          // For page 2+, simply append the new articles
          addStateChange(`Adding ${newArticles.length} new articles`);
          const updatedArticles = [...articlesRef.current, ...newArticles];
          articlesRef.current = updatedArticles;
          setArticles(updatedArticles);
          addStateChange(
            `Updated articles state: ${
              articlesRef.current.length - newArticles.length
            } -> ${updatedArticles.length}`
          );
        }

        // Set total count only once
        if (currentPage === 1) {
          setTotalCount(result.totalCount || 0);
        }

        // Calculate total loaded articles
        const totalLoaded = articlesRef.current.length;
        addStateChange(
          `Pagination state: ${totalLoaded}/${result.totalCount} articles loaded`
        );

        // Only show Load More if we have more articles to load
        const hasMoreArticles = result.totalCount > totalLoaded;
        addStateChange(`Has more articles: ${hasMoreArticles}`);
        setHasMore(hasMoreArticles);

        // Set category info from the first article
        if (result.data && result.data.length > 0 && currentPage === 1) {
          setCategoryInfo({
            name: result.data[0].category_name || "",
          });
        }
      } catch (error) {
        console.error("Error in fetchArticles:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch articles"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [category, currentPage]);

  // Calculate total loaded articles
  const totalLoaded = articles.length;

  // Loading state display - only show on initial load
  if (isLoading && articles.length === 0) {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state display
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  // Empty state display
  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {category
            ? "No articles found in this category."
            : "No articles found."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1536px] mx-auto px-4 mt-10">
      {/* Debug Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsDebugOpen(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700"
        >
          Debug
        </button>
      </div>

      {/* Debug Dialog */}
      <DebugDialog
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
        data={{
          currentPage,
          isLoading,
          articlesCount: articles.length,
          totalCount,
          hasMore,
          newArticlesCount: totalLoaded,
          stateChanges,
        }}
      />

      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100">
              <FolderIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {categoryInfo?.name || "Articles"}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <FolderIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Category:
                  </span>
                  <span className="text-sm text-gray-600">
                    {categoryInfo?.name || "Uncategorized"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Total Articles:
                  </span>
                  <span className="text-sm text-gray-600">{totalCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Grid columns={5} gap="lg">
          {articles.map((article) => {
            console.log("Article data:", {
              id: article.id,
              title: article.title,
              tag_names: article.tag_names,
              tag_colors: article.tag_colors,
            });
            return (
              <Card
                key={article.id}
                title={article.title}
                description={article.content}
                imageUrl={article.image || undefined}
                link={`/article/${article.id}`}
                category={article.category_name || undefined}
                subcategory={article.subcategory_name || undefined}
                author={article.author_name || undefined}
                date={article.published_at}
                viewsCount={article.views_count}
                likesCount={article.likes_count}
                commentsCount={article.comments_count}
                tags={article.tag_names}
                tagColors={article.tag_colors}
              />
            );
          })}
        </Grid>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
