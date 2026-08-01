# ✅ CIVRAT Bot v2.0 — Résumé de l'intégration

## 🏗️ Architecture finale

```
civrat-discord-mastery/
├── bot/                              # Bot Discord (NOUVEAU - restructuré)
│   ├── index.js                      # Point d'entrée principal
│   ├── deploy.js                     # Déploiement des commandes
│   ├── package.json                  # Dépendances
│   ├── .env                          # Secrets (NE PAS COMMIT)
│   ├── .env.example                  # Template
│   ├── .gitignore
│   │
│   └── src/
│       ├── config/
│       │   ├── index.js              # Configuration centralisée (.env)
│       │   └── database.js           # MongoDB + Supabase connections
│       │
│       ├── commands/                 # 17 commandes (1 fichier = 1 commande)
│       │   ├── ping.js
│       │   ├── infoserveur.js
│       │   ├── infomembre.js
│       │   ├── avatar.js
│       │   ├── bannir.js
│       │   ├── expulser.js
│       │   ├── debannir.js          # ← NOUVEAU (était manquant)
│       │   ├── warn.js              # ← NOUVEAU
│       │   ├── mute.js              # ← NOUVEAU
│       │   ├── unmute.js            # ← NOUVEAU
│       │   ├── slowmode.js          # ← NOUVEAU
│       │   ├── pseudo.js            # ← NOUVEAU
│       │   ├── verrouiller.js       # ← NOUVEAU
│       │   ├── deverrouiller.js     # ← NOUVEAU
│       │   ├── supprimer.js         # ← Corrigé (était non enregistré)
│       │   ├── ticketpanel.js
│       │   └── invites.js
│       │
│       ├── events/                   # 21 événements (1 fichier = 1 event)
│       │   ├── ready.js             # ← FIX: "clientReady" → "ready"
│       │   ├── interactionCreate.js # Tickets, boutons, menus
│       │   ├── guildMemberAdd.js    # ← Fusionné (3 → 1 listener)
│       │   ├── guildMemberRemove.js # ← Fusionné (2 → 1 listener)
│       │   ├── guildMemberUpdate.js # ← Fusionné (2 → 1 listener)
│       │   ├── messageCreate.js     # ← Fusionné (2 → 1 listener)
│       │   ├── messageDelete.js
│       │   ├── messageUpdate.js
│       │   ├── messageDeleteBulk.js
│       │   ├── channelCreate/Delete/Update.js
│       │   ├── threadCreate/Delete.js
│       │   ├── roleCreate/Delete/Update.js
│       │   ├── inviteCreate/Delete.js
│       │   └── guildBanAdd/Remove.js
│       │
│       ├── services/
│       │   ├── guildConfig.js       # ← LECTURE SUPABASE (source de vérité)
│       │   ├── inviteService.js     # Invite tracking (MongoDB)
│       │   └── placeholder.js       # Template engine ({user}, {server}, etc.)
│       │
│       ├── handlers/
│       │   ├── commandHandler.js    # Charge et dispatch les commandes
│       │   └── eventHandler.js      # Charge les événements
│       │
│       ├── utils/
│       │   ├── logger.js            # Logs structurés
│       │   └── auditLogCache.js     # Cache audit logs (anti rate-limit)
│       │
│       └── api/
│           └── server.js            # Express API (health, sync)
│
└── src/                              # Dashboard (EXISTANT - non modifié)
    ├── pages/dashboard/modules/      # 20+ modules
    ├── lib/supabase.ts              # Supabase client
    ├── lib/use-guild-config.ts      # Config hook (lit guild_configs)
    └── types/index.ts               # TypeScript types
```

---

## 🔐 Sécurité — Corrigé

| Avant | Après |
|-------|-------|
| Token en clair dans index.js | `.env` avec `dotenv` |
| Token en clair dans deploy.js | `.env` partagé |
| MongoDB URI en clair | `.env` |
| Pas de CORS | CORS configuré pour dashboard |
| Pas de rate limiting | `express-rate-limit` (100 req/15min) |
| Pas de headers sécurité | `helmet.js` |

---

## 🐛 Bugs corrigés

| # | Bug original | Correction |
|---|-------------|------------|
| 1 | `client.once("clientReady")` inexistant | → `ready` |
| 2 | Commande `/supprimer` non enregistrée | → Enregistrée + handler |
| 3 | 8 commandes sans handler (deploy.js) | → Tous implémentés |
| 4 | `guildMemberAdd` × 3 listeners | → 1 listener fusionné |
| 5 | `guildMemberRemove` × 2 listeners | → 1 listener fusionné |
| 6 | `guildMemberUpdate` × 2 listeners | → 1 listener fusionné |
| 7 | `messageCreate` × 2 listeners | → 1 listener fusionné |
| 8 | `inviteStats` perdu au restart | → Persisté en MongoDB |
| 9 | `spam` Map jamais nettoyée (memory leak) | → Nettoyage par timestamps |
| 10 | MongoDB connecté mais jamais utilisé | → Utilisé pour invites, tickets, counting |
| 11 | Pas de `partials` dans le client | → Ajoutés (Message, Channel) |
| 12 | Pas d'intent `GuildModeration` | → Ajouté pour ban/unban |
| 13 | `fetchAuditLogs` sans cache (rate limit) | → Cache 3s |

---

## 🔄 Intégration Supabase

### Source de vérité unique

Le bot lit **toute la configuration serveur** depuis Supabase :

```javascript
// Au lieu de:
const LOG_JOIN = "1512783491157458965";  // ← Hardcodé

// Maintenant:
const config = await getGuildConfig(guildId);
const channelId = config.log_member_join_channel_id;  // ← Supabase
```

### Flux de données

```
Dashboard (React)
    │
    │ Écrit dans guild_configs
    ▼
Supabase (PostgreSQL)
    │
    │ Bot lit au démarrage + cache 5min
    ▼
Discord Bot (Node.js)
    │
    │ Écrit analytics/XP/counting
    ▼
MongoDB (NoSQL)
```

### Mapping Dashboard ↔ Bot

| Dashboard Field | Bot Usage |
|----------------|-----------|
| `welcome_enabled` | Active/désactive welcome |
| `welcome_channel_id` | Salon d'envoi |
| `welcome_message` | Message avec placeholders |
| `goodbye_enabled` | Active/désactive goodbye |
| `goodbye_channel_id` | Salon d'envoi |
| `tickets_enabled` | Active/désactive tickets |
| `ticket_category_id` | Catégorie des tickets |
| `ticket_support_role_id` | Rôle staff mentionné |
| `ticket_log_channel_id` | Salon de log tickets |
| `logs_enabled` | Active/désactive tous les logs |
| `log_member_join_channel_id` | Log des arrivées |
| `log_member_leave_channel_id` | Log des départs |
| `log_moderation_channel_id` | Log ban/kick/timeout |
| `log_message_delete_channel_id` | Log messages supprimés |
| `log_message_edit_channel_id` | Log messages modifiés |
| `log_role_update_channel_id` | Log rôles/nicknames |
| `log_channel_update_channel_id` | Log salons/threads |
| `automod_enabled` | Active/désactive auto-mod |
| `automod_anti_spam` | Anti-spam |
| `security_anti_raid` | Anti-raid |
| `security_log_channel_id` | Salon alertes sécurité |
| `invitations_enabled` | Tracking invitations |
| `invitations_log_channel_id` | Log invitations |
| `language` | Langue du bot (fr/en) |

---

## 📊 MongoDB — Utilisation correcte

MongoDB est maintenant utilisé **uniquement** pour :

| Collection | Usage | Raison |
|-----------|-------|--------|
| `InviteStats` | Stats d'invitations par utilisateur | Volume élevé, lecture/écriture fréquente |
| `TicketCounter` | Compteur de tickets par serveur | État runtime |
| `CountingGame` | État du jeu de comptage | État runtime |
| *(futur)* `UserXP` | XP/Niveaux | Volume élevé |
| *(futur)* `CommandUsage` | Analytics commandes | Analytics |
| *(futur)* `AuditLog` | Logs haute fréquence | Volume élevé |

---

## 🌐 Placeholders supportés

| Placeholder | Description |
|-------------|-------------|
| `{user}` | Mention de l'utilisateur |
| `{username}` | Nom d'utilisateur |
| `{displayName}` | Nom affiché sur le serveur |
| `{server}` | Nom du serveur |
| `{memberCount}` | Nombre de membres |
| `{joinDate}` | Date d'arrivée |
| `{accountAge}` | Âge du compte |
| `{inviter}` | Mention de l'inviteur |
| `{inviteCode}` | Code d'invitation |
| `{channel}` | Mention du salon |
| `{date}` | Date actuelle |
| `{time}` | Heure actuelle |
| `{ticketNumber}` | Numéro du ticket |
| `{ticketOwner}` | Propriétaire du ticket |
| `{boostCount}` | Nombre de boosts |
| `{boostLevel}` | Niveau de boost |

---

## 🚀 Pour démarrer

### 1. Configurer les variables d'environnement

```bash
cd bot
cp .env.example .env
# Éditer .env avec tes credentials
```

### 2. Variables requises dans `.env`

```
DISCORD_TOKEN=ton_token_bot
CLIENT_ID=1478877109538652371
SUPABASE_URL=https://ton-projet.supabase.co
SUPABASE_ANON_KEY=ta-clé-anon
MONGO_URI=ton-uri-mongodb
```

### 3. Installer et lancer

```bash
npm install
node deploy.js    # Enregistrer les commandes (1x)
node index.js     # Démarrer le bot
```

---

## 📋 Prochaines étapes

### Phase 4 : MongoDB Analytics
- [ ] Modèle `UserXP` pour le leveling
- [ ] Modèle `CommandUsage` pour les analytics
- [ ] Service d'agrégation pour les graphiques

### Phase 5 : Features avancées
- [ ] Welcome images (canvas/node-canvas)
- [ ] Ticket transcripts
- [ ] XP/Leveling complet
- [ ] Suggestions system
- [ ] Giveaways
- [ ] Auto-responses
- [ ] Anti-nuke
- [ ] Temp voice channels
- [ ] i18n (FR/EN)

### Phase 6 : Dashboard improvements
- [ ] Remplacer les faux channels dans les selects par les vrais channels du serveur
- [ ] Ajouter le live preview pour welcome
- [ ] Ajouter l'embed builder visuel
- [ ] Ajouter les templates
- [ ] Ajouter l'import/export
- [ ] Supprimer la page Premium

---

## ⚠️ Notes importantes

1. **Le dashboard n'a PAS été modifié** — il fonctionne tel quel
2. **Le bot lit la config Supabase** que le dashboard écrit
3. **Pour que tout fonctionne**, il faut :
   - Configurer `SUPABASE_URL` et `SUPABASE_ANON_KEY` dans `.env`
   - S'assurer que la table `guild_configs` existe dans Supabase
   - Les colonnes doivent correspondre au schéma dans `use-guild-config.ts`
4. **Les IDs hardcodés restants** (MEMBER_ROLE, BOT_ROLE) sont des fallbacks qui seront remplacés par la config Supabase quand les champs correspondants seront ajoutés au schéma

---

## Security Center — état réel

Les protections suivantes sont reliées au contrat `guild_configs` et actives côté bot lorsqu'elles sont configurées :

| Protection | Champ | État |
|---|---|---|
| Détection raid (5 arrivées / 15 s) | `security_enabled`, `security_anti_raid` | Opérationnelle |
| Bot non autorisé | `security_anti_bot`, `security_whitelist` | Opérationnelle |
| Créations/suppressions massives salons | `security_anti_nuke` | Opérationnelle |
| Créations/suppressions massives rôles | `security_anti_nuke` | Opérationnelle |
| Réponse quarantaine | `security_quarantine_role` | Opérationnelle si le bot peut gérer le membre/rôle |
| Log incident | `log_moderation_channel_id` | Opérationnelle |

Les actions anti-webhook, mass-ban, mass-kick, seuils personnalisables, retrait de permissions et exemptions de rôles/salons ne sont pas documentées comme fonctionnelles : elles requièrent des champs canoniques supplémentaires et/ou des événements/services dédiés.

---

## Invitations — état réel

| Fonctionnalité | Champ / source | État |
|---|---|---|
| Activation tracking | `invitations_enabled` | Opérationnelle |
| Cache au démarrage et refresh create/delete | Cache Discord + `InviteStats` | Opérationnelle |
| Attribution de l’invitation utilisée | Comparaison cache / uses Discord | Opérationnelle après cache initial |
| Totales, départs, actuelles/nettes | collection Mongo existante `InviteStats` | Opérationnelle |
| Classement `/invites` | agrégation Mongo existante | Opérationnelle |
| Log join par invitation | `invitations_log_channel_id` | Opérationnelle |
| Fake invites | aucune donnée canonique/modèle | Prêt à connecter |
| Vanity URLs / attribution après redémarrage avant premier cache | Discord ne fournit pas toujours l’information | Limité |

Un départ issu d’un kick détecté via Audit Logs n’est pas décrémenté comme départ volontaire. Les erreurs Discord et Mongo sont absorbées et journalisées sans faire tomber le listener.

---

## XP & Niveaux — état réel

| Fonctionnalité | Champ / source | État |
|---|---|---|
| Gain XP message | `xp_enabled`, `xp_per_message` | Opérationnelle |
| Cooldown durable | `xp_cooldown`, `UserXP.lastXpAt` | Opérationnelle |
| Niveaux | formule `100 × niveau²` | Opérationnelle |
| Rôles récompense | `role_rewards` | Opérationnelle si le bot peut gérer le rôle/membre |
| Annonce niveau | `xp_announce_channel_id` | Opérationnelle si le salon est accessible |
| `/niveau` | collection `UserXP` | Opérationnelle |
| `/classement` | index Mongo `guildId, xp` | Opérationnelle |
| Carte XP image | aucune dépendance image/canvas | Prêt à connecter |
| Multiplicateurs | aucun champ canonique | Prêt à connecter |
| Analytics XP dashboard | aucun endpoint API actif | Prêt à connecter |

Le modèle Mongo `UserXP` est la seule collection ajoutée pour XP : il contient guildId, userId, xp, level, lastXpAt et totalMessages, avec index unique `(guildId, userId)` et index de classement `(guildId, xp)`.

---

## Giveaways — état réel

| Fonctionnalité | Source | État |
|---|---|---|
| Activation | `giveaways_enabled` | Opérationnelle |
| Données giveaway | table Supabase existante `giveaways` | Opérationnelle |
| Participations | modèle Mongo minimal `GiveawayEntry` | Opérationnelle |
| Bouton participer | interaction `giveaway_join:<id>` | Opérationnelle |
| Fin automatique après redémarrage | requête Supabase toutes les minutes | Opérationnelle |
| Création / fin / reroll / annulation staff | `/giveaway` | Opérationnelle |
| Logs | `log_moderation_channel_id` | Opérationnelle |
| Modification d’un giveaway publié | aucun `message_id` existant | Prêt à connecter |
| Suppression physique / édition du message Discord | aucun `message_id` existant | Prêt à connecter |
| Conditions de participation avancées | champ `requirements` texte non interprété | Prêt à connecter |

La table existante ne possède pas de `message_id`; le bot envoie donc le résultat dans le salon à la fin sans modifier le message initial. Les entrées sont uniques par `(giveawayId, userId)` et persistent après redémarrage.
