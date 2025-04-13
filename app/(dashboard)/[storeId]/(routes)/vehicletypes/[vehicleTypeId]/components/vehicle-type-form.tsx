"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { VehicleType } from "@prisma/client";
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

interface VehicleTypeProps {
  initialData: VehicleType | null;
}
type VehicleTypevalues = z.infer<typeof VehicleTypeformSchema>;

export const VehicleTypeForm: React.FC<VehicleTypeProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Vehicle Type" : "Create Vehicle Type";
  const description = initialData
    ? "Edit  a Vehicle Type"
    : "Add a new Vehicle Type";
  const toastMessage = initialData
    ? "Vehicle Type updated"
    : "Vehicle Type created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<VehicleTypevalues>({
    resolver: zodResolver(VehicleTypeformSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = async (values: VehicleTypevalues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/vehicletypes/${params.vehicleTypeId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/vehicletypes`, values);
      }
      router.refresh();
      update();
      router.push(`/${params.storeId}/vehicletypes`);
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
        `/api/${params.storeId}/vehicletypes/${params.vehicleTypeId}`
      );
      router.refresh();
      update();
      router.push(`/${params.storeId}/vehicletypes`);
      toast.success("vehicle type deleted.");
    } catch {
      toast.error(
        "Make sure you removed all products using this vehicletype first."
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
                      placeholder="Vehicle type name"
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
