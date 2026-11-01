# Plan — Nova, boutique tech

## Approche d’implémentation

Créer une application web Next.js App Router, React et TypeScript avec Tailwind CSS, exécutée sur Node et adaptée au runtime Next.js de Netlify. Utiliser `pnpm@11.25.0`, version disponible dans l’environnement, épinglée dans `package.json`, et consigner à l’avance les scripts de dépendances autorisés dans `pnpm-workspace.yaml` conformément à pnpm 11. La boutique et les opérations métier seront rendues par Next.js ; les pages restent utilisables sur mobile et au clavier.

Supabase constitue la source de vérité pour le catalogue, les variantes, les stocks, les clients, les commandes, les articles commandés, les promotions et les paramètres. Fournir un schéma SQL d’installation, des politiques RLS et des données de départ. Le rôle administrateur est accordé explicitement dans Supabase et vérifié côté serveur pour chaque zone/action `/admin`; les secrets de service ne sont jamais envoyés au navigateur. La gestion d’images s’appuie sur le bucket Supabase Storage `product-images` avec accès d’écriture réservé à un administrateur authentifié.

Le panier sera géré par le client et conservé dans `localStorage`. Les prix et stocks affichés ne feront pas autorité à la validation : une route serveur valide les données de contact et les identifiants de variantes, relit les prix/stocks de Supabase, calcule le total, puis enregistre la commande et ses lignes dans une transaction de base. Seul le succès de cet enregistrement déclenche, côté serveur, une notification Resend adressée à `ALERT_EMAIL`, incluant nom, coordonnées, produits, quantités, montant total et numéro de commande. Un échec d’envoi n’annule pas une commande persistée.

Les clés de configuration côté navigateur sont limitées à `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`; `SUPABASE_SERVICE_ROLE_KEY` et `RESEND_API_KEY` restent côté serveur. Préparer `.env.example`, les consignes de création des valeurs, `netlify.toml` et l’adaptateur Next.js Netlify. Avec des variables Supabase absentes, l’interface peut présenter des produits de démonstration, mais le checkout signale qu’il faut connecter Supabase et ne prétend pas avoir persisté une commande.

## Structure du projet

- `app/` : accueil, catalogue, fiche produit, panier, commande, connexion, pages `/admin` et sous-pages, routes API serveur.
- `components/` : navigation, cartes et galeries produit, filtres, panier, formulaire de commande, éléments partagés de l’administration.
- `lib/supabase/` : clients navigateur/serveur, validation de session et contrôle d’accès administrateur.
- `lib/` : accès au catalogue, schémas Zod, calcul de commandes, formatage des prix et utilitaires.
- `context/` : état du panier et persistance navigateur.
- `supabase/migrations/` : tables, fonctions transactionnelles, règles RLS et bucket d’images.
- `public/images/` : copie locale du hero pour Netlify, images produit référencées dans les données initiales et icône du site ; Preview WebDev conserve l’URL de stockage du hero généré.
- `public/manus-routes.json` : manifeste des routes de pages réellement implémentées, sans API.
- `docs/` : étapes de configuration Supabase et mise en service Netlify.
- `netlify.toml`, `next.config.ts`, `app.config.ts` : runtime de déploiement, configuration Next.js et métadonnées de marque.

## Design

Pistes visuelles envisagées, avec probabilités faibles tirées avant sélection : **Swiss editorial tech — 0,059** ; **brutalisme chromatique — 0,050** ; **futurisme Y2K translucide — 0,070**. Style retenu : **Swiss editorial tech**, showroom de produits précis et haut de gamme.

- **Mouvement de design** : minimalisme éditorial suisse appliqué au commerce technologique, avec une composition asymétrique et un rythme de magazine produit.
- **Principes** : hiérarchie typographique nette ; mise en avant des objets plutôt que des décorations ; informations de prix, disponibilité et variantes toujours lisibles ; parcours d’achat direct et prévisible.
- **Philosophie couleur** : fond ivoire frais et encre profonde pour une lecture calme ; le bleu électrique propriétaire de Nova signale les actions et éléments de confiance ; un accent mandarine réservé aux offres rend l’urgence commerciale immédiatement repérable.
- **Paradigme de mise en page** : hero éditorial ample, zones de texte et image décalées, bandeaux promotionnels, navigation de catégories et grilles de produits adaptatives ; tableaux structurés pour les vues de gestion.
- **Éléments signature** : repères d’index fins inspirés des fiches techniques ; pastilles d’offre mandarine ; motif « N » diagonal géométrique dans le wordmark et les icônes.
- **Interactions** : réponse immédiate à l’ajout au panier avec confirmation accessible ; filtres persistants pendant la navigation ; actions destructives clairement confirmées ; formulaires avec erreurs en contexte.
- **Animation** : transitions courtes de 180–280 ms, léger déplacement/effacement à l’apparition des cartes, retour tactile au clic et panneau panier glissant ; respecter `prefers-reduced-motion` et éviter les mouvements qui détournent l’attention.
- **Typographie** : Manrope pour les titres et prix afin de donner une forme nette aux chiffres ; Inter pour les formulaires, paragraphes et données de gestion ; titres compacts, prix en tabulaires, libellés d’interface courts.
- **Essence de marque** : sélection soignée d’appareils et d’accessoires actuels avec une commande simple et des informations transparentes ; personnalité **précise, contemporaine, fiable**.
- **Voix** : précise et chaleureuse, sans superlatifs vagues. Exemples : « La technologie, bien choisie. » et « Votre sélection est prête. »
- **Wordmark & logo** : mot-symbole `nova` en minuscules à chasse serrée, précédé d’un N géométrique fait de diagonales imbriquées ; icône dérivée reconnaissable seule dans un carré aux angles doux.
- **Couleur de marque signature** : bleu Nova `#4F63F7`.

## Déploiement et contraintes matérielles

La publication cible Netlify : build Next.js, `@netlify/plugin-nextjs`, adaptations des routes dynamiques et des route handlers par la plateforme. Les valeurs sensibles seront saisies uniquement dans l’interface d’environnement de WebDev/Netlify, jamais commitées. Les tests locaux et le mode démonstration ne remplacent pas la confirmation d’une commande réelle dans le Supabase du propriétaire. Aucune valeur de paiement ni fonction de passerelle de paiement n’est spécifiée dans la demande : la validation demandée enregistre une commande, sans simuler un paiement accepté.
