# ⚡ VoltCalc — Bangladesh Electricity Bill & Load Calculator

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A modern, high-precision web application to calculate, simulate, and analyze residential electricity bills and appliance power consumption under the official **Bangladesh Energy Regulatory Commission (BERC) LT-A (Domestic)** retail tariff schedule.

Live web experience designed for Bangladeshi consumers across DPDC, DESCO, BPDB, NESCO, WZPDCL, and BREB (Palli Bidyut) post-paid and pre-paid meters.

---

## 🌟 Features

### 1. 📊 Forward Bill Calculator (Units $\to$ Taka)
- **Official BERC LT-A Tariff Matrix**: Exact stepped slab rates including Life Line (0–50 units) and progressive slabs up to >600 units.
- **Accurate Statutory Charges**:
  - **Demand Charge**: Fixed ৳42.00 / kW sanctioned load.
  - **Timely Payment Rebate**: 0.5% discount on gross subtotal.
  - **Government VAT**: 5.0% statutory VAT computed after rebate.
- **Interactive UI**: Sliders with magnetic snap ticks, direct numeric inputs, quick preset chips (50, 75, 150, 300, 500 units), and real-time computation.
- **Visual Analytics**: Interactive cost distribution chart (Recharts) and color-coded slab-by-slab breakdown.

### 2. 🔄 Reverse Prepaid Calculator (Taka $\to$ Units)
- Reverse-engineers exact electricity units (kWh) from recharge amount in Taka.
- Inverts VAT (5%), rebate (0.5%), and fixed demand charge, mapping net energy charge backward through progressive tariff tiers.
- Perfect for prepaid meter users planning monthly recharges or verifying deducted units.

### 3. 🏠 Household Appliance Load & Energy Auditor
- **Room & Device Inventory**: Add and configure appliances with real-world Bangladeshi wattage ratings, usage frequency, and quantities.
- **Duty Cycle & Standby Modeling**:
  - Accounts for compressor/thermostat cycling (e.g., 50% for refrigerators, 60% for inverter ACs).
  - Calculates phantom/vampire standby power consumption.
- **Flexible Usage Modes**:
  - Daily (hours/day, days/month)
  - Weekly (hours/day, days/week)
  - Monthly (hours/use, uses/month)
- **Pre-Built Household Templates**:
  - **Clean Slate**: Start fresh.
  - **Bachelor / 1BHK**: Compact single/couple living (~70–100 kWh).
  - **Typical Family Flat (2–3 BHK)**: Standard family setup with fridge, fans, lights, TV (~250–400 kWh).
  - **High-Load / AC Household**: Multi-AC setup with geyser and heavy kitchen appliances (~600+ kWh).
- **Sanctioned Demand Load Estimator**: Recommends appropriate sanctioned demand (kW) using industry-standard diversity factor (~65% of connected peak load).
- **Interactive What-If Simulator**: Test energy-saving actions (e.g., cutting AC runtime by 2 hours/day) and see instantaneous monthly kWh and Taka impact.
- **Seamless Integration**: One-click "Apply to Calculator" imports calculated household consumption directly into the bill engine.

### 4. ⚡ Offline-Ready & Privacy-Focused
- 100% client-side calculation — no data sent to external servers.
- Persistent state management across browser sessions and tabs using React 19 `useSyncExternalStore` and `localStorage`.
- Dark and Light mode support with automatic system detection (`next-themes`).

---

## 📋 BERC Domestic (LT-A) Tariff Structure

| Slab Tier | Monthly Consumption (kWh) | Energy Rate (৳ / kWh) | Demand Charge (৳ / kW / Month) |
| :--- | :--- | :--- | :--- |
| **Life Line** | 0 – 50 units (only if total $\le$ 50) | ৳4.63 | ৳42.00 |
| **Step 1** | 0 – 75 units | ৳5.26 | ৳42.00 |
| **Step 2** | 76 – 200 units | ৳8.50 | ৳42.00 |
| **Step 3** | 201 – 300 units | ৳9.10 | ৳42.00 |
| **Step 4** | 301 – 400 units | ৳9.62 | ৳42.00 |
| **Step 5** | 401 – 600 units | ৳15.01 | ৳42.00 |
| **Step 6** | Above 600 units | ৳17.35 | ৳42.00 |

*Statutory adjustments: Subtotal = Energy Charge + Demand Charge; Rebate = 0.5% of Subtotal; VAT = 5.0% of (Subtotal − Rebate).*

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with OKLCH color palettes
- **Components**: [shadcn/ui](https://ui.shadcn.com/) / [@base-ui/react](https://base-ui.com/)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Persistence**: `useSyncExternalStore` + `localStorage`
- **Fonts**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [Geist Mono](https://vercel.com/font)

---

## 📁 Project Architecture

```
electricity-bill-calculator/
├── app/
│   ├── layout.tsx              # Root HTML layout, font setup, theme provider
│   ├── page.tsx                # Main view orchestrating tabs and calculation flows
│   └── globals.css             # Tailwind v4 theme variables and design tokens
├── components/
│   ├── calculator-form.tsx     # Mode switch, unit/amount sliders, demand inputs
│   ├── bill-summary.tsx        # Forward bill result cards & metric badges
│   ├── amount-summary.tsx      # Reverse calculation results & estimated units
│   ├── slab-breakdown.tsx      # Progressive slab billing cost breakdown
│   ├── usage-chart.tsx         # Recharts cost/unit visual charts
│   ├── tariff-info.tsx         # Official BERC rate card reference table
│   ├── theme-toggle.tsx        # Dark / Light theme toggle
│   ├── household-calculator/   # Appliance load calculation suite
│   │   ├── household-calculator-view.tsx  # Main appliance workflow view
│   │   ├── appliance-breakdown-table.tsx  # Detailed energy & cost table
│   │   ├── appliance-card-item.tsx        # Individual appliance editor card
│   │   ├── appliance-catalog-picker.tsx   # 40+ appliance catalog modal
│   │   ├── custom-appliance-dialog.tsx    # Custom appliance configuration
│   │   ├── template-selector-bar.tsx      # Quick-load household templates
│   │   ├── top-consumers-card.tsx         # Highest energy-consuming appliances
│   │   └── what-if-simulator.tsx          # Optimization & savings simulator
│   └── ui/                     # Primitives (button, card, dialog, tabs, etc.)
├── hooks/
│   ├── use-calculator-store.ts # Synced store for units, amount, demand, mode
│   └── use-household-store.ts  # Synced store for user appliances & templates
├── lib/
│   ├── tariff.ts               # BERC slab calculation & reverse calculation engine
│   ├── appliance-calc.ts       # Energy math, duty cycles, standby, diversity factor
│   ├── appliance-catalog.ts    # Comprehensive Bangladeshi appliance database
│   ├── appliance-templates.ts  # Bachelor, family, and high-load profile templates
│   ├── appliance-types.ts      # TypeScript interfaces and domain schemas
│   └── utils.ts                # Class merge and utility helpers
├── public/                     # Static assets, favicon, logo
├── tariff.pdf                  # Official Bangladesh Gazette BERC tariff order
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- `pnpm` (recommended), `npm`, or `yarn`

### Installation

1. **Clone repository**:
   ```bash
   git clone https://github.com/maopu2001/electricity-bill-calculator.git
   cd electricity-bill-calculator
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build optimized standalone bundle
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
pnpm lint
```

---

## 👤 Author

**M. Aktaruzzaman Opu**
- Website: [maopu.com.bd](https://maopu.com.bd)
- Email: [maopu2001@gmail.com](mailto:maopu2001@gmail.com)
- GitHub: [@maopu2001](https://github.com/maopu2001)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
