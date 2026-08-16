import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { getPortfolio } from '@/lib/portfolio/store';

export const metadata = { title: 'Work — Moving Stone' };

export default async function WorkPage() {
  const items = await getPortfolio();

  return (
    <>
      <Header />
      <main className="pf-page">
        <div className="container">
          <h1 className="display-sm pf-heading">Work</h1>
          <PortfolioGrid items={items} />
        </div>
      </main>
      <Footer />
    </>
  );
}
