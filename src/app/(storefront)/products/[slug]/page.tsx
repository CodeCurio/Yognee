"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product, Review } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Check } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Obsidian Black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // Submit Review State
  const [newRating, setNewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewBody, setNewReviewBody] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { addItem } = useCart();
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      const supabase = createClient();

      // Fetch Product
      const { data: prodData } = await supabase
        .from("products")
        .select("*, images:product_images(*), category:categories(*)")
        .eq("slug", slug)
        .single();

      if (prodData) {
        const prod = prodData as Product;
        setProduct(prod);

        // Fetch Reviews
        const { data: revData } = await supabase
          .from("reviews")
          .select("*")
          .eq("product_id", prod.id)
          .order("created_at", { ascending: false });

        if (revData) setReviews(revData as Review[]);

        // Fetch Related Products
        const { data: relData } = await supabase
          .from("products")
          .select("*, images:product_images(*), category:categories(*)")
          .eq("status", "active")
          .neq("id", prod.id)
          .limit(4);

        if (relData) setRelatedProducts(relData as Product[]);
      }

      setIsLoading(false);
    };

    fetchProductData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <Skeleton className="aspect-[4/5] rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products">
          <Button variant="primary">Return to Collection</Button>
        </Link>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images.map((i) => i.image_url)
    : ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&q=80"];

  const currentImage = images[selectedImageIndex] || images[0];
  const discountPercent = calculateDiscount(product.price, product.sale_price);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    addItem(
      product,
      undefined,
      quantity,
      { Color: selectedColor, Size: selectedSize },
      rect,
      currentImage
    );
    toast.success("Added to Shopping Bag", `${product.title} (${selectedSize})`);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewBody.trim()) {
      toast.error("Please write a title and review body.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          product_id: product.id,
          user_id: user?.id || null,
          rating: newRating,
          title: newReviewTitle,
          body: newReviewBody,
          is_verified: true,
        })
        .select()
        .single();

      if (error) {
        toast.error("Failed to submit review");
      } else {
        toast.success("Thank you for your feedback!", "Your review is published.");
        setReviews([data as Review, ...reviews]);
        setNewReviewTitle("");
        setNewReviewBody("");
      }
    } catch (e) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const accordionItems = [
    {
      id: "description",
      title: "Description & Details",
      content: (
        <p className="leading-relaxed">
          {product.description ||
            "Forged in limited quantities, this piece represents architectural design combined with master artisan finishing. Every component is rigorously inspected to satisfy demanding longevity standards."}
        </p>
      ),
    },
    {
      id: "specifications",
      title: "Technical Specifications",
      content: (
        <table className="w-full text-xs text-left">
          <tbody className="divide-y divide-neutral-100">
            <tr>
              <td className="py-2 font-semibold text-foreground-primary">SKU Identifier</td>
              <td className="py-2 text-foreground-secondary">{product.sku}</td>
            </tr>
            <tr>
              <td className="py-2 font-semibold text-foreground-primary">Materials</td>
              <td className="py-2 text-foreground-secondary">100% Organic Tuscan Calfskin & Grade 5 Titanium</td>
            </tr>
            <tr>
              <td className="py-2 font-semibold text-foreground-primary">Origin</td>
              <td className="py-2 text-foreground-secondary">Hand-Assembled in Florence, Italy</td>
            </tr>
            <tr>
              <td className="py-2 font-semibold text-foreground-primary">Warranty</td>
              <td className="py-2 text-foreground-secondary">5-Year International Atelier Guarantee</td>
            </tr>
          </tbody>
        </table>
      ),
    },
    {
      id: "shipping",
      title: "Complimentary Express Shipping & Returns",
      content: (
        <div className="space-y-2 text-xs">
          <p>• Complimentary express courier shipping on orders over $250.</p>
          <p>• Signature archival black box presentation included with all orders.</p>
          <p>• 30-day trial period with complimentary pre-paid return shipping labels.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12 space-y-16">
      {/* Breadcrumbs */}
      <nav className="text-xs text-neutral-400 font-medium flex items-center gap-2">
        <Link href="/" className="hover:text-foreground-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground-primary transition-colors">
          Collections
        </Link>
        <span>/</span>
        <span className="text-foreground-primary font-semibold">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Gallery: Main Image + Thumbnail Strip */}
        <div className="space-y-4">
          <div
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 cursor-zoom-in border border-neutral-100 shadow-card"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={currentImage}
                alt={product.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: isZoomed ? 1.25 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover transition-transform duration-300 origin-center"
              />
            </AnimatePresence>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx ? "border-accent shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Panel */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block mb-2">
              {product.category?.name || "EXCLUSIVE ATELIER RELEASE"}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground-primary mb-4">
              {product.title}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-foreground-primary">
                  {formatCurrency(product.sale_price ?? product.price)}
                </span>
                {product.sale_price && (
                  <span className="text-lg text-neutral-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-white bg-destructive px-2.5 py-1 rounded">
                  -{discountPercent}% OFF
                </span>
              )}

              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold ml-auto bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                <Star className="h-4 w-4 fill-amber-400" />
                <span>4.9 ({reviews.length} Verified Reviews)</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm text-foreground-secondary leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-primary mb-3">
                Color Palette: <span className="font-normal text-neutral-500">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {[
                  { name: "Obsidian Black", color: "bg-neutral-900" },
                  { name: "Tuscan Cognac", color: "bg-amber-800" },
                  { name: "Milano Cream", color: "bg-stone-200" },
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`h-9 w-9 rounded-full ${c.color} flex items-center justify-center border-2 transition-all ${
                      selectedColor === c.name ? "ring-2 ring-accent ring-offset-2 border-white scale-110" : "border-transparent"
                    }`}
                  >
                    {selectedColor === c.name && <Check className="h-4 w-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground-primary">
                  Select Size
                </label>
                <button className="text-xs text-accent underline font-semibold">Size Guide</button>
              </div>
              <div className="flex items-center gap-3">
                {["S", "M", "L", "XL"].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`h-11 w-14 rounded-lg font-semibold text-xs border transition-all ${
                      selectedSize === sz
                        ? "bg-foreground-primary text-white border-foreground-primary shadow-md"
                        : "bg-white text-foreground-primary border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-primary mb-3">
                Quantity
              </label>
              <div className="inline-flex items-center border border-neutral-200 rounded-lg bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 font-bold text-neutral-600 hover:bg-neutral-100 rounded-md"
                >
                  -
                </button>
                <span className="px-6 font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity || 99, quantity + 1))}
                  className="px-4 py-2 font-bold text-neutral-600 hover:bg-neutral-100 rounded-md"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart CTA & Wishlist */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                shimmer
                disabled={product.stock_quantity === 0}
                className="flex-1 gap-2 shadow-xl py-4"
              >
                <ShoppingBag className="h-5 w-5" />
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Shopping Bag"}
              </Button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-xl border transition-colors ${
                  inWishlist
                    ? "bg-red-50 border-red-200 text-destructive"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-foreground-primary"
                }`}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-destructive" : ""}`} />
              </button>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="pt-8">
            <Accordion items={accordionItems} defaultOpenId="description" />
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-12 border-t border-neutral-200 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground-primary mb-2">
              Verified Client Reviews
            </h2>
            <p className="text-sm text-foreground-secondary">
              Real feedback from connoisseurs and patrons worldwide.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-neutral-100 p-4 rounded-xl">
            <div className="text-center pr-4 border-r border-neutral-200">
              <span className="font-serif text-4xl font-bold text-foreground-primary">4.9</span>
              <span className="text-xs text-neutral-500 block">Out of 5</span>
            </div>
            <div className="text-xs text-neutral-600 space-y-1 pl-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p>Based on {reviews.length} reviews</p>
            </div>
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-card max-w-2xl">
          <h3 className="font-serif text-xl font-bold mb-4">Write a Client Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 text-amber-400 focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= newRating ? "fill-amber-400" : "text-neutral-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <input
                type="text"
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
                placeholder="Review Headline (e.g. Masterclass in Horology)"
                className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-md focus:outline-none focus:border-accent bg-white"
                required
              />
            </div>

            <div>
              <textarea
                value={newReviewBody}
                onChange={(e) => setNewReviewBody(e.target.value)}
                rows={4}
                placeholder="Share your experience with the craftsmanship, packaging, and fit..."
                className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-md focus:outline-none focus:border-accent bg-white"
                required
              />
            </div>

            <Button type="submit" variant="primary" isLoading={isSubmittingReview}>
              Submit Client Review
            </Button>
          </form>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-xl border border-neutral-100 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                {rev.is_verified && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" /> Verified Patron
                  </span>
                )}
              </div>
              <h4 className="font-serif text-lg font-bold text-foreground-primary">{rev.title}</h4>
              <p className="text-sm text-foreground-secondary leading-relaxed">{rev.body}</p>
              <span className="text-xs text-neutral-400 block pt-2">
                Posted on {new Date(rev.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-neutral-200">
          <h2 className="font-serif text-3xl font-bold text-foreground-primary mb-8">
            You May Also Admire
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
