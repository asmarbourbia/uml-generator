package com.project.xmluml.controller;
import com.project.xmluml.model.UMLClass;

import java.util.List;

public class UMLRequest {
    private List<UMLClass> classes;

    public List<UMLClass> getClasses() {
        return classes;
    }

    public void setClasses(List<UMLClass> classes) {
        this.classes = classes;
    }
}
