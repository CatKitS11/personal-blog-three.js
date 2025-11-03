import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/BlogCard";
import { CategoryCombobox } from "@/components/Combobox";
import { useState, useMemo } from "react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useCategories } from "@/hooks/useCategories";

import { useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";

const ArticleSection = () => {
  const { categories: dbCategories, loading: categoriesLoading } = useCategories();
  const categories = ['Highlight', ...dbCategories.map(c => c.name)];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  console.log(categories);
  const { 
    posts,
    loading,
    error,
    pagination,
    changeCategory,
    changePage,
    allPosts, 
  } = useBlogPosts();
  
  const navigate = useNavigate(); 
  const [query, setQuery] = useState(""); 
  const [openSearch, setOpenSearch] = useState(false); 
  
  const results = useMemo(() => { 
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return (allPosts || [])
      .filter(p =>
        [p.title, p.description, p.content].some(t =>
          (t || "").toLowerCase().includes(q)
        )
      )
      .slice(0, 6);
  }, [query, allPosts]);

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
    <div className="px-2 w-full">
      <h1 className="text-2xl font-bold text-left font-poppins">
        Latest articles
      </h1>
      <div className="flex max-xs:flex-col items-center justify-between bg-stone-100 mb-4 mt-4 p-2 rounded-lg">
        <div className="flex flex-col max-xs:hidden max-xs:w-full items-center justify-center">
          <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
            <TabsList className="grid w-full grid-cols-8 max-xs:grid-cols-1 max-xs:grid-rows-1">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="my-1 mx-2">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        {/* Search autocomplete */}
        <div className="flex items-center justify-center max-xs:w-full">
          <Popover open={openSearch} onOpenChange={setOpenSearch}> 
            <PopoverTrigger asChild> 
              <div className="relative w-72 max-xs:w-full"> 
                <input
                  className="w-full bg-white h-10 rounded-md px-3 border" 
                  placeholder="Search"
                  value={query} 
                  onChange={(e) => { setQuery(e.target.value); setOpenSearch(true); }} 
                  onFocus={() => query && setOpenSearch(true)} 
                />
                <button
                  type="button"
                  className="absolute right-1 top-1.5 px-2 py-1 border rounded-md" 
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[28rem] max-xs:w-[calc(100vw-2rem)]" align="end"> 
              <Command> 
                {/* <CommandInput
                  placeholder="Type to search…"
                  value={query}
                  onValueChange={setQuery}
                /> */}
                <CommandList>
                  {results.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() => { 
                        setOpenSearch(false);
                        setQuery("");
                        navigate(`/post/${p.id}`);
                      }}
                      className="cursor-pointer bg-white"
                    >
                      {p.title}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {/* end search */}
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
              <BlogCard 
                key={post.id} 
                id={post.id}
                {...post} 
                className="w-[calc(50%-0.5rem)] max-xs:w-full" 
              />
            ))}
          </div>
          
          {/* Replace pagination with View More button */}
          {pagination.currentPage < pagination.totalPages && (
            <div className="flex justify-center mt-8 mb-8">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="px-6 py-2"
              >
                View more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArticleSection;
