# pays-ages_energetiques

Projet issu du BAT, Pays-ages Energétiques a pour but de montrer la réalité énergétique cachée derrière une photo de paysage. 
La géolocalisation de la photo est utilisée : en fonction du département où la photo a été prise le paysage va subir des modifications liées à la consommation et la production d'énergie sur le territoire. Si la photo est prise sur un territoire consommant beaucoup d'énergie (électricité, gaz) et produisant peu d'énergie verte (solaire, éolien, biomasse, hydoéléctrique) elle sera beaucoup modifiée. Inversement si le territoire produit beaucoup d'énergie renouvellable et consomme peu, la photo sera peu altérée. 

Il y a donc 6 niveaux d'altération : 
⋅⋅* consommation de gaz : plus du gaz est consommé plus la photo sera floutée 
..* consommation d'électricité : plus de l'électricité est consommée, plus la photo sera bruitée
..* production solaire : moins il y a de production d'énérgie solaire, plus la photo sera solariée (tend vers des couleurs extremes)
..* production éolien : moins il y a de production d'énérgie éolienne, plus la photo sera blanchie 
..* production biomasse : moins il y a de production d'énérgie biommase, plus la photo sera hachée
..* production éolien : moins il y a de production d'énérgie hydraulique, plus la photo tendra vers son négatif

Une dernière image est produite : celle récapitulant toutes ces modifications. 

## Matériel 
7 tablettes 
1 PC 
1 vidéo projecteur 

## Installation 
![IMG_20191016_173528160.jpg](https://photos.erasme.org/images/2019/10/18/IMG_20191016_173528160.jpg) 

Une première tablette est à disposition de l'utilisateur qui peut choisir l'image qu'il souhaite voir altérée. 
Devant lui se trouvent 6 tablettes, chacune présentera une déformation individuelle. 
Enfin se trouve un écran sur lequel sera projeté l'image finale, projection réalisée grace au vidéoprojecteur connecté au PC

## Code et données
Projet réalisé sur Glitch : https://glitch.com/edit/#!/paysages?path=README.md:1:0 
Données issues de : https://data.enedis.fr/explore/?sort=modified et https://opendata.grdf.fr/pages/accueil/?flg=fr

## Réglages
Tous les appareils doivent être connectées. 
La tablette de l'utilisateur est sur l'adresse : http://paysages.glitch.me/control
Les 6 autres tablettes sont sur les adresses respectives : http://paysages.glitch.me/?id=0 jusqu'à http://paysages.glitch.me/?id=5
Enfin le PC branché au vidéoprojecteur est sur l'adresse : http://paysages.glitch.me/result

## Jouons ! 
L'utilisateur chosiit une image sur sa tablette et clique dessus. Il voit alors apparaitre sur les 6 tablettes les déformations une par une. Bien ranger les tablettes dans l'ordre pour que le résultat soit logique. Dans le même temps l'image sur l'écarn final est modifiée. L'utilisateur peut voir sur sa tabeltte les chiffres réels de consommation et production par année. 

