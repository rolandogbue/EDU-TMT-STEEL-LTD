import { createFileRoute } from "@tanstack/react-router";
import { PostEditor } from "@/components/admin/post-editor";

export const Route = createFileRoute("/_authenticated/admin/blog/$id")({
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  return <PostEditor postId={id} />;
}
