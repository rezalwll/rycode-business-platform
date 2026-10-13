import type { Locale } from "@/i18n/routing";
import { ReferenceLocale } from "@/components/template/reference-locale";
import ReferenceHero from "@/components/template/reference-hero";
import ReferenceFeatures from "@/components/template/reference-features";
import ReferenceAppShowcase from "@/components/template/reference-app-showcase";
import ReferenceImpact from "@/components/template/reference-impact";
import ReferenceCommunityCTA from "@/components/template/reference-community-cta";
import ReferenceDesktopApp from "@/components/template/reference-desktop-app";
import ReferenceNativeFeatures from "@/components/template/reference-native-features";
import ReferenceStories from "@/components/template/reference-stories";
import ReferencePricing from "@/components/template/reference-pricing";
import ReferenceTestimonials from "@/components/template/reference-testimonials";
import ReferenceFAQ from "@/components/template/reference-faq";
import ReferenceInsights from "@/components/template/reference-insights";
import ReferenceMoments from "@/components/template/reference-moments";

export function CoordaHome({ locale }: { locale: Locale }) {
  return (
    <ReferenceLocale locale={locale}>
      <div className="coorda-home coorda-reference">
        <ReferenceHero />
        <ReferenceFeatures />
        <ReferenceAppShowcase />
        <ReferenceImpact />
        <ReferenceCommunityCTA />
        <ReferenceDesktopApp />
        <ReferenceNativeFeatures />
        <ReferenceStories />
        <ReferencePricing />
        <ReferenceTestimonials />
        <ReferenceFAQ />
        <ReferenceInsights />
        <ReferenceMoments />
      </div>
    </ReferenceLocale>
  );
}
