package com.project.sequense.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SequenceRequest {
    private List<Actor> actors;
    private List<Message> messages;
    private List<Fragment> fragments; // Ajout de fragments

    // Méthode pour récupérer les acteurs
    public List<Actor> getActors() {
        return actors;
    }

    // Méthode pour récupérer les messages
    public List<Message> getMessages() {
        return messages;
    }

    // Méthode pour récupérer les fragments
    public List<Fragment> getFragments() {
        return fragments;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Actor {
        private String name;
        private String type; // Ajout du type d'acteur

        // Méthodes de récupération pour les attributs
        public String getName() {
            return name;
        }

        public String getType() {
            return type;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String sender;
        private String receiver;
        private String text;
        private String type; // Ajout du type de message

        // Méthodes de récupération pour les attributs
        public String getSender() {
            return sender;
        }

        public String getReceiver() {
            return receiver;
        }

        public String getText() {
            return text;
        }

        public String getType() {
            return type;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Fragment {
        private String type; // Type du fragment (loop, alt, etc.)
        private String condition; // Condition optionnelle
        private List<Message> messages; // Messages à l'intérieur du fragment

        // Méthodes de récupération pour les attributs
        public String getType() {
            return type;
        }

        public String getCondition() {
            return condition;
        }

        public List<Message> getMessages() {
            return messages;
        }
    }
}
