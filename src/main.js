import './style.css'
import { loginComposant } from './loginVue'
import { ComposantAccueil } from './accueilvue';

const URL_UTILISATEURS = 'http://localhost:3001/utilisateurs';
const URL_GROUPES = 'http://localhost:3001/groupes';
const URL_MESSAGES = 'http://localhost:3001/messages'
const URL_STATUTS = 'http://localhost:3001/statuts'
const URL_APPELS = 'http://localhost:3001/appels'
const URL_PARAMETRES_APPLICATION = 'http://localhost:3001/parametres_application'

window.addEventListener('DOMContentLoaded', () => {
  const estConnecte = localStorage.getItem('estConnecte') === 'true';

  if(estConnecte){
    ComposantAccueil(document.body);  
  } else {
    loginComposant(document.body);  
  }
});