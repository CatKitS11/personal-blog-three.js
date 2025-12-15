import React from "react";

const CardAuthor = ({ author }) => {
  return (
    <div className="bg-[#EFEEEB] p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
      <div className="flex flex-row gap-4 items-center text-center border-b border-gray-200 pb-2">
        {author?.avatar ? (
          <img
            src={author.avatar}
            alt={author.name || "Author"}
            className="w-14 h-14 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-gray-800">
              {author?.name?.charAt(0) || "A"}
            </span>
          </div>
        )}
        <div className="flex flex-col items-start text-center">
          <span className="text-sm text-gray-500 mb-2">Author</span>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {author?.name || "Unknown Author"}
          </h3>
        </div>
      </div>
      <p className="flex flex-col flex-start py-4 text-sm text-start text-gray-600 leading-relaxed">
        {author?.bio ||
          "I am a passionate writer who loves sharing insights and stories with readers around the world."}
      </p>
    </div>
  );
};

export default CardAuthor;


