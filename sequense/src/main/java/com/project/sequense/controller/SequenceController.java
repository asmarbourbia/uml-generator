package com.project.sequense.controller;

import com.project.sequense.Service.SequenceService;
import com.project.sequense.model.SequenceRequest;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;

@RestController
@RequestMapping("/sequence")
public class SequenceController {
    private final SequenceService sequenceService;

    public SequenceController(SequenceService sequenceService) {
        this.sequenceService = sequenceService;
    }

    @PostMapping("/generate")  // Accepte uniquement POST
    public ResponseEntity<String> generateSequenceDiagram(@RequestBody SequenceRequest request) {
        try {
            String svg = sequenceService.generateDiagram(request); // Génération du diagramme
            return ResponseEntity.ok(svg);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }

    // ✅ Endpoint pour télécharger le fichier XML généré
    @GetMapping("/download/xml")
    public ResponseEntity<Resource> downloadXMLFile() {
        try {
            File xmlFile = new File("src/main/resources/xml/sequence_diagram.xml");

            if (!xmlFile.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Resource resource = new FileSystemResource(xmlFile);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sequence_diagram.xml")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
