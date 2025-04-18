"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Combos } from "@prisma/client";
import { VehicleTypeformSchema } from "@/schemas";
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

interface FormProps {
  initialData: Combos | null;
}
type FormValues = z.infer<typeof VehicleTypeformSchema>;

export const FormEnter: React.FC<FormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit combo" : "Create combo";
  const description = initialData ? "Edit  a combo" : "Add a new combo";
  const toastMessage = initialData ? "combo updated" : "combo created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<FormValues>({
    resolver: zodResolver(VehicleTypeformSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/combos/${params.comboId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/combos`, values);
      }
      router.refresh();
      update();
      router.push(`/${params.storeId}/combos`);
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
      await axios.delete(`/api/${params.storeId}/combos/${params.comboId}`);
      router.refresh();
      update();
      router.push(`/${params.storeId}/combos`);
      toast.success("combo deleted.");
    } catch {
      toast.error("Make sure you removed all products using this combo first.");
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="combo name"
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
