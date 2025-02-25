package com.project.sequense.Service;
import com.project.sequense.model.SequenceRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@Service
public class SequenceService {

    private static final Logger logger = LoggerFactory.getLogger(SequenceService.class);

    public String generateDiagram(SequenceRequest request) throws Exception {
        try {
            // Étape 1 : Générer le fichier XML
            File xmlFile = convertToXML(request);

            // Étape 2 : Valider le fichier XML avec XSD
            if (!validateXML(xmlFile)) {
                logger.error("Validation XML échouée !");
                throw new Exception("Validation XML échouée avec XSD.");
            }

            // Étape 3 : Transformer le XML en SVG avec XSLT
            File svgFile = transformXMLToSVG(xmlFile);

            logger.info("Diagramme SVG de séquence généré avec succès : {}", svgFile.getAbsolutePath());
            return Files.readString(svgFile.toPath(), StandardCharsets.UTF_8);

        } catch (Exception e) {
            logger.error("Erreur lors de la génération du diagramme de séquence : {}", e.getMessage(), e);
            throw new Exception("Erreur lors de la génération du diagramme de séquence.", e);
        }
    }

    public File convertToXML(SequenceRequest request) throws Exception {
        try {
            logger.info("Début de la conversion des données en fichier XML.");
            File xmlFile = new File("src/main/resources/xml/sequence_diagram.xml");

            StringBuilder xmlBuilder = new StringBuilder();
            xmlBuilder.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
            xmlBuilder.append("<sequenceDiagram>\n");

            // Ajouter les acteurs
            xmlBuilder.append("  <actors>\n");
            for (SequenceRequest.Actor actor : request.getActors()) {
                xmlBuilder.append("    <actor name=\"").append(escapeXML(actor.getName())).append("\"");
                if (actor.getType() != null) { // Vérifie si le type est spécifié
                    xmlBuilder.append(" type=\"").append(escapeXML(actor.getType())).append("\"");
                }
                xmlBuilder.append("/>\n");
            }
            xmlBuilder.append("  </actors>\n");

            // Ajouter les messages
            xmlBuilder.append("  <messages>\n");
            if (request.getMessages() != null && !request.getMessages().isEmpty()) { // Vérifie si des messages sont présents
                for (SequenceRequest.Message message : request.getMessages()) {
                    xmlBuilder.append("    <message sender=\"").append(escapeXML(message.getSender())).append("\" ")
                            .append("receiver=\"").append(escapeXML(message.getReceiver())).append("\" ")
                            .append("text=\"").append(escapeXML(message.getText())).append("\"");
                    if (message.getType() != null) { // Vérifie si le type est spécifié
                        xmlBuilder.append(" type=\"").append(escapeXML(message.getType())).append("\"");
                    }
                    xmlBuilder.append("/>\n");
                }
            } else {
                logger.warn("Aucun message trouvé dans la requête. Ajout d'un message vide par défaut.");
                // Ajouter un message par défaut pour éviter les erreurs de validation
                xmlBuilder.append("    <message sender=\"undefined\" receiver=\"undefined\" text=\"undefined\"/>\n");
            }
            xmlBuilder.append("  </messages>\n");

            // Ajouter les fragments
            if (request.getFragments() != null && !request.getFragments().isEmpty()) {
                xmlBuilder.append("  <fragments>\n");
                for (SequenceRequest.Fragment fragment : request.getFragments()) {
                    xmlBuilder.append("    <fragment type=\"").append(escapeXML(fragment.getType())).append("\"");
                    if (fragment.getCondition() != null) { // Vérifie si une condition est spécifiée
                        xmlBuilder.append(" condition=\"").append(escapeXML(fragment.getCondition())).append("\"");
                    }
                    xmlBuilder.append(">\n");

                    // Ajouter les messages du fragment
                    if (fragment.getMessages() != null && !fragment.getMessages().isEmpty()) {
                        for (SequenceRequest.Message fragmentMessage : fragment.getMessages()) {
                            xmlBuilder.append("      <message sender=\"").append(escapeXML(fragmentMessage.getSender())).append("\" ")
                                    .append("receiver=\"").append(escapeXML(fragmentMessage.getReceiver())).append("\" ")
                                    .append("text=\"").append(escapeXML(fragmentMessage.getText())).append("\"");
                            if (fragmentMessage.getType() != null) {
                                xmlBuilder.append(" type=\"").append(escapeXML(fragmentMessage.getType())).append("\"");
                            }
                            xmlBuilder.append("/>\n");
                        }
                    } else {
                        logger.warn("Aucun message trouvé dans le fragment. Ajout d'un message vide par défaut.");
                        // Ajouter un message par défaut pour éviter les erreurs de validation
                        xmlBuilder.append("      <message sender=\"undefined\" receiver=\"undefined\" text=\"undefined\"/>\n");
                    }

                    xmlBuilder.append("    </fragment>\n");
                }
                xmlBuilder.append("  </fragments>\n");
            }

            xmlBuilder.append("</sequenceDiagram>");

            Files.write(xmlFile.toPath(), xmlBuilder.toString().getBytes(StandardCharsets.UTF_8));
            logger.info("Fichier XML généré avec succès : {}", xmlFile.getAbsolutePath());
            return xmlFile;

        } catch (Exception e) {
            logger.error("Erreur lors de la génération du fichier XML : {}", e.getMessage(), e);
            throw new Exception("Erreur lors de la génération du fichier XML.", e);
        }
    }


    /**
     * Échappe les caractères spéciaux XML (&, <, >, ", ')
     */
    private String escapeXML(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }



    private boolean validateXML(File xmlFile) {
        try {
            logger.info("Début de la validation XML.");
            String xsdPath = "schema/sequence.xsd";
            javax.xml.validation.SchemaFactory factory = javax.xml.validation.SchemaFactory.newInstance(javax.xml.XMLConstants.W3C_XML_SCHEMA_NS_URI);
            javax.xml.validation.Schema schema = factory.newSchema(new StreamSource(new ClassPathResource(xsdPath).getInputStream()));
            javax.xml.validation.Validator validator = schema.newValidator();
            validator.validate(new StreamSource(xmlFile));
            logger.info("Validation XML réussie.");
            return true;

        } catch (Exception e) {
            logger.error("Erreur lors de la validation XML : {}", e.getMessage(), e);
            return false;
        }
    }

    private File transformXMLToSVG(File xmlFile) throws Exception {
        try {
            String xsltPath = "xslt/sequence.xslt";
            File svgFile = new File("src/main/resources/svg/sequence_diagram.svg");
            TransformerFactory factory = new net.sf.saxon.TransformerFactoryImpl();
            Transformer transformer = factory.newTransformer(new StreamSource(new ClassPathResource(xsltPath).getInputStream()));
            transformer.transform(new StreamSource(xmlFile), new StreamResult(svgFile));
            return svgFile;

        } catch (Exception e) {
            logger.error("Erreur lors de la transformation XML en SVG : {}", e.getMessage(), e);
            throw new Exception("Erreur lors de la transformation XML en SVG.", e);
        }
    }
}
