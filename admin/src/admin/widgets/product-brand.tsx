import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import {
  clx,
  Container,
  Heading,
  IconButton,
  Text,
  DropdownMenu,
  Drawer,
  Skeleton,
  Select,
  Button,
  toast,
  Avatar,
} from "@medusajs/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import { EllipsisHorizontal, PencilSquare } from "@medusajs/icons";
import { useState } from "react";

type AdminProductBrand = AdminProduct & {
  brand?: {
    id: string;
    name: string;
    image?: string;
  };
};

const ProductBrandWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const { data: queryResult } = useQuery({
    queryFn: () =>
      sdk.admin.product.retrieve(product.id, {
        fields: "+brand.*",
      }),
    queryKey: [["product", product.id]],
  });
  const brand = (queryResult?.product as AdminProductBrand)?.brand;
  const [isOpen, setOpen] = useState(false);
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Brand</Heading>
        </div>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton size="small" variant="transparent">
              <EllipsisHorizontal />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              className="gap-x-2"
              onClick={() => setOpen(true)}
            >
              <PencilSquare className="text-ui-fg-subtle" />
              Edit
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
      <div
        className={clx(
          `text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4`
        )}
      >
        {brand && <Avatar src={brand.image || ""} fallback={brand?.name} />}

        <Text
          size="small"
          leading="compact"
          className="whitespace-pre-line text-pretty"
        >
          {brand?.name || "-"}
        </Text>
      </div>
      <EditItemPanel product={product} isOpen={isOpen} setOpen={setOpen} />
    </Container>
  );
};

function EditItemPanel({
  isOpen,
  setOpen,
  product,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  product: AdminProduct & { brand?: { id: string; name: string } };
}) {
  const [brandId, setBrandId] = useState(product.brand?.id);
  const queryClient = useQueryClient();
  const { data: queryResult, isLoading } = useQuery({
    queryFn: () =>
      sdk.client.fetch<
        { brands: { id: string; name: string; image?: string }[] } | undefined
      >("/admin/brands"),
    queryKey: [["brands"]],
  });
  const { mutateAsync } = useMutation({
    mutationFn: (brandId: string) => {
      return sdk.admin.product.update(product.id, {
        additional_data: {
          brand_id: brandId,
        },
      } as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [["product", product.id]],
      });
    },
  });

  const brands = queryResult?.brands || [];

  const handleUpdateBrand = () => {
    if (!brandId) return;
    mutateAsync(brandId)
      .then((res) => {
        if (res.product) {
          setOpen(false);
          toast.success("Brand updated successfully");
        }
      })
      .catch((error) => {
        toast.error("Failed to update brand");
        console.error(error);
      });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit Brand</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          {isLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <Select onValueChange={setBrandId} value={brandId}>
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Select a brand" />
              </Select.Trigger>
              <Select.Content>
                {brands.map((brand) => (
                  <Select.Item key={brand.id} value={brand.id}>
                    {brand.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          )}
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button variant="primary" onClick={() => handleUpdateBrand()}>
            Save
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

export const config = defineWidgetConfig({
  zone: "product.details.side.before",
});

export default ProductBrandWidget;
