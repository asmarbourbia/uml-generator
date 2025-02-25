package com.project.xmluml.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Getter
@Setter
@Data
@JsonRootName("umlClass")
public class UMLClass {
    private String name;
    private String type; // concrete, abstract, interface
    private String packageName; // Ajout du package
    private List<Attribute> attributes;
    private List<Method> methods;
    private List<Relation> relations;

    @Data
    public static class Attribute {
        private String name;
        private String type;
        private String visibility; // +, -, ~
        @JsonProperty("isStatic")
        private boolean isStatic;
        @JsonProperty("isFinal")
        private boolean isFinal;
        private String initialization;
    }

    @Data
    public static class Method {
        private String name;
        private String returnType;
        private String visibility;// +, -, ~
        @JsonProperty("isStatic")
        private boolean isStatic;
        @JsonProperty("isAbstract")
        private boolean isAbstract;
        @JsonProperty("isDefault")
        private boolean isDefault;
        private String params; // Liste des paramètres
    }

    @Data
    public static class Relation {
        private String name; // Nom de la relation
        private String type; // inheritance, association, etc.
        private String from;
        private String to;
        @JsonProperty("isBidirectional")
        private boolean isBidirectional;
        private String multiplicityFrom; // Cardinalité côté "from"
        private String multiplicityTo;   // Cardinalité côté "to"
    }
}
