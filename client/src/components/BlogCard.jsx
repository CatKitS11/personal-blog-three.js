import { Link } from 'react-router-dom';

function BlogCard({
  id,
  image,
  category,
  title,
  description,
  author,
  date,
  className,
}) {
  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Helper function สำหรับจัดการ author
  const getAuthorInfo = () => {
    if (typeof author === 'object' && author !== null) {
      return {
        name: author.name || 'Unknown',
        avatar: author.avatar || null
      };
    }
    return {
      name: author || 'Unknown',
      avatar: null
    };
  };

  const authorInfo = getAuthorInfo();

  return (
    <div className={`flex flex-col gap-4 px-2 py-2 ${className || ''}`}>
      <Link to={`/post/${id}`} className="relative h-[212px] sm:h-[360px]">
        <img
          className="w-full h-full object-cover rounded-md"
          src={image}
          alt={title}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex">
          <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
            {category}
          </span>
        </div>
        <Link to={`/post/${id}`}>
          <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
            {title}
          </h2>
        </Link>
        <p className="flex flex-row items-start text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
          {description}
        </p>
        <div className="flex items-center text-sm">
          {/* EDIT: เพิ่ม fallback เหมือน CardAuthor */}
          {authorInfo.avatar ? (
            <img
              className="w-8 h-8 rounded-full mr-2 object-cover"
              src={authorInfo.avatar}
              alt={authorInfo.name}
            />
          ) : (
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
              <span className="text-sm font-bold text-gray-800">
                {authorInfo.name?.charAt(0) || 'A'}
              </span>
            </div>
          )}
          <span>{authorInfo.name}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{formatDate(date)}</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;