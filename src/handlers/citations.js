const citationAdaptiveCard = {
  type: "AdaptiveCard",
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.6",
  body: [
    {
      type: "ColumnSet",
      columns: [
        {
          type: "Column",
          width: "auto",
          items: [
            {
              type: "Image",
              url: "https://adaptivecards.io/content/cats/1.png",
              size: "Medium",
              style: "Person",
            },
          ],
        },
        {
          type: "Column",
          width: "stretch",
          items: [
            {
              type: "TextBlock",
              text: "Document Title",
              weight: "Bolder",
              size: "Medium",
              wrap: true,
            },
            {
              type: "TextBlock",
              text: "Author · Last modified June 2026",
              isSubtle: true,
              size: "Small",
              wrap: true,
            },
          ],
        },
      ],
    },
    {
      type: "TextBlock",
      text: "Excerpt description",
      wrap: true,
      spacing: "Medium",
    },
    {
      type: "FactSet",
      facts: [
        {
          title: "Category",
          value: "Reference Document",
        },
        {
          title: "Keywords",
          value: "keyword 1, keyword 2, keyword 3",
        },
        {
          title: "Source",
          value: "Internal Knowledge Base",
        },
      ],
    },
    {
      type: "Image",
      url: "https://adaptivecards.io/content/AlkiBeach.jpg",
      size: "Stretch",
      altText: "Document preview image",
    },
  ],
};

const genericAdaptiveCardText = JSON.stringify(citationAdaptiveCard, null, 0);

const words = [
  "Microsoft Word",
  "Microsoft Excel",
  "Microsoft PowerPoint",
  "Microsoft OneNote",
  "Microsoft SharePoint",
  "Microsoft Visio",
  "Microsoft Loop",
  "Microsoft Whiteboard",
  "Source Code",
  "Sketch",
  "Adobe Illustrator",
  "Adobe Photoshop",
  "Adobe InDesign",
  "Adobe Flash",
  "Image",
  "GIF",
  "Video",
  "Sound",
  "ZIP",
  "Text",
];

const powerBIWords = [
  "power bi app",
  "power bi data agent",
  "power bi semantic model",
  "power bi report",
  "PDF",
];

const citations = words.map((word, index) => ({
  "@type": "Claim",
  position: index + 1,
  appearance: {
    "@type": "DigitalDocument",
    name: word,
    url: `https://example.com/claim-${index + 1}`,
    abstract: "Excerpt description",
    text: genericAdaptiveCardText,
    keywords: ["keyword 1", "keyword 2", "keyword 3"],
    encodingFormat: "application/vnd.microsoft.card.adaptive",
    image: {
      "@type": "ImageObject",
      name: word,
    },
    // usageInfo: {
    //   "@type": "CreativeWork",
    //   "@id": "sensitivity1",
    //   name: "Confidential // Contoso FTE",
    //   description: "Only accessible to Contoso FTE",
    // },
  },
}));

const powerBICitations = powerBIWords.map((word, index) => ({
  "@type": "Claim",
  position: index + 1,
  appearance: {
    "@type": "DigitalDocument",
    name: word,
    url: `https://example.com/claim-${index + 1}`,
    abstract: "Excerpt description",
    text: genericAdaptiveCardText,
    keywords: ["keyword 1", "keyword 2", "keyword 3"],
    encodingFormat: "application/vnd.microsoft.card.adaptive",
    image: {
      "@type": "ImageObject",
      name: word,
    },
    // usageInfo: {
    //   "@type": "CreativeWork",
    //   "@id": "sensitivity1",
    //   name: "Confidential // Contoso FTE",
    //   description: "Only accessible to Contoso FTE",
    // },
  },
}));

module.exports = {
  citations,
  powerBICitations,
};
