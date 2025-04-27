"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Body,
  Category,
  Combos,
  Face,
  Fragrance,
  Hair,
  Image,
  Ingredient,
  Makeup,
  Price,
  Product,
} from "@prisma/client";
import { ProductformSchema } from "@/schemas";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertModal } from "@/components/modals/alert-modal";
import { ImageUpload } from "@/components/ui/image-upload-product";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
  faces: Face[];
  hairs: Hair[];
  makeups: Makeup[];
  bodys: Body[];
  combos: Combos[];
  ingredients: Ingredient[];
  fragrances: Fragrance[];
  prices: Price[];
}

type ProductFormValues = z.infer<typeof ProductformSchema>;

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  faces,
  hairs,
  makeups,
  bodys,
  combos,
  ingredients,
  fragrances,
  prices,
}) => {
  const params = useParams();
  const router = useRouter();
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit a Product" : "Add a new product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductformSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          images: initialData.images
            .flat() // Flatten the array if it is nested
            .map((image) => ({ url: image.url })), // Transform to { url: string }[]
          faceId: initialData.faceId ?? undefined,
          hairId: initialData.hairId ?? undefined,
          makeupId: initialData.makeupId ?? undefined,
          bodyId: initialData.bodyId ?? undefined,
          comboId: initialData.comboId ?? undefined,
          ingredientId: initialData.ingredientId ?? undefined,
          fragranceId: initialData.fragranceId ?? undefined,
          priceId: initialData.priceId ?? undefined,
        }
      : {
          name: "",
          images: [], // Default to an empty array of { url: string }[]
          description: "",
          categoryId: "",
          faceId: "",
          hairId: "",
          makeupId: "",
          bodyId: "",
          comboId: "",
          ingredientId: "",
          fragranceId: "",
          priceId: "",
          isNewLaunch: false,
          isBestseller: false,
          isFeatured: false,
          isArchived: false,
        },
  });
  const onSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, values);
      }
      router.refresh();
      update();
      router.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      await update();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch {
      toast.error(
        "Make sure you removed all categories using this Product first."
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
          className="space-y-8 w-full "
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={loading}
                    value={field.value || []}
                    onChange={(newUrls) => field.onChange(newUrls)} // Pass the array directly
                    onRemove={(urlToRemove) => {
                      const updatedValue = (field.value || []).filter(
                        (img) => img.url !== urlToRemove
                      );
                      field.onChange(updatedValue);
                    }}
                    maxFiles={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Product</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center p-2 text-sm text-gray-500">
                          No Categories.{" "}
                          <button
                            onClick={() => {
                              router.push(`/${params.storeId}/categories/new`);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Create one!
                          </button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none ">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will be highlighted on the home page.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none ">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="isBestseller"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none ">
                    <FormLabel>Best Seller</FormLabel>
                    <FormDescription>
                      This product will show bestseller in the store.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="isNewLaunch"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none ">
                    <FormLabel>New Launch</FormLabel>
                    <FormDescription>
                      This product will show new launch in the store.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Face Filter</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a filter"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {faces.length > 0 ? (
                        faces.map((face) => (
                          <SelectItem key={face.id} value={face.id}>
                            {face.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center p-2 text-sm text-gray-500">
                          No Colors.{" "}
                          <button
                            onClick={() => {
                              router.push(`/${params.storeId}/faces/new`);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Create one!
                          </button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hairId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hair Filter</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a filter"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hairs.length > 0 ? (
                        hairs.map((hair) => (
                          <SelectItem key={hair.id} value={hair.id}>
                            {hair.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center p-2 text-sm text-gray-500">
                          No filters.{" "}
                          <button
                            onClick={() => {
                              router.push(`/${params.storeId}/hairs/new`);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Create one!
                          </button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="makeupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Makeup Filter</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a filter"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {makeups.length > 0 ? (
                        makeups.map((makeup) => (
                          <SelectItem key={makeup.id} value={makeup.id}>
                            {makeup.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center p-2 text-sm text-gray-500">
                          No filters.{" "}
                          <button
                            onClick={() => {
                              router.push(`/${params.storeId}/makeups/new`);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Create one!
                          </button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bodyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Filter</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a filter"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bodys.length > 0 ? (
                        bodys.map((body) => (
                          <SelectItem key={body.id} value={body.id}>
                            {body.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center p-2 text-sm text-gray-500">
                          No filters.{" "}
                          <button
                            onClick={() => {
                              router.push(`/${params.storeId}/bodys/new`);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Create one!
                          </button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hairId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Combo Filter</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a filter"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {combos.length > 0 ? (
                        combos.map((combo) => (
                          <SelectItem key={combo.id} value={combo.id}>
                            {combo.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center p-2 text-sm text-gray-500">
                          No filters.{" "}
                          <button
                            onClick={() => {
                              router.push(`/${params.storeId}/combos/new`);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Create one!
                          </button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ingredientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredient Filter</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a filter"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ingredients.length > 0 ? (
                        ingredients.map((ingredient) => (
                          <SelectItem key={ingredient.id} value={ingredient.id}>
                            {ingredient.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center p-2 text-sm text-gray-500">
                          No filters.{" "}
                          <button
                            onClick={() => {
                              router.push(`/${params.storeId}/ingredients/new`);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Create one!
                          </button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fragranceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fragrance Filter</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a filter"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fragrances.length > 0 ? (
                        fragrances.map((fragrance) => (
                          <SelectItem key={fragrance.id} value={fragrance.id}>
                            {fragrance.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center p-2 text-sm text-gray-500">
                          No filters.{" "}
                          <button
                            onClick={() => {
                              router.push(`/${params.storeId}/fragrances/new`);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Create one!
                          </button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Filter</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a filter"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {prices.length > 0 ? (
                        prices.map((price) => (
                          <SelectItem key={price.id} value={price.id}>
                            {price.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center p-2 text-sm text-gray-500">
                          No filters.{" "}
                          <button
                            onClick={() => {
                              router.push(`/${params.storeId}/prices/new`);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Create one!
                          </button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
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
