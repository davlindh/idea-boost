import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useComments, useAddComment, supabase } from "@/integrations/supabase/index.js";
import { toast } from "sonner";

const ProjectDetails = () => {
  const { data: comments, isLoading, error } = useComments();
  const addComment = useAddComment();
  const { register, handleSubmit, reset } = useForm();
  const [userId, setUserId] = useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = supabase.auth.user();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  const onSubmit = async (data) => {
    try {
      await addComment.mutateAsync({
        task_id: "project-id-placeholder", // Replace with actual project ID
        user_id: userId,
        content: data.comment,
        created_at: new Date().toISOString(),
      });
      toast.success("Comment added successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to add comment: " + error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading comments</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Urban Green Roof Initiative</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Urban Green Roof Initiative</CardTitle>
            <CardDescription>Greening Urban Skies</CardDescription>
          </CardHeader>
          <CardContent>
            <img src="/images/project1.jpg" alt="Urban Green Roof Initiative" className="w-full h-48 object-cover rounded-md" />
            <p className="mt-4">Transform concrete jungles into lush, green sanctuaries. Join our mission to convert city rooftops into vibrant gardens, combating urban heat and enhancing air quality.</p>
            <div className="mt-4">
              <h3 className="text-lg font-bold">Impact</h3>
              <ul className="list-disc list-inside">
                <li>Cleaning Air</li>
                <li>Providing Food</li>
                <li>Isolation</li>
                <li>CO2 Absorption</li>
              </ul>
            </div>
            <Button className="mt-4" variant="outline">Vote Here</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Comments</h3>
        {comments.map((comment) => (
          <div key={comment.comment_id} className="mb-4">
            <Card>
              <CardContent>
                <p>{comment.content}</p>
                <p className="text-sm text-gray-500">Posted by {comment.user_id} on {new Date(comment.created_at).toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Add a Comment</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Textarea id="comment" {...register("comment")} required />
          </div>
          <Button type="submit" className="w-full">Submit Comment</Button>
        </form>
      </div>
    </div>
  );
};

export default ProjectDetails;