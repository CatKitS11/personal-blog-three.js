import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud } from "lucide-react";

const CreateArticle = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create article</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Save as draft</Button>
          <Button className="bg-black text-white">Save and publish</Button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left side for form fields */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="inspiration">Inspiration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author name
              </label>
              <Input id="author" type="text" placeholder="Thompson P." />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input id="title" type="text" placeholder="Article title" />
            </div>
            <div>
              <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-1">
                Introduction (max 120 letters)
              </label>
              <Textarea id="introduction" placeholder="Introduction" rows={3} />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <Textarea id="content" placeholder="Content" rows={12} />
            </div>
          </div>

          {/* Right side for thumbnail */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Thumbnail image
            </label>
            <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg">
              <UploadCloud className="w-10 h-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No image uploaded</p>
            </div>
            <Button variant="outline" className="w-full">
              Upload thumbnail image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;