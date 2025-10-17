import React from 'react';

const CardAuthor = ({ author }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
      <div className="flex flex-col items-center text-center">
        {/* Author Avatar */}
        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-gray-800">
            {author?.name?.charAt(0) || 'A'}
          </span>
        </div>
        
        {/* Author Label */}
        <span className="text-sm text-gray-500 mb-2">Author</span>
        
        {/* Author Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {author?.name || 'Unknown Author'}
        </h3>
        
        {/* Author Bio */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {author?.bio || 'I am a passionate writer who loves sharing insights and stories with readers around the world.'}
        </p>
      </div>
    </div>
  );
};

export default CardAuthor;
