// Ajouter dynamiquement un acteur
document.getElementById("addActor").addEventListener("click", function () {
    const actorHTML = `
        <div class="actor-entry">
            <input type="text" name="actorName" class="actor-input" placeholder="Ex : Utilisateur" required>
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
            <button type="button" class="btn-danger" onclick="this.parentElement.remove()">🗑 Supprimer</button>
        </div>`;
    document.getElementById("messagesContainer").insertAdjacentHTML("beforeend", messageHTML);
});

// Génération du diagramme
document.getElementById("convertSequenceDiagram").addEventListener("click", async function () {
    const data = {
        actors: [],
        messages: []
    };

    // Collecte des acteurs avec validation
    document.querySelectorAll("#actorsContainer .actor-input").forEach(actor => {
        const actorName = actor.value.trim();
        if (actorName) {
            data.actors.push({ name: actorName });
        }
    });

    // Collecte des messages avec validation
    document.querySelectorAll("#messagesContainer .message-entry").forEach(message => {
        const sender = message.querySelector("input[name='sender']").value.trim();
        const receiver = message.querySelector("input[name='receiver']").value.trim();
        const text = message.querySelector("input[name='messageText']").value.trim();

        if (sender && receiver && text) {
            data.messages.push({ sender, receiver, text });
        }
    });

    console.log("Données envoyées :", JSON.stringify(data));

    // Vérifier s'il y a au moins un acteur et un message avant d'envoyer
    if (data.actors.length === 0 || data.messages.length === 0) {
        alert("Ajoutez au moins un acteur et un message avant de générer le diagramme !");
        return;
    }

    // Envoyer les données au serveur
    try {
        const response = await fetch("/sequence/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.text();
        document.getElementById("svgDiagram").innerHTML = result;

        // Activer le bouton de téléchargement après génération
        document.getElementById("downloadDiagram").style.display = "inline-block";
    } catch (error) {
        console.error("Erreur lors de la génération du diagramme de séquence :", error);
    }
});

// Gestion du téléchargement du diagramme
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
