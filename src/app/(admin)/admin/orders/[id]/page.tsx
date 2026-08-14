"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Order, OrderTimeline } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft, Printer, Truck, Check, Clock, Send } from "lucide-react";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<OrderTimeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status & Tracking Form State
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [trackingCarrier, setTrackingCarrier] = useState<string>("");
  const [adminNote, setAdminNote] = useState<string>("");

  const toast = useToast();

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    const supabase = createClient();

    // Fetch Order
    const { data: ord } = await supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("id", id)
      .single();

    if (ord) {
      const orderObj = ord as Order;
      setOrder(orderObj);
      setFulfillmentStatus(orderObj.fulfillment_status);
      setTrackingNumber(orderObj.tracking_number || "");
      setTrackingCarrier(orderObj.tracking_carrier || "FedEx Express");
    }

    // Fetch Order Timeline
    const { data: timeData } = await supabase
      .from("order_timeline")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false });

    if (timeData) setTimeline(timeData as OrderTimeline[]);

    setIsLoading(false);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    const supabase = createClient();

    try {
      // 1. Update Order record
      await supabase
        .from("orders")
        .update({
          fulfillment_status: fulfillmentStatus,
          tracking_number: trackingNumber,
          tracking_carrier: trackingCarrier,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      // 2. Add Timeline Log
      await supabase.from("order_timeline").insert({
        order_id: order.id,
        status: fulfillmentStatus,
        note: adminNote ? adminNote : `Fulfillment status changed to ${fulfillmentStatus}`,
      });

      toast.success("Order status & tracking updated!");
      setAdminNote("");
      fetchOrderDetails();
    } catch (e: any) {
      toast.error("Failed to update status", e.message);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (isLoading) return <div className="p-8 text-center text-neutral-400">Loading Order Details...</div>;
  if (!order) return <div className="p-8 text-center text-neutral-400">Order Not Found.</div>;

  const addr = order.shipping_address as any;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 print:hidden">
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push("/admin/orders")} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground-primary">
              Order {order.order_number}
            </h1>
            <p className="text-xs text-neutral-500">
              Placed on {formatDate(order.created_at)} • Payment ID: {order.Razorpay_payment_id || "N/A"}
            </p>
          </div>
        </div>

        <Button onClick={handlePrintInvoice} variant="outline" size="sm" className="gap-2">
          <Printer className="h-4 w-4" /> Print Invoice / Packing Slip
        </Button>
      </div>

      {/* Main Grid: Customer & Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-2 text-xs">
          <h3 className="font-serif text-base font-bold text-foreground-primary mb-3">
            Shipping Destination
          </h3>
          <p className="font-bold text-sm">{addr?.full_name}</p>
          <p>{addr?.address_line1} {addr?.address_line2}</p>
          <p>{addr?.city}, {addr?.state} {addr?.zip}, {addr?.country}</p>
          <p className="pt-2 text-neutral-500">Email: {order.email}</p>
          <p className="text-neutral-500">Phone: {addr?.phone}</p>
        </div>

        {/* Status Update Control Box */}
        <form onSubmit={handleUpdateStatus} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4 print:hidden">
          <h3 className="font-serif text-base font-bold text-foreground-primary">
            Update Logistics Status
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                Status
              </label>
              <select
                value={fulfillmentStatus}
                onChange={(e) => setFulfillmentStatus(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded p-2 text-xs font-bold text-foreground-primary focus:outline-none focus:border-accent"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <Input
              label="Tracking Carrier"
              value={trackingCarrier}
              onChange={(e) => setTrackingCarrier(e.target.value)}
            />
          </div>

          <Input
            label="Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. 78123456789"
          />

          <Input
            label="Internal Timeline Note (Optional)"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="e.g. Dispatched via armored courier"
          />

          <Button type="submit" variant="primary" size="sm" className="w-full">
            Save Status & Log Timeline
          </Button>
        </form>
      </div>

      {/* Items Breakdown Table */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
        <h3 className="font-serif text-lg font-bold">Ordered Masterpieces</h3>
        <table className="w-full text-xs text-left">
          <thead className="bg-neutral-50 uppercase text-neutral-500">
            <tr>
              <th className="py-2.5 px-4">Item Title</th>
              <th className="py-2.5 px-4">Unit Price</th>
              <th className="py-2.5 px-4">Quantity</th>
              <th className="py-2.5 px-4 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium">
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td className="py-3 px-4 font-bold">{item.title}</td>
                <td className="py-3 px-4">{formatCurrency(item.unit_price)}</td>
                <td className="py-3 px-4">{item.quantity}</td>
                <td className="py-3 px-4 text-right font-bold">{formatCurrency(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pt-4 border-t border-neutral-200 text-xs space-y-1 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span className="font-semibold">{formatCurrency(order.shipping_cost)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span className="font-semibold">{formatCurrency(order.tax_amount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-neutral-200 text-base font-bold">
            <span>Total:</span>
            <span className="font-serif text-xl">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Visual Timeline Section */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4 print:hidden">
        <h3 className="font-serif text-lg font-bold">Order Activity & Audit Timeline</h3>
        <div className="space-y-4 pl-4 border-l-2 border-neutral-200">
          {timeline.map((t) => (
            <div key={t.id} className="relative pl-6">
              <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-accent border-2 border-white" />
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-foreground-primary">
                  {t.status}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {formatDate(t.created_at)}
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-1">{t.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
