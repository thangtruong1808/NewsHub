"use client";

import { Article } from "../../../type/Article";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface TableBodyProps {
  articles: Article[];
}

export function TableBody({ articles }: TableBodyProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <tbody className="bg-white">
      {articles.map((article) => (
        <tr
          key={article.id}
          className="border-b border-gray-200 hover:bg-gray-50"
        >
          <td className="px-4 py-3">
            <Link
              href={`/dashboard/articles/${article.id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {article.title}
            </Link>
          </td>
          <td className="px-4 py-3">
            <div className="max-w-xs truncate">{article.content}</div>
          </td>
          <td className="px-4 py-3">{article.category_id}</td>
          <td className="px-4 py-3">{article.author_id}</td>
          <td className="px-4 py-3">{formatDate(article.published_at)}</td>
          <td className="px-4 py-3">
            {article.is_featured ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Yes
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                No
              </span>
            )}
          </td>
          <td className="px-4 py-3">
            {article.is_trending ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Yes
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                No
              </span>
            )}
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex justify-end gap-2">
              <Link
                href={`/dashboard/articles/${article.id}/edit`}
                className="text-blue-600 hover:text-blue-800"
              >
                <PencilIcon className="h-5 w-5" />
              </Link>
              <button
                onClick={() => {
                  // TODO: Implement delete functionality
                  console.log("Delete article:", article.id);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
