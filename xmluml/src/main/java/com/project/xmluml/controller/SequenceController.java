package com.project.xmluml.controller;

import com.project.xmluml.model.SequenceRequest;
import com.project.xmluml.Service.SequenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
