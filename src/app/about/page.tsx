import { Metadata } from 'next';
import AboutClientView from './client-view';

export const metadata: Metadata = {
  title: 'About Us | Khushi Gems & Jewellery - 25 Years of Heritage',
  description: 'Khushi Gems has been a trusted name in Johari Bazar, Jaipur since 2000. Learn about our legacy of manufacturing authentic Gold, Silver, and Kundan Meena jewellery.',
  alternates: {
    canonical: 'https://www.khushigemsjaipur.com/about',
  },
};

export default function AboutPage() {
  return <AboutClientView />;
}