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
import {
  GiSteelClaws,
  GiMetalBar,
  GiBrickWall,
  GiWoodBeam,
  GiMetalPlate,
  GiWireCoil,
} from "react-icons/gi";

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
    desc: "Thermo-mechanically treated (TMT) reinforcement bars form part of a build's structural frame. Available in multiple grades and diameters from 6mm to 32mm.",
    featured: true,
  },
  {
    image: brcMesh,
    icon: GiSteelClaws,
    name: "BRC Wire Mesh",
    tag: "Structural",
    desc: "Welded high-tensile wire mesh for slabs, floors and reinforced concrete. It has consistent spacing, certified strength and is ready for site use.",
  },
  {
    image: cementImg,
    icon: GiBrickWall,
    name: "Cement",
    tag: "Foundation",
    desc: "Premium-grade cement in bags or in bulk, supplied consistently. Ask us to estimate the quantity your project needs.",
  },
  {
    image: zincRoofing,
    icon: GiMetalPlate,
    name: "Zinc Roofing Sheets",
    tag: "Roofing",
    desc: "Durable galvanized zinc roofing sheets, designed to withstand Nigeria's climate. Available in a range of profiles and gauges for homes, commercial buildings and industrial projects.",
  },
  {
    image: marineBoard,
    icon: GiWoodBeam,
    name: "Marine Board",
    tag: "Formwork & Finishing",
    desc: "Moisture-resistant marine plywood for formwork, shuttering, casting and interior finishing. Structurally reliable for site use.",
  },
  {
    image: bindingWire,
    icon: GiWireCoil,
    name: "Binding Wire",
    tag: "Fixing",
    desc: "Annealed steel binding wire for tying reinforcement bars and mesh. An essential material for reinforced concrete work, always in stock.",
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
    desc: "We deliver promptly to sites across Abuja, handle materials with care and keep each order tracked on the way.",
    detail: "Same-day dispatch on in-stock items",
  },
  {
    icon: FiClipboard,
    name: "Material Estimation",
    desc: "Send us your project details for a free estimate of the quantities you need. Planning ahead can help you avoid ordering too much or running short.",
    detail: "Free for all clients",
  },
  {
    icon: FiMapPin,
    name: "Site Inspection",
    desc: "Our team inspects materials at your site and checks the delivery against your order.",
    detail: "On-site quality assurance",
  },
  {
    icon: FiZap,
    name: "Quick Turnaround",
    desc: "We dispatch in-stock items the same day to help keep materials moving on your project.",
    detail: "Same-day dispatch on in-stock items",
  },
  {
    icon: FiShield,
    name: "Quality Guarantee",
    desc: "Our 100% quality guarantee covers replacement if any material fails to meet the stated standard.",
    detail: "Replacement guarantee on all materials",
  },
  {
    icon: FiPhoneCall,
    name: "24/7 Support",
    desc: "Call any time for help with urgent material needs. Our support team is available 24/7.",
    detail: "Support available 24/7",
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
    pain: "A shortage or quality issue can hold up work and put the schedule, budget and client relationship at risk.",
    msg: "We offer same-day dispatch on in-stock items, and our support team is available 24/7.",
  },
  {
    icon: FiBriefcase,
    title: "Real Estate Developers",
    pain: "Coordinating bulk orders across several units while managing costs and material quality takes careful planning.",
    msg: "We can estimate quantities and coordinate bulk orders and delivery through one supplier.",
  },
  {
    icon: FiHome,
    title: "Self-Build Homeowners",
    pain: "When you're managing a home build, it can be hard to know what to buy and how much. You want to avoid over-ordering, running short or spending more than planned.",
    msg: "Ask for a free estimate of the quantities your build needs before you place an order.",
  },
  {
    icon: FiEdit3,
    title: "Architects & QS Professionals",
    pain: "Your supplier reflects on the recommendation you make. You need materials that meet specification and service that follows through.",
    msg: "We supply to specification and support your clients with estimates, site inspections and delivery.",
  },
];

export type TrustPoint = { icon: IconType; title: string; body: string };

export const TRUST_POINTS: TrustPoint[] = [
  { icon: FiTruck, title: "Fast Delivery", body: "To project sites across Abuja" },
  { icon: FiClipboard, title: "Free Estimation", body: "Plan the quantities your project needs" },
  { icon: FiZap, title: "Same-Day Dispatch", body: "For in-stock items" },
  { icon: FiShield, title: "Quality Guarantee", body: "Replacement if materials don't meet the stated standard" },
  { icon: FiPhoneCall, title: "24/7 Support", body: "Call our team at any time" },
];

export const WHY_POINTS = [
  {
    title: "Materials for Every Stage",
    body: "Source TMT rods, BRC mesh, cement, roofing sheets, marine board and binding wire from one Abuja supplier.",
  },
  {
    title: "Plan Before You Order",
    body: "Get a free estimate based on your project, so you can budget for the quantities you need and avoid ordering too much or running short.",
  },
  {
    title: "Delivery and Site Checks",
    body: "We arrange delivery across Abuja and can inspect materials at your site against your order.",
  },
  {
    title: "Support When You Need It",
    body: "Our team is available 24/7 for urgent material needs. In-stock items can be dispatched the same day.",
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
  address: "Plot 349A, Jikwoyi Residential Layout, Along Nyanya-Karshi Road, Abuja 900108, FCT",
};
