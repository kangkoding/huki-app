export default function ArticleCard({ article }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3 hover:shadow-md transition">
      <h2 className="text-base font-semibold text-gray-800 mb-1">
        {article.title}
      </h2>
      <p className="text-sm text-gray-600 line-clamp-2">{article.summary}</p>
      <p className="text-xs text-gray-400 mt-2">{article.date}</p>
    </div>
  );
}
