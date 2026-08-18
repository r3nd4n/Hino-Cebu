export type Promotion = {
  slug: string; title: string; summary: string; startDate?: string; endDate?: string;
  applicableModels?: string[]; terms?: string[]; ctaLabel: string; ctaHref: string; isPublished: boolean;
};

export const promotions: Promotion[] = [];

export function activePromotions(now = new Date()) {
  return promotions.filter((promotion) => {
    if (!promotion.isPublished) return false;
    if (promotion.startDate && new Date(promotion.startDate) > now) return false;
    if (promotion.endDate && new Date(promotion.endDate) < now) return false;
    return true;
  });
}
