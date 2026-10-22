/**
 * Hero stars: every repeated recruit becomes fragments, and fragments raise a hero's stars with no upper limit.
 * Stars come in groups of five. Each completed group changes the stars' colour, and every new group costs
 * twice the previous one: 25 25 25 50 50 → 50 50 50 100 100 → 100 100 100 200 200 → …
 */
export const FRAGMENTS_PER_COPY = 50;
export const STARS_PER_TIER = 5;
export const FIRST_TIER_COSTS = [25, 25, 25, 50, 50];
// Every star adds this much on top of the hero's base attributes.
export const STAR_BONUS = { damage: 0.10, attackSpeed: 0.03 };
// Colour of each group of five stars; past the last colour, the stars stay Celestial.
export const STAR_TIERS = [
  { name: 'Ouro', color: '#e9c46f' },
  { name: 'Rubi', color: '#ef6f5e' },
  { name: 'Ametista', color: '#b98cf0' },
  { name: 'Safira', color: '#6fb7f5' },
  { name: 'Jade', color: '#77d6a0' },
  { name: 'Celestial', color: '#eef3ff' },
];
// Only a guard against corrupted saves: costs double every five stars, so nobody gets close.
export const STAR_SAFETY_CAP = 100;

const toStars = stars => Math.max(0, Math.min(STAR_SAFETY_CAP, Math.floor(Number(stars) || 0)));

/** Fragments needed to go from `stars` to the next star. */
export const nextStarCost = stars => {
  const current = toStars(stars);
  if (current >= STAR_SAFETY_CAP) return null;
  return FIRST_TIER_COSTS[current % STARS_PER_TIER] * 2 ** Math.floor(current / STARS_PER_TIER);
};

/** Which group of five a star count is in, and how many stars of that group are lit. */
export function starTier(stars) {
  const current = toStars(stars);
  const index = Math.floor(current / STARS_PER_TIER);
  return {
    index,
    lit: current % STARS_PER_TIER,
    ...STAR_TIERS[Math.min(index, STAR_TIERS.length - 1)],
    previous: index > 0 ? STAR_TIERS[Math.min(index - 1, STAR_TIERS.length - 1)] : null,
  };
}

/** Bonus percentages at a given star count, e.g. { damage: 20, attackSpeed: 6 } for 2 stars. */
export const starBonusPercent = stars => ({
  damage: Math.round(toStars(stars) * STAR_BONUS.damage * 100),
  attackSpeed: Math.round(toStars(stars) * STAR_BONUS.attackSpeed * 100),
});

/** The hero as it fights with its stars: same identity and look, stronger attributes. */
export function withStars(hero, stars = 0) {
  const level = toStars(stars);
  if (!hero || level === 0) return hero && { ...hero, stars: 0 };
  return {
    ...hero,
    stars: level,
    damage: Math.round(hero.damage * (1 + level * STAR_BONUS.damage)),
    attackSpeed: Math.round(hero.attackSpeed * (1 + level * STAR_BONUS.attackSpeed) * 100) / 100,
  };
}
