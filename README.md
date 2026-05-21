# UrbanFlow - Plateforme Intelligente de Gestion du Trafic Urbain

Mini Projet – Web Services & GraphQL

## Architecture

Ce projet est basé sur une architecture **Microservices** communicant via une **API Gateway GraphQL (Apollo)**.

- `gateway` (Port 4000) : Fédère tous les microservices (IntrospectAndCompose).
- `auth-service` (Port 3001) : Gestion des utilisateurs et JWT.
- `vehicle-service` (Port 3002) : Flotte de véhicules et tracking GPS.
- `traffic-service` (Port 3003) : Zones de circulation et densité.
- `notif-service` (Port 3005) : Notifications via WebSockets (Socket.io).
- `incident-service` (Port 3004) : Déclaration et suivi des incidents.
- `frontend` (Port 3000) : Interface React/Next.js connectée à la Gateway et au WebSocket.

## Prérequis

- Node.js (v18+)
- NPM
- Base de données locale (PostgreSQL/MySQL selon configuration `.env`) ou SQLite pour dev.

## Lancement (Local)

Vous pouvez lancer les services un par un dans des terminaux séparés :

```bash
# Backend Services
cd auth-service && npm run start:dev
cd vehicle-service && npm run start:dev
cd traffic-service && npm run start:dev
cd incident-service && npm run start:dev
cd notif-service && npm run start:dev

# API Gateway
cd gateway && npm run start:dev

# Frontend
cd frontend && npm run dev
```

## Lancement avec Docker Compose (Bonus)

À la racine du projet :

```bash
docker-compose up --build
```

## Fonctionnalités Implémentées

**Service Authentification** : Connexion, génération JWT.
**Service Gestion des Véhicules** : Ajout, liste, détails, historique GPS.
**Service Gestion du Trafic** : Zones de circulation, niveau de densité (Faible, Moyen, Elevé).
**Service Gestion des Incidents** : Types (Accident, Travaux...), Statuts (Signalé, En cours, Résolu).
**Service Notifications** : Envoi, liste, marquer lu, **WebSocket temps réel**.
**Frontend** : Dashboard moderne React.
**Simulateur GPS** : Un script `simulate_gps.js` injecte des points GPS temps réel pour tester la carte.
