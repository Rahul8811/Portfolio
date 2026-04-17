import Footer from "../components/Footer";
import SectionHero from "./SectionHero";
import SectionLetsConnect from "./SectionLetsConnect";
import SectionMyLatestProject from "./SectionMyLatestProject";
import SectionQuote from "./SectionQuote";
import SectionTechnologyStack from "./SectionTechnologyStack";
import portfolioData from "../content/portfolio-data.json";

export default function Home() {
  return (
    <div className="safe-layout">
      <SectionHero hero={portfolioData.hero} />
      <SectionTechnologyStack technologies={portfolioData.technologies} />
      <SectionMyLatestProject projects={portfolioData.projects} />
      <SectionLetsConnect social={portfolioData.social} />
      <SectionQuote quote={portfolioData.quote} />
      <Footer />
    </div>
  )
}
