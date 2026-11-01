# TODO — Nova

## Boutique et catalogue
- [x] **Accueil et découverte des produits** — « Accueil avec bannières promotionnelles. » « Catalogue avec catégories et recherche. » « Fiches produits avec photos, prix et variantes. » Le design doit être « Premium, élégant, responsive, avec animations fluides et interface intuitive. »

## Panier et commandes client
- [ ] **Panier, formulaire et validation de commande** — « Panier dynamique et validation des commandes. » « Formulaire avec coordonnées du client. » La commande validée doit conserver les lignes, quantités, prix et coordonnées client dans Supabase.

## Administration sécurisée
- [ ] **Accès à /admin et tableau de bord** — « Espace administrateur /admin : Dashboard avec statistiques des ventes. » « L’espace admin sécurisé. » L’autorisation doit être vérifiée côté serveur ; une session non administrateur ne peut consulter ni modifier les ressources d’administration.
- [ ] **Gestion du catalogue, des clients et de la boutique** — « Gestion des produits, prix, images et stocks. » « Gestion des clients et promotions. » « Paramètres de la boutique. » Les données de gestion sont stockées dans Supabase et les images sont gérées dans Supabase Storage.
- [ ] **Gestion des commandes** — « Gestion des commandes et de leurs statuts. » Les commandes et changements de statut doivent être persistés dans Supabase.

## Données, emails et déploiement
- [ ] **Persistance Supabase** — « Important : Toutes les fonctionnalités doivent être opérationnelles, les données stockées dans Supabase et l’espace admin sécurisé. » Livrer le schéma SQL, les règles d’accès et le guide de configuration.
- [ ] **Alerte email Resend** — « Intégrer Resend pour envoyer automatiquement une alerte à l’administrateur dès qu’un client passe une commande. » « Inclure dans l’email : nom du client, coordonnées, produits commandés, quantités, montant total et numéro de commande. » « Configurer ALERT_EMAIL et RESEND_API_KEY dans les variables d’environnement. » « Déclencher l’alerte côté serveur uniquement après l’enregistrement réussi de la commande. »
- [x] **Préparation Netlify** — « Préparer le déploiement sur Netlify. » Fournir la configuration de build et les noms de variables d’environnement requis, sans inclure de valeurs secrètes dans le dépôt.
