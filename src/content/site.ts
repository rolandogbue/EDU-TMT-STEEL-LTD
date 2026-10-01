import type { IconType } from "react-icons";
import {
  FiTruck,
  FiClipboard,
  FiMapPin,
  FiZap,
  FiShield,
  FiPhoneCall,
  FiHome,
  FiLayers,
  FiTool,
  FiUsers,
  FiBriefcase,
  FiEdit3,
} from "react-icons/fi";
import { GiSteelClaws, GiMetalBar, GiBrickWall, GiWoodBeam, GiMetalPlate, GiWireCoil } from "react-icons/gi";

import tmtRods from "@/assets/products/tmt-rods.jpg";
import brcMesh from "@/assets/products/brc-mesh.jpg";
import cementImg from "@/assets/products/cement.jpg";
import zincRoofing from "@/assets/products/zinc-roofing.jpg";
import marineBoard from "@/assets/products/marine-board.jpg";
import bindingWire from "@/assets/products/binding-wire.jpg";

export type Product = {
  image: string;
  icon: IconType;
  name: string;
  tag: string;
  desc: string;
  featured?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    image: tmtRods,
    icon: GiMetalBar,
    name: "TMT Rods",
    tag: "★ Flagship Product",
    desc: "Thermo-Mechanically Treated steel reinforcement bars — the structural backbone of every serious build. Available in multiple grades and diameters (6mm–32mm).",
    featured: true,
  },
  {
    image: brcMesh,
    icon: GiSteelClaws,
    name: "BRC Wire Mesh",
    tag: "Structural",
    desc: "High-tensile welded wire mesh for slabs, floors, and reinforced concrete. Consistent spacing, certified strength, ready for immediate site use.",
  },
  {
    image: cementImg,
    icon: GiBrickWall,
    name: "Cement",
    tag: "Foundation",
    desc: "Premium-grade cement in bulk or bag quantities. The foundation of every wall, floor and column — supplied consistently and reliably.",
  },
  {
    image: zincRoofing,
    icon: GiMetalPlate,
    name: "Zinc Roofing Sheets",
    tag: "Roofing",
    desc: "Durable galvanized zinc sheets engineered to withstand Nigeria's climate. Various profiles and gauges for residential, commercial and industrial builds.",
  },
  {
    image: marineBoard,
    icon: GiWoodBeam,
    name: "Marine Board",
    tag: "Formwork & Finishing",
    desc: "High-quality marine plywood for formwork, shuttering and finishing. Moisture-resistant and structurally reliable for casting and interior use.",
  },
  {
    image: bindingWire,
    icon: GiWireCoil,
    name: "Binding Wire",
    tag: "Fixing",
    desc: "Annealed steel binding wire for tying rebar and reinforcement mesh. The essential connecting material on every reinforced concrete build — always in stock.",
  },
];

export type Service = {
  icon: IconType;
  name: string;
  desc: string;
  detail: string;
};

export const SERVICES: Service[] = [
  {
    icon: FiTruck,
    name: "Fast Delivery",
    desc: "Swift, reliable delivery of your materials across Abuja. Dispatched promptly, handled with care, and tracked straight to your site — no logistics headache, no third-party delays.",
    detail: "Same-day dispatch on stock items",
  },
  {
    icon: FiClipboard,
    name: "Material Estimation",
    desc: "Expert consultation and accurate material quantity estimation — completely free. Know exactly what you need before you spend a naira. Prevents overbuy, underbuy and budget waste.",
    detail: "Free for all clients",
  },
  {
    icon: FiMapPin,
    name: "Site Inspection",
    desc: "On-site quality inspection and material verification by our experts. We don't just deliver — we verify. Your site, our eyes, your peace of mind.",
    detail: "On-site quality assurance",
  },
  {
    icon: FiZap,
    name: "Quick Turnaround",
    desc: "Same-day dispatch for all in-stock items. Your project timeline is non-negotiable — ours matches it. We move as fast as your build demands.",
    detail: "Same-day dispatch on stock items",
  },
  {
    icon: FiShield,
    name: "Quality Guarantee",
    desc: "100% quality assurance with a replacement guarantee on all materials. If it doesn't meet standard, we answer for it — no arguments, no delays.",
    detail: "100% backed guarantee",
  },
  {
    icon: FiPhoneCall,
    name: "24/7 Support",
    desc: "Round-the-clock customer support for urgent material requirements. Construction doesn't wait for business hours. Neither do we. Call at 3am — we pick up.",
    detail: "Always reachable",
  },
];

export type Audience = {
  icon: IconType;
  title: string;
  pain: string;
  msg: string;
};

export const AUDIENCES: Audience[] = [
  {
    icon: FiTool,
    title: "Contractors & Site Managers",
    pain: "You can't afford site stoppages. Material shortages and quality failures cost you client relationships and project reputation.",
    msg: "\"Never stall a site over materials again. We're stocked, we deliver same-day, and we answer at 3am.\"",
  },
  {
    icon: FiBriefcase,
    title: "Real Estate Developers",
    pain: "Coordinating bulk procurement across multiple units, managing cost overruns, and maintaining consistent material quality is complex.",
    msg: "\"Bulk orders. Fast delivery. Expert estimation. We're the supply partner serious developers build relationships with.\"",
  },
  {
    icon: FiHome,
    title: "Self-Build Homeowners",
    pain: "You're making the biggest investment of your life. You don't know exactly what to buy, and you're afraid of being overcharged or undersupplied.",
    msg: "\"Don't guess. Our estimation experts calculate exactly what your project needs. The consultation is free.\"",
  },
  {
    icon: FiEdit3,
    title: "Architects & QS Professionals",
    pain: "The supplier you recommend reflects on your professional reputation. Underperforming vendors make you look bad to your clients.",
    msg: "\"When you refer a client to EDU TMT, your reputation stays intact. We supply to spec, every time.\"",
  },
];

export type TrustPoint = { icon: IconType; title: string; body: string };

export const TRUST_POINTS: TrustPoint[] = [
  { icon: FiTruck, title: "Fast Delivery", body: "Materials delivered across Abuja, fast" },
  { icon: FiClipboard, title: "Free Estimation", body: "Expert material planning" },
  { icon: FiZap, title: "Same-Day Dispatch", body: "In-stock items ship the same day" },
  { icon: FiShield, title: "Quality Guarantee", body: "100% backed with replacement assurance" },
  { icon: FiPhoneCall, title: "24/7 Support", body: "Available for urgent material needs" },
];

export const WHY_POINTS = [
  {
    title: "Structural Authority",
    body: "Our TMT rods literally hold buildings up. Every product we stock inherits that same standard of quality and engineering trust.",
  },
  {
    title: "Full Project Support",
    body: "Free estimation, site inspection, same-day dispatch, 24/7 support. No competitor in Abuja offers this complete package under one name.",
  },
  {
    title: "Supply You Can Count On",
    body: "In a volatile market, reliability is a premium product. When you call, we have stock. When you need it, we deliver.",
  },
  {
    title: "Abuja-Rooted, Builder-Focused",
    body: "We live and operate in the same city we serve. We understand your projects, your timelines, and your pressures.",
  },
];

export const AUDIENCE_ICON: Record<string, IconType> = {
  contractors: FiTool,
  developers: FiBriefcase,
  self: FiHome,
  architects: FiEdit3,
  users: FiUsers,
  layers: FiLayers,
};

export const CONTACT = {
  phone: "+234 803 868 5377",
  phoneHref: "tel:+2348038685377",
  whatsapp: "https://wa.me/2348038685377",
  email: "contact@edutmtsteel.com",
  location: "Abuja, FCT, Nigeria",
};
