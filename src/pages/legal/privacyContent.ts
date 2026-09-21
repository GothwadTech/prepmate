import { LegalSection } from './termsContent';

export const privacySections: LegalSection[] = [
  {
    title: '1. Information We Collect',
    content: 'We collect minimal information necessary to deliver personalized NEET study tracking: your account credentials (display name, email address, unique username), your target NEET year and target score, and your self-reported study logs, timers, and goals.',
  },
  {
    title: '2. How Your Data Is Used',
    content: 'Your study data is used exclusively to compute your daily consistency streaks, syllabus completion percentages, study timer analytics, and partner challenge statistics. We never sell, rent, or trade your personal information to third parties.',
  },
  {
    title: '3. Data Storage & Security',
    content: 'Data is stored using Google Cloud Platform / Firebase infrastructure with end-to-end transport encryption (HTTPS/TLS) and Firestore security rules. Client-side caching utilizes encrypted browser storage for uninterrupted offline preparation.',
  },
  {
    title: '4. Peer & Study Partner Visibility',
    content: 'When you accept a study partnership, your partner can view your consistency score, study hours completed today, and syllabus progress strictly for mutual accountability. Your private contact details and password are never shared.',
  },
  {
    title: '5. Student Privacy & Data Protection',
    content: 'Prepmate complies with Indian Digital Personal Data Protection standards. We do not engage in targeted behavioral advertising, track student browsing behavior outside the app, or profile students for commercial exploitation.',
  },
  {
    title: '6. Account Deletion & Rights',
    content: 'You have the right to export your study progress logs or permanently delete your Prepmate account and associated cloud records at any time through Profile Settings or by emailing privacy@gothwadtech.com.',
  },
  {
    title: '7. Gothwad Tech Governance',
    content: 'Managed with pride by Gothwad Tech under Indian law and digital governance principles. For data queries, contact our Data Protection Officer at privacy@gothwadtech.com.',
  },
];
