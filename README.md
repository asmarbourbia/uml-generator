# UML Generator

## 📌 Description du projet

UML Generator est une application permettant de **générer automatiquement des diagrammes UML** (diagrammes de classes et de séquences) à partir de **spécifications XML**. Ce projet combine **Spring Boot** pour le backend et une **interface web en HTML, CSS et JavaScript** pour la gestion et la visualisation des diagrammes en temps réel.

Le système transforme les fichiers XML en **diagrammes UML interactifs** via des transformations **XSLT**, permettant d’exporter les diagrammes sous format **SVG et PNG**.

## 🚀 Fonctionnalités principales

- **Édition dynamique des spécifications UML** via une interface web interactive.
- **Génération automatique** des **diagrammes de classes et de séquences** en **SVG ou PNG**.
- **Validation XML Schema** avant la transformation en diagramme UML.
- **Téléchargement des fichiers XML** pour sauvegarde ou modification ultérieure.
- **Zoom et navigation** dans les diagrammes générés.
- **Exportation en plusieurs formats** pour faciliter l'intégration dans d'autres outils.

## 🛠️ Technologies utilisées

### 🔹 Front-End
- **HTML, CSS, JavaScript** pour l'interface utilisateur.
- Gestion dynamique via JavaScript pour la création et modification des classes et relations.

### 🔹 Back-End
- **Java 17** avec **Spring Boot** pour le traitement des requêtes.
- **Transformation XSLT** pour générer les diagrammes à partir des fichiers XML.
- **Validation XML Schema** pour assurer la conformité des fichiers.

### 🔹 Autres Technologies
- **IntelliJ IDEA** comme environnement de développement.

---

## 📥 Installation et Exécution

### 🔹 Prérequis
- **Java 17** (Assurez-vous que `JAVA_HOME` est bien configuré)
- **Maven** (pour gérer les dépendances)
- **IntelliJ IDEA** (ou un autre IDE compatible Spring Boot)
### 🔹 Les URLS
- **La pages HOME**http://localhost:61822/xmluml/static/uml_home.html?_ijt=clqdvbl24f0utvib85n487qrn5&_ij_reload=RELOAD_ON_SAVE .
- **diagrammes de classes**http://localhost:8084 .
- **diagrammes de séquences**http://localhost:8085/sequence_diagram.html .
### 🔹 Clonage du projet
```sh
git clone https://github.com/asmarbourbia/uml-generator.git
cd uml-generator
