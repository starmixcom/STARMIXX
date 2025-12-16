import { Variant } from '../types';

const STORAGE_KEY = 'starmix_ab_variant';

/**
 * Récupère la variante actuelle ou en assigne une nouvelle aléatoirement.
 * Persiste le choix dans le localStorage pour la cohérence de session.
 */
export const getAbVariant = (): Variant => {
  // 1. Vérifier si une variante est déjà assignée
  const storedVariant = localStorage.getItem(STORAGE_KEY);
  if (storedVariant === 'A' || storedVariant === 'B') {
    return storedVariant as Variant;
  }

  // 2. Sinon, assigner aléatoirement (50/50)
  const newVariant: Variant = Math.random() < 0.5 ? 'A' : 'B';
  localStorage.setItem(STORAGE_KEY, newVariant);
  
  return newVariant;
};

/**
 * Configuration du contenu pour l'A/B Testing
 */
export const AB_CONTENT = {
  A: {
    // Variante A : Contrôle (Approche Santé/Urgence)
    price: 10000,
    crossedPrice: 15000,
    headline: (leadName: string | undefined) => 
      leadName ? `${leadName}, ne laissez plus les moustiques gâcher` : 'Ne laissez plus les moustiques gâcher',
    headlineHighlight: "vos nuits",
    subheadline: "Découvrez Starmix, la barrière invisible qui protège votre famille. Sans odeur chimique, 100% efficace.",
    heroButton: "JE VEUX MA PROMO 2+1 🎁",
    benefitsTitle: "Pourquoi Starmix est",
    benefitsHighlight: "Génial",
    offerTitle: "OFFRE EXCLUSIVE",
    offerBadge: "🏆 MEILLEURE VENTE"
  },
  B: {
    // Variante B : Test (Approche Confort/Sommeil + Prix Psychologique)
    price: 9900,
    crossedPrice: 14900,
    headline: (leadName: string | undefined) => 
      leadName ? `${leadName}, retrouvez enfin un sommeil` : 'Retrouvez enfin un sommeil',
    headlineHighlight: "profond et réparateur",
    subheadline: "Fini les réveils nocturnes et les bourdonnements. Starmix vous offre le silence absolu et une protection 100% naturelle.",
    heroButton: "TESTER LE SILENCE ABSOLU 🌙",
    benefitsTitle: "Le Secret des Nuits",
    benefitsHighlight: "Parfaites",
    offerTitle: "OFFRE DÉCOUVERTE",
    offerBadge: "🔥 OFFRE LIMITÉE"
  }
};