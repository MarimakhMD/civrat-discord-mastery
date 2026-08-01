# CIVRAT Dashboard

Dashboard web CIVRAT construit avec React, TypeScript, Vite, Tailwind CSS, Framer Motion et les intégrations existantes du projet.

> Cette application conserve les connexions existantes à Discord OAuth, Supabase, MongoDB et au bot CIVRAT. Le front-end ne contient aucun secret et ne doit jamais en ajouter.

## Démarrage

```bash
npm ci
npm run dev
```

Commandes de contrôle :

```bash
npm run lint
npm run build
npm run preview
```

## Architecture active

- `src/main.tsx` : point d’entrée Vite.
- `src/App.tsx` : routes React Router et chargement différé des pages.
- `src/pages/` : landing, authentification, sélection de serveur et modules.
- `src/components/layout/` : sidebar, top bar et shell dashboard.
- `src/components/ui/` : composants UI partagés utilisés par le dashboard.
- `src/context/` : états d’authentification et de serveur actuellement utilisés par l’interface.
- `src/index.css` : thème CIVRAT noir, vert néon et or, règles responsive et accessibilité.

Les pages dashboard sont chargées avec `React.lazy` : le code d’un module n’est téléchargé que lorsqu’il est ouvert.

## Modules

Le dashboard contient les espaces Welcome, Tickets, Logs, AutoMod, Captcha, XP & Niveaux, Giveaways, Suggestions, Security, Invitations, paramètres et outils d’administration.

Les réglages déjà exposés par le projet utilisent les mécanismes existants. Les aperçus ou contrôles dont le bot ne fournit pas encore de données sont présentés comme des interfaces prêtes à connecter : ils ne créent ni API, ni table, ni collection de données supplémentaire.

## Configuration et déploiement

Les variables d’environnement, les secrets Discord, la configuration Supabase/MongoDB et le déploiement Vercel sont gérés par l’infrastructure existante. Ne créez pas de variable `VITE_*` pour un secret, un token Discord ou une clé de service.

Pour un déploiement, utilisez la configuration Vercel déjà reliée au dépôt et vérifiez que les URL de callback Discord existantes correspondent au domaine de production.

## Qualité

- `npm run build` vérifie TypeScript puis produit le build Vite.
- `npm run lint` contrôle le code de l’application Vite active.
- Les anciens exports TanStack / React Start encore présents dans le dépôt sont exclus du lint actif : ils ne font pas partie du point d’entrée `src/main.tsx` / `src/App.tsx` et sont conservés pour ne pas supprimer une structure historique sans migration dédiée.

## Guide développeur

1. Préserver les contrats des contextes, services et intégrations existants.
2. Ajouter les chaînes de texte via le système de présentation approprié avant de les réutiliser dans des modules.
3. Pour une donnée Discord non exposée par le backend, créer uniquement un état visuel explicite « prêt à connecter » ; ne pas simuler de persistance.
4. Tester au minimum le build et le lint avant toute mise en production.

## Security Center (bot)

The bot currently enforces the canonical `guild_configs` Security fields below:

- `security_enabled`
- `security_anti_raid`
- `security_anti_nuke`
- `security_anti_bot`
- `security_whitelist`
- `security_quarantine_role`
- `log_moderation_channel_id`

When enabled, CIVRAT detects join bursts, unapproved bot joins, and repeated channel/role creation or deletion from the same audit-log actor. It writes security incidents to the configured moderation log and applies the configured quarantine role where Discord permissions allow it. Webhook, mass-ban, mass-kick, and per-action thresholds remain future work because the current canonical configuration does not contain fields for them.

## Invitation tracking (bot)

When `invitations_enabled` is enabled, CIVRAT caches guild invites at startup and after invite lifecycle events. It identifies the incremented invite on member join, persists total/current/left counts in the existing `InviteStats` MongoDB collection, records invitation joins in `invitations_log_channel_id`, and exposes the available counters plus a leaderboard through `/invites`. Fake-invite detection is intentionally reported as unavailable because no fake-account data model exists yet.

## XP & Levels (bot)

When `xp_enabled` is enabled, CIVRAT stores member XP in the `UserXP` MongoDB collection. It uses `xp_per_message`, `xp_cooldown`, `xp_announce_channel_id` and `role_rewards` from `guild_configs`. The stable formula is `100 × level²` total XP. `/niveau` displays a member profile and `/classement` displays the top ten. XP level announcements and configured role rewards are sent/applied only when Discord permissions allow them.
