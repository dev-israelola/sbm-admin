import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useOrder } from "@/features/orders/useOrders";
import { formatNaira, formatDateTime } from "@/lib/format";

export default function OrderReceiptPrintPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const format = params.get("format") || "thermal";
  const { data: order, isLoading } = useOrder(id);

  // Automatically trigger Native Browser Print engine immediately after network completion
  useEffect(() => {
    if (!isLoading && order) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, order]);

  if (isLoading) return <div className="p-10 font-mono text-sm text-center text-black bg-white min-h-screen">Loading receipt data...</div>;
  if (!order) return <div className="p-10 font-mono text-sm text-center text-black bg-white min-h-screen">Order record not found.</div>;

  const isThermal = format === "thermal";

  // Thermal 80mm format (POS Dispatch)
  if (isThermal) {
    return (
      <div className="bg-white text-black min-h-screen">
        <div className="w-[80mm] max-w-full mx-auto p-4 font-mono text-[12px] leading-tight flex flex-col gap-4">
          <div className="text-center">
            <h1 className="font-bold text-lg mb-1 leading-none">Naturale & Holistic</h1>
            <p className="text-[10px]">Order Receipt</p>
          </div>

          <div className="border-b border-black border-dashed pb-3 space-y-1">
            <div className="flex justify-between">
              <span>Order:</span>
              <span className="font-bold">{order.number}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="uppercase">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="uppercase">{order.paymentMethod.replace("_", " ")}</span>
            </div>
          </div>

          <div className="border-b border-black border-dashed pb-3">
            <p className="font-bold mb-1">Customer Details</p>
            <p className="uppercase">{order.customerName}</p>
            <p>{order.customerPhone}</p>
            <p className="text-[10px] truncate">{order.customerEmail}</p>
            {order.address && (
              <p className="mt-1 text-[11px] break-words uppercase">
                {order.address.street}, {order.address.city}, {order.address.state}
              </p>
            )}
            {order.deliveryMethod === "pickup" && order.pickupStation && (
              <p className="mt-1 text-[11px] break-words">
                PICKUP HUB: {order.pickupStation.name} - {order.pickupStation.city}
              </p>
            )}
          </div>

          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-black border-dashed text-left">
                <th className="py-1 font-normal w-1/2">Item</th>
                <th className="py-1 font-normal text-center w-[15%]">Qty</th>
                <th className="py-1 font-normal text-right w-[35%]">Amt</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="py-2 pr-2 break-words align-top">
                    {it.name}
                    <div className="text-[9px] mt-0.5 truncate uppercase">SKU:{it.sku}</div>
                  </td>
                  <td className="py-2 text-center align-top">{it.quantity}</td>
                  <td className="py-2 text-right align-top break-words">{formatNaira(it.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1 border-t border-black border-dashed pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatNaira(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{order.deliveryFee === 0 ? "Free" : formatNaira(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{formatNaira(order.discount)}</span>
              </div>
            )}
            {order.pointsApplied > 0 && (
              <div className="flex justify-between">
                <span>Points Claimed</span>
                <span>-{formatNaira(order.pointsValue)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm mt-3 pt-3 border-t border-black border-dashed">
              <span>TOTAL</span>
              <span>{formatNaira(order.total)}</span>
            </div>
          </div>
          
          <div className="text-center mt-6 text-[10px] space-y-1">
            <p className="font-bold">Thank you for shopping with us!</p>
            <p>naturaleandholistic.com</p>
          </div>
        </div>
      </div>
    );
  }

  // Standard A4 Letter Format (Generic Standard Invoice)
  return (
    <div className="bg-white text-black min-h-screen p-10 print:p-0">
      <div className="max-w-4xl mx-auto font-sans leading-relaxed">
        <div className="flex justify-between items-start border-b border-black pb-8 mb-10">
          <div>
            <h1 className="font-black text-4xl tracking-tight mb-2">INVOICE</h1>
            <p className="text-neutral-500 font-medium">Order #{order.number}</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-xl uppercase tracking-widest text-black">Naturale & Holistic</h2>
            <p className="text-sm text-neutral-500 mt-1">Generated {formatDateTime(new Date().toISOString())}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-xs text-neutral-400 mb-3 uppercase tracking-widest">Bill To / Deliver To</h3>
            <p className="font-bold text-xl uppercase mb-1">{order.customerName}</p>
            <p className="text-neutral-700">{order.customerPhone}</p>
            <p className="text-neutral-700">{order.customerEmail}</p>
            
            {order.address && (
               <div className="mt-3 text-neutral-700 border-l-2 border-neutral-200 pl-3 py-1">
                 <p>{order.address.street}</p>
                 <p>{order.address.city}, {order.address.state}</p>
                 <p>{order.address.country}</p>
               </div>
            )}
            
            {order.deliveryMethod === "pickup" && order.pickupStation && (
               <div className="mt-3 text-neutral-700 border-l-2 border-neutral-200 pl-3 py-1">
                 <p className="font-bold">PICKUP STATION HUB</p>
                 <p>{order.pickupStation.name}</p>
                 <p>{order.pickupStation.address}, {order.pickupStation.city}</p>
               </div>
            )}
          </div>
          
          <div>
            <h3 className="font-bold text-xs text-neutral-400 mb-3 uppercase tracking-widest">Order Details</h3>
            <table className="w-full text-sm">
               <tbody className="divide-y divide-neutral-100">
                  <tr><td className="py-2 text-neutral-500">Invoice Date</td><td className="py-2 text-right font-medium">{formatDateTime(order.createdAt)}</td></tr>
                  <tr><td className="py-2 text-neutral-500">Payment Status</td><td className="py-2 text-right font-bold uppercase">{order.paymentStatus}</td></tr>
                  <tr><td className="py-2 text-neutral-500">Payment Method</td><td className="py-2 text-right font-medium uppercase">{order.paymentMethod.replace("_", " ")}</td></tr>
                  <tr><td className="py-2 text-neutral-500">Delivery Method</td><td className="py-2 text-right font-medium uppercase">{order.deliveryMethod}</td></tr>
               </tbody>
            </table>
          </div>
        </div>

        <table className="w-full mb-12 border-collapse">
          <thead>
            <tr className="border-b-2 border-black text-left">
              <th className="py-4 font-bold text-sm tracking-wider uppercase">Item Description</th>
              <th className="py-4 font-bold text-sm tracking-wider uppercase text-center w-32">Unit Price</th>
              <th className="py-4 font-bold text-sm tracking-wider uppercase text-center w-20">Qty</th>
              <th className="py-4 font-bold text-sm tracking-wider uppercase text-right w-40">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {order.items.map((it, idx) => (
              <tr key={idx}>
                <td className="py-5 pr-4">
                  <p className="font-bold text-base text-black mb-1">{it.name}</p>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">SKU: {it.sku} | Brand: {it.brand}</p>
                </td>
                <td className="py-5 text-center text-neutral-700">{formatNaira(it.unitPrice)}</td>
                <td className="py-5 text-center font-medium text-black">{it.quantity}</td>
                <td className="py-5 text-right font-bold text-black">{formatNaira(it.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end border-t-2 border-black pt-6">
          <div className="w-full max-w-sm space-y-3 pb-8">
             <div className="flex justify-between text-neutral-600 text-sm">
                <span>Subtotal</span>
                <span>{formatNaira(order.subtotal)}</span>
             </div>
             <div className="flex justify-between text-neutral-600 text-sm">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? "Free" : formatNaira(order.deliveryFee)}</span>
             </div>
             {order.discount > 0 && (
               <div className="flex justify-between text-neutral-600 text-sm">
                 <span>Discount</span>
                 <span>-{formatNaira(order.discount)}</span>
               </div>
             )}
             {order.pointsApplied > 0 && (
               <div className="flex justify-between text-neutral-600 text-sm">
                 <span>Points Claimed</span>
                 <span>-{formatNaira(order.pointsValue)}</span>
               </div>
             )}
             <div className="flex justify-between font-black text-2xl pt-4 border-t border-neutral-200 mt-2">
                <span className="uppercase tracking-widest text-sm self-end pb-1">Total Amount</span>
                <span>{formatNaira(order.total)}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
