package com.project.xmluml.controller;

import com.project.xmluml.model.UMLRequest;
import com.project.xmluml.Service.UMLService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;

@RestController
@RequestMapping("/uml")
public class UMLController {

    private static final Logger logger = LoggerFactory.getLogger(UMLController.class);
    private final UMLService umlService;

    public UMLController(UMLService umlService) {
        this.umlService = umlService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateDiagram(@RequestBody UMLRequest umlRequest) {
        try {
            // Log des classes et relations reçues
            logger.info("Requête reçue : Classes - {}, Relations - {}",
                    umlRequest.getClasses(),
                    umlRequest.getRelationships());

            // Appeler le service UML pour générer le diagramme
            ResponseEntity<String> result = umlService.generateDiagram(umlRequest);

            // Retourner directement la réponse générée par le service
            return result;
        } catch (Exception e) {
            // Gérer les exceptions et logger les erreurs
            logger.error("Erreur lors de la génération du diagramme", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur : " + e.getMessage());
        }
    }

    // ✅ **Nouvel endpoint pour télécharger le fichier XML**
    @GetMapping("/download/xml")
    public ResponseEntity<Resource> downloadXMLFile() {
        try {
            File xmlFile = new File("src/main/resources/xml/uml_classes.xml");

            if (!xmlFile.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Resource resource = new FileSystemResource(xmlFile);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=uml_classes.xml")
                    .body(resource);

        } catch (Exception e) {
            logger.error("Erreur lors du téléchargement du fichier XML", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
