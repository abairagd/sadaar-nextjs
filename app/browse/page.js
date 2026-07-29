import { Suspense } from "react";
import { api } from "../../lib/constants";
import { ProductCard } from "../../components/ProductCard";
import { BrowseSidebar, BrowseSortBar, NoResultsMessage } from "../../components/BrowseFilters";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop — SADAAR",
  description: "Browse independent Saudi fashion brands on SADAAR — filter by category, price, and brand.",
};

async function getBrowseData(searchParams) {
  const params = new URLSearchParams();
  if (searchParams.cat) params.set("category", searchParams.cat);
  if (searchParams.subcat) params.set("subcategory", searchParams.subcat);
  if (searchParams.ptype) params.set("productType", searchParams.ptype);
  if (searchParams.brand) params.set("brandId", searchParams.brand);
  if (searchParams.sort) params.set("sort", searchParams.sort);
  if (searchParams.search) params.set("search", searchParams.search);
  if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
  if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);

  const [products, brands] = await Promise.all([
    api(`/products?${params.toString()}`).catch(() => []),
    api("/brands").catch(() => []),
  ]);
  return { products, brands };
}

export default async function BrowsePage({ searchParams }) {
  const { products, brands } = await getBrowseData(searchParams);

  const activeFilterCount = [
    searchParams.cat, searchParams.subcat, searchParams.ptype, searchParams.brand,
    searchParams.search, searchParams.minPrice, searchParams.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="sadaar-browse-layout" style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px 64px", display: "flex", gap: 32 }}>
      <Suspense fallback={null}>
        <BrowseSidebar brands={brands} />
        <div style={{ flex: 1 }}>
          <BrowseSortBar resultCount={products.length} />
          {products.length === 0 ? (
            <NoResultsMessage activeFilterCount={activeFilterCount} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "28px 20px" }}>
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
}
