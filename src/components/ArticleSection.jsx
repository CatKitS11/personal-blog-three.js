import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { CategoryCombobox } from "@/components/Combobox";
import { useState } from "react";

const ArticleSection = () => {
  const categories = ["Highlight", "Cat", "Inspiration", "General"];
  const [selectedCategory, setSelectedCategory] = useState("Highlight");

  return (
    <div>
      <h1 className="text-2xl font-bold text-left font-poppins">
        Latest articles
      </h1>
      <div className="flex max-xs:flex-col items-center justify-between bg-stone-100 mb-4 mt-4 p-2 rounded-lg">
        <div className="flex flex-col max-xs:hidden max-xs:w-full items-center justify-center">
          <Tabs defaultValue="highlight" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-xs:grid-cols-1 max-xs:grid-rows-1">
              {categories.map((i) => (
                <TabsTrigger key={i} value={i}>{i}</TabsTrigger>
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
          <CategoryCombobox value={selectedCategory} onChange={setSelectedCategory} className="w-full" />
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} {...post} className="w-[calc(50%-0.5rem)] max-xs:w-full" />
        ))}
      </div>
    </div>
  );
};

export default ArticleSection;
