"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTags, searchTags, deleteTag } from "@/app/lib/actions/tags";
import { Tag } from "@/app/lib/definition";
import TagsTable from "@/app/components/dashboard/tags/table/TagsTable";
import TagsSearchWrapper from "@/app/components/dashboard/tags/search/TagsSearchWrapper";
import { PlusIcon } from "@heroicons/react/24/outline";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import TagsHeader from "@/app/components/dashboard/tags/header/TagsHeader";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";

/**
 * Props interface for TagsPage component
 * Defines the expected search parameters for filtering and sorting
 */
interface TagsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    sortField?: string;
    sortDirection?: "asc" | "desc";
    query?: string;
    limit?: string;
  };
}

/**
 * TagsPage Component
 * Main page for managing tags with features for:
 * - Pagination and sorting
 * - Search functionality
 * - CRUD operations
 * - Loading states
 * - Error handling
 */
export default function TagsPage({ searchParams }: TagsPageProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  // Extract and parse URL parameters for pagination and sorting
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = Number(searchParams.limit) || 5;
  const searchQuery = searchParams.query || "";
  const sortField = (searchParams.sortField as keyof Tag) || "created_at";
  const sortDirection = searchParams.sortDirection || "desc";

  // Table column configuration for tag data display
  const columns = [
    {
      field: "name",
      label: "Name",
      sortable: true,
    },
    {
      field: "description",
      label: "Description",
      sortable: true,
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
    },
  ];

  /**
   * Fetch tags data based on search and pagination parameters
   * Handles loading states and error cases
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching && !isSorting) {
          setIsLoading(true);
        }
        const result = searchQuery
          ? await searchTags(searchQuery)
          : await getTags({
              page: currentPage,
              limit: itemsPerPage,
              sortField,
              sortDirection,
            });

        setTags(result.data || []);
        if (result.totalItems !== undefined) {
          setTotalPages(Math.ceil(result.totalItems / itemsPerPage));
          setTotalItems(result.totalItems);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setIsSorting(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, sortField, sortDirection, searchQuery]);

  /**
   * Handle pagination - navigate to selected page
   * Updates URL parameters and triggers data fetch
   */
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dashboard/tags?${params.toString()}`);
  };

  /**
   * Handle sorting - toggle sort direction and update URL
   * Manages sorting state and triggers data refresh
   */
  const handleSort = (field: keyof (Tag & { sequence?: number })) => {
    setIsSorting(true);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/tags?${params.toString()}`);
  };

  /**
   * Navigate to tag edit page
   * Routes to the edit form for the selected tag
   */
  const handleEdit = (tag: Tag) => {
    router.push(`/dashboard/tags/${tag.id}/edit`);
  };

  /**
   * Handle tag deletion with confirmation
   * Includes error handling and state management
   */
  const handleDelete = async (tag: Tag) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Tag",
        message:
          "Are you sure you want to delete this tag? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const { data, error } = await deleteTag(tag.id);

      if (error) {
        showErrorToast({ message: error });
        return;
      }

      // Force a router refresh to ensure we get fresh data
      router.refresh();

      // Fetch fresh data after successful deletion
      const result = searchQuery
        ? await searchTags(searchQuery)
        : await getTags({
            page: currentPage,
            limit: itemsPerPage,
            sortField,
            sortDirection,
          });

      if (result.error) {
        throw new Error(result.error);
      }

      // Update the state with the new data
      setTags(result.data || []);
      if (result.totalItems !== undefined) {
        setTotalPages(Math.ceil(result.totalItems / itemsPerPage));
        setTotalItems(result.totalItems);
      }

      // If we're on the last page and it's now empty, go to the previous page
      if (result.data?.length === 0 && currentPage > 1) {
        const newPage = currentPage - 1;
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`/dashboard/tags?${params.toString()}`);
      }

      showSuccessToast({ message: "Tag deleted successfully" });
    } catch (error) {
      console.error("Error deleting tag:", error);
      showErrorToast({ message: "Failed to delete tag. Please try again." });
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle search functionality
   * Updates URL parameters and triggers data refresh
   */
  const handleSearch = (term: string) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.push(`/dashboard/tags?${params.toString()}`);
  };

  /**
   * Update items per page and reset to first page
   * Manages pagination size and triggers data refresh
   */
  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", limit.toString());
    router.push(`/dashboard/tags?${params.toString()}`);
  };

  return (
    <div className="">
      {/* Header section with title and create button */}
      <TagsHeader />

      {/* Search functionality */}
      <div className="my-6">
        <div className="w-full">
          <TagsSearchWrapper onSearch={handleSearch} />
        </div>
      </div>

      {/* Main content area */}
      {isLoading ? (
        <TableSkeleton columns={columns} itemsPerPage={itemsPerPage} />
      ) : (
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <TagsTable
                tags={tags}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                sortField={sortField}
                sortDirection={sortDirection}
                searchQuery={searchQuery}
                isDeleting={isDeleting}
                isLoading={isLoading}
                onSort={handleSort}
                onPageChange={handlePageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
