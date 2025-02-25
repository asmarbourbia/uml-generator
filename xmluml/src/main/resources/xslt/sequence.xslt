<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/2000/svg">

    <xsl:output method="xml" indent="yes"/>

    <!-- Définition des styles SVG -->
    <xsl:template match="/">
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f8f9fa"/>

            <!-- Générer les acteurs -->
            <xsl:apply-templates select="sequenceDiagram/actors/actor"/>

            <!-- Générer les messages -->
            <xsl:apply-templates select="sequenceDiagram/messages/message"/>
        </svg>
    </xsl:template>

    <!-- Acteurs (Colonnes verticales) -->
    <xsl:template match="actor">
        <xsl:variable name="actorIndex" select="position()"/>
        <xsl:variable name="xPosition" select="$actorIndex * 200 - 100"/>

        <!-- Dessiner la ligne verticale de l'acteur -->
        <line x1="{$xPosition}" y1="50" x2="{$xPosition}" y2="550" stroke="black" stroke-dasharray="5,5"/>

        <!-- Dessiner le texte de l'acteur -->
        <text x="{$xPosition}" y="30" text-anchor="middle" font-size="16" font-weight="bold">
            <xsl:value-of select="@name"/>
        </text>
    </xsl:template>

    <!-- Messages -->
    <xsl:template match="message">
        <xsl:variable name="senderIndex" select="count(../actor[@name=current()/@sender]/preceding-sibling::actor) + 1"/>
        <xsl:variable name="receiverIndex" select="count(../actor[@name=current()/@receiver]/preceding-sibling::actor) + 1"/>
        <xsl:variable name="yPosition" select="position() * 50 + 80"/>
        <xsl:variable name="xStart" select="$senderIndex * 200 - 100"/>
        <xsl:variable name="xEnd" select="$receiverIndex * 200 - 100"/>

        <!-- Dessiner la flèche du message -->
        <line x1="{$xStart}" y1="{$yPosition}" x2="{$xEnd}" y2="{$yPosition}" stroke="black" marker-end="url(#arrow)"/>

        <!-- Dessiner le texte du message -->
        <text x="{($xStart + $xEnd) div 2}" y="{$yPosition - 5}" text-anchor="middle" font-size="14" fill="black">
            <xsl:value-of select="@text"/>
        </text>
    </xsl:template>

    <!-- Définition de la flèche pour les messages -->
    <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>
        </marker>
    </defs>

</xsl:stylesheet>
