// messagerie.js - Système de messagerie corrigé
const URL_MESSAGES = "http://localhost:3001/messages";
const URL_UTILISATEURS = "http://localhost:3001/utilisateurs";

let conversationActive = null;
let intervalRafraichissement = null;

/**
 * Initialise le système de messagerie
 */
export function initialiserMessagerie() {
    console.log("Initialisation du système de messagerie");
    
    // Écouter les événements de sélection de conversation
    document.addEventListener('click', (e) => {
        const contactItem = e.target.closest('.contact-groupe-item');
        if (contactItem) {
            const id = contactItem.dataset.id;
            const type = contactItem.dataset.type;
            const nom = contactItem.querySelector('h4')?.textContent;
            
            if (id && type && nom) {
                ouvrirConversation(id, type, nom);
            }
        }
    });
}

/**
 * Ouvre une conversation avec un contact ou groupe
 */
export async function ouvrirConversation(id, type, nom) {
    try {
        // Arrêter le rafraîchissement précédent
        if (intervalRafraichissement) {
            clearInterval(intervalRafraichissement);
        }

        // Définir la conversation active
        conversationActive = {
            id: id,
            type: type,
            nom: nom,
            conversationId: genererIdConversation(id, type)
        };

        // Mettre à jour l'interface
        mettreAJourInterfaceConversation();
        
        // Charger les messages
        await chargerMessages();
        
        // Démarrer le rafraîchissement automatique
        intervalRafraichissement = setInterval(chargerMessages, 2000);
        
        // Marquer la conversation comme sélectionnée
        marquerConversationActive(id);
        
    } catch (error) {
        console.error('Erreur lors de l\'ouverture de la conversation:', error);
    }
}

/**
 * Génère un ID unique pour la conversation
 */
function genererIdConversation(id, type) {
    if (type === 'groupe') {
        return `conv_group_${id}`;
    } else {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        const ids = [utilisateurConnecte.id, id].sort();
        return `conv_${ids[0]}_${ids[1]}`;
    }
}

/**
 * Met à jour l'interface de conversation
 */
function mettreAJourInterfaceConversation() {
    const zoneDiscussion = document.querySelector('.discussion');
    if (!zoneDiscussion || !conversationActive) return;

    zoneDiscussion.innerHTML = `
        <!-- En-tête de conversation -->
        <div class="flex items-center justify-between bg-white p-4 shadow-sm border-b">
            <div class="flex items-center space-x-3">
                <img src="src/img/default-avatar.png" alt="Profil" class="w-10 h-10 rounded-full object-cover">
                <div>
                    <h4 class="font-semibold text-gray-800">${conversationActive.nom}</h4>
                    <p class="text-sm text-gray-500" id="statutContact">En ligne</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button class="p-2 hover:bg-gray-100 rounded-full" title="Appel vocal">
                    <i class="fa-solid fa-phone text-gray-600"></i>
                </button>
                <button class="p-2 hover:bg-gray-100 rounded-full" title="Appel vidéo">
                    <i class="fa-solid fa-video text-gray-600"></i>
                </button>
                <button class="p-2 hover:bg-gray-100 rounded-full" title="Plus d'options">
                    <i class="fa-solid fa-ellipsis-vertical text-gray-600"></i>
                </button>
            </div>
        </div>

        <!-- Zone des messages -->
        <div id="zoneMessages" class="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div class="flex items-center justify-center h-full">
                <div class="text-center text-gray-500">
                    <i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i>
                    <p>Chargement des messages...</p>
                </div>
            </div>
        </div>

        <!-- Zone de saisie -->
        <div class="bg-white p-4 border-t">
            <div class="flex items-center space-x-3">
                <button class="p-2 hover:bg-gray-100 rounded-full" title="Joindre un fichier">
                    <i class="fa-solid fa-paperclip text-gray-600"></i>
                </button>
                <div class="flex-1 relative">
                    <input 
                        type="text" 
                        id="champMessage" 
                        placeholder="Tapez votre message..." 
                        class="w-full p-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    >
                    <button class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full" title="Emoji">
                        <i class="fa-solid fa-face-smile text-gray-600"></i>
                    </button>
                </div>
                <button id="btnEnvoyerMessage" class="p-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-full transition-colors">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;

    // Ajouter les événements
    initialiserEvenementsMessage();
}

/**
 * Initialise les événements de messagerie
 */
function initialiserEvenementsMessage() {
    const champMessage = document.getElementById('champMessage');
    const btnEnvoyer = document.getElementById('btnEnvoyerMessage');

    if (champMessage && btnEnvoyer) {
        // Envoi par clic sur le bouton
        btnEnvoyer.addEventListener('click', envoyerMessage);
        
        // Envoi par Entrée
        champMessage.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                envoyerMessage();
            }
        });

        // Focus automatique
        champMessage.focus();
    }
}

/**
 * Charge les messages de la conversation active
 */
async function chargerMessages() {
    if (!conversationActive) return;

    try {
        const response = await fetch(`${URL_MESSAGES}?conversation_id=${conversationActive.conversationId}`);
        const messages = await response.json();
        
        afficherMessages(messages);
        
    } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        afficherErreurChargement();
    }
}

/**
 * Affiche les messages dans l'interface
 */
function afficherMessages(messages) {
    const zoneMessages = document.getElementById('zoneMessages');
    if (!zoneMessages) return;

    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    
    if (messages.length === 0) {
        zoneMessages.innerHTML = `
            <div class="flex items-center justify-center h-full">
                <div class="text-center text-gray-500">
                    <i class="fa-solid fa-comments text-4xl mb-2"></i>
                    <p>Aucun message pour le moment</p>
                    <p class="text-sm">Commencez la conversation !</p>
                </div>
            </div>
        `;
        return;
    }

    // Trier les messages par date
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    let htmlMessages = '<div class="space-y-3">';
    
    messages.forEach((message, index) => {
        const estEnvoye = message.expediteur === utilisateurConnecte.id;
        const messagePrecedent = messages[index - 1];
        const afficherDate = !messagePrecedent || 
            !memeJour(new Date(message.timestamp), new Date(messagePrecedent.timestamp));

        if (afficherDate) {
            htmlMessages += `
                <div class="text-center my-4">
                    <span class="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                        ${formaterDate(message.timestamp)}
                    </span>
                </div>
            `;
        }

        htmlMessages += creerElementMessage(message, estEnvoye);
    });
    
    htmlMessages += '</div>';
    zoneMessages.innerHTML = htmlMessages;
    
    // Faire défiler vers le bas
    zoneMessages.scrollTop = zoneMessages.scrollHeight;
}

/**
 * Crée l'élément HTML pour un message
 */
function creerElementMessage(message, estEnvoye) {
    const heureMessage = new Date(message.timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const classesMessage = estEnvoye 
        ? 'bg-fuchsia-500 text-white ml-auto' 
        : 'bg-white text-gray-800 mr-auto';

    const iconesStatut = estEnvoye ? genererIconesStatut(message.statut) : '';

    return `
        <div class="flex ${estEnvoye ? 'justify-end' : 'justify-start'}">
            <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${classesMessage} shadow-sm">
                ${message.contenu.type === 'texte' ? `
                    <p class="text-sm">${message.contenu.texte}</p>
                ` : ''}
                <div class="flex items-center justify-end mt-1 space-x-1">
                    <span class="text-xs opacity-70">${heureMessage}</span>
                    ${iconesStatut}
                </div>
            </div>
        </div>
    `;
}

/**
 * Génère les icônes de statut pour les messages envoyés
 */
function genererIconesStatut(statut) {
    if (!statut) return '';
    
    if (statut.lu) {
        return '<i class="fa-solid fa-check-double text-blue-300 text-xs"></i>';
    } else if (statut.livre) {
        return '<i class="fa-solid fa-check-double text-gray-300 text-xs"></i>';
    } else if (statut.envoye) {
        return '<i class="fa-solid fa-check text-gray-300 text-xs"></i>';
    }
    
    return '<i class="fa-solid fa-clock text-gray-300 text-xs"></i>';
}

/**
 * Envoie un nouveau message
 */
async function envoyerMessage() {
    const champMessage = document.getElementById('champMessage');
    if (!champMessage || !conversationActive) return;

    const texte = champMessage.value.trim();
    if (!texte) return;

    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    
    const nouveauMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversation_id: conversationActive.conversationId,
        expediteur: utilisateurConnecte.id,
        contenu: {
            type: "texte",
            texte: texte,
            mise_en_forme: []
        },
        timestamp: new Date().toISOString(),
        statut: {
            envoye: true,
            livre: false,
            lu: false,
            timestamp_lecture: null
        },
        reponse_a: null,
        transfere_de: null,
        reactions: [],
        ephemere: false
    };

    try {
        // Vider le champ immédiatement pour une meilleure UX
        champMessage.value = '';
        
        // Afficher le message temporairement
        ajouterMessageTemporaire(nouveauMessage);
        
        // Envoyer à l'API
        const response = await fetch(URL_MESSAGES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nouveauMessage)
        });

        if (response.ok) {
            // Recharger les messages pour avoir la version serveur
            await chargerMessages();
            
            // Mettre à jour la dernière activité de la conversation
            await mettreAJourDerniereActivite();
        } else {
            throw new Error('Erreur lors de l\'envoi');
        }

    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        afficherErreurEnvoi();
        
        // Remettre le texte dans le champ en cas d'erreur
        champMessage.value = texte;
    }
}

/**
 * Ajoute temporairement un message à l'interface
 */
function ajouterMessageTemporaire(message) {
    const zoneMessages = document.getElementById('zoneMessages');
    if (!zoneMessages) return;

    const elementMessage = creerElementMessage(message, true);
    
    // Si la zone est vide, créer le conteneur
    let conteneur = zoneMessages.querySelector('.space-y-3');
    if (!conteneur) {
        zoneMessages.innerHTML = '<div class="space-y-3"></div>';
        conteneur = zoneMessages.querySelector('.space-y-3');
    }
    
    conteneur.insertAdjacentHTML('beforeend', elementMessage);
    zoneMessages.scrollTop = zoneMessages.scrollHeight;
}

/**
 * Met à jour la dernière activité de la conversation
 */
async function mettreAJourDerniereActivite() {
    try {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        // Récupérer l'utilisateur depuis l'API
        const response = await fetch(`${URL_UTILISATEURS}/${utilisateurConnecte.id}`);
        const utilisateur = await response.json();
        
        // Trouver ou créer la conversation
        if (!utilisateur.conversations) {
            utilisateur.conversations = [];
        }
        
        let conversation = utilisateur.conversations.find(conv => {
            if (conversationActive.type === 'groupe') {
                return conv.groupe_id === conversationActive.id;
            } else {
                return conv.participants && conv.participants.includes(conversationActive.id);
            }
        });
        
        if (!conversation) {
            // Créer une nouvelle conversation
            conversation = {
                id: conversationActive.conversationId,
                type: conversationActive.type === 'groupe' ? 'groupe' : 'individuelle',
                participants: conversationActive.type === 'groupe' ? [] : [utilisateurConnecte.id, conversationActive.id],
                groupe_id: conversationActive.type === 'groupe' ? conversationActive.id : undefined,
                derniere_activite: new Date().toISOString(),
                messages_non_lus: 0,
                epingle: false,
                archive: false,
                silencieux: false
            };
            utilisateur.conversations.push(conversation);
        } else {
            conversation.derniere_activite = new Date().toISOString();
        }
        
        // Sauvegarder
        await fetch(`${URL_UTILISATEURS}/${utilisateur.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(utilisateur)
        });
        
        // Mettre à jour le localStorage
        localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateur));
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la dernière activité:', error);
    }
}

/**
 * Marque la conversation comme active visuellement
 */
function marquerConversationActive(id) {
    // Retirer la sélection précédente
    document.querySelectorAll('.contact-groupe-item').forEach(item => {
        item.classList.remove('bg-fuchsia-50', 'border-l-4', 'border-fuchsia-500');
    });
    
    // Ajouter la sélection à l'élément actuel
    const elementActif = document.querySelector(`[data-id="${id}"]`);
    if (elementActif) {
        elementActif.classList.add('bg-fuchsia-50', 'border-l-4', 'border-fuchsia-500');
    }
}

/**
 * Affiche une erreur de chargement
 */
function afficherErreurChargement() {
    const zoneMessages = document.getElementById('zoneMessages');
    if (zoneMessages) {
        zoneMessages.innerHTML = `
            <div class="flex items-center justify-center h-full">
                <div class="text-center text-red-500">
                    <i class="fa-solid fa-exclamation-triangle text-4xl mb-2"></i>
                    <p>Erreur lors du chargement des messages</p>
                    <button onclick="chargerMessages()" class="mt-2 px-4 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600">
                        Réessayer
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Affiche une erreur d'envoi
 */
function afficherErreurEnvoi() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fa-solid fa-exclamation-circle"></i>
            <span>Erreur lors de l'envoi du message</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Utilitaires de date
 */
function memeJour(date1, date2) {
    return date1.toDateString() === date2.toDateString();
}

function formaterDate(timestamp) {
    const date = new Date(timestamp);
    const aujourd = new Date();
    
    if (memeJour(date, aujourd)) {
        return "Aujourd'hui";
    }
    
    const hier = new Date(aujourd);
    hier.setDate(hier.getDate() - 1);
    
    if (memeJour(date, hier)) {
        return "Hier";
    }
    
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: date.getFullYear() !== aujourd.getFullYear() ? 'numeric' : undefined
    });
}

/**
 * Nettoie les ressources lors de la fermeture
 */
export function nettoyerMessagerie() {
    if (intervalRafraichissement) {
        clearInterval(intervalRafraichissement);
        intervalRafraichissement = null;
    }
    conversationActive = null;
}

// Exposer les fonctions nécessaires globalement
window.chargerMessages = chargerMessages;
window.ouvrirConversation = ouvrirConversation;