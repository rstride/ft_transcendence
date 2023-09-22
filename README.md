# ft_transcendence

## Description

ft_transcendence est un site web de jeu en ligne qui permet aux utilisateurs de jouer au célèbre jeu Pong tout en profitant de fonctionnalités de chat et de réseau social. Le projet est développé en utilisant NestJS pour le backend et React pour le frontend.

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies Utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [Contributeurs](#contributeurs)

## Fonctionnalités

- Jeu Pong en temps réel
- Chat avec plusieurs salons et messages directs
- Authentification via OAuth de l'intranet 42
- Profils utilisateurs avec avatars et statistiques
- Sécurité renforcée (chiffrement, protection contre les injections SQL)

## Technologies Utilisées

- Backend: NestJS
- Frontend: React
- Base de données: PostgreSQL
- Autres: Docker

## Installation

### Prérequis

- Docker

### Étapes

1. Clonez le dépôt
    ```bash
    git clone https://github.com/votre_nom_dutilisateur/ft_transcendence.git
    ```
2. Modifier backend/src/common/envs/template.env en src/common/envs/.env et remplissez les champs 42_CLIENT_ID et 42_CLIENT_SECRET avec les informations de votre application 42

3. Mofidier template.env en .env

4. Installez les conteneurs Docker
    ```bash
    make all
    ```

## Utilisation

Ouvrez votre navigateur et accédez à `http://localhost:3000` pour utiliser l'application.

## Tests

Pour exécuter les tests, utilisez la commande suivante :

```bash
npm run test
```

## Contributeurs

rstride, romaurel, masserie

