import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PostEditor } from "@/components/admin/post-editor";

export const Route = createFileRoute("/_authenticated/admin/blog/new")({
  component: NewPost,
});

function NewPost() {
  const navigate = useNavigate();
  return <PostEditor onSaved={(id) => navigate({ to: "/admin/blog/$id", params: { id } })} />;
}
