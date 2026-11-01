# Mise en service Nova

## Supabase

1. Créez un projet Supabase et exécutez intégralement `supabase/migrations/202610300001_nova_store.sql` dans le SQL Editor. La migration crée les tables, les politiques RLS, le bucket public `product-images` et les références de catalogue de démonstration.
2. Récupérez l’URL de projet, la clé `anon`/publishable et la clé `service_role` dans les paramètres API de Supabase. Configurez-les dans les variables d’environnement du site. La clé `service_role` ne doit jamais être préfixée `NEXT_PUBLIC_`.
3. Dans Supabase Auth, créez ou invitez l’adresse administrateur. Ensuite, dans le SQL Editor, accordez le rôle explicitement :

   ```sql
   update public.profiles set role = 'admin' where email = 'votre-adresse@example.com';
   ```

4. Vérifiez que le rôle renvoyé par cette requête est `admin`. La connexion utilise l’authentification Supabase ; aucun accès de démonstration ne contourne le contrôle de rôle.
5. Les images produit sont publiques en lecture via le bucket, mais seules les sessions qui possèdent le rôle administrateur peuvent téléverser, modifier ou supprimer des fichiers.

## Resend

Dans Resend, créez une clé API et configurez `RESEND_API_KEY` ainsi que `ALERT_EMAIL` dans l’environnement du site. Pour la production, configurez également `RESEND_FROM_EMAIL` avec une adresse dont le domaine est vérifié dans Resend. La route de commande persiste d’abord l’enregistrement et ses lignes via la fonction transactionnelle Supabase ; elle tente ensuite d’envoyer l’alerte à l’adresse administrateur. Une indisponibilité de l’email n’annule jamais une commande enregistrée.

## Netlify

Importez le dépôt dans Netlify et laissez détecter `netlify.toml`. Le site utilise Node 22, pnpm 11.25, la commande `pnpm install --frozen-lockfile && pnpm build` et `@netlify/plugin-nextjs`. Déclarez `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` et `ALERT_EMAIL` dans **Site configuration → Environment variables**. Configurez aussi `NEXT_PUBLIC_SITE_URL` avec le domaine HTTPS attribué au site et `RESEND_FROM_EMAIL` avec une adresse d’un domaine vérifié chez Resend. Redéployez après les avoir saisies.

## Vente et paiement

Le parcours livré enregistre une commande et décrémente les stocks atomiquement ; il ne débite pas de moyen de paiement, car aucune passerelle de paiement ni clé marchand n’a été demandée. Avant vente réelle, renseignez vos coordonnées de société, tarifs et modalités de livraison, conditions de retour, adresse d’assistance et domaine expéditeur Resend. Les pages de paiement sécurisées peuvent être ajoutées avec le prestataire choisi.
