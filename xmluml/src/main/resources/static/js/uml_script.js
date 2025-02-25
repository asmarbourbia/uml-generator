function showPage(page) {
    let content = document.getElementById("content");
    if (page === "uml_home") {
        content.innerHTML = "<h2>🏠 Accueil</h2><p>Bienvenue sur UML Diagrammes, cliquez sur les liens du menu pour explorer.</p>";

    } else if (page === "uml-form") {
        content.innerHTML = "<h2>📐 Formulaire UML</h2><p>Créez et modifiez vos diagrammes UML ici...</p>";
    } else if (page === "sequence-form") {
        content.innerHTML = "<h2>🎬 Formulaire de Séquence</h2><p>Créez un diagramme de séquence facilement...</p>";
    }
}
