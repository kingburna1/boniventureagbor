import { MarketingServiceCategory } from '@/types/marketing';

export const MARKETING_SERVICES_INTRO = {
  badge: 'Growth & Visibility',
  title: 'Digital Marketing Services',
  subtitle:
    'I help businesses build their online presence, reach the right audience, attract potential customers, and turn digital visibility into measurable business growth. From strategic marketing and content creation to search engine optimization and lead generation, I combine technical knowledge with marketing strategy to help businesses grow online.',
};

export const MARKETING_SERVICES_DATA: MarketingServiceCategory[] = [
  {
    id: 'strategy-growth',
    title: 'Digital Marketing Strategy & Growth',
    badge: 'Strategy & Direction',
    description:
      'Build a clear digital marketing strategy that connects your business with the right audience, strengthens your online presence, and creates opportunities for sustainable growth.',
    groups: [
      {
        title: 'Strategy & Market Planning',
        skills: [
          'Digital Marketing Strategy',
          'Digital Marketing Planning',
          'Brand Positioning',
          'Online Brand Development',
        ],
      },
      {
        title: 'Research & Audience Insights',
        skills: [
          'Market Research',
          'Audience Research & Customer Segmentation',
          'Competitor Analysis',
          'Customer Persona Development',
        ],
      },
      {
        title: 'Funnel & Customer Acquisition',
        skills: [
          'Digital Customer Journey Mapping',
          'Marketing Funnel Development',
          'Customer Acquisition Strategy',
          'Lead Generation Strategy',
        ],
      },
      {
        title: 'Optimization & Growth Analytics',
        skills: [
          'Conversion Rate Optimization (CRO)',
          'Marketing Campaign Planning',
          'Campaign Performance Analysis',
          'Marketing Analytics & Reporting',
          'Growth Marketing',
          'Customer Retention Strategy',
        ],
      },
    ],
  },
  {
    id: 'content-social',
    title: 'Content Marketing & Social Media Management',
    badge: 'Content & Engagement',
    description:
      'Create relevant content, build meaningful relationships with your audience, and turn social media platforms into channels for brand awareness, engagement, and business opportunities.',
    groups: [
      {
        title: 'Social Media Strategy & Management',
        skills: [
          'Social Media Strategy',
          'Social Media Account Management',
          'Business Page Optimization',
          'Social Media Growth Strategy',
          'Organic Social Media Marketing',
          'Social Media Performance Analysis',
        ],
      },
      {
        title: 'Content Strategy & Creation',
        skills: [
          'Content Marketing Strategy',
          'Content Planning & Editorial Calendars',
          'Social Media Content Creation',
          'Social Media Copywriting',
          'Caption Writing & Content Hooks',
          'Brand Storytelling',
          'Content Repurposing',
          'Short-Form Video Content Planning',
        ],
      },
      {
        title: 'Audience Engagement & Channels',
        skills: [
          'Community Management',
          'Audience Engagement',
          'Personal Branding',
          'TikTok Marketing',
          'Facebook Marketing',
          'Instagram Marketing',
          'LinkedIn Marketing',
          'X (Twitter) Marketing',
          'WhatsApp Business Marketing',
          'Google Business Profile Optimization & Management',
        ],
      },
      {
        title: 'Web & Editorial Content Strategy',
        skills: [
          'Blog Content Planning',
          'Website Content Strategy',
          'Educational & Promotional Content',
          'Content Distribution Strategy',
          'Calls-to-Action (CTA) Optimization',
        ],
      },
    ],
  },
  {
    id: 'seo-visibility',
    title: 'SEO, Online Visibility & Lead Generation',
    badge: 'Visibility & Conversions',
    description:
      'Improve your business’s discoverability, strengthen its online presence, and create better opportunities for potential customers to find you, trust your brand, and take action.',
    isExpandable: true,
    groups: [
      {
        title: 'Search Engine Optimization (SEO)',
        skills: [
          'On-Page SEO',
          'Technical SEO Fundamentals',
          'Keyword Research',
          'Search Intent Analysis',
          'SEO Content Optimization',
          'Meta Title & Meta Description Optimization',
          'Internal Linking Strategy',
          'Image SEO',
          'Website Structure & Crawlability Audits',
          'Search Performance Monitoring',
        ],
      },
      {
        title: 'Local SEO & Online Presence',
        skills: [
          'Local SEO Strategy',
          'Google Business Profile Setup & Optimization',
          'Google Business Profile Content & Updates',
          'Local Business Visibility Optimization',
          'Business Information Consistency',
          'Local Search Performance Monitoring',
        ],
      },
      {
        title: 'Lead Generation & Conversion',
        skills: [
          'Lead Generation Campaign Planning',
          'Landing Page Optimization',
          'Lead Capture Strategy',
          'Call-to-Action Optimization',
          'Website Conversion Optimization',
          'Lead Nurturing Strategy',
          'Email Marketing Campaigns',
          'Email List Growth Strategy',
          'Email Copywriting',
          'Marketing Automation Planning',
          'WhatsApp Business Setup & Optimization',
          'WhatsApp Customer Communication Strategy',
        ],
      },
      {
        title: 'Paid Advertising & Performance Marketing',
        skills: [
          'Paid Advertising Strategy',
          'Meta Ads Campaign Planning',
          'Facebook & Instagram Advertising',
          'Google Ads Fundamentals',
          'Advertising Audience Targeting',
          'Campaign Performance Monitoring',
          'Advertising Budget Optimization',
          'Return on Ad Spend (ROAS) Analysis',
        ],
      },
    ],
  },
];

export const MARKETING_BRIDGE_DATA = {
  eyebrow: 'Full-Stack Technical Marketer',
  headline: 'More than visibility. A complete digital growth approach.',
  description:
    'From building your website to improving its visibility, developing your content strategy, and creating opportunities to attract customers, I bring together web development and digital marketing to help businesses strengthen their online presence.',
  ctaText: "Let's Grow Your Business",
  ctaHref: '#contact',
};
