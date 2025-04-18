import { getTagById } from "../../../../lib/actions/tags";
import TagForm from "../../../../components/dashboard/tags/TagForm";
import { Tag } from "../../../../lib/definition";

interface EditTagPageProps {
  params: {
    id: string;
  };
}

export default async function EditTagPage({ params }: EditTagPageProps) {
  const tagId = parseInt(params.id);

  if (isNaN(tagId)) {
    return <div>Tag not found</div>;
  }

  const result = await getTagById(tagId);
  const tag = result.data;

  if (!tag) {
    return (
      <div className="space-y-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">Edit Tag</h1>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading tag
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{result.error || "Tag not found"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Edit Tag: {tag.name}</h1>
      </div>

      <div className="mt-4">
        <TagForm tag={tag} />
      </div>
    </div>
  );
}
