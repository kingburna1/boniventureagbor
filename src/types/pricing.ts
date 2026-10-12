export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isRecommended?: boolean;
  positioning: string;
  price: string;
  currency: string;
  billing: string;
  billingPeriod?: string;
  description: string;
  deliverables: string[];
  deliveryEstimate: string;
  ctaText: string;
  prefillMessage: string;
  exclusions?: string[];
}

export interface CustomProjectData {
  badge: string;
  heading: string;
  description: string;
  services: string[];
  pricingLabel: string;
  supportingText: string;
  ctaText: string;
  prefillMessage: string;
}

export interface PaymentTermsData {
  badge: string;
  heading: string;
  depositTerm: {
    title: string;
    description: string;
  };
  customMilestonesTerm: {
    title: string;
    description: string;
  };
  monthlySupportTerm: {
    title: string;
    description: string;
  };
  scopeNote: string;
  transparencyNote: string;
}

export interface PricingDictionary {
  badge: string;
  title: string;
  subtitle: string;
  plans: PricingPlan[];
  customProjects: CustomProjectData;
  paymentTerms: PaymentTermsData;
  deliveryLabel: string;
  includesLabel: string;
  exclusionsLabel: string;
}
