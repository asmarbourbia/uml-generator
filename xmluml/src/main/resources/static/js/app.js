let classCount = 0;

// Ajouter une classe ou interface dynamiquement
document.getElementById("addClass").addEventListener("click", function () {
    classCount++;
    const classHTML = `
        <div class="class-container" id="class-${classCount}">
            <h3>Classe ou Interface ${classCount}</h3>
            <label>Nom : <span class="required">*</span></label>
            <input type="text" name="className" placeholder="Ex: Person" required>
            <label>Type : <span class="required">*</span></label>
            <select name="classType" required>
                <option value="" disabled selected>Choisir le type</option>
                <option value="concrete">Concrète</option>
                <option value="abstract">Abstraite</option>
                <option value="interface">Interface</option>
            </select>

            <h4>Attributs</h4>
            <div class="attributes"></div>
            <button type="button" class="btn" onclick="addAttribute(${classCount})">Ajouter un Attribut</button>

            <h4>Méthodes</h4>
            <div class="methods"></div>
            <button type="button" class="btn" onclick="addMethod(${classCount})">Ajouter une Méthode</button>

            <h4>Relations</h4>
            <div class="relations"></div>
            <button type="button" class="btn" onclick="addRelation(${classCount})">Ajouter une Relation</button>

            <button type="button" class="btn-danger" onclick="removeClass(${classCount})">Supprimer</button>
        </div>
    `;
    document.getElementById("classes").insertAdjacentHTML("beforeend", classHTML);
});

// Ajouter un attribut
function addAttribute(classId) {
    const container = document.querySelector(`#class-${classId} .attributes`);
    const attrHTML = `
        <div class="attribute">
            <label>Nom : <span class="required">*</span></label>
            <input type="text" name="attrName" placeholder="Ex: age" required>
            <label>Type : <span class="required">*</span></label>
            <input type="text" name="attrType" placeholder="Ex: int" required>
            <label>Visibilité : <span class="required">*</span></label>
            <select name="attrVisibility" required>
                <option value="" disabled selected>Choisir</option>
                <option value="-">Privé (-)</option>
                <option value="~">Protégé (~)</option>
                <option value="+">Public (+)</option>
            </select>
            <label>Static :</label>
            <input type="checkbox" name="isStatic">
            <label>Final :</label>
            <input type="checkbox" name="isFinal">
            <label>Initialisation :</label>
            <input type="text" name="attrInit" placeholder="Ex: 0">
            <button type="button" class="btn-danger" onclick="this.parentElement.remove()">Supprimer</button>
        </div>
    `;
    container.insertAdjacentHTML("beforeend", attrHTML);
}

// Ajouter une méthode
function addMethod(classId) {
    const container = document.querySelector(`#class-${classId} .methods`);
    const methodHTML = `
        <div class="method">
            <label>Nom : <span class="required">*</span></label>
            <input type="text" name="methodName" placeholder="Ex: getName" required>
            <label>Type de Retour : <span class="required">*</span></label>
            <input type="text" name="methodReturnType" placeholder="Ex: String" required>
            <label>Visibilité : <span class="required">*</span></label>
            <select name="methodVisibility" required>
                <option value="" disabled selected>Choisir</option>
                <option value="-">Privé (-)</option>
                <option value="~">Protégé (~)</option>
                <option value="+">Public (+)</option>
            </select>
            <label>Static :</label>
            <input type="checkbox" name="isStatic">
            <label>Abstract :</label>
            <input type="checkbox" name="isAbstract">
            <label>Default :</label>
            <input type="checkbox" name="isDefault">
            <label>Paramètres :</label>
            <input type="text" name="methodParams" placeholder="Ex: int x, String y">
            <button type="button" class="btn-danger" onclick="this.parentElement.remove()">Supprimer</button>
        </div>
    `;
    container.insertAdjacentHTML("beforeend", methodHTML);
}

// Ajouter une relation
function addRelation(classId) {
    const container = document.querySelector(`#class-${classId} .relations`);
    const relationHTML = `
        <div class="relation">
            <label>Nom de la Relation :</label>
            <input type="text" name="relationName" placeholder="Ex: owns">
            <label>Type de Relation :</label>
            <select name="relationType" required>
                <option value="" disabled selected>Choisir</option>
                <option value="inheritance">Héritage</option>
                <option value="association">Association</option>
                <option value="composition">Composition</option>
                <option value="aggregation">Agrégation</option>
                <option value="dependency">Dépendance</option>
                <option value="implementation">Implémentation</option>
            </select>
            <label>De :</label>
            <input type="text" name="fromClass" placeholder="Ex: Person">
            <label>À :</label>
            <input type="text" name="toClass" placeholder="Ex: Employee">
            <label>Multiplicité (De) :</label>
            <input type="text" name="multiplicityFrom" placeholder="Ex: 1..*">
            <label>Multiplicité (À) :</label>
            <input type="text" name="multiplicityTo" placeholder="Ex: 0..1">
            <label>Bidirectionnel :</label>
<input type="checkbox" name="isBidirectional" value="true"/>
            <button type="button" class="btn-danger" onclick="this.parentElement.remove()">Supprimer</button>
        </div>
    `;
    container.insertAdjacentHTML("beforeend", relationHTML);
}

//<label>Bidirectionnel :</label>
//<input type="checkbox" name="isBidirectional" value="true"/>

// Supprimer une classe
function removeClass(classId) {
    document.getElementById(`class-${classId}`).remove();
}

// Soumettre les données pour conversion en XML et SVG
document.getElementById("convertDiagram").addEventListener("click", async function () {
    const data = {
        classes: [],
        relationships: [],
        packages: []
    };

    // Collecter les classes
    document.querySelectorAll(".class-container").forEach(classContainer => {
        const className = classContainer.querySelector("input[name='className']").value.trim();
        const classType = classContainer.querySelector("select[name='classType']").value;

        if (!className || !classType) {
            alert("Nom et type de classe sont obligatoires !");
            return;
        }

        const classData = {
            name: className,
            type: classType,
            attributes: [],
            methods: []
        };

        // Collecter les attributs
        classContainer.querySelectorAll(".attribute").forEach(attr => {
            classData.attributes.push({
                name: attr.querySelector("input[name='attrName']").value.trim(),
                type: attr.querySelector("input[name='attrType']").value.trim(),
                visibility: attr.querySelector("select[name='attrVisibility']").value,
                isStatic: attr.querySelector("input[name='isStatic']").checked, // ✅ Corrigé
                isFinal: attr.querySelector("input[name='isFinal']").checked, // ✅ Corrigé
                initialization: attr.querySelector("input[name='attrInit']").value.trim() || null // ✅ Ajout d'une valeur par défaut
            });
        });

        // Collecter les méthodes
        classContainer.querySelectorAll(".method").forEach(method => {
            classData.methods.push({
                name: method.querySelector("input[name='methodName']")?.value.trim() || "",  // Vérifie l'existence
                returnType: method.querySelector("input[name='methodReturnType']")?.value.trim() || "",
                visibility: method.querySelector("select[name='methodVisibility']")?.value || "public", // Par défaut `public`
                isStatic: method.querySelector("input[name='isStatic']")?.checked || false,
                isAbstract: method.querySelector("input[name='isAbstract']")?.checked || false,
                isDefault: method.querySelector("input[name='isDefault']")?.checked || false,
                params: method.querySelector("input[name='methodParams']")?.value.trim() || ""
            });
        });


        data.classes.push(classData);
    });
    /*let isValid = true;

    document.querySelectorAll(".relation").forEach(rel => {
        const from = rel.querySelector("input[name='fromClass']").value.trim();
        const to = rel.querySelector("input[name='toClass']").value.trim();
        const type = rel.querySelector("select[name='relationType']").value;

        // Validation des champs obligatoires
        if (!from || !to || !type) {
            isValid = false;

            // Ajout de classe CSS d'erreur (optionnel)
            if (!from) rel.querySelector("input[name='fromClass']").classList.add("error");
            if (!to) rel.querySelector("input[name='toClass']").classList.add("error");
            if (!type) rel.querySelector("select[name='relationType']").classList.add("error");

            return; // Passe à la prochaine relation
        }

        // Ajout de la relation
        data.relationships.push({
            name: rel.querySelector("input[name='relationName']").value.trim(),
            type,
            from,
            to,
            isBidirectional: rel.querySelector("input[name='isBidirectional']").checked
        });
    });

    // Si une relation est invalide, interrompre le processus
    if (!isValid) {
        alert("Veuillez corriger les erreurs dans les relations avant de continuer !");
        return;
    }

    // Log des données envoyées
    console.log("Données envoyées :", JSON.stringify(data, null, 2));
    */
    // Collecter les relations
    // Collecter les relations
    document.querySelectorAll(".relation").forEach(rel => {
        const from = rel.querySelector("input[name='fromClass']").value.trim();
        const to = rel.querySelector("input[name='toClass']").value.trim();
        const type = rel.querySelector("select[name='relationType']").value;

        const isBidirectionalElement = rel.querySelector("input[name='isBidirectional']");
        const isBidirectional = isBidirectionalElement ? isBidirectionalElement.checked : false;

        const multiplicityFrom = rel.querySelector("input[name='multiplicityFrom']").value.trim();
        const multiplicityTo = rel.querySelector("input[name='multiplicityTo']").value.trim();

        console.log("Relation collectée :", {from, to, type, isBidirectional, multiplicityFrom, multiplicityTo});

        data.relationships.push({
            name: rel.querySelector("input[name='relationName']").value.trim(),
            type,
            from,
            to,
            isBidirectional,  // ✅ Corrigé
            multiplicityFrom,
            multiplicityTo
        });
    });



    console.log("Données envoyées :", JSON.stringify(data, null, 2));
    /**
     * Convertir un SVG en PNG et proposer le téléchargement
     */
    function convertSvgToPng(svgElement, fileName) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Convertir le contenu du canvas en PNG
            canvas.toBlob(function (blob) {
                const pngUrl = URL.createObjectURL(blob);
                const downloadButton = document.getElementById("downloadDiagram");
                downloadButton.href = pngUrl;
                downloadButton.download = fileName || "diagramme.png";

                // Libérer l'URL après téléchargement
                downloadButton.addEventListener("click", () => {
                    setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
                });
            }, "image/png");
        };
        img.src = url;
    }


    // Envoi des données au backend
    try {
        const response = await fetch("/uml/generate", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Erreur de génération du SVG");

        const svg = (await response.text()).trim();
        console.log("SVG généré :", svg);

        // Afficher le SVG dans la page
        const svgContainer = document.getElementById("svgDiagram");
        svgContainer.innerHTML = svg;

        // Récupérer le format choisi
        const exportFormat = document.getElementById("exportFormat").value;

// Trouver l'élément SVG généré
        const svgElement = svgContainer.querySelector("svg");

        if (exportFormat === "svg") {
            // Créer un fichier SVG
            const blob = new Blob([svg], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);

            const downloadButton = document.getElementById("downloadDiagram");
            downloadButton.href = url;
            downloadButton.download = "diagramme.svg";

            // Libérer l'URL après téléchargement
            downloadButton.addEventListener("click", () => {
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            });
        } else if (exportFormat === "png" && svgElement) {
            // Convertir le SVG en PNG
            convertSvgToPng(svgElement, "diagramme.png");
        }


    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de la génération du diagramme !");
    }
});
// Gestion du zoom et du drag & drop
const svgContainer = document.getElementById("svgDiagram");

let isPanning = false;
let startPoint = { x: 0, y: 0 };
let transform = { x: 0, y: 0, scale: 1 };

function applyTransform() {
    svgContainer.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;
}

svgContainer.addEventListener("wheel", (event) => {
    event.preventDefault();
    const zoomSpeed = 0.1;
    const scaleDelta = event.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    transform.scale = Math.min(Math.max(0.5, transform.scale + scaleDelta), 5);
    applyTransform();
});
document.getElementById("downloadClassXML").addEventListener("click", function () {
    window.location.href = "/uml/download/xml";
});

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