/**
 * Placeholder images utility for event cards and headers
 * Uses local assets from @/assets/images/
 */

// Event placeholder images - motorsport themed
export const eventPlaceholders = [
  require('@/assets/images/events/drift-car-smoke-tire-burnout-action-shot.jpg'),
  require('@/assets/images/events/endurance-race-cars-night-racing-headlights.jpg'),
  require('@/assets/images/events/formula-race-car-speed-blur-professional-racing.jpg'),
  require('@/assets/images/events/motorsport-race-track-aerial-view-with-race-cars-d.jpg'),
  require('@/assets/images/events/race-car-celebration-checkered-flag-victory.jpg'),
  require('@/assets/images/events/race-track-motorsport-cars-competition.jpg'),
  require('@/assets/images/events/rally-car-dirt-track-jumping-action.jpg'),
];

// More dramatic versions for hero headers
export const heroPlaceholders = [
  require('@/assets/images/events/drift-car-smoke-tire-burnout-action-shot-close-up.jpg'),
  require('@/assets/images/events/endurance-race-cars-night-racing-headlights-dramat.jpg'),
  require('@/assets/images/events/formula-race-car-speed-blur-professional-racing-tr.jpg'),
  require('@/assets/images/events/race-track-motorsport-cars-competition-dramatic.jpg'),
  require('@/assets/images/events/rally-car-dirt-track-jumping-action-dramatic.jpg'),
];

// Generic placeholder for fallback
export const genericPlaceholder = require('@/assets/images/placeholders/placeholder.jpg');

// User avatar placeholder
export const userPlaceholder = require('@/assets/images/placeholders/placeholder-user.jpg');

/**
 * FNV-1a hash for better distribution with UUIDs
 */
function fnv1aHash(str: string): number {
  let hash = 2166136261; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 16777619) >>> 0; // FNV prime, force unsigned
  }
  return hash;
}

/**
 * Get a consistent placeholder image based on an ID or index
 * This ensures the same event always gets the same placeholder
 */
export function getEventPlaceholder(identifier?: string | number, index?: number): any {
  // If index is provided, use it directly for list-based assignment
  if (index !== undefined) {
    return eventPlaceholders[index % eventPlaceholders.length];
  }
  
  if (identifier === undefined) {
    return eventPlaceholders[0];
  }
  
  // Use FNV-1a hash for better distribution with UUIDs
  const hash = typeof identifier === 'string' 
    ? fnv1aHash(identifier) 
    : identifier;
  
  return eventPlaceholders[hash % eventPlaceholders.length];
}

/**
 * Get a consistent hero placeholder image based on an ID or index
 */
export function getHeroPlaceholder(identifier?: string | number, index?: number): any {
  // If index is provided, use it directly for list-based assignment
  if (index !== undefined) {
    return heroPlaceholders[index % heroPlaceholders.length];
  }
  
  if (identifier === undefined) {
    return heroPlaceholders[0];
  }
  
  // Use FNV-1a hash for better distribution with UUIDs
  const hash = typeof identifier === 'string' 
    ? fnv1aHash(identifier) 
    : identifier;
  
  return heroPlaceholders[hash % heroPlaceholders.length];
}

