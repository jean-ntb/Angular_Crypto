import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
/*Rôle :

- Point d'entrée de l'application Angular
- Premier fichier exécuté
- Bootstrap (démarre) l'application
- Charge le composant racine et la configuration*/ 
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
