# ProjetTronG5

Projet de développement du jeu TRON pour le cours de développement web mobile

Installation du projet
=============

- Dézipper l'archive

### Lancement de mongoDB

- Dans un autre terminal, lancer la commande :
```
mongod --dbpath={emplacementBD/dossierBD}
```
Avec comme paramètre --dbpath l'emplacement du répertoire d'installation de mongoDB

### Lancement du serveur

- Dans le répertoire source du projet, lancer la commande : 
```
npm install
```
- Dans le répertoire ProjetTronServeur/www/js lancer la commande : 
```
node ServerTron.js
```

### Lancement de l'application

- Dans le répertoire ProjetTronClient, lancer les commandes l'une après l'autre :
```
cordova platform add android
```
```
cordova build android
```
```
cordova platform add browser
```
```
cordova build browser
```

- Pour lancer l'application dans un navigateur, utiliser la commande :
```
cordova run browser
```

- Pour lancer l'application sur un émulateur android, utiliser la commande :
```
cordova run android
```

Utilisation de l'application
==========
Le lancement de l'application envoie directement sur un menu de connexion, il suffit d'entrer un nom d'utilisateur et un mot de passe pour se connecter (ou le bon mot de passe si l'utilisateur existe déjà)

Une fois dans le menu de lancement de partie, le bouton "Lancer la recherche" permet d'entrer dans une salle d'attente, qui se remplit quand d'autres joueurs cherchent une partie

Quand le nombre de joueurs suffisant est atteint, la partie se lance. Une fois terminé (gagnée ou perdue), le bouton "Revenir au menu" renvoie vers le menu de lancement de partie
