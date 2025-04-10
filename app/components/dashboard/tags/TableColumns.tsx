"use client";

import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Tag } from "../../../login/login-definitions";
import { Column } from "./types";

export function getTableColumns(
  currentPage: number,
  itemsPerPage: number,
  onDelete: (id: number, name: string) => void,
  isDeleting: boolean
): Column[] {
  return [
    {
      key: "id",
      label: "ID",
      sortable: false,
      cell: (
        tag: Tag,
        index: number,
        currentPage: number,
        itemsPerPage: number
      ) => (
        <div className="whitespace-nowrap text-xs font-medium text-gray-900 sm:text-sm">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs font-medium text-gray-900 sm:text-sm">
          {tag.name}
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs text-gray-500 hidden md:table-cell sm:text-sm">
          {tag.description || "-"}
        </div>
      ),
    },
    {
      key: "color",
      label: "Color",
      sortable: false,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs text-gray-500 hidden md:table-cell sm:text-sm">
          <div className="flex items-center">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <span className="ml-2">{tag.color}</span>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          <div className="flex justify-center gap-2 p-3">
            <Link
              href={`/dashboard/tags/${tag.id}/edit`}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <button
              onClick={() => onDelete(tag.id, tag.name)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-900 disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      ),
    },
  ];
}
