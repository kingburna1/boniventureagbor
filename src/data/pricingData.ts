import {
  PricingPlan,
  CustomProjectData,
  PaymentTermsData,
  PricingDictionary,
} from '@/types/pricing';

export const PRICING_PLANS_INTRO = {
  badge: 'Investment & Packages',
  title: 'Pricing Plans',
  subtitle:
    "Whether you need a professional website, a stronger digital presence, or a complete software solution, I offer flexible services designed around your business goals. Choose a starting package or let's discuss a solution tailored to your needs.",
};

export const PRICING_PLANS_DATA: PricingPlan[] = [
  {
    id: 'digital-launch',
    name: 'Digital Launch',
    positioning: 'For startups and small businesses establishing their online presence.',
    price: '150,000',
    currency: 'FCFA',
    billing: 'One-time project fee',
    description:
      'Get the essential digital foundation your business needs to look professional online and make it easier for customers to contact you.',
    deliverables: [
      'Responsive landing page or small business website of up to 3 pages',
      'Mobile-first implementation',
      'Contact form integration',
      'WhatsApp click-to-chat integration',
      'Social media profile links',
      'Basic on-page SEO setup',
      'Website performance & speed checks',
      'Google Analytics integration where appropriate',
      'One structured revision round',
    ],
    deliveryEstimate: '5–10 business days',
    ctaText: 'Get Started',
    prefillMessage: "I'm interested in the Digital Launch package.",
  },
  {
    id: 'business-growth',
    name: 'Business Growth',
    badge: 'Recommended',
    isRecommended: true,
    positioning: 'For growing businesses that need a stronger website and a coordinated digital presence.',
    price: '350,000',
    currency: 'FCFA',
    billing: 'One-time project fee',
    description:
      'Combine professional web development with essential marketing foundations to help your business establish a stronger online presence.',
    deliverables: [
      'Business website of up to 5 pages',
      "Custom implementation aligned with the client's brand",
      'Responsive layouts for mobile, tablet, and desktop',
      'Contact forms & WhatsApp direct integration',
      'Basic technical & on-page SEO optimization',
      'Google Analytics & conversion tracking setup',
      'Google Business Profile setup or optimization',
      'Basic social media content strategy',
      '30-day social media content calendar',
      'Two structured revision rounds',
    ],
    deliveryEstimate: '10–20 business days',
    ctaText: 'Choose Business Growth',
    prefillMessage: "I'm interested in the Business Growth package.",
  },
  {
    id: 'growth-partner',
    name: 'Growth Partner',
    positioning: 'For businesses that need consistent digital marketing support.',
    price: '100,000',
    currency: 'FCFA',
    billing: 'Per month',
    billingPeriod: '/ month',
    description:
      'Maintain an active online presence with structured content, marketing planning, and regular performance reviews.',
    deliverables: [
      'Digital marketing planning',
      'Management of one agreed social media platform',
      'Up to 8 content posts per month',
      'Content copywriting & targeted calls-to-action',
      'Monthly editorial content calendar',
      'Basic community engagement during agreed hours',
      'Google Business Profile regular updates',
      'Monthly marketing performance report',
      'One monthly strategy review meeting',
    ],
    deliveryEstimate: 'Monthly ongoing support',
    ctaText: 'Discuss Monthly Support',
    prefillMessage: "I'm interested in monthly digital marketing support.",
    exclusions: [
      'Website development or redesign',
      'Extensive video production & ad spend budgets',
      'Advanced SEO campaigns or unlimited revisions',
      'Additional social media platforms',
    ],
  },
];

export const CUSTOM_PROJECT_DATA: CustomProjectData = {
  badge: 'Tailored Solutions',
  heading: 'Need Something More Specific?',
  description:
    'From custom web applications and backend systems to e-commerce platforms and mobile applications, I can help you plan and build a solution around your technical and business requirements.',
  services: [
    'Full-stack web application development',
    'Backend development',
    'REST API development and integration',
    'Database design & optimization',
    'Authentication & role-based access',
    'E-commerce development',
    'Mobile application development',
    'Third-party API integrations',
    'Automation and system integrations',
    'Website maintenance and technical improvements',
    'Advanced SEO and digital marketing projects',
  ],
  pricingLabel: 'Custom quotation',
  supportingText:
    "Pricing depends on the project's requirements, complexity, integrations, delivery timeline, and support needs.",
  ctaText: 'Discuss Your Project',
  prefillMessage:
    'I would like to discuss a custom software or digital marketing project.',
};

export const PAYMENT_TERMS_DATA: PaymentTermsData = {
  badge: 'Engagement Terms',
  heading: 'Working Terms & Payment Boundaries',
  depositTerm: {
    title: 'One-Time Projects',
    description:
      '50% deposit before work begins, remaining 50% upon milestone completion and prior to final handover.',
  },
  customMilestonesTerm: {
    title: 'Large Custom Projects',
    description:
      'Phased, milestone-based payments agreed upon in the technical proposal.',
  },
  monthlySupportTerm: {
    title: 'Monthly Marketing Support',
    description:
      'Retainer fees are invoiced and due at the start of each agreed monthly service cycle.',
  },
  scopeNote:
    'Projects begin after the scope, deliverables, timeline, and payment terms have been agreed. Additional requirements outside the agreed scope may require a separate quotation.',
  transparencyNote:
    'Final pricing depends on the agreed scope. Third-party fees (domains, hosting, paid ad spend, external SaaS) are quoted separately where applicable.',
};

export const DEFAULT_PRICING_DICTIONARY: PricingDictionary = {
  badge: PRICING_PLANS_INTRO.badge,
  title: PRICING_PLANS_INTRO.title,
  subtitle: PRICING_PLANS_INTRO.subtitle,
  plans: PRICING_PLANS_DATA,
  customProjects: CUSTOM_PROJECT_DATA,
  paymentTerms: PAYMENT_TERMS_DATA,
  deliveryLabel: 'Estimated Delivery',
  includesLabel: "What's Included",
  exclusionsLabel: 'Not included in monthly package (quoted separately)',
};
