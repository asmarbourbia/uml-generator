package com.project.xmluml.Service;

import com.project.xmluml.model.UMLClass;
import com.project.xmluml.model.UMLRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.management.relation.Relation;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;

@Service
public class UMLService {

    private static final Logger logger = LoggerFactory.getLogger(UMLService.class);

    public ResponseEntity<String> generateDiagram(UMLRequest umlRequest) {
        try {



            logger.info("Classes reçues : {}", umlRequest.getClasses());
            logger.info("Relations reçues : {}", umlRequest.getRelationships());

            // Générer le fichier XML
            File xmlFile = convertToXML(umlRequest.getClasses(), umlRequest.getRelationships());

            // Valider le fichier XML avec XSD
            if (!validateXML(xmlFile)) {
                logger.error("Validation XML échouée !");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Validation XML échouée avec XSD.");
            }

            // Transformer le fichier XML en SVG
            File svgFile = transformXMLToSVG(xmlFile);

            logger.info("Diagramme SVG généré avec succès : {}", svgFile.getAbsolutePath());
            return ResponseEntity.ok(readSvgContent(svgFile));
        } catch (Exception e) {
            logger.error("Erreur lors de la génération du diagramme : {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la génération du diagramme : " + e.getMessage());
        }
    }

    private String readSvgContent(File svgFile) throws IOException {
        return new String(Files.readAllBytes(svgFile.toPath()), StandardCharsets.UTF_8);
    }

    private File convertToXML(List<UMLClass> classes, List<UMLClass.Relation> relationships) throws Exception {
        try {
            logger.info("Début de la conversion des données en fichier XML.");
            File xmlFile = new File("src/main/resources/xml/uml_classes.xml");
            logger.info("Fichier XML sera créé à l'emplacement : {}", xmlFile.getAbsolutePath());

            // Construction du fichier XML
            StringBuilder xmlBuilder = new StringBuilder();
            xmlBuilder.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
            xmlBuilder.append("<uml>\n");

            // Ajouter les classes
            xmlBuilder.append("  <classes>\n");
            for (UMLClass umlClass : classes) {
                xmlBuilder.append("    <class name=\"").append(umlClass.getName()).append("\" type=\"").append(umlClass.getType()).append("\">\n");

                // Ajouter les attributs
                if (umlClass.getAttributes() != null && !umlClass.getAttributes().isEmpty()) {
                    xmlBuilder.append("      <attributes>\n");
                    for (UMLClass.Attribute attribute : umlClass.getAttributes()) {
                        xmlBuilder.append("        <attribute visibility=\"").append(attribute.getVisibility()).append("\" name=\"").append(attribute.getName())
                                .append("\" type=\"").append(attribute.getType()).append("\" isStatic=\"").append(attribute.isStatic())
                                .append("\" isFinal=\"").append(attribute.isFinal()).append("\" initialization=\"")
                                .append(attribute.getInitialization() != null ? attribute.getInitialization() : "").append("\"/>\n");
                    }
                    xmlBuilder.append("      </attributes>\n");
                }

                // Ajouter les méthodes
                if (umlClass.getMethods() != null && !umlClass.getMethods().isEmpty()) {
                    xmlBuilder.append("      <methods>\n");
                    for (UMLClass.Method method : umlClass.getMethods()) {
                        xmlBuilder.append("        <method visibility=\"").append(method.getVisibility()).append("\" name=\"").append(method.getName())
                                .append("\" returnType=\"").append(method.getReturnType()).append("\" isStatic=\"").append(method.isStatic())
                                .append("\" isAbstract=\"").append(method.isAbstract()).append("\" isDefault=\"").append(method.isDefault()).append("\">\n");
                        if (method.getParams() != null && !method.getParams().isEmpty()) {
                            xmlBuilder.append("          <parameters>\n");
                            String[] params = method.getParams().split(",");
                            for (String param : params) {
                                String[] paramParts = param.trim().split(":");
                                if (paramParts.length == 2) {
                                    xmlBuilder.append("            <parameter name=\"").append(paramParts[0].trim()).append("\" type=\"").append(paramParts[1].trim()).append("\"/>\n");
                                }
                            }
                            xmlBuilder.append("          </parameters>\n");
                        }
                        xmlBuilder.append("        </method>\n");
                    }
                    xmlBuilder.append("      </methods>\n");
                }

                xmlBuilder.append("    </class>\n");
            }
            xmlBuilder.append("  </classes>\n");

            // Ajouter les relations
            xmlBuilder.append("  <relationships>\n");
            for (UMLClass.Relation relation : relationships) {
                if (relation.getType() != null && !relation.getType().isEmpty() &&
                        relation.getFrom() != null && !relation.getFrom().isEmpty() &&
                        relation.getTo() != null && !relation.getTo().isEmpty()) {

                    // Vérifiez si le type correspond à l'un des types définis dans le XSD
                    if (relation.getType().equalsIgnoreCase("association") ||
                            relation.getType().equalsIgnoreCase("inheritance") ||
                            relation.getType().equalsIgnoreCase("composition") ||
                            relation.getType().equalsIgnoreCase("aggregation") ||
                            relation.getType().equalsIgnoreCase("dependency") ||
                            relation.getType().equalsIgnoreCase("implementation")) {

                        xmlBuilder.append("    <").append(relation.getType())
                                .append(" from=\"").append(relation.getFrom()).append("\"")
                                .append(" to=\"").append(relation.getTo()).append("\"");

                        if (relation.getName() != null && !relation.getName().isEmpty()) {
                            xmlBuilder.append(" name=\"").append(relation.getName()).append("\"");
                        }

                        xmlBuilder.append(" isBidirectional=\"").append(relation.isBidirectional()).append("\"");

                        // Ajouter les cardinalités
                        if (relation.getMultiplicityFrom() != null && !relation.getMultiplicityFrom().isEmpty()) {
                            xmlBuilder.append(" multiplicityFrom=\"").append(relation.getMultiplicityFrom()).append("\"");
                        }
                        if (relation.getMultiplicityTo() != null && !relation.getMultiplicityTo().isEmpty()) {
                            xmlBuilder.append(" multiplicityTo=\"").append(relation.getMultiplicityTo()).append("\"");
                        }

                        xmlBuilder.append("/>\n");
                    } else {
                        logger.warn("Type de relation inconnu ou non supporté : {}", relation.getType());
                    }
                } else {
                    logger.warn("Relation ignorée pour cause de données manquantes : {}", relation);
                }
            }

            xmlBuilder.append("  </relationships>\n");

            xmlBuilder.append("</uml>");

            // Écriture du fichier XML
            Files.write(xmlFile.toPath(), xmlBuilder.toString().getBytes(StandardCharsets.UTF_8));
            logger.info("Fichier XML généré avec succès : {}", xmlFile.getAbsolutePath());
            return xmlFile;
        } catch (Exception e) {
            logger.error("Erreur lors de la génération du fichier XML : {}", e.getMessage(), e);
            throw new Exception("Erreur lors de la génération du fichier XML.", e);
        }
    }


    private boolean validateXML(File xmlFile) {
        try {
            logger.info("Début de la validation XML.");
            String xsdPath = "schema/uml_schema.xsd";

            ClassPathResource xsdResource = new ClassPathResource(xsdPath);
            if (!xsdResource.exists()) {
                throw new IOException("Le fichier XSD est introuvable.");
            }

            javax.xml.validation.SchemaFactory factory = javax.xml.validation.SchemaFactory.newInstance(javax.xml.XMLConstants.W3C_XML_SCHEMA_NS_URI);
            javax.xml.validation.Schema schema = factory.newSchema(new StreamSource(xsdResource.getInputStream()));
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
            String xsltPath = "xslt/uml_transform.xslt";
            File svgFile = new File("src/main/resources/svg/uml_diagram.svg");
            svgFile.getParentFile().mkdirs();

            ClassPathResource xsltResource = new ClassPathResource(xsltPath);
            TransformerFactory factory = new net.sf.saxon.TransformerFactoryImpl();
            Transformer transformer = factory.newTransformer(new StreamSource(xsltResource.getInputStream()));

            transformer.transform(new StreamSource(xmlFile), new StreamResult(svgFile));
            return svgFile;
        } catch (Exception e) {
            logger.error("Erreur lors de la transformation XML en SVG : {}", e.getMessage(), e);
            throw new Exception("Erreur lors de la transformation XML en SVG.", e);
        }
    }
}
