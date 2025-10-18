import { Search, Edit, Trash2 } from 'lucide-react';

const mockArticles = [
  { id: 1, title: 'Understanding Cat Behavior: Why Your Feline Friend Acts the Way They Do...', category: 'Cat', status: 'Published' },
  { id: 2, title: 'The Fascinating World of Cats: Why We Love Our Furry Friends', category: 'Cat', status: 'Published' },
  { id: 3, title: 'Finding Motivation: How to Stay Inspired Through Life’s Challenges', category: 'General', status: 'Published' },
  { id: 4, title: 'The Science of the Cat’s Purr: How It Benefits Cats and Humans Alike', category: 'Cat', status: 'Published' },
  { id: 5, title: 'Top 10 Health Tips to Keep Your Cat Happy and Healthy', category: 'Cat', status: 'Published' },
  { id: 6, title: 'Unlocking Creativity: Simple Habits to Spark Inspiration Daily', category: 'Inspiration', status: 'Published' },
];

const ArticleManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Article management</h1>
        <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
          + Create article
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-md w-80"
            />
          </div>
          <div className="flex space-x-4">
            {/* These would be dropdowns in a real app */}
            <select className="border rounded-md px-4 py-2">
              <option>Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
            <select className="border rounded-md px-4 py-2">
              <option>Category</option>
              <option>Cat</option>
              <option>General</option>
              <option>Inspiration</option>
            </select>
          </div>
        </div>

        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-2 font-normal">Article title</th>
              <th className="pb-2 font-normal">Category</th>
              <th className="pb-2 font-normal">Status</th>
              <th className="pb-2 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {mockArticles.map((article) => (
              <tr key={article.id} className="border-t">
                <td className="py-4">{article.title}</td>
                <td className="py-4">{article.category}</td>
                <td className="py-4">
                  <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                    {article.status}
                  </span>
                </td>
                <td className="py-4 flex justify-end space-x-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <Edit size={20} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleManagement;