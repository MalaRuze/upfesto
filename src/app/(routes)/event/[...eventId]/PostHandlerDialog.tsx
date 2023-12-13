"use client";

import { createPostAction } from "@/actions/createPostAction";
import { updatePostAction } from "@/actions/updatePostAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { PostDataSchema, UpdatePostDataSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostTypeEnum } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type CreateProps = {
  mode: "create";
  eventId: string;
  trigger: React.ReactNode;
};

type UpdateProps = {
  mode: "update";
  postId: string;
  message: string;
  eventId: string;
  trigger: React.ReactNode;
};

// function to get the correct schema based on the mode
const getPostFormSchema = (mode: "create" | "update") => {
  switch (mode) {
    case "create":
      return PostDataSchema;
    case "update":
      return UpdatePostDataSchema;
  }
};

const PostHandlerDialog = (props: UpdateProps | CreateProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // get the correct schema based on the mode
  const schema = getPostFormSchema(props.mode);
  // function to get default values for the form
  const getDefaultValues = () => {
    switch (props.mode) {
      case "update":
        return {
          id: props.postId,
          eventId: props.eventId,
          message: props.message,
        } as z.infer<typeof schema>;
      case "create":
        return {
          eventId: props.eventId,
          type: PostTypeEnum.MANUAL,
          message: "",
        } as z.infer<typeof schema>;
    }
  };

  // initialize form
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(),
  });

  // function to handle form submission
  const onSubmit = async (values: z.infer<typeof schema>) => {
    const res =
      props.mode === "create"
        ? await createPostAction(values as z.infer<typeof PostDataSchema>)
        : await updatePostAction(
            values as z.infer<typeof UpdatePostDataSchema>,
          );
    if (res?.success === false) {
      toast({
        title: "Something went wrong",
        description: res?.error + " Please try again later.",
        variant: "destructive",
      });
      return;
    }
    if (!res) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Post saved",
      description: "Your post has been saved.",
    });
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* dialog trigger */}
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent>
        {/* dialog header */}
        <DialogHeader>
          <DialogTitle>
            {props.mode === "update" ? "Edit Post" : "Add a Post"}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "update"
              ? "Make changes to your post"
              : "Attendants subscribed to this event will be notified by email."}
          </DialogDescription>
        </DialogHeader>
        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* post message */}
            <FormField
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind?"
                      className="h-40 resize-none"
                      maxLength={300}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.message?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            {/* dialog footer with submit button */}
            <DialogFooter className="mt-4">
              <Button type="submit">
                {props.mode === "update" ? "Update" : "Post"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PostHandlerDialog;
