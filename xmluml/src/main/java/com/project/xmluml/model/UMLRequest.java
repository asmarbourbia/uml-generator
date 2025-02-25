package com.project.xmluml.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.management.relation.Relation;
import java.util.List;

public class UMLRequest {
    @JsonProperty("classes")
    private List<UMLClass> classes;

    @JsonProperty("relationships")
    private List<UMLClass.Relation> relationships;

    // Constructeur sans arguments
    public UMLRequest() {}

    // Getters et Setters
    public List<UMLClass> getClasses() {
        return classes;
    }

    public void setClasses(List<UMLClass> classes) {
        this.classes = classes;
    }

    public List<UMLClass.Relation> getRelationships() {
        return relationships;
    }

    public void setRelationships(List<UMLClass.Relation> relationships) {
        this.relationships = relationships;
    }
}
