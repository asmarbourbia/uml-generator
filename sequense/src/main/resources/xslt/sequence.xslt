<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/2000/svg">

    <xsl:output method="xml" indent="yes"/>

    <!-- Paramètres de configuration -->
    <xsl:variable name="actorSpacing" select="200"/>
    <xsl:variable name="startY" select="50"/>
    <xsl:variable name="messageHeight" select="50"/>

    <!-- Template principal -->
    <xsl:template match="/">
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f8f9fa"/>

            <!-- Définitions des marqueurs -->
            <defs>
                <!-- Flèche standard -->
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                    <polygon points="0 0, 10 5, 0 10" fill="black"/>
                </marker>

                <!-- Flèche asynchrone -->
                <marker id="open-arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                    <polyline points="0 0, 10 5, 0 10" fill="none" stroke="black" stroke-width="2"/>
                </marker>

                <!-- Flèche de création asynchrone -->
                <marker id="create-arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                    <polyline points="0 0, 10 5, 0 10" fill="none" stroke="black" stroke-width="2" stroke-dasharray="5,5"/>
                </marker>

                <!-- Symbole de destruction -->
                <symbol id="destroy" viewBox="0 0 20 20">
                    <path d="M2 2 L18 18 M18 2 L2 18" stroke="red" stroke-width="2"/>
                </symbol>
            </defs>

            <!-- Génération des éléments -->
            <xsl:apply-templates select="sequenceDiagram/actors/actor"/>
            <xsl:apply-templates select="sequenceDiagram/messages/message"/>
            <xsl:call-template name="activation-boxes"/>
            <xsl:apply-templates select="sequenceDiagram/fragments/fragment"/>
        </svg>
    </xsl:template>

    <!-- Template pour les acteurs -->
    <xsl:template match="actor">
        <xsl:variable name="x" select="position() * $actorSpacing - 100"/>

        <!-- Ligne de vie -->
        <line x1="{$x}" y1="{$startY}" x2="{$x}" y2="550"
              stroke="black" stroke-dasharray="5,5"/>

        <!-- Nom de l'acteur -->
        <text x="{$x}" y="30" text-anchor="middle" font-size="16" font-weight="bold">
            <xsl:value-of select="@name"/>
        </text>

        <!-- Symbole de paquetage si nécessaire -->
        <xsl:if test="@type='object'">
            <rect x="{$x - 40}" y="10" width="80" height="30"
                  stroke="blue" fill="none"/>
        </xsl:if>
    </xsl:template>

    <!-- Template pour les messages -->
    <xsl:template match="message">
        <xsl:variable name="y" select="$startY + position() * $messageHeight"/>
        <xsl:variable name="fromX" select="(count(//actors/actor[@name=current()/@sender]/preceding-sibling::*)+1) * $actorSpacing - 100"/>
        <xsl:variable name="toX" select="(count(//actors/actor[@name=current()/@receiver]/preceding-sibling::*)+1) * $actorSpacing - 100"/>

        <!-- Ligne du message -->
        <line x1="{$fromX}" y1="{$y}" x2="{$toX}" y2="{$y}"
              stroke="black" stroke-width="2">
            <xsl:choose>
                <xsl:when test="@type='async'">
                    <xsl:attribute name="marker-end">url(#open-arrow)</xsl:attribute>
                </xsl:when>
                <xsl:when test="@type='create'">
                    <xsl:attribute name="marker-end">url(#create-arrow)</xsl:attribute>
                    <xsl:attribute name="stroke-dasharray">5,5</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="marker-end">url(#arrow)</xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:if test="@type='return'">
                <xsl:attribute name="stroke-dasharray">5,5</xsl:attribute>
            </xsl:if>
        </line>

        <!-- Texte du message -->
        <text x="{($fromX + $toX) div 2}" y="{$y - 10}"
              text-anchor="middle" font-size="14">
            <xsl:value-of select="@text"/>
        </text>

        <!-- Symbole de destruction -->
        <xsl:if test="@type='destroy'">
            <use x="{$toX - 10}" y="{$y - 10}" href="#destroy" width="20" height="20"/>
        </xsl:if>
    </xsl:template>

    <!-- Boîtes d'activation -->
    <xsl:template name="activation-boxes">
        <xsl:for-each select="//message">
            <!-- Variables locales pour la largeur et la hauteur des boîtes d'activation -->
            <xsl:variable name="activationBoxWidth" select="20"/>
            <xsl:variable name="activationBoxHeight" select="30"/>

            <rect x="{((count(//actors/actor[@name=current()/@sender]/preceding-sibling::*)+1) * $actorSpacing) - 110}"
                  y="{$startY + position() * $messageHeight - 10}"
                  width="{$activationBoxWidth}"
                  height="{$activationBoxHeight}"
                  fill="none"
                  stroke="black"/>
        </xsl:for-each>
    </xsl:template>

    <!-- Fragments combinés -->
    <xsl:template match="fragment">
        <xsl:variable name="fragmentStartY" select="$startY + (count(preceding-sibling::message) * $messageHeight) + 20"/>
        <xsl:variable name="height" select="count(.//message) * $messageHeight + 60"/>

        <!-- Cadre -->
        <rect x="50" y="{$fragmentStartY}" width="700" height="{$height}" fill="none" stroke="black"/>

        <!-- Étiquette -->
        <text x="70" y="{$fragmentStartY + 25}" font-weight="bold">
            <xsl:value-of select="concat(translate(@type, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), ' (', @condition, ')')"/>
        </text>

        <!-- Contenu -->
        <xsl:apply-templates select=".//message" mode="inside-fragment">
            <xsl:with-param name="fragmentStartY" select="$fragmentStartY + 40"/>
        </xsl:apply-templates>
    </xsl:template>



    <xsl:template match="message" mode="inside-fragment">
        <xsl:param name="fragmentStartY"/>
        <xsl:variable name="y" select="$fragmentStartY + position() * $messageHeight"/>
        <xsl:variable name="fromX" select="(count(//actors/actor[@name=current()/@sender]/preceding-sibling::*)+1) * $actorSpacing - 100"/>
        <xsl:variable name="toX" select="(count(//actors/actor[@name=current()/@receiver]/preceding-sibling::*)+1) * $actorSpacing - 100"/>

        <!-- Ligne du message -->
        <line x1="{$fromX}" y1="{$y}" x2="{$toX}" y2="{$y}" stroke="black" stroke-width="2">
            <xsl:choose>
                <xsl:when test="@type='async'">
                    <xsl:attribute name="marker-end">url(#open-arrow)</xsl:attribute>
                </xsl:when>
                <xsl:when test="@type='create'">
                    <xsl:attribute name="marker-end">url(#create-arrow)</xsl:attribute>
                    <xsl:attribute name="stroke-dasharray">5,5</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="marker-end">url(#arrow)</xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>
        </line>

        <!-- Texte du message -->
        <text x="{($fromX + $toX) div 2}" y="{$y - 5}" text-anchor="middle" font-size="14">
            <xsl:value-of select="@text"/>
        </text>

        <!-- Boîte d'activation -->
        <xsl:variable name="activationBoxWidth" select="20"/>
        <xsl:variable name="activationBoxHeight" select="30"/>
        <rect x="{(count(//actors/actor[@name=current()/@sender]/preceding-sibling::*)+1) * $actorSpacing - 110}"
              y="{$y - 20}"
              width="{$activationBoxWidth}"
              height="{$activationBoxHeight}"
              fill="none"
              stroke="black"/>
    </xsl:template>


</xsl:stylesheet>