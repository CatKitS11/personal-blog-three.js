import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";

const ArticleSection = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-left font-poppins">
        Latest articles
      </h1>
      <div className="flex items-center justify-between bg-stone-100 mb-4 mt-4 p-2 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <Tabs defaultValue="highlight" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="highlight">Highlight</TabsTrigger>
              <TabsTrigger value="cat">Cat</TabsTrigger>
              <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center justify-center">
          <input className="w-full bg-white" placeholder="Search" />
          <Button variant="outline">
            <Search />
          </Button>
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
