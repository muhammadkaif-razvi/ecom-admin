"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Image, Ingredient } from "@prisma/client";
import { ingredientFormSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertModal } from "@/components/modals/alert-modal";
import { ImageUpload } from "@/components/ui/image-upload-product";

interface ingredientFormProps {
  initialData:
    | (Ingredient & {
        images: Image[];
      })
    | null;
}
type ingredientFormValues = z.infer<typeof ingredientFormSchema>;

export const IngredientForm: React.FC<ingredientFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit ingredient" : "Create ingredient";
  const description = initialData
    ? "Edit  a ingredient"
    : "Add a new ingredient";
  const toastMessage = initialData
    ? "ingredient updated"
    : "ingredient created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ingredientFormValues>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          image: initialData.images
            ? [{ url: String(initialData.images) }]
            : [],
        }
      : {
          name: "",
          image: [],
          description: "",
        },
  });

  const onSubmit = async (values: ingredientFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/ingredients/${params.ingredientId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/ingredients`, values);
      }
      router.refresh();
      update();
      router.push(`/${params.storeId}/ingredients`);
      toast.success(toastMessage);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/ingredients/${params.ingredientId}`
      );
      router.refresh();
      update();
      router.push(`/${params.storeId}/ingredients`);
      toast.success("ingredient deleted.");
    } catch {
      toast.error(
        "Make sure you removed all categories using this ingredient first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={() => {
          onDelete();
        }}
        loading={loading}
      />
      <div className="flex items-center justify-between mt-3 sm:mt-5 lg:mt-6">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={"destructive"}
            size={"icon"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingredient Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={
                      field.value
                        ? field.value.map((item: { url: string }) => item)
                        : []
                    }
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={(urlToRemove) => {
                      const updatedValue = (field.value || []).filter(
                        (img) => img.url !== urlToRemove
                      );
                      field.onChange(updatedValue);
                    }}
                    maxFiles={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredient Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="ingredient Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredient Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="ingredient description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
