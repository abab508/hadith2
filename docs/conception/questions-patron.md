# HadithVerify AI — Questions à trancher par le patron

> Rédigé le 2026-10-28 par l'analyste, à partir de docs/exigences/01, 02 et 03.
> Classées de la plus bloquante à la moins bloquante.
> (R) = option recommandée : la plus simple et la plus facile à changer plus tard.
> Aucun prix n'est donné ici : les coûts seront chiffrés par le contrôleur de gestion.

---

## 1. En V1, l'application donne-t-elle elle-même un verdict d'authenticité ?
- A. (R) Non : elle cherche les hadiths et affiche les jugements des savants **cités avec leur référence**. Sinon elle indique « Non déterminé ».
- B. Oui : l'IA propose sa propre conclusion (ṣaḥīḥ, ḥasan, ḍaʿīf…), marquée « provisoire, à valider par un spécialiste ».
- **Bloqué tant que non tranché** : le cahier des charges, le rôle des agents IA, le format des rapports, le niveau de validation humaine exigé.

## 2. D'où viennent les textes arabes des hadiths ?
- A. (R) D'un petit nombre de recueils dont la licence de réutilisation est vérifiée et notée par écrit (corpus à identifier par la veille).
- B. D'un éditeur ou d'une base payante, avec un contrat de licence.
- C. D'une saisie manuelle d'un petit échantillon, pour un prototype seulement.
- **Bloqué** : la base de données, la recherche, toutes les démonstrations. Sans source autorisée, rien ne peut être publié.

## 3. Quel budget pour la V1 ?
- A. (R) Aucune dépense jusqu'au prototype (outils gratuits seulement), puis chiffrage avant toute dépense.
- B. Un plafond mensuel fixé par le patron dès maintenant.
- C. Budget décidé après un chiffrage complet par le contrôleur de gestion.
- **Bloqué** : le choix du moteur d'IA, de l'hébergement, des sources payantes et des relecteurs payants.

## 4. Quelle forme pour l'application et quelles technologies ?
- A. (R) Un site web qui s'adapte au téléphone, avec un outil de traduction d'interface standard. L'architecte propose la liste exacte, le patron valide.
- B. Une application mobile (Android / iPhone) d'abord.
- C. Les deux en même temps.
- **Bloqué** : tout le code. Le dépôt est vide : aucune technologie n'est encore choisie.

## 5. Quel moteur d'intelligence artificielle pour les « agents » ?
- A. (R) Un service d'IA externe, appelé à travers une couche interchangeable (on peut changer de fournisseur sans tout réécrire).
- B. Un modèle libre installé sur nos propres serveurs.
- C. Pas d'IA en V1 : recherche documentaire seulement, IA ajoutée ensuite.
- **Bloqué** : la conception des agents, les rapports, le budget mensuel, la confidentialité des requêtes.

## 6. Où héberger l'application ?
- A. (R) Chez un hébergeur « géré » (il s'occupe des serveurs), avec possibilité de déménager.
- B. Un serveur loué que nous administrons nous-mêmes.
- C. Rien en ligne pour l'instant : tout tourne sur l'ordinateur du patron.
- **Bloqué** : la mise en ligne, les tests publics, une partie du choix technique. (Rappel : tout déploiement exige l'accord du patron.)

## 7. Faut-il des comptes utilisateurs en V1 ?
- A. (R) Non : la langue choisie est gardée dans le navigateur du visiteur. Les comptes viendront plus tard.
- B. Oui : inscription avec e-mail et mot de passe, préférences gardées dans le compte.
- **Bloqué** : la gestion des données personnelles et ses obligations légales, la page « paramètres du compte » prévue dans l'exigence 02.

## 8. Quelles traductions des hadiths afficher, et avec quels droits ?
- A. (R) Seulement des traductions publiées dont le droit de réutilisation est vérifié et noté. Sinon : texte arabe + mention « pas de traduction vérifiée ».
- B. Demander l'autorisation à des éditeurs ou traducteurs précis (prend du temps).
- C. Ne montrer aucune traduction en V1 : arabe seul + explication dans la langue choisie.
- **Bloqué** : le contenu affiché en français, anglais et dans les autres langues ; la fiche « provenance » de chaque traduction.

## 9. Utilise-t-on la traduction automatique ?
- A. (R) Oui pour l'interface (menus, boutons), toujours relue avant publication. Non pour les hadiths et les termes techniques en V1.
- B. Oui aussi pour les hadiths, avec l'étiquette visible « traduction automatique, non officielle ».
- C. Jamais : uniquement des traductions humaines.
- **Bloqué** : la vitesse de lancement des 8 langues, le niveau « Traduction automatique disponible » du catalogue des langues.

## 10. Qui valide la terminologie des sciences du hadith ?
- A. (R) Un spécialiste désigné par le patron. En attendant, chaque terme du dictionnaire porte la mention « en attente de validation ».
- B. Un comité de plusieurs spécialistes (plus sûr, plus long).
- C. Recruter un spécialiste rémunéré (dépense, accord du patron requis).
- Sous-question : quelle norme de translittération (ex. celle utilisée dans les exemples de l'exigence 01) ? (R) garder celle des exemples, validée par le spécialiste.
- **Bloqué** : le statut « validé » du dictionnaire, le contrôle qualité avant publication des rapports.

## 11. Qui relit les traductions en espagnol, ourdou, indonésien, malais et turc ?
- A. (R) Lancer ces langues avec l'étiquette « expérimental », et chercher des relecteurs bénévoles compétents.
- B. Payer des traducteurs professionnels (dépense, accord du patron requis).
- C. Retarder ces 5 langues : lancer seulement en arabe, anglais, français.
- **Bloqué** : le passage de ces langues au niveau « vérifié », le critère n° 3 de l'exigence 02.

## 12. Jusqu'où va la couverture des langues au lancement ?
- A. (R) Les 8 langues de l'exigence 02 pour l'interface. Toutes les autres sont seulement « identifiées » dans le catalogue, sans promesse de contenu.
- B. Ouvrir aussi des langues de priorité 2 dès la V1.
- **Bloqué** : la taille du travail de traduction, l'affichage honnête des niveaux de prise en charge dans le sélecteur de langues.
