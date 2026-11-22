// Content for the Men / Women / Perfumes landing pages ("second home pages").
//
// To add real photos: upload an image in Supabase > Storage > site-assets
// (public bucket), copy its public URL, and paste it as `image` (the big
// hero picture) or into `tiles` (one picture per subcategory tile, keyed by
// the subcategory name, e.g. tiles: { Clothing: "https://..." }).
// Leave a value empty to use the plain colour design.
export const CATEGORY_LANDING = {
  Men: {
    image: "",
    tiles: {},
    en: { title: "The men's edit", sub: "Thobes, tailoring and everyday pieces from independent Saudi labels." },
    ar: { title: "تشكيلة الرجال", sub: "ثياب وتفصيل وقطع يومية من علامات سعودية مستقلة." },
  },
  Women: {
    image: "",
    tiles: {},
    en: { title: "The women's edit", sub: "Abayas, dresses and everyday pieces from independent Saudi labels." },
    ar: { title: "تشكيلة النساء", sub: "عبايات وفساتين وقطع يومية من علامات سعودية مستقلة." },
  },
  Perfumes: {
    image: "",
    tiles: {},
    en: { title: "The fragrance edit", sub: "Perfumes, oud and bukhoor from Saudi fragrance houses." },
    ar: { title: "تشكيلة العطور", sub: "عطور وعود وبخور من بيوت عطور سعودية." },
  },
};

// Which brands belong on a category page. "Both" brands show under Men and Women.
export function brandMatchesCategory(brandCategory, cat) {
  if (brandCategory === "Both") return cat === "Men" || cat === "Women";
  return brandCategory === cat;
}
