import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/BlogCard";
import { CategoryCombobox } from "@/components/Combobox";
import { useState } from "react";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const ArticleSection = () => {
  const categories = ["Highlight", "Cat", "Inspiration", "General"];
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  
  const { 
    posts, 
    loading, 
    error, 
    pagination, 
    changeCategory, 
    changePage 
  } = useBlogPosts({ category: selectedCategory });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    changeCategory(category);
  };

  const handlePageChange = (page) => {
    changePage(page);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading posts: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-left font-poppins">
        Latest articles
      </h1>
      <div className="flex max-xs:flex-col items-center justify-between bg-stone-100 mb-4 mt-4 p-2 rounded-lg">
        <div className="flex flex-col max-xs:hidden max-xs:w-full items-center justify-center">
          <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-xs:grid-cols-1 max-xs:grid-rows-1">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center justify-center max-xs:w-full">
          <input className="w-full bg-white" placeholder="Search" />
          <Button variant="outline">
            <Search />
          </Button>
        </div>
        <div className="hidden max-xs:flex items-center justify-center max-xs:w-full">
          <CategoryCombobox 
            value={selectedCategory} 
            onChange={handleCategoryChange} 
            className="w-full" 
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading posts...</span>
        </div>
      ) : (
        <>
          <div className="flex flex-row flex-wrap gap-4">
            {posts.map((post) => (
              <BlogCard key={post.id} {...post} className="w-[calc(50%-0.5rem)] max-xs:w-full" />
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.currentPage ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
          
          {/* Posts count info */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {posts.length} of {pagination.totalPosts} posts
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleSection;
