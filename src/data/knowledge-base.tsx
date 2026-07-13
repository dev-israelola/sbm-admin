import React from "react";
import { 
  Store, ShoppingCart, Users, Truck, Wallet, 
  Settings, Package, MapPin, Printer, Newspaper, Gift, 
  Activity, ShieldCheck, CheckCircle2, ChevronRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type Role = "admin" | "manager" | "accountant" | "delivery" | "consultant";

export interface KnowledgeTopic {
  id: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  roles: Role[]; 
}

export interface KnowledgeCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  roles: Role[]; 
  topics: KnowledgeTopic[];
}

export const KNOWLEDGE_BASE: KnowledgeCategory[] = [
  {
    id: "dashboard-analytics",
    title: "1. Dashboard & Analytics",
    icon: Activity,
    description: "Your primary viewpoint. Learn how to read global metrics and generate comprehensive data reports for your operations.",
    roles: ["admin", "manager", "accountant"],
    topics: [
      {
        id: "overview",
        title: "Platform Overview",
        roles: [],
        excerpt: "Reading your primary dashboard metrics, gross volume, and quick actions.",
        content: (
          <div className="space-y-4">
            <p>
              The <strong>Overview</strong> screen is the command center of SBM Naturales. It provides a real-time snapshot of your gross volume, open orders, unfulfilled shipments, and active user metrics.
            </p>
            <h4 className="font-semibold text-ink mt-6 mb-2">Key Metrics Explained:</h4>
            <ul className="list-disc pl-5 space-y-2 text-[15px]">
              <li><strong>Open Orders:</strong> Orders that have been submitted and paid for, but have not yet entered transit. This is your immediate task queue.</li>
              <li><strong>Unfulfilled:</strong> A critical sub-metric of open orders indicating orders that have sat in the queue past their standard timeline (usually 24 hours).</li>
              <li><strong>Gross Volume:</strong> Total monetary value of all processed orders over the last 30 days, including refunds.</li>
            </ul>
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="border border-line rounded-lg p-5 bg-surface text-center shadow-sm">
                <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold">Open Orders</p>
                <p className="text-3xl font-display font-bold mt-2 text-ink">24</p>
                <p className="text-xs text-success mt-1">↑ 12% vs last week</p>
              </div>
              <div className="border border-line rounded-lg p-5 bg-surface text-center shadow-sm">
                <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold">Unfulfilled Alert</p>
                <p className="text-3xl font-display font-bold mt-2 text-danger">12</p>
                <Button variant="danger" size="xs" className="mt-2 pointer-events-none w-full">Action Required</Button>
              </div>
            </div>
            <p><strong>Pro Tip:</strong> Clicking any metric card will automatically redirect you to the associated list with the correct filters already pre-applied to match the exact data slice you clicked!</p>
          </div>
        )
      },
      {
        id: "reports",
        title: "Reports & Exports",
        roles: ["admin", "manager", "accountant"],
        excerpt: "Generating custom reports for products, sales, and customers in CSV format.",
        content: (
          <div className="space-y-4">
            <p>
              The <strong>Reports</strong> tab allows you to run detailed temporal queries against all database models. You can filter data by specific Date Ranges, Order Statuses, or Geographical Delivery Zones, and immediately export them into Microsoft Excel.
            </p>
            <h4 className="font-semibold text-ink mt-6 mb-2">How to Generate a Report:</h4>
            <ol className="list-decimal pl-5 space-y-2 text-[15px]">
              <li>Select your target module (e.g. Sales, Customers, Deliveries).</li>
              <li>Click the <strong>Start Date</strong> to open the calendar picker and define the starting boundary.</li>
              <li>Click the <strong>End Date</strong>.</li>
              <li>(Optional) Apply any specific tags (e.g., Only display "Pending" orders).</li>
              <li>Click <strong>Generate CSV</strong>. Depending on the size of the request, compiling the file may take up to 30 seconds.</li>
            </ol>
            <div className="border border-line rounded-xl bg-surface p-6 my-6 shadow-sm">
               <h4 className="font-semibold text-sm mb-4">Mock Export Configuration</h4>
               <div className="flex flex-wrap items-center gap-3">
                 <Button variant="outline" size="sm" className="pointer-events-none">Oct 1st, 2026</Button>
                 <span className="text-ink-muted leading-none">—</span>
                 <Button variant="outline" size="sm" className="pointer-events-none">Oct 31st, 2026</Button>
                 <Badge variant="info">Sales Only</Badge>
                 <Button variant="primary" size="sm" className="pointer-events-none ml-auto">Generate CSV file</Button>
               </div>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: "catalog",
    title: "2. Catalog Management",
    icon: Package,
    description: "Manage your storefront products, categories, master inventory levels, and stock movements.",
    roles: ["admin", "manager"],
    topics: [
      {
        id: "products",
        title: "Master Products",
        roles: [],
        excerpt: "Creating, editing, and managing your public products, prices, and SEO tags.",
        content: (
          <div className="space-y-4">
            <p>Your products are the core of the storefront. The Products Data Table displays every product in your catalog regardless of its active status. You can toggle visibility, edit pricing models, and upload high-resolution Cover Images directly via the "Edit" panel.</p>
            <h4 className="font-semibold text-ink mt-6 mb-2">Creating a New Product:</h4>
            <ul className="list-disc pl-5 space-y-2 text-[15px]">
              <li><strong>Price vs Cost Price:</strong> Establish your <code className="text-[13px] bg-accent/10 text-accent px-1 rounded">retailPrice</code> that customers see, and tracking your internal <code className="text-[13px] bg-accent/10 px-1 rounded">costPrice</code> for accurate P&L margin calculations.</li>
              <li><strong>Bulk Promos:</strong> Engage wholesale buyers using the <code className="text-[13px] bg-accent/10 text-accent px-1 rounded">bulkMinQty</code> threshold, which can automatically trigger a <code className="text-[13px] bg-accent/10 px-1 rounded">PERCENT</code> or <code className="text-[13px] bg-accent/10 px-1 rounded">PRICE</code> discount.</li>
              <li><strong>Storefront Badges:</strong> Use the boolean toggles like Is Featured, Is Best Seller, or Is New Arrival to natively pop ribbon overlays onto the public site.</li>
              <li><strong>Medical Concerns:</strong> For consultations, explicitly map products to <code className="text-[13px] bg-accent/10 text-accent px-1 rounded">concernSlugs</code> (e.g. "Acne", "Hyperpigmentation") so doctors can prescribe them directly.</li>
            </ul>
            <div className="flex items-center justify-between p-4 border border-line rounded-lg bg-surface my-6 shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-surface-muted rounded overflow-hidden border border-line">
                     <img src="https://placehold.co/100x100" alt="mock" className="opacity-50 object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-ink">Raw Cocoa Butter</p>
                    <p className="text-xs text-ink-muted mt-0.5">SKU: RCB-102 • ₦4,500</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                 <Badge variant="success">Published</Badge>
                 <Button variant="outline" size="xs" className="pointer-events-none">Edit</Button>
               </div>
            </div>
          </div>
        )
      },
      {
        id: "categories",
        title: "Store Categories",
        roles: ["admin"],
        excerpt: "Defining the navigational hierarchy loops for the public website.",
        content: (
          <div className="space-y-4">
            <p>Categories group your products together into neat navigation menus for your customers (e.g., "Skincare", "Teas", "Bundles"). SBM Naturales relies on a Many-To-Many relationship, meaning you do not need duplicate products to have them display in multiple Collections.</p>
            <h4 className="font-semibold text-ink mt-6 mb-2">Uploading Category Posters:</h4>
            <p>Every category requires a Cover Image. This image is displayed universally on the Website's "Explore Components" and Mobile App grid. Ensure these are visually stunning, high-resolution `.jpg` or `.png` files.</p>
            <div className="text-sm bg-accent/10 border border-accent/20 p-4 rounded-lg text-ink my-4">
              💡 <strong>Did You Know?</strong> Deleting a Category <em>does not</em> delete the Products attached to it! It simply unlinks them, preventing catastrophic data loss.
            </div>
          </div>
        )
      },
      {
        id: "inventory",
        title: "Stock Inventory",
        roles: [],
        excerpt: "Managing physical warehouse stock counts and low-inventory alerts.",
        content: (
          <div className="space-y-4">
            <p>The Inventory screen provides a master view of available physical stock. This is completely decoupled from the "Products" system to allow for rapid auditing without risking accidental modifications to customer-facing pricing metrics.</p>
            <h4 className="font-semibold text-ink mt-6 mb-2">Auditing Flow:</h4>
            <p>If you see a stock mismatch natively (e.g. system says 12, physical warehouse shows 10), use the <strong>Adjust Count</strong> button. The system will force you to categorize the discrepancy (e.g., as <code className="text-[13px] bg-accent/10 px-1 rounded">DAMAGED_STOCK</code> or a general <code className="text-[13px] bg-accent/10 px-1 rounded">MANUAL_ADJUSTMENT</code>) which creates an immutable record in the Movements log for the Accountant to trace.</p>
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center bg-surface border border-line p-5 rounded-lg my-6 shadow-sm">
               <div>
                  <span className="text-[15px] font-bold text-ink">Turmeric Root Powder</span>
                  <p className="text-xs text-ink-muted mt-0.5">Threshold Alert: &lt;10</p>
               </div>
               <Badge variant="danger" className="text-[13px] px-3 py-1">5 physically left</Badge>
               <Button size="sm" variant="outline" className="pointer-events-none">Receive Shipments</Button>
            </div>
          </div>
        )
      },
      {
        id: "movements",
        title: "Inventory Movements",
        roles: [],
        excerpt: "Auditing exact stock additions and deductions universally over time.",
        content: (
          <div className="space-y-4">
            <p>The <strong>Movements</strong> tracker is an immutable ledger of all stock changes. You cannot delete data from this log. Ever.</p>
            <ul className="list-disc pl-5 space-y-2 text-[15px]">
              <li><strong>STOCK_RESERVED / ORDER_FULFILLED:</strong> Every time an order is placed, stock is automatically reserved. When packed, it's explicitly drawn down.</li>
              <li><strong>STOCK_ADDED:</strong> Every time you physically receive shipments via the supply chain, it creates a <code className="text-[13px] bg-accent/10 px-1 rounded">+N</code> row showing exactly which staff member authorized it.</li>
              <li><strong>RETURN_RESTOCKED:</strong> If an order is canceled, the system will optionally restock it based on the <code className="text-[13px] bg-accent/10 px-1 rounded">ReturnCondition</code> and log this exact event natively.</li>
              <li><strong>MANUAL_ADJUSTMENT / DAMAGED_STOCK:</strong> For stock mismatches or broken items discovered during warehouse audits.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: "fulfillment",
    title: "3. Order Fulfillment",
    icon: ShoppingCart,
    description: "Accepting inbound tickets, assigning routing configurations, processing packaging slips, and managing manual refunds.",
    roles: ["admin", "manager"],
    topics: [
      {
        id: "orders",
        title: "Orders Engine",
        roles: [],
        excerpt: "Processing orders from placement, to transit, to delivery verification.",
        content: (
          <div className="space-y-4">
            <p>The Orders screen is where active sales arrive. Tracking the authentic backend lifecycles is paramount to preventing sync errors.</p>
            <h4 className="font-semibold text-ink mt-6 mb-2">The Required Lifecycle of an Order:</h4>
            <ol className="list-decimal pl-5 space-y-3 text-[15px]">
              <li><strong>pending-payment / payment-confirmed:</strong> Order generated by the website. Paystack fires webhooks to transition it to Confirmed natively.</li>
              <li><strong>pending-verification → verified:</strong> Used explicitly when a user selects 'Bank Transfer' so internal agents can cross-check manually against the bank ledger.</li>
              <li><strong>pending-fulfillment → packed:</strong> Handed over to the warehouse. Picker generates the slip, places the items in the box, and logs it.</li>
              <li><strong>ready-for-dispatch / ready-for-pickup:</strong> Box is sealed and sitting in the loading bay waiting for Hand-offs or Walk-in customers.</li>
              <li><strong>in-transit → delivered:</strong> Handed to Rider via Hand-offs. The associated Rider completes the node via Signature.</li>
            </ol>
            <div className="flex items-center gap-2 mt-6 p-4 border border-line bg-surface rounded-lg">
               <span className="font-mono font-semibold text-accent mr-4">#ORD-9932</span>
               <Badge variant="success">payment-confirmed</Badge>
               <ChevronRight className="h-4 w-4 text-ink-muted" />
               <Badge variant="outline">packed</Badge>
            </div>
            <p>Click into any order to pop open the Customer details pane, review internal AdminNotes natively hooked to the timeline log, and issue standard refund requests.</p>
          </div>
        )
      },
      {
        id: "refunds",
        title: "Returns & Refunds Logs",
        roles: ["admin"],
        excerpt: "Managing customer chargebacks, disputes, and physical restocking protocols.",
        content: (
          <div className="space-y-4">
            <p>When an order is manually cancelled by an Admin, a <strong>Refund Ticket</strong> is automatically spun up. Refunding the money does <em>not</em> happen instantly! Instead, it lands here for the Operations Lead to review.</p>
            <h4 className="font-semibold text-ink mt-6 mb-2">Processing a Manual Refund:</h4>
            <ul className="list-disc pl-5 space-y-2 text-[15px]">
              <li><strong>Condition Assessment:</strong> Provide input on whether the items were returned in <code className="text-[13px] bg-accent/10 text-accent px-1 rounded">GOOD</code> condition vs <code className="text-[13px] bg-accent/10 px-1 rounded">DAMAGED</code>. Items classified as GOOD will trigger a <code className="text-[13px] bg-accent/10 px-1 rounded">RETURN_RESTOCKED</code> event into master inventory.</li>
              <li><strong>Refund States:</strong> A ticket starts as <code className="text-[13px] bg-accent/10 px-1 rounded">SUBMITTED</code>, moves to <code className="text-[13px] bg-accent/10 text-accent px-1 rounded">UNDER_REVIEW</code>, and can be <code className="text-[13px] bg-accent/10 text-success px-1 rounded">APPROVED</code> or <code className="text-[13px] bg-accent/10 text-danger px-1 rounded">REJECTED</code>. Once the revenue is transferred via Paystack, mark it as <code className="text-[13px] bg-accent/10 text-accent px-1 rounded">REFUNDED</code> or <code className="text-[13px] bg-accent/10 px-1 rounded">PARTIALLY_REFUNDED</code>.</li>
            </ul>
            <div className="border border-line rounded-lg p-5 bg-surface my-6 shadow-sm flex items-center justify-between">
               <div>
                 <p className="text-[15px] font-bold text-ink">Ticket #REF-0992</p>
                 <p className="text-xs text-ink-muted mt-1">Associated Order: ORD-10023</p>
                 <Badge variant="warn" className="mt-2">Pending Finance Disburse</Badge>
               </div>
               <Button size="sm" variant="danger" className="pointer-events-none">Close & Resolve Ticket</Button>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: "logistics",
    title: "4. Global Logistics",
    icon: Truck,
    description: "Manage internal delivery fleets, coordinate third-party dispatch zones, and process rider Proof-of-Deliveries.",
    roles: ["admin", "manager", "delivery"],
    topics: [
      {
        id: "delivery-overview",
        title: "Master Delivery Tracking",
        roles: ["admin", "manager"],
        excerpt: "Tracking overall progress of fleet shipments specifically out on the field.",
        content: (
          <div className="space-y-4">
            <p>The Master Delivery board oversees all assignments dynamically. Once a ticket is accepted, it cycles from <code className="text-[13px] bg-accent/10 text-accent px-1 rounded">pending-assignment</code> to <code className="text-[13px] bg-accent/10 px-1 rounded">assigned</code>, then shifts to <code className="text-[13px] bg-accent/10 text-accent px-1 rounded">in-transit</code> when picked up.</p>
            <p>Use the "Overdue" filter explicitly to flag shipments tagged as <code className="text-[13px] bg-accent/10 px-1 rounded">in-transit</code> for more than 48 hours without hitting <code className="text-[13px] bg-accent/10 px-1 rounded">delivered</code> or <code className="text-[13px] bg-accent/10 text-danger px-1 rounded">failed-delivery</code>!</p>
          </div>
        )
      },
      {
        id: "pickup-handoffs",
        title: "Warehouse Handoffs",
        roles: ["admin", "manager"],
        excerpt: "Physically transferring packed static orders to dynamic dispatch riders.",
        content: (
          <div className="space-y-4">
            <p>The Handoffs tab transitions packed static orders into the delivery chain. You cannot hand off an order unless its internal state is purely marked as <code className="text-[13px] bg-accent/10 text-accent px-1 rounded">ready-for-dispatch</code>.</p>
            <h4 className="font-semibold text-ink mt-6 mb-2">Handoff Flow:</h4>
            <p>Select multiple orders, select the arriving Driver, and generate the manifest. For Pickup Station transfers, the system natively utilizes <code className="text-[13px] bg-accent/10 px-1 rounded">PickupHandoffStatus</code> to cycle packages from <code className="text-[13px] bg-accent/10 px-1 rounded">awaiting-arrival</code> to explicitly <code className="text-[13px] bg-accent/10 text-success px-1 rounded">picked-up</code> by the end consumer.</p>
            <Button variant="primary" size="sm" className="pointer-events-none mt-4 w-full sm:w-auto">
               Assign Packages to Delivery Agent
            </Button>
          </div>
        )
      },
      {
        id: "pickup-stations",
        title: "Pickup Stations Matrix",
        roles: ["admin", "manager"],
        excerpt: "Managing physical customer collection points and franchises.",
        content: (
          <div className="space-y-4">
            <p>Customers can opt to pick up items at physical centers rather than paying for final-mile logistics. This section allows you to define locations globally (e.g. "Ikeja Store Hub", "Abuja Wuse Post"). </p>
            <p>When creating a Station, provide clear Address details! This info is dynamically printed onto the Customer's Email Receipt during checkout.</p>
          </div>
        )
      },
      {
        id: "delivery-terminals",
        title: "Terminals & Pricing",
        roles: ["admin", "manager"],
        excerpt: "Mapping global geographical zones to accurate delivery fee profiles.",
        content: (
          <div className="space-y-4">
            <p>This is where SBM Naturales calculates delivery fees. A Terminal is effectively a Zone (e.g. "Lagos Island", "Port Harcourt City").</p>
            <p className="bg-surface border border-line p-4 rounded-lg my-4 text-[14px]">
              <strong>Important Rule:</strong> If you delete a Terminal, any user attempting to Checkout from that Region will encounter an Error declaring "No Delivery Agents Available". Always keep active Terminals!
            </p>
          </div>
        )
      },
      {
        id: "assignments",
        title: "Rider Manifest",
        roles: ["delivery"],
        excerpt: "The personal routing manifest and signature capture engine for Riders.",
        content: (
          <div className="space-y-4">
            <p>Welcome, Rider! Your assignment dashboard lists exactly what nodes you need to hit today. It's ordered specifically by the routing engine.</p>
            <h4 className="font-semibold text-ink mt-6 mb-2">Running a Route:</h4>
            <div className="bg-surface border border-line p-4 rounded-xl flex items-center gap-4 my-4 shadow-sm">
               <div className="h-12 w-12 flex items-center justify-center rounded-full bg-accent text-white font-display font-bold text-lg">1</div>
               <div className="flex-1">
                  <p className="font-bold text-[15px] text-ink">Drop-off: Bode Thomas</p>
                  <p className="text-xs text-ink-muted mt-1">Customer: Emeka J. • 08123456789</p>
               </div>
               <Button size="sm" variant="success" className="pointer-events-none">Verify Delivery</Button>
            </div>
            <p className="text-sm font-medium">Be sure to capture Customer Signature or Photo Proof upon completion! Failure to do so prevents the accounting ledger from realizing the Order Revenue.</p>
          </div>
        )
      }
    ]
  },
  {
    id: "consultants",
    title: "5. Expert Consultations",
    icon: Users,
    description: "Handle inbound healthcare video streams, book 1-on-1 schedules, and write diagnostic prescriptions.",
    roles: ["admin", "consultant"],
    topics: [
      {
        id: "consultations-overview",
        title: "Active Consultations",
        roles: [],
        excerpt: "Review your upcoming appointment calendar and associated patient questionnaires.",
        content: (
          <div className="space-y-4">
            <p>Customers book paid time slots asynchronously online. You can utilize this portal to review their initial <code className="text-[13px] bg-accent/10 px-1 rounded">primaryConcern</code> and Health goals prior to jumping directly on a call.</p>
            <h4 className="font-semibold text-ink mt-6 mb-2">Filing Diagnostic Notes:</h4>
            <p>After a session completes, you must formally transition it to <code className="text-[13px] bg-accent/10 text-success px-1 rounded">recommendation-sent</code> by submitting the Prescription Builder response. You can inject strict <code className="text-[13px] bg-accent/10 px-1 rounded">RoutineBlocks</code> (Morning, Evening, Weekly) alongside specific master product IDs. This structurally generates a robust, branded Email containing direct Checkout links for those exact products.</p>
          </div>
        )
      },
      {
        id: "slots",
        title: "Consultation Calendars",
        roles: ["admin"],
        excerpt: "Opening availability on your storefront engine algorithmically.",
        content: (
          <div className="space-y-4">
            <p>SBM Naturales utilizes an "Exclusionary" booking calendar via the <code className="text-[13px] bg-accent/10 px-1 rounded">ConsultationBlock</code> schema. This means rather than actively generating times, you are inherently available within global store hours <em>unless</em> you insert an explicit Block!</p>
            <div className="border border-line rounded-lg p-5 bg-surface my-6 shadow-sm">
               <h4 className="font-semibold text-sm mb-4 text-ink flex items-center gap-2">
                 <Settings className="h-4 w-4" /> Block Out Schedule Window
               </h4>
               <div className="flex flex-wrap items-center gap-3">
                 <Badge variant="outline" className="px-3 py-1">startsAt: Monday, 09:00 AM</Badge>
                 <Badge variant="outline" className="px-3 py-1">endsAt: Monday, 12:00 PM</Badge>
                 <Button size="sm" variant="danger" className="pointer-events-none w-full sm:w-auto">Apply Exclusion Block</Button>
               </div>
               <p className="text-xs text-ink-muted mt-3">This pushes an active <code className="text-[13px] bg-accent/10 px-1 rounded">ConsultationBlock</code>, preventing any user from utilizing that overlapping time natively.</p>
            </div>
            <p>This handles sick days gracefully. Just create an exclusion block capturing the whole week, instantly snapping off frontend availability.</p>
          </div>
        )
      }
    ]
  },
  {
    id: "marketing",
    title: "6. Marketing & Growth",
    icon: Gift,
    description: "Drive traffic, establish loyalty loops, write SEO journals, and mint checkout coupons.",
    roles: ["admin", "manager"],
    topics: [
      {
        id: "blog",
        title: "Blog / Journal",
        roles: ["admin"],
        excerpt: "Writing SEO-optimized articles and community guides.",
        content: (
          <div className="space-y-4">
            <p>The Journal module lets you write extensive multi-paragraph content. Upload Cover Images to increase click-through rates. Ensure the `Slug` parameter is unique (e.g. `benefits-of-shea-butter`) because this dictates the actual URL structure!</p>
          </div>
        )
      },
      {
        id: "customers",
        title: "Customers Directory",
        roles: ["admin", "manager"],
        excerpt: "Reviewing all registered users globally within the CRM.",
        content: (
          <div className="space-y-4">
            <p>Track spending patterns, lookup profiles, and view lifetime order history for every single consumer interacting with your brand. The <code className="text-[13px] bg-accent/10 text-accent px-1 rounded">lifetimeSpend</code> sorting column lets you identify your top Whales explicitly for VIP treatment, while also tracking their realtime <code className="text-[13px] bg-accent/10 px-1 rounded">rewardsBalance</code>.</p>
          </div>
        )
      },
      {
        id: "rewards",
        title: "Loyalty Rewards Engine",
        roles: ["admin"],
        excerpt: "Configuring the algorithmic point-minting economy for recurring purchases.",
        content: (
          <div className="space-y-4">
            <p>Determine exactly how many points users automatically win per ₦100 spent, managed via the `RewardActivity` hook.</p>
            <h4 className="font-semibold text-ink mt-6 mb-2">Reward Statuses:</h4>
            <ul className="list-disc pl-5 space-y-2 text-[15px]">
              <li><code className="text-[13px] bg-accent/10 px-1 rounded">earned</code>: Given inherently on Paid orders.</li>
              <li><code className="text-[13px] bg-accent/10 text-accent px-1 rounded">redeemed</code>: Actively applied to a newly carted checkout flow by the user.</li>
              <li><code className="text-[13px] bg-accent/10 px-1 rounded">reversed</code> / <code className="text-[13px] bg-accent/10 px-1 rounded">adjusted</code>: Occurs natively when manual refunds void previously granted loyalty points.</li>
            </ul>
          </div>
        )
      },
      {
        id: "coupons",
        title: "Checkout Coupons",
        roles: ["admin"],
        excerpt: "Creating temporary logic codes for sale campaigns.",
        content: (
          <div className="space-y-4">
            <p>Generate both <code className="text-[13px] bg-accent/10 px-1 rounded">PERCENT</code> based (e.g., 20% off) or <code className="text-[13px] bg-accent/10 px-1 rounded">PRICE</code> based (e.g., ₦1,000 off) vouchers quickly.</p>
            <h4 className="font-semibold text-ink mt-6 mb-2">Voucher Restrictions:</h4>
            <ul className="list-disc pl-5 space-y-2 text-[15px]">
              <li><strong>Expiry Dates:</strong> Code burns automatically at Midnight on the specified date.</li>
              <li><strong>Usage Limits:</strong> The system forcefully locks validation requests upon hitting upper bounds.</li>
              <li><strong>Customer Restrictions:</strong> Map voucher hooks solely to explicit Customer emails.</li>
            </ul>
            <div className="flex items-center justify-center gap-4 bg-surface border border-dashed border-accent p-6 rounded-xl my-6">
               <span className="font-mono text-xl font-bold tracking-widest text-accent uppercase">BF2026-NUTR</span>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: "finance",
    title: "7. Finance & Accounting",
    icon: Wallet,
    description: "Maintain GAAP structures, reconcile bank ledgers, track operational expenses, and export formal Income Statements.",
    roles: ["admin", "accountant"],
    topics: [
      {
        id: "accounting",
        title: "Accounting Overview",
        roles: [],
        excerpt: "The master control center displaying holistic financial velocity.",
        content: (
          <div className="space-y-4">
            <p>The Accounting dashboard aggregates Gross Sales minus Logged Expenses over a 30-day temporal period, delivering an instant overview of your cash margin trajectory.</p>
          </div>
        )
      },
      {
        id: "sales",
        title: "Sales Ledger",
        roles: [],
        excerpt: "Parsing all system-recognized revenue streams in real-time.",
        content: (
          <div className="space-y-4">
            <p><strong>Vital Logic:</strong> Only precisely <code className="text-[13px] bg-accent/10 px-1 rounded">PAID</code> payment models natively push <code className="text-[13px] bg-accent/10 px-1 rounded">SalesRecord</code> lines! The backend specifically traces the explicit `gatewayFee` and strips `costOfGoods` off the real-time P&L instantly, assuring your `estimatedProfit` field is permanently accurate.</p>
          </div>
        )
      },
      {
        id: "expenses",
        title: "Expenses Ledger",
        roles: [],
        excerpt: "Tracking operating costs (OPEX) and dispatch manual payouts natively.",
        content: (
          <div className="space-y-4">
            <p>You MUST constrain all operating costs cleanly to the strict <code className="text-[13px] bg-accent/10 px-1 rounded">ExpenseCategory</code> enums ensuring final standard P&L formulation.</p>
            <ul className="list-disc pl-5 space-y-2 text-[15px] mt-4">
              <li><strong>COGS Equivalents:</strong> Use <code className="text-[13px] bg-accent/10 px-1 rounded">product-cost</code>, <code className="text-[13px] bg-accent/10 px-1 rounded">packaging</code>, and <code className="text-[13px] bg-accent/10 px-1 rounded">delivery-cost</code>.</li>
              <li><strong>Digital Overheads:</strong> Explicitly use <code className="text-[13px] bg-accent/10 px-1 rounded">platform</code> or <code className="text-[13px] bg-accent/10 px-1 rounded">gateway-fee</code>.</li>
              <li><strong>Physical Leaks:</strong> Ensure returned deadstock files under <code className="text-[13px] bg-accent/10 px-1 rounded">damaged-loss</code>.</li>
            </ul>
          </div>
        )
      },
      {
        id: "accounting-refunds",
        title: "Accounting Refunds",
        roles: [],
        excerpt: "Isolating cash outflows explicitly tied to Order Reversals.",
        content: (
          <div className="space-y-4">
            <p>While the Support/Operations team initiates functional Refunds via Tickets, the Accounting team must officially Reconcile them to finalize the deduction of value from gross revenue metrics universally.</p>
          </div>
        )
      },
      {
        id: "reconciliation",
        title: "Bank Reconciliation",
        roles: [],
        excerpt: "Matching digital payment gateway settlements securely to local dashboard ledgers.",
        content: (
          <div className="space-y-4">
            <p>Reconciliation is the structural act of comparing online processing statements against the actual <code className="text-[13px] bg-accent/10 px-1 rounded">ReconciliationRecord</code> fields recorded internally.</p>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              Records begin as <code className="text-[13px] bg-accent/10 px-1 rounded">unreconciled</code>. You must actively mark them as accurately <code className="text-[13px] bg-accent/10 text-success px-1 rounded">reconciled</code>, or flag a <code className="text-[13px] bg-accent/10 text-danger px-1 rounded">discrepancy</code> if the bank statement shows `amountExpected` vs `amountCollected` variance (e.g. Riders shorting cash flows).
            </p>
            <div className="rounded-xl border border-line bg-surface p-6 my-6 shadow-sm transition hover:border-accent/40 cursor-pointer">
               <h4 className="font-display font-semibold text-ink mb-4 text-base">Unreconciled Incoming Transfer</h4>
               <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
                 <div>
                   <p className="text-[15px] font-bold text-ink">Invoice #10294</p>
                   <p className="text-[13px] text-ink-muted flex items-center gap-1 mt-1">
                     <CheckCircle2 className="h-3 w-3 text-success" /> Transfer via Paystack Gateway
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="text-xl font-display font-bold text-ink">₦45,000</p>
                   <Badge variant="warn" className="mt-1 shadow-sm">Review Pending</Badge>
                 </div>
               </div>
               <p className="text-[13px] font-medium text-accent">Tap to match alongside Zenith Bank Statement →</p>
            </div>
          </div>
        )
      },
      {
        id: "profit-loss",
        title: "Profit & Loss Statements",
        roles: [],
        excerpt: "Generating comprehensive, printable income statements.",
        content: (
          <div className="space-y-4">
            <p>Generates the localized <code className="text-[13px] bg-accent/10 px-1 rounded">ProfitLossReport</code> interface dynamically parsing <code className="text-[13px] bg-accent/10 px-1 rounded">netSales</code> linearly stripped against your categorized <code className="text-[13px] bg-accent/10 px-1 rounded">expensesTotal</code>.</p>
          </div>
        )
      }
    ]
  },
  {
    id: "administration",
    title: "8. Platform Administration",
    icon: ShieldCheck,
    description: "Handle Global Application toggles, Team Staffing architectures, and RBAC Permission assignments.",
    roles: ["admin"],
    topics: [
      {
        id: "team",
        title: "Team & Staff Members",
        roles: [],
        excerpt: "Managing internal dashboard access, role injection, and custom permissions.",
        content: (
          <div className="space-y-4">
            <p>Only `Super Admins` can add core team members.</p>
            <p>SBM Naturales utilizes explicit Permission Injection via the specific <code className="text-[13px] bg-accent/10 text-accent px-1 rounded">accessRoleId</code> variable. While a user has a generalized parent Role assigned in the standard hierarchy (e.g. `Manager`), customized restrictions can structurally gate or unlock discrete interface grids natively.</p>
          </div>
        )
      },
      {
        id: "settings",
        title: "Global Core Settings",
        roles: [],
        excerpt: "Defining contact nodes, VAT percentage multipliers, and maintenance intervals.",
        content: (
          <div className="space-y-4">
            <p>The Settings pane holds operational levers dictating exactly how the frontend storefront interacts with the internet.</p>
            <ul className="list-disc pl-5 space-y-2 text-[15px]">
              <li><strong>Contact Info:</strong> Overwrites the Footer layout mapped on the primary domain instantly.</li>
              <li><strong>Emergency Maintenance Mode:</strong> Activating this immediately hides all Products globally and throws up a "We're Undergoing Upgrades" barrier for public buyers. Use only during severe catalog migrations!</li>
            </ul>
          </div>
        )
      }
    ]
  }
];
