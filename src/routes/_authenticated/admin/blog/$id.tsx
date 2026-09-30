import { createFileRoute } from "@tanstack/react-router";
import { PostEditor } from "@/components/admin/post-editor";

export const Route = createFileRoute("/_authenticated/admin/blog/$id")({
  component: EditPost,
});

function EditPost() {
  // The dynamic route segment is the database post ID, not its public slug.
  const { id } = Route.useParams();
  return <PostEditor postId={id} />;
}
