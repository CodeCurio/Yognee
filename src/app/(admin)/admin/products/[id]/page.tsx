"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { ProductForm } from "@/components/admin/ProductForm";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*, images:product_images(*)")
        .eq("id", id)
        .single();

      if (data) setProduct(data as Product);
      setIsLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  if (!product) {
    return <div className="p-8 text-center text-neutral-500">Product Not Found</div>;
  }

  return <ProductForm initialProduct={product} />;
}
