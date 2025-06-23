import { ouvrirPopupAjoutContact } from './ajoutvue.js';
import { ouvrirPopupAjoutGroupe } from './groupevue.js';
import { deconnecterUtilisateur } from './loginVue.js';
import { initialiserDiffusion } from './diffusion.js';
import { initialiserArchivage } from './archivage.js';
import { initialiserStatut, mettreAJourIndicateurStatut } from './status.js';
import { initialiserAppels } from './appel.js';
import { initialiserEpinglage, ajouterMenuEpinglage, reorganiserConversations } from './epingle.js';
import { initialiserMessagerie, ouvrirConversation, nettoyerMessagerie } from './messagerie.js';

const URL_UTILISATEURS = "http://localhost:3001/utilisateurs";
const URL_GROUPES = "http://localhost:3001/groupes";

export function ComposantAccueil(composant) {
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    
    if (!utilisateurConnecte.id) {
        console.error('Aucun utilisateur connecté trouvé');
        return;
    }

    composant.innerHTML = `
        <div class="flex h-screen bg-gray-100">
            <!-- Sidebar gauche -->
            <div class="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                <!-- Header avec profil utilisateur -->
                <div class="navbarRecherche bg-fuchsia-900 text-white p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="relative">
                                <img id="photoProfilUtilisateur" src="${utilisateurConnecte.photo_profil || 'src/img/default-avatar.png'}" 
                                     alt="Profil" class="w-10 h-10 rounded-full object-cover">
                            </div>
                            <div>
                                <h3 class="font-semibold">${utilisateurConnecte.nom}</h3>
                                <p class="text-sm text-fuchsia-200">En ligne</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button class="p-2 hover:bg-fuchsia-700 rounded-full transition-colors" title="Nouveau groupe">
                                <i class="fa-solid fa-users text-white"></i>
                            </button>
                            <button class="p-2 hover:bg-fuchsia-700 rounded-full transition-colors" title="Menu">
                                <i class="fa-solid fa-ellipsis-vertical text-white"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Barre de recherche -->
                <div class="p-4 border-b border-gray-200">
                    <div class="relative">
                        <input type="text" id="rechercheConversation" 
                               placeholder="Rechercher une conversation..." 
                               class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                        <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                <!-- Boutons d'action -->
                <div class="p-4 border-b border-gray-200">
                    <div class="grid grid-cols-4 gap-2">
                        <button class="boutonAjoutContact flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <i class="fa-solid fa-user-plus text-fuchsia-600 text-xl mb-1"></i>
                            <span class="text-xs text-gray-600">Contact</span>
                        </button>
                        <button class="boutonAjoutGroupe flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <i class="fa-solid fa-users text-green-600 text-xl mb-1"></i>
                            <span class="text-xs text-gray-600">Groupe</span>
                        </button>
                        <button class="Diffusion flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <i class="fa-solid fa-broadcast-tower text-blue-600 text-xl mb-1"></i>
                            <span class="text-xs text-gray-600">Diffusion</span>
                        </button>
                        <button class="Statut flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div class="boutonStatut">
                                <i class="fa-solid fa-circle-info text-orange-600 text-xl mb-1"></i>
                                <span class="text-xs text-gray-600">Statut</span>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Filtres -->
                <div class="p-4 border-b border-gray-200">
                    <div class="flex space-x-2">
                        <button class="filtre-btn active px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-sm" data-filtre="tous">
                            Tous
                        </button>
                        <button class="filtre-btn px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm" data-filtre="non-lus">
                            Non lus
                        </button>
                        <button class="filtre-btn px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm" data-filtre="favoris">
                            Favoris
                        </button>
                        <button class="Archivage filtre-btn px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm" data-filtre="archives">
                            Archives
                        </button>
                    </div>
                </div>

                <!-- Liste des conversations -->
                <div class="flex-1 overflow-y-auto">
                    <div id="listeContactsGroupes" class="divide-y divide-gray-100">
                        <!-- Les conversations seront chargées ici -->
                    </div>
                </div>

                <!-- Bouton de déconnexion -->
                <div class="p-4 border-t border-gray-200">
                    <button id="btnDeconnexion" class="w-full flex items-center justify-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <i class="fa-solid fa-sign-out-alt"></i>
                        <span>Se déconnecter</span>
                    </button>
                </div>
            </div>

            <!-- Zone de discussion principale -->
            <div class="flex-1 flex flex-col discussion">
                <!-- Message de bienvenue par défaut -->
                <div class="flex items-center justify-between bg-white p-4 shadow-sm border-b">
                    <div class="flex items-center space-x-3">
                        <img src="src/img/default-avatar.png" alt="Profil" class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <h4 class="font-semibold text-gray-800">Sélectionnez une conversation</h4>
                            <p class="text-sm text-gray-500">Choisissez un contact ou groupe pour commencer</p>
                        </div>
                    </div>
                </div>

                <div class="flex-1 flex items-center justify-center bg-gray-50">
                    <div class="text-center text-gray-500">
                        <i class="fa-solid fa-comments text-6xl text-gray-300 mb-4"></i>
                        <p class="text-lg">Sélectionnez une conversation pour commencer à discuter</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialiser tous les modules
    initialiserModules();
    
    // Charger les données
    chargerContactsEtGroupes();
    
    // Ajouter les événements
    ajouterEvenements();
}

function initialiserModules() {
    try {
        initialiserMessagerie();
        initialiserDiffusion();
        initialiserArchivage();
        initialiserStatut();
        initialiserAppels();
        initialiserEpinglage();
        mettreAJourIndicateurStatut();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des modules:', error);
    }
}

function ajouterEvenements() {
    // Bouton ajout contact
    const btnAjoutContact = document.querySelector('.boutonAjoutContact');
    if (btnAjoutContact) {
        btnAjoutContact.addEventListener('click', ouvrirPopupAjoutContact);
    }

    // Bouton ajout groupe
    const btnAjoutGroupe = document.querySelector('.boutonAjoutGroupe');
    if (btnAjoutGroupe) {
        btnAjoutGroupe.addEventListener('click', ouvrirPopupAjoutGroupe);
    }

    // Bouton déconnexion
    const btnDeconnexion = document.getElementById('btnDeconnexion');
    if (btnDeconnexion) {
        btnDeconnexion.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                nettoyerMessagerie();
                deconnecterUtilisateur();
                location.reload();
            }
        });
    }

    // Recherche
    const rechercheInput = document.getElementById('rechercheConversation');
    if (rechercheInput) {
        rechercheInput.addEventListener('input', (e) => {
            filtrerConversations(e.target.value);
        });
    }

    // Filtres
    const filtres = document.querySelectorAll('.filtre-btn');
    filtres.forEach(filtre => {
        filtre.addEventListener('click', (e) => {
            const filtreCible = e.target.dataset.filtre;
            if (filtreCible) {
                changerFiltre(filtreCible);
            }
        });
    });
}

async function chargerContactsEtGroupes() {
    try {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        // Récupérer les données mises à jour depuis l'API
        const responseUtilisateur = await fetch(`${URL_UTILISATEURS}/${utilisateurConnecte.id}`);
        const utilisateurMisAJour = await responseUtilisateur.json();
        
        // Mettre à jour le localStorage
        localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateurMisAJour));
        
        const responseGroupes = await fetch(URL_GROUPES);
        const tousLesGroupes = await responseGroupes.json();
        
        // Filtrer les groupes dont l'utilisateur est membre
        const groupesUtilisateur = tousLesGroupes.filter(groupe => 
            groupe.membres && groupe.membres.some(membre => 
                membre.utilisateur_id === utilisateurConnecte.id || membre.id === utilisateurConnecte.id
            )
        );
        
        afficherContactsEtGroupes(utilisateurMisAJour.liste_contacts || [], groupesUtilisateur);
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        afficherErreurChargement();
    }
}

function afficherContactsEtGroupes(contacts, groupes) {
    const container = document.getElementById('listeContactsGroupes');
    if (!container) return;

    container.innerHTML = '';

    // Créer une liste combinée avec les conversations
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    const conversations = utilisateurConnecte.conversations || [];
    
    const elements = [];

    // Ajouter les contacts
    contacts.forEach(contact => {
        const conversation = conversations.find(conv => 
            conv.participants && conv.participants.includes(contact.id)
        );
        
        elements.push({
            type: 'contact',
            data: contact,
            conversation: conversation,
            derniere_activite: conversation?.derniere_activite || contact.date_ajout || new Date().toISOString()
        });
    });

    // Ajouter les groupes
    groupes.forEach(groupe => {
        const conversation = conversations.find(conv => conv.groupe_id === groupe.id);
        
        elements.push({
            type: 'groupe',
            data: groupe,
            conversation: conversation,
            derniere_activite: conversation?.derniere_activite || groupe.date_creation || new Date().toISOString()
        });
    });

    // Trier par dernière activité (plus récent en premier)
    elements.sort((a, b) => {
        const dateA = new Date(a.derniere_activite);
        const dateB = new Date(b.derniere_activite);
        return dateB - dateA;
    });

    // Afficher les éléments
    elements.forEach(element => {
        const elementHTML = creerElementConversation(element);
        container.appendChild(elementHTML);
    });

    // Réorganiser selon les épinglages
    reorganiserConversations();
}

function creerElementConversation(element) {
    const div = document.createElement('div');
    div.className = 'contact-groupe-item p-4 hover:bg-gray-50 cursor-pointer transition-colors';
    div.dataset.id = element.data.id;
    div.dataset.type = element.type;

    const nom = element.type === 'contact' 
        ? (element.data.nom_personnalise || element.data.nom)
        : element.data.nom;

    const photo = element.data.photo_profil || element.data.photo_groupe || 'src/img/default-avatar.png';
    
    const dernierMessage = obtenirDernierMessage(element);
    const heureMessage = element.derniere_activite 
        ? new Date(element.derniere_activite).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        : '';

    const messagesNonLus = element.conversation?.messages_non_lus || 0;
    const estSilencieux = element.conversation?.silencieux || false;

    div.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="relative">
                <img src="${photo}" alt="${nom}" class="w-12 h-12 rounded-full object-cover">
                ${element.type === 'groupe' ? `
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <i class="fa-solid fa-users text-white text-xs"></i>
                    </div>
                ` : ''}
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                    <h4 class="font-semibold text-gray-900 truncate">${nom}</h4>
                    <div class="flex items-center space-x-1">
                        ${estSilencieux ? '<i class="fa-solid fa-bell-slash text-gray-400 text-xs"></i>' : ''}
                        <span class="text-xs text-gray-500">${heureMessage}</span>
                    </div>
                </div>
                <div class="flex items-center justify-between mt-1">
                    <p class="text-sm text-gray-600 truncate">${dernierMessage}</p>
                    ${messagesNonLus > 0 ? `
                        <span class="bg-fuchsia-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            ${messagesNonLus > 99 ? '99+' : messagesNonLus}
                        </span>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    // Ajouter le menu contextuel d'épinglage
    ajouterMenuEpinglage(div, element.data.id, element.type);

    // Ajouter l'événement de clic pour ouvrir la conversation
    div.addEventListener('click', () => {
        ouvrirConversation(element.data.id, element.type, nom);
    });

    return div;
}

function obtenirDernierMessage(element) {
    // Pour l'instant, retourner un message par défaut
    // Cette fonction pourrait être améliorée pour récupérer le vrai dernier message
    if (element.type === 'contact') {
        return 'Cliquez pour commencer la conversation';
    } else {
        return 'Groupe créé';
    }
}

function filtrerConversations(terme) {
    const elements = document.querySelectorAll('.contact-groupe-item');
    const termeNormalise = terme.toLowerCase().trim();
    
    elements.forEach(element => {
        const nom = element.querySelector('h4').textContent.toLowerCase();
        const visible = nom.includes(termeNormalise);
        element.style.display = visible ? 'block' : 'none';
    });
}

function changerFiltre(filtre) {
    // Mettre à jour l'apparence des boutons
    document.querySelectorAll('.filtre-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-fuchsia-100', 'text-fuchsia-700');
        btn.classList.add('bg-gray-100', 'text-gray-600');
    });
    
    const btnActif = document.querySelector(`[data-filtre="${filtre}"]`);
    if (btnActif) {
        btnActif.classList.remove('bg-gray-100', 'text-gray-600');
        btnActif.classList.add('active', 'bg-fuchsia-100', 'text-fuchsia-700');
    }
    
    // Appliquer le filtre
    const elements = document.querySelectorAll('.contact-groupe-item');
    
    elements.forEach(element => {
        let visible = true;
        
        switch (filtre) {
            case 'non-lus':
                const badge = element.querySelector('.bg-fuchsia-500');
                visible = badge !== null;
                break;
            case 'favoris':
                // Logique pour les favoris
                visible = element.dataset.favori === 'true';
                break;
            case 'archives':
                // Logique pour les archives
                visible = element.dataset.archive === 'true';
                break;
            case 'tous':
            default:
                visible = true;
                break;
        }
        
        element.style.display = visible ? 'block' : 'none';
    });
}

function afficherErreurChargement() {
    const container = document.getElementById('listeContactsGroupes');
    if (container) {
        container.innerHTML = `
            <div class="p-4 text-center text-red-500">
                <i class="fa-solid fa-exclamation-triangle text-2xl mb-2"></i>
                <p>Erreur lors du chargement</p>
                <button onclick="location.reload()" class="mt-2 px-4 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600">
                    Réessayer
                </button>
            </div>
        `;
    }
}

// Fonction pour rafraîchir l'affichage (utilisée par d'autres modules)
export async function rafraichirContactsGroupes() {
    await chargerContactsEtGroupes();
}

// Fonction pour recharger après archivage
export async function rechargerApresArchivage() {
    await chargerContactsEtGroupes();
}

// Exposer les fonctions nécessaires globalement
window.rafraichirContactsGroupes = rafraichirContactsGroupes;