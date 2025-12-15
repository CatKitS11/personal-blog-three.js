import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BlogCard from "@/features/blog/BlogCard";
import { CategoryCombobox } from "@/components/Combobox";
import { useState, useMemo, useEffect } from "react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useCategories } from "@/hooks/useCategories";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

const ArticleSection = () => {
  const { categories: dbCategories } = useCategories();
  const categories = ["Highlight", ...dbCategories.map((c) => c.name)];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

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
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) return [];
    const q = debouncedQuery.toLowerCase();
    return (allPosts || [])
      .filter((p) =>
        [p.title, p.description, p.content].some((t) =>
          (t || "").toLowerCase().includes(q)
        )
      )
      .slice(0, 6);
  }, [debouncedQuery, allPosts]);

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
    <div className="px-0 w-full">
      <h1 className="text-2xl my-4 font-bold text-left font-poppins">
        Latest articles
      </h1>
      <div className="flex max-xs:flex-col items-center justify-between bg-stone-100 rounded-lg py-3 px-5">
        <div className="flex flex-col max-xs:hidden max-xs:w-full items-center justify-center">
          <Tabs
            value={selectedCategory}
            onValueChange={handleCategoryChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-8 max-xs:grid-cols-1 max-xs:grid-rows-1">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center justify-center max-xs:w-full">
          <Popover open={openSearch} onOpenChange={setOpenSearch}>
            <PopoverTrigger asChild>
              <div className="relative w-72 mr-2 max-xs:w-full">
                <input
                  className="w-full bg-white h-10 rounded-md px-3 border"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (e.target.value.trim()) setOpenSearch(true);
                  }}
                  onFocus={() => query.trim() && setOpenSearch(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setOpenSearch(false);
                      setQuery("");
                    }
                  }}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1.5 px-2 py-1 mr-3 border rounded-md"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-auto bg-white max-xs:w-[calc(100vw-2rem)]"
              align="end"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search articles..."
                  value={query}
                  onValueChange={setQuery}
                />
                <CommandList>
                  {debouncedQuery !== query && (
                    <div className="bg-white p-4 text-center text-sm text-gray-500">
                      Searching...
                    </div>
                  )}
                  {debouncedQuery === query &&
                    results.length === 0 &&
                    debouncedQuery.length >= 2 && (
                      <div className="bg-white p-4 text-center text-sm text-gray-500">
                        No articles found
                      </div>
                    )}
                  {results.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() => {
                        setOpenSearch(false);
                        setQuery("");
                        navigate(`/post/${p.id}`);
                      }}
                      className="cursor-pointer border-b py-2 bg-white hover:bg-gray-100"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-gray-500">
                          {p.category}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
              <BlogCard
                key={post.id}
                id={post.id}
                {...post}
                className="w-[calc(50%-0.5rem)] max-xs:w-full"
              />
            ))}
          </div>

          {pagination.currentPage < pagination.totalPages && (
            <div className="flex justify-center mt-8 mb-8">
              <Button
                variant="outline"
                onClick={() =>
                  handlePageChange(pagination.currentPage + 1)
                }
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


