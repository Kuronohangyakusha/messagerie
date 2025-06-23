
export function AjoutGroupePopup() {
    const popup = document.createElement("div");
    popup.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    popup.id = "popupAjoutGroupe";
    
    popup.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl w-[500px] max-w-[90vw] max-h-[90vh] overflow-hidden transform transition-all duration-300">
            <!-- Header -->
            <div class="bg-fuchsia-900 text-white p-6 rounded-t-2xl">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-semibold flex items-center gap-2">
                        <i class="fa-solid fa-people-group"></i>
                        Créer un groupe
                    </h2>
                    <button class="text-white hover:text-gray-200 transition-colors" id="fermerPopupGroupe">
                        <i class="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
            </div>
            
            <!-- Contenu du formulaire -->
            <div class="p-6 max-h-[70vh] overflow-y-auto">
                <form id="formulaireAjoutGroupe" class="space-y-4">
                    <!-- Messages d'erreur et succès -->
                    <div id="messageErreurGroupe" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <span id="texteErreurGroupe"></span>
                    </div>
                    <div id="messageSuccesGroupe" class="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        Groupe créé avec succès !
                    </div>

                    <!-- Nom du groupe -->
                    <div>
                        <label for="nomGroupe" class="block text-sm font-medium text-gray-700 mb-2">
                            Nom du groupe *
                        </label>
                        <input type="text" id="nomGroupe" name="nom" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                               placeholder="Entrez le nom du groupe">
                    </div>

                    <!-- Description -->
                    <div>
                        <label for="descriptionGroupe" class="block text-sm font-medium text-gray-700 mb-2">
                            Description (optionnel)
                        </label>
                        <textarea id="descriptionGroupe" name="description" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                  placeholder="Décrivez brièvement le groupe"></textarea>
                    </div>

                    <!-- Photo du groupe -->
                    <div>
                        <label for="photoGroupe" class="block text-sm font-medium text-gray-700 mb-2">
                            Photo du groupe
                        </label>
                        <input type="file" id="photoGroupe" name="photo" accept="image/*"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                        <div id="previewPhotoGroupe" class="hidden mt-2">
                            <img id="imagePreviewGroupe" src="" alt="Aperçu" class="w-20 h-20 rounded-full object-cover">
                        </div>
                    </div>

                    <!-- Recherche contacts -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Ajouter des membres
                        </label>
                        <input type="text" id="rechercheContact" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 mb-3"
                               placeholder="Rechercher un contact...">
                    </div>

                    <!-- Liste des contacts -->
                    <div id="listeContacts" class="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                        <!-- Les contacts seront chargés ici -->
                    </div>

                    <!-- Paramètres du groupe -->
                    <div class="space-y-2">
                        <h3 class="text-sm font-medium text-gray-700">Paramètres du groupe</h3>
                        <div class="flex items-center">
                            <input type="checkbox" id="seulsAdminsModifient" name="seulsAdminsModifient"
                                   class="rounded text-fuchsia-500 focus:ring-fuchsia-500">
                            <label for="seulsAdminsModifient" class="ml-2 text-sm text-gray-600">
                                Seuls les administrateurs peuvent modifier les infos du groupe
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="approuverNouveauxMembres" name="approuverNouveauxMembres"
                                   class="rounded text-fuchsia-500 focus:ring-fuchsia-500">
                            <label for="approuverNouveauxMembres" class="ml-2 text-sm text-gray-600">
                                Approuver les nouveaux membres
                            </label>
                        </div>
                    </div>

                    <!-- Boutons -->
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" id="annulerAjoutGroupe"
                                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Annuler
                        </button>
                        <button type="submit" id="confirmerAjoutGroupe"
                                class="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors">
                            <i class="fa-solid fa-people-group mr-2"></i>
                            Créer le groupe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    ajouterGestionnairesEvenementsGroupe(popup);
    return popup;
}


function ajouterGestionnairesEvenementsGroupe(popup) {
    const fermerBtn = popup.querySelector("#fermerPopupGroupe");
    const annulerBtn = popup.querySelector("#annulerAjoutGroupe");
    const formulaire = popup.querySelector("#formulaireAjoutGroupe");
    const rechercheInput = popup.querySelector("#rechercheContact");
    const confirmerBtn = popup.querySelector("#confirmerAjoutGroupe");
    
    const fermerPopup = () => {
        popup.classList.add("opacity-0");
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 300);
    };
    
    fermerBtn.addEventListener("click", fermerPopup);
    annulerBtn.addEventListener("click", fermerPopup);
    popup.addEventListener("click", (e) => {
        if (e.target === popup) fermerPopup();
    });
     
    function validerFormulaire() {
        const nomGroupe = formulaire.querySelector('#nomGroupe').value.trim();
        const contactsSelectionnes = formulaire.querySelectorAll('input[name="membresGroupe"]:checked').length;
        
        const peutCreer = nomGroupe.length >= 2 && contactsSelectionnes >= 2;
        
        confirmerBtn.disabled = !peutCreer;
        if (peutCreer) {
            confirmerBtn.className = "px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors";
        } else {
            confirmerBtn.className = "px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed";
        }
    }
    
   
    formulaire.querySelector('#nomGroupe').addEventListener('input', validerFormulaire);
    
    // Observer les changements de checkboxes (pour les éléments ajoutés dynamiquement)
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.contact-checkbox').forEach(checkbox => {
            checkbox.removeEventListener('change', validerFormulaire); // Éviter les doublons
            checkbox.addEventListener('change', validerFormulaire);
        });
        validerFormulaire();
    });
    
    observer.observe(popup, { childList: true, subtree: true });
    
    formulaire.addEventListener("submit", async (e) => {
        e.preventDefault();
        await gererAjoutGroupe(formulaire, popup);
    });
    
    rechercheInput.addEventListener("input", (e) => {
        filtrerContacts(e.target.value);
    });
    
    ajouterGestionnairePhotoGroupe(popup);
    
     
    setTimeout(() => {
        chargerListeContacts().then(() => {
            validerFormulaire(); 
        });
    }, 100);
}

function ajouterGestionnairePhotoGroupe(popup) {
    const photoInput = popup.querySelector("#photoGroupe");
    const previewDiv = popup.querySelector("#previewPhotoGroupe");
    const previewImg = popup.querySelector("#imagePreviewGroupe");
    
    photoInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("La photo ne doit pas dépasser 5MB");
                photoInput.value = "";
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                alert("Veuillez sélectionner une image valide");
                photoInput.value = "";
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                previewDiv.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            previewDiv.classList.add('hidden');
        }
    });
}


async function chargerListeContacts() {
    try {
        console.log("Début du chargement des contacts...");
        
        const utilisateurConnecte = JSON.parse(localStorage.getItem("utilisateurConnecte"));
        
        if (!utilisateurConnecte || !utilisateurConnecte.liste_contacts || utilisateurConnecte.liste_contacts.length === 0) {
            const listeContacts = document.querySelector("#listeContacts");
            if (listeContacts) {
                listeContacts.innerHTML = `
                    <div class="text-center text-gray-500 py-4">
                        <i class="fa-solid fa-users text-2xl mb-2"></i>
                        <p>Aucun contact disponible</p>
                        <p class="text-xs">Ajoutez d'abord des contacts pour créer un groupe</p>
                    </div>
                `;
            }
            return;
        }

        const listeContacts = document.querySelector("#listeContacts");
        if (!listeContacts) return;

        listeContacts.innerHTML = "";
        
        
        const compteurDiv = document.createElement("div");
        compteurDiv.id = "compteurContacts";
        compteurDiv.className = "mb-3 p-2 bg-blue-50 rounded-md text-sm text-blue-700";
        compteurDiv.innerHTML = `<span id="nombreSelectionnes">0</span> contact(s) sélectionné(s) - Minimum requis: 2`;
        listeContacts.appendChild(compteurDiv);

        utilisateurConnecte.liste_contacts.forEach((contact, index) => {
            const contactDiv = document.createElement("div");
            contactDiv.className = "flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer contact-item";
            contactDiv.dataset.nom = contact.nom.toLowerCase();
            contactDiv.dataset.telephone = contact.telephone;

            const initiales = contact.nom.split(' ')
                .map(mot => mot.charAt(0))
                .join('')
                .toUpperCase()
                .substring(0, 2);

             
            const contactId = contact.id || `contact_${index}`;
            console.log(`Contact ${contact.nom} - ID: ${contactId}`);

            contactDiv.innerHTML = `
                <input type="checkbox" id="contact_${contactId}" name="membresGroupe" value="${contactId}" class="mr-3 rounded text-fuchsia-500 focus:ring-fuchsia-500 contact-checkbox">
                <div class="w-8 h-8 rounded-full bg-fuchsia-200 flex items-center justify-center mr-3">
                    ${contact.photo_profil ? 
                        `<img src="${contact.photo_profil}" alt="${contact.nom}" class="w-8 h-8 rounded-full object-cover">` : 
                        `<span class="text-fuchsia-700 font-semibold text-sm">${initiales}</span>`
                    }
                </div>
                <div class="flex-1">
                    <p class="font-medium text-gray-800">${contact.nom_personnalise || contact.nom}</p>
                    <p class="text-sm text-gray-500">${contact.telephone}</p>
                </div>
                ${contact.favori ? '<i class="fa-solid fa-star text-yellow-500 text-sm"></i>' : ''}
            `;
 
            contactDiv.addEventListener("click", (e) => {
                if (e.target.type !== "checkbox") {
                    const checkbox = contactDiv.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });

            const checkbox = contactDiv.querySelector('input[type="checkbox"]');
            checkbox.addEventListener("change", () => {
                mettreAJourCompteur();
            });

            listeContacts.appendChild(contactDiv);
        });
  
        function mettreAJourCompteur() {
            const nombreSelectionnes = document.querySelectorAll('.contact-checkbox:checked').length;
            const compteurSpan = document.getElementById('nombreSelectionnes');
            const compteurDiv = document.getElementById('compteurContacts');
            
            if (compteurSpan) {
                compteurSpan.textContent = nombreSelectionnes;
            }
             
            if (compteurDiv) {
                if (nombreSelectionnes >= 2) {
                    compteurDiv.className = "mb-3 p-2 bg-green-50 rounded-md text-sm text-green-700";
                } else {
                    compteurDiv.className = "mb-3 p-2 bg-blue-50 rounded-md text-sm text-blue-700";
                }
            }
        }
        
    } catch (error) {
        console.error("Erreur lors du chargement des contacts:", error);
    }
}



function filtrerContacts(terme) {
    const contacts = document.querySelectorAll('.contact-item');
    const termeNormalise = terme.toLowerCase().trim();
    
    contacts.forEach(contact => {
        const nom = contact.dataset.nom;
        const telephone = contact.dataset.telephone;
        
        if (nom.includes(termeNormalise) || telephone.includes(termeNormalise)) {
            contact.style.display = 'flex';
        } else {
            contact.style.display = 'none';
        }
    });
}


async function gererAjoutGroupe(formulaire, popup) {
    const messageErreur = popup.querySelector("#messageErreurGroupe");
    const messageSucces = popup.querySelector("#messageSuccesGroupe");
    const texteErreur = popup.querySelector("#texteErreurGroupe");
    const confirmerBtn = popup.querySelector("#confirmerAjoutGroupe");
    
    messageErreur?.classList.add("hidden");
    messageSucces?.classList.add("hidden");
    
    const formData = new FormData(formulaire);
    const nomGroupe = formData.get('nom')?.trim();
    
    if (!nomGroupe) {
        afficherErreurGroupe("Le nom du groupe est obligatoire.", messageErreur, texteErreur);
        return;
    }
      
    const contactsSelectionnes = formulaire.querySelectorAll('input[name="membresGroupe"]:checked');
    if (contactsSelectionnes.length < 2) {  
        afficherErreurGroupe("Veuillez sélectionner au moins 2 contacts pour créer un groupe.", messageErreur, texteErreur);
        return;
    }
    
    confirmerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Création en cours...';
    confirmerBtn.disabled = true;
     
    
    try {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte'));
        if (!utilisateurConnecte) {
            throw new Error("Aucun utilisateur connecté trouvé");
        }
        
        const maintenant = new Date().toISOString();
        const nouveauGroupe = {
            id: `group_${Date.now()}`,
            nom: nomGroupe,
            description: formData.get('description')?.trim() || "",
            photo_groupe: await genererPhotoGroupe(formData.get('photo'), nomGroupe),
            createur: utilisateurConnecte.id,
            date_creation: maintenant,
            date_ajout: maintenant,
            membres: recupererMembresSelectionnes(formulaire, utilisateurConnecte),
            parametres: {
                seuls_admins_modifient_infos: formData.get('seulsAdminsModifient') === 'on',
                seuls_admins_envoient_messages: false,
                approuver_nouveaux_membres: formData.get('approuverNouveauxMembres') === 'on'
            }
        };
        
        await sauvegarderGroupe(nouveauGroupe);
        
        // Mettre à jour l'utilisateur
        utilisateurConnecte.groupes_membre = utilisateurConnecte.groupes_membre || [];
        utilisateurConnecte.groupes_membre.push(nouveauGroupe.id);
        localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateurConnecte));
        await sauvegarderUtilisateur(utilisateurConnecte);
        
        messageSucces?.classList.remove("hidden");
        
        setTimeout(() => {
            popup.remove();
            
            if (typeof window.rafraichirContactsGroupes === 'function') {
                window.rafraichirContactsGroupes();
            }
        }, 2000);
        
    } catch (error) {
        console.error("Erreur lors de la création du groupe:", error);
        afficherErreurGroupe(error.message || "Erreur lors de la création", messageErreur, texteErreur);
    } finally {
        confirmerBtn.innerHTML = '<i class="fa-solid fa-people-group mr-2"></i>Créer le groupe';
        confirmerBtn.disabled = false;
    }
}

async function sauvegarderGroupe(groupe) {
    try {
        const response = await fetch('http://localhost:3001/groupes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupe)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde du groupe');
        }
        
        console.log('Groupe sauvegardé avec succès');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du groupe:', error);
        throw error;
    }
}

async function sauvegarderUtilisateur(utilisateur) {
    try {
        const response = await fetch(`http://localhost:3001/utilisateurs/${utilisateur.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(utilisateur)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde de l\'utilisateur');
        }
        
        console.log('Utilisateur sauvegardé avec succès');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
        throw error;
    }
}

function convertirImageEnBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function genererPhotoGroupeParDefaut(nomGroupe) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
    
    const couleurs = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const couleur = couleurs[Math.floor(Math.random() * couleurs.length)];
    
    ctx.fillStyle = couleur;
    ctx.fillRect(0, 0, 100, 100);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const initiales = nomGroupe.split(' ')
        .map(mot => mot[0])
        .join('')
        .toUpperCase();
    
    ctx.fillText(initiales.substring(0, 2), 50, 50);
    
    return canvas.toDataURL();
}

function afficherErreurGroupe(message, messageDiv, texteDiv) {
    texteDiv.textContent = message;
    messageDiv.classList.remove("hidden");
}

function rafraichirAffichageGroupes() {
    console.log("Rafraîchissement de l'affichage des groupes...");
}

export function ouvrirPopupAjoutGroupe() {
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte'));
    if (!utilisateurConnecte) {
        alert('Vous devez être connecté pour créer un groupe. Veuillez vous reconnecter.');
        return;
    }
    
    if (document.getElementById('popupAjoutGroupe')) {
        return;
    }
    
   
    testerDonneesUtilisateur();
    
    const popupExistant = document.getElementById('popupAjoutGroupe');
    if (popupExistant) {
        console.log("Popup déjà ouvert");
        return;
    }
    
    console.log("Création du popup...");  
    
    const popup = AjoutGroupePopup();
    document.body.appendChild(popup);
     
    setTimeout(() => {
        popup.classList.add('opacity-100');
        popup.style.opacity = '1';
    }, 10);
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('opacity-100');
    }, 10);
}


 function recupererMembresSelectionnes(formulaire, utilisateurConnecte) {
    const checkboxesSelectionnes = formulaire.querySelectorAll('input[name="membresGroupe"]:checked');
    console.log("Checkboxes sélectionnées:", checkboxesSelectionnes.length);
    
    const membresSelectionnes = Array.from(checkboxesSelectionnes).map(checkbox => {
        console.log("Checkbox value:", checkbox.value);
        return checkbox.value;
    });
    
    const membresDuGroupe = [{
        utilisateur_id: utilisateurConnecte.id,
        role: "admin",
        date_ajout: new Date().toISOString(),
        ajoute_par: utilisateurConnecte.id
    }];

    membresSelectionnes.forEach(contactId => {
        console.log("Recherche du contact avec ID:", contactId);
        console.log("Liste des contacts disponibles:", utilisateurConnecte.liste_contacts?.map(c => ({id: c.id, nom: c.nom})));
        
        const contact = utilisateurConnecte.liste_contacts?.find(c => 
            c.id === contactId || c.id === parseInt(contactId)
        );
        
        if (contact) {
            console.log("Contact trouvé:", contact.nom);
            membresDuGroupe.push({
                utilisateur_id: contact.id,
                role: "membre", 
                date_ajout: new Date().toISOString(),
                ajoute_par: utilisateurConnecte.id
            });
        } else {
            console.warn(`Contact avec ID ${contactId} non trouvé dans:`, utilisateurConnecte.liste_contacts);
        }
    });

    console.log("Membres finaux du groupe:", membresDuGroupe);
    return membresDuGroupe;
}



function testerDonneesUtilisateur() {
    const utilisateurConnecte = JSON.parse(localStorage.getItem("utilisateurConnecte"));
    console.log("=== TEST DES DONNÉES UTILISATEUR ===");
    console.log("Utilisateur:", utilisateurConnecte);
    console.log("Nombre de contacts:", utilisateurConnecte?.liste_contacts?.length || 0);
    console.log("Contacts:", utilisateurConnecte?.liste_contacts);
    console.log("===============================");
}
async function genererPhotoGroupe(photoFile, nomGroupe) {
    if (photoFile && photoFile.size > 0) {
        return await convertirImageEnBase64(photoFile);
    }
    return genererPhotoGroupeParDefaut(nomGroupe);
}

