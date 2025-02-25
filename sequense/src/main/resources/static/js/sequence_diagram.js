// Ajouter dynamiquement un acteur
document.getElementById("addActor").addEventListener("click", function () {
    const actorHTML = `
        <div class="actor-entry">
            <input type="text" name="actorName" class="actor-input" placeholder="Ex : Utilisateur" required>
            <select name="actorType" class="actor-type">
                <option value="actor">Acteur</option>
                <option value="object">Objet</option>
                <!--<option value="package">Paquetage</option>-->
            </select>
            <button type="button" class="btn-danger" onclick="this.parentElement.remove()">🗑 Supprimer</button>
        </div>`;
    document.getElementById("actorsContainer").insertAdjacentHTML("beforeend", actorHTML);
});

// Ajouter dynamiquement un message
document.getElementById("addMessage").addEventListener("click", function () {
    const messageHTML = `
        <div class="message-entry">
            <input type="text" name="sender" placeholder="Expéditeur (Ex : Utilisateur)" required>
            <input type="text" name="receiver" placeholder="Destinataire (Ex : Système)" required>
            <input type="text" name="messageText" placeholder="Message (Ex : Connexion)" required>
            <select name="messageType" class="message-type">
                <option value="sync">Synchrone</option>
                <option value="async">Asynchrone</option>
                <option value="return">Retour</option>
                <option value="create">Création</option>
                <option value="destroy">Destruction</option>
            </select>
            <button type="button" class="btn-danger" onclick="this.parentElement.remove()">🗑 Supprimer</button>
        </div>`;
    document.getElementById("messagesContainer").insertAdjacentHTML("beforeend", messageHTML);
});

// Ajouter dynamiquement un fragment avec un champ pour les messages
document.getElementById("addFragment").addEventListener("click", function () {
    const fragmentHTML = `
        <div class="fragment-entry">
            <select name="fragmentType">
                <option value="loop">Boucle</option>
                <option value="alt">Alternative</option>
            </select>
            <input type="text" name="fragmentCondition" placeholder="Condition">
            
            <!-- Conteneur pour les messages du fragment -->
            <div class="fragment-messages">
                <label>Messages :</label>
                <div class="messagesContainer"></div>
                <button type="button" class="btn-secondary addMessageToFragment">➕ Ajouter un message</button>
            </div>
            
            <button type="button" class="btn-danger" onclick="this.parentElement.remove()">🗑 Supprimer</button>
        </div>`;
    document.getElementById("fragmentsContainer").insertAdjacentHTML("beforeend", fragmentHTML);
});

// Gestion de l'ajout de messages dans un fragment
document.getElementById("fragmentsContainer").addEventListener("click", function (event) {
    if (event.target.classList.contains("addMessageToFragment")) {
        const messagesContainer = event.target.previousElementSibling;
        const messageHTML = `
            <div class="message-entry">
                <input type="text" name="sender" placeholder="Expéditeur (Ex : Utilisateur)" required>
                <input type="text" name="receiver" placeholder="Destinataire (Ex : Système)" required>
                <input type="text" name="messageText" placeholder="Message (Ex : Connexion)" required>
                <select name="messageType" class="message-type">
                    <option value="sync">Synchrone</option>
                    <option value="async">Asynchrone</option>
                    <option value="return">Retour</option>
                    <option value="create">Création</option>
                    <option value="destroy">Destruction</option>
                </select>
                <button type="button" class="btn-danger" onclick="this.parentElement.remove()">🗑 Supprimer</button>
            </div>`;
        messagesContainer.insertAdjacentHTML("beforeend", messageHTML);
    }
});

// Génération du diagramme
document.getElementById("convertSequenceDiagram").addEventListener("click", async function () {
    const data = {
        actors: [],
        messages: [],
        fragments: []
    };

    // Collecte des acteurs
    document.querySelectorAll("#actorsContainer .actor-entry").forEach(actor => {
        const name = actor.querySelector("input[name='actorName']").value.trim();
        const type = actor.querySelector("select[name='actorType']").value;
        if (name) {
            data.actors.push({ name, type });
        }
    });

    // Collecte des messages
    document.querySelectorAll("#messagesContainer .message-entry").forEach(message => {
        const sender = message.querySelector("input[name='sender']").value.trim();
        const receiver = message.querySelector("input[name='receiver']").value.trim();
        const text = message.querySelector("input[name='messageText']").value.trim();
        const type = message.querySelector("select[name='messageType']").value;
        if (sender && receiver && text) {
            data.messages.push({ sender, receiver, text, type });
        }
    });

    // Collecte des fragments avec leurs messages
    document.querySelectorAll("#fragmentsContainer .fragment-entry").forEach(fragment => {
        const type = fragment.querySelector("select[name='fragmentType']").value;
        const condition = fragment.querySelector("input[name='fragmentCondition']").value.trim();

        // Collecte des messages du fragment
        const fragmentMessages = [];
        fragment.querySelectorAll(".messagesContainer .message-entry").forEach(message => {
            const sender = message.querySelector("input[name='sender']").value.trim();
            const receiver = message.querySelector("input[name='receiver']").value.trim();
            const text = message.querySelector("input[name='messageText']").value.trim();
            const type = message.querySelector("select[name='messageType']").value;
            if (sender && receiver && text) {
                fragmentMessages.push({ sender, receiver, text, type });
            }
        });

        data.fragments.push({ type, condition, messages: fragmentMessages });
    });

    // Envoyer les données au serveur
    try {
        const response = await fetch("/sequence/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.text();
        document.getElementById("svgDiagram").innerHTML = result;

        // Activer le bouton de téléchargement
        document.getElementById("downloadDiagram").style.display = "inline-block";
    } catch (error) {
        console.error("Erreur lors de la génération du diagramme :", error);
    }
});

// Téléchargement du diagramme
document.getElementById("downloadDiagram").addEventListener("click", function () {
    const format = document.getElementById("exportFormat").value;
    const svgElement = document.getElementById("svgDiagram").querySelector("svg");

    if (!svgElement) {
        alert("Veuillez générer le diagramme avant de le télécharger !");
        return;
    }

    if (format === "svg") {
        downloadSVG(svgElement, "diagramme_sequence.svg");
    } else if (format === "png") {
        convertSvgToPng(svgElement, "diagramme_sequence.png");
    }
});

function downloadSVG(svgElement, filename) {
    const serializer = new XMLSerializer();
    const svgBlob = new Blob([serializer.serializeToString(svgElement)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
document.getElementById("downloadXML").addEventListener("click", function () {
    window.location.href = "/sequence/download/xml";
});


function convertSvgToPng(svgElement, filename) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(blob => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, "image/png");
    };
    img.src = url;
}
// Gestion du zoom et du drag & drop
const svgContainer = document.getElementById("svgDiagram");

let isPanning = false;
let startPoint = { x: 0, y: 0 };
let transform = { x: 0, y: 0, scale: 1 };

// Appliquer les transformations (zoom et déplacement)
function applyTransform() {
    svgContainer.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;
}

// Gestion du zoom avec la molette
svgContainer.addEventListener("wheel", (event) => {
    event.preventDefault();
    const zoomSpeed = 0.1; // Vitesse du zoom
    const scaleDelta = event.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    transform.scale = Math.min(Math.max(0.5, transform.scale + scaleDelta), 5); // Limiter le zoom
    applyTransform();
});

// Gestion du drag & drop
svgContainer.addEventListener("mousedown", (event) => {
    isPanning = true;
    startPoint = { x: event.clientX - transform.x, y: event.clientY - transform.y };
    svgContainer.style.cursor = "grabbing";
});

svgContainer.addEventListener("mousemove", (event) => {
    if (!isPanning) return;
    transform.x = event.clientX - startPoint.x;
    transform.y = event.clientY - startPoint.y;
    applyTransform();
});

svgContainer.addEventListener("mouseup", () => {
    isPanning = false;
    svgContainer.style.cursor = "default";
});

svgContainer.addEventListener("mouseleave", () => {
    isPanning = false;
    svgContainer.style.cursor = "default";
});
