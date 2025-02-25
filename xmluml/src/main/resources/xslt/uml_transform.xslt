<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="xml" indent="yes" />
    <xsl:template match="/">
        <!-- Début du fichier SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1600" font-family="Arial" font-size="14">
            <defs>
                <!-- Styles des flèches pour les relations -->
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                </marker>
                <marker id="inheritanceArrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                    <polygon points="0 0, 10 5, 0 10" fill="none" stroke="black" />
                </marker>
                <marker id="diamond" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                    <polygon points="0 5, 5 0, 10 5, 5 10, 0 5" fill="none" stroke="black" />
                </marker>
                <marker id="filledDiamond" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                    <polygon points="0 5, 5 0, 10 5, 5 10, 0 5" fill="black" />
                </marker>
                <!-- Nouveau style pour implementation /implementation -->
                <marker id="realizationArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="white" stroke="black" />
                </marker>
                <!-- Nouveau style pour dependency -->
                <marker id="dependencyArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="none" stroke="black" />
                </marker>
                <marker id="noArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="" fill="none" stroke="none"/>
                </marker>
            </defs>

            <!-- Générer des rectangles pour les classes -->
            <xsl:for-each select="uml/classes/class">
                <xsl:variable name="classIndex" select="position()" />
                <xsl:variable name="posX" select="(($classIndex - 1) mod 4) * 300 + 50" />
                <xsl:variable name="posY" select="floor(($classIndex - 1) div 4) * 200 + 50" />

                <!-- Rectangle pour la classe -->
                <rect x="{$posX}" y="{$posY}" width="250" height="150" fill="lightblue" stroke="black" />

                <!-- Texte pour le nom de la classe -->
                <text x="{$posX + 125}" y="{$posY + 20}" text-anchor="middle">
                    <xsl:choose>
                        <!-- Si la classe est une interface -->
                        <xsl:when test="@type='interface'">
                            <xsl:value-of select="'&lt;&lt;interface&gt;&gt;'" />

                            <xsl:value-of select="@name" />
                        </xsl:when>

                        <!-- Si la classe est abstraite, elle est en italique -->
                        <xsl:when test="@type='abstract'">
                            <xsl:attribute name="font-style">italic</xsl:attribute>
                            <xsl:value-of select="@name" />
                        </xsl:when>

                        <!-- Sinon, affichage normal -->
                        <xsl:otherwise>
                            <xsl:value-of select="@name" />
                        </xsl:otherwise>
                    </xsl:choose>
                </text>

                <!-- Ligne pour séparer les attributs -->
                <line x1="{$posX}" y1="{$posY + 30}" x2="{$posX + 250}" y2="{$posY + 30}" stroke="black" />

                <!-- Attributs de la classe -->
                <xsl:for-each select="attributes/attribute">
                    <text x="{$posX + 10}" y="{$posY + 50 + (position() * 15)}">
                        <xsl:variable name="staticText">
                            <xsl:if test="@isStatic='true'"> static</xsl:if>
                        </xsl:variable>
                        <xsl:variable name="finalText">
                            <xsl:if test="@isFinal='true'"> final</xsl:if>
                        </xsl:variable>
                        <xsl:variable name="initText">
                            <xsl:if test="@initialization">
                                <xsl:text> = </xsl:text>
                                <xsl:value-of select="@initialization"/>
                            </xsl:if>
                        </xsl:variable>
                        <xsl:value-of select="concat(@visibility, ' ', $staticText, ' ', $finalText, ' ', @name, ' : ', @type, $initText)" />
                    </text>
                </xsl:for-each>


                <!-- Ligne pour séparer les méthodes -->
                <line x1="{$posX}" y1="{$posY + 80}" x2="{$posX + 250}" y2="{$posY + 80}" stroke="black" />

                <!-- Méthodes de la classe -->
                <xsl:for-each select="methods/method">
                    <text x="{$posX + 10}" y="{$posY + 100 + (position() * 15)}">
                        <!-- Appliquer le soulignement pour les méthodes statiques -->
                        <xsl:if test="@isStatic = 'true'">
                            <xsl:attribute name="text-decoration">underline</xsl:attribute>
                        </xsl:if>

                        <!-- Appliquer l'italique pour les méthodes abstraites -->
                        <xsl:if test="@isAbstract = 'true'">
                            <xsl:attribute name="font-style">italic</xsl:attribute>
                        </xsl:if>

                        <!-- Générer la signature de la méthode -->
                        <xsl:value-of select="concat(
            @visibility, ' ', @name, '(',
            string-join(for $p in parameters/parameter return concat($p/@name, ': ', $p/@type), ', '),
            ') : ', @returnType
        )"/>

                        <!-- Ajouter l'indicateur {default} si la méthode est une méthode par défaut -->
                        <xsl:if test="@isDefault = 'true'">
                            <xsl:text> {default}</xsl:text>
                        </xsl:if>
                    </text>
                </xsl:for-each>


            </xsl:for-each>

            <!-- Générer des relations entre les classes -->
            <xsl:for-each select="uml/relationships/*">
                <xsl:variable name="fromClass" select="@from" />
                <xsl:variable name="toClass" select="@to" />
                <xsl:variable name="isBidirectional" select="@isBidirectional"/>
                <xsl:variable name="multiplicityFrom" select="@multiplicityFrom"/>
                <xsl:variable name="multiplicityTo" select="@multiplicityTo"/>

                <!-- Positions des classes -->
                <xsl:variable name="fromIndex" select="index-of(//class/@name, $fromClass)" />
                <xsl:variable name="toIndex" select="index-of(//class/@name, $toClass)" />

                <!-- Positions des rectangles -->
                <xsl:variable name="fromPosX" select="(($fromIndex - 1) mod 4) * 300 + 50" />
                <xsl:variable name="fromPosY" select="floor(($fromIndex - 1) div 4) * 200 + 50" />
                <xsl:variable name="toPosX" select="(($toIndex - 1) mod 4) * 300 + 50" />
                <xsl:variable name="toPosY" select="floor(($toIndex - 1) div 4) * 200 + 50" />

                <!-- Calcul des bords pour éviter les chevauchements -->
                <xsl:variable name="fromEdgeX" select="if ($fromPosX &lt; $toPosX) then $fromPosX + 250 else $fromPosX" />
                <xsl:variable name="fromEdgeY" select="$fromPosY + 75" />
                <xsl:variable name="toEdgeX" select="if ($fromPosX &lt; $toPosX) then $toPosX else $toPosX + 250" />
                <xsl:variable name="toEdgeY" select="$toPosY + 75" />
                <marker id="realizationArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="none" stroke="black" />
                </marker>
                <marker id="openArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polyline points="0 0, 10 3.5, 0 7" fill="none" stroke="black" />
                </marker>

                <!-- Ligne de relation -->
                <line x1="{$fromEdgeX}" y1="{$fromEdgeY}" x2="{$toEdgeX}" y2="{$toEdgeY}" stroke="black">
                    <xsl:choose>
                        <xsl:when test="name()='association' and (@isBidirectional='true' or string(@isBidirectional)='true')">
                            <!-- Pas de marker-end pour une ligne simple -->
                            <xsl:attribute name="marker-end">url(#noArrow)</xsl:attribute>
                        </xsl:when>
                        <xsl:when test="name()='inheritance'">
                            <xsl:attribute name="marker-end">url(#inheritanceArrow)</xsl:attribute>
                        </xsl:when>


                        <xsl:when test="name()='implementation'">
                            <xsl:attribute name="stroke-dasharray">5,5</xsl:attribute>
                            <xsl:attribute name="marker-end">url(#realizationArrow)</xsl:attribute>
                        </xsl:when>
                        <xsl:when test="name()='dependency'">
                            <xsl:attribute name="stroke-dasharray">5,5</xsl:attribute>
                            <xsl:attribute name="marker-end">url(#openArrow)</xsl:attribute>
                        </xsl:when>
                        <xsl:when test="name()='aggregation'">
                            <xsl:attribute name="marker-end">url(#diamond)</xsl:attribute>
                        </xsl:when>
                        <xsl:when test="name()='composition'">
                            <xsl:attribute name="marker-end">url(#filledDiamond)</xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="marker-end">url(#arrowhead)</xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                </line>
                <!-- Cardinalité côté "from" -->
                <text x="290" y="120" fill="black" text-anchor="end">
                    <xsl:value-of select="$multiplicityFrom"/>
                </text>

                <!-- Cardinalité côté "to" -->
                <text x="360" y="120" fill="black" text-anchor="start">
                    <xsl:value-of select="$multiplicityTo"/>
                </text>
                <!-- Nom de la relation -->
                <text x="{($fromEdgeX + $toEdgeX) div 2}" y="{($fromEdgeY + $toEdgeY) div 2 - 10}" fill="black" text-anchor="middle">
                    <xsl:value-of select="@name" />
                </text>
            </xsl:for-each>
        </svg>
    </xsl:template>
</xsl:stylesheet>
