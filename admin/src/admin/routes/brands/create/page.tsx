import { defineRouteConfig } from "@medusajs/admin-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FocusModal, Heading, Label, Input, Button, toast } from "@medusajs/ui";
import { FormProvider, Controller, useForm } from "react-hook-form";
import { sdk } from "../../../lib/sdk";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createBrandSchema = z.object({
  name: z.string().min(2).max(100),
  handler: z.string().optional(),
  image: z.string().optional(),
});

function CreateBrandPage() {
  const [open, setOpen] = useState(true);
  const queryClient = useQueryClient();

  const go = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof createBrandSchema>) => {
      return sdk.client.fetch("/admin/brands", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [["brands"]],
      });
    },
  });
  const form = useForm<z.infer<typeof createBrandSchema>>({
    resolver: zodResolver(createBrandSchema),
    disabled: isPending,
  });
  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data)
      .then((data) => {
        if (data) {
          closeModal();
        }
      })
      .catch((error) => {
        toast.error("Failed to create brand");
        console.error(error);
      });
  });

  function closeModal() {
    setOpen(false);
    go(-1);
  }
  return (
    <FocusModal open={open} onOpenChange={closeModal}>
      <FocusModal.Trigger asChild>
        <Button>Create</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex h-full flex-col overflow-hidden"
          >
            <FocusModal.Header>
              <div className="flex items-center justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button size="small" variant="secondary">
                    Cancel
                  </Button>
                </FocusModal.Close>
                <Button type="submit" size="small">
                  Save
                </Button>
              </div>
            </FocusModal.Header>
            <FocusModal.Body>
              <div className="flex flex-1 flex-col items-center overflow-y-auto">
                <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
                  <div>
                    <Heading className="capitalize">Create Item</Heading>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      control={form.control}
                      name="name"
                      render={({ field }) => {
                        return (
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-x-1">
                              <Label size="small" weight="plus">
                                Name
                              </Label>
                            </div>
                            <Input {...field} />
                          </div>
                        );
                      }}
                    />
                    <Controller
                      control={form.control}
                      name="handler"
                      render={({ field }) => {
                        return (
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-x-1">
                              <Label size="small" weight="plus">
                                Handler{" "}
                                <span className="txt-fg-subtle">
                                  (optional)
                                </span>
                              </Label>
                            </div>
                            <Input {...field} />
                          </div>
                        );
                      }}
                    />
                  </div>
                  <Controller
                    control={form.control}
                    name="image"
                    render={({ field }) => {
                      return (
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center gap-x-1">
                            <Label size="small" weight="plus">
                              Image url{" "}
                              <span className="txt-fg-subtle">(optional)</span>
                            </Label>
                          </div>
                          <Input {...field} />
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </FocusModal.Body>
            <FocusModal.Footer>
              <div className="flex items-center justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button size="small" variant="secondary" disabled={isPending}>
                    Cancel
                  </Button>
                </FocusModal.Close>
                <Button type="submit" size="small" isLoading={isPending}>
                  Save
                </Button>
              </div>
            </FocusModal.Footer>
          </form>
        </FormProvider>
      </FocusModal.Content>
    </FocusModal>
  );
}

export const config = defineRouteConfig({
  label: "Create brand",
});

export default CreateBrandPage;
