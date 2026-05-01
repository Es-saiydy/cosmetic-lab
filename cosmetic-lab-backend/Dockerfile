# Image de base : Node.js 20 LTS sur Alpine Linux (image très légère ~50 Mo)
FROM node:20-alpine

# Définit le répertoire de travail à l'intérieur du container
WORKDIR /app

# On copie d'abord package.json et package-lock.json
# (avant le reste du code) pour profiter du cache Docker :
# tant que ces fichiers ne changent pas, npm install n'est pas relancé.
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source dans le container
COPY . .

# Documentation : ce container expose le port 5001
# (n'ouvre pas réellement le port, c'est juste informatif)
EXPOSE 5001

# Commande lancée au démarrage du container
# (forme exec : pas de shell intermédiaire, signaux mieux gérés)
CMD ["node", "server.js"]
