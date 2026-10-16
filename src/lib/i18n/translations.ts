export type Language = "EN" | "FR" | "ES" | "RU" | "AR";

export interface Translations {
  nav: {
    merge: string;
    split: string;
    scan: string;
    convert: string;
    edit: string;
    compress: string;
    rotate: string;
    sign: string;
    imagesToPdf: string;
    pdfToImages: string;
    watermark: string;
    sanitize: string;
    allTools: string;
    installApp: string;
    searchPlaceholder: string;
  };
  hero: {
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    searchPlaceholder: string;
  };
  filters: {
    all: string;
    popular: string;
    scan_edit: string;
    organize: string;
    convert: string;
  };
  tools: {
    scanTitle: string;
    scanDesc: string;
    compressTitle: string;
    compressDesc: string;
    signTitle: string;
    signDesc: string;
    mergeTitle: string;
    mergeDesc: string;
    convertTitle: string;
    convertDesc: string;
    splitTitle: string;
    splitDesc: string;
    rotateTitle: string;
    rotateDesc: string;
    imagesToPdfTitle: string;
    imagesToPdfDesc: string;
    pdfToImagesTitle: string;
    pdfToImagesDesc: string;
    editTitle: string;
    editDesc: string;
    watermarkTitle: string;
    watermarkDesc: string;
    sanitizeTitle: string;
    sanitizeDesc: string;
  };
  common: {
    home: string;
    tools: string;
    shareTool: string;
    copied: string;
    download: string;
    processing: string;
    clear: string;
    clearAll: string;
    remove: string;
    backToHome: string;
    originalSize: string;
    compressedSize: string;
    reduction: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    installModalTitle: string;
    installModalDesc: string;
    installDesktop: string;
    installDesktopDesc: string;
    installMobile: string;
    installMobileDesc: string;
    gotIt: string;
    close: string;
  };
  dropzone: {
    browseOrDrop: string;
    dropHere: string;
    supportsSingle: string;
    supportsMultiple: string;
    pasteHint: string;
    processedLocally: string;
  };
  howItWorks: {
    titleTemplate: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  toolTrust: {
    whyChooseTemplate: string;
    whyChooseDesc: string;
    ramTitle: string;
    ramDesc: string;
    zeroWaitTitle: string;
    zeroWaitDesc: string;
    fidelityTitle: string;
    fidelityDesc: string;
  };
  faq: {
    headingTemplate: string;
    homepageHeading: string;
    homepageFaqs: Array<{ question: string; answer: string }>;
    toolFaqs: {
      qLocalProcess: string;
      aLocalProcess: string;
      qFreeNoWatermark: string;
      aFreeNoWatermark: string;
      qConfidential: string;
      aConfidential: string;
      qLimits: string;
      aLimits: string;
      qDevices: string;
      aDevices: string;
    };
  };
  toolUi: {
    compress: {
      recommended: string;
      recommendedDesc: string;
      extreme: string;
      extremeDesc: string;
      lossless: string;
      losslessDesc: string;
      compressBtn: string;
      downloadBtn: string;
      analyzing: string;
      optimizing: string;
    };
    merge: {
      queueTitle: string;
      queueDesc: string;
      clearAll: string;
      mergeBtn: string;
      merging: string;
      downloadBtn: string;
      addMorePrompt: string;
      readyPrompt: string;
    };
    split: {
      rangeTitle: string;
      rangeDesc: string;
      rangePlaceholder: string;
      splitBtn: string;
      extracting: string;
      page: string;
    };
    rotate: {
      rotateLeft: string;
      rotateRight: string;
      rotateAll: string;
      rotateBtn: string;
      rotating: string;
      downloadBtn: string;
    };
    scan: {
      takePhoto: string;
      takePhotoDesc: string;
      uploadImage: string;
      uploadImageDesc: string;
      exportBtn: string;
      exporting: string;
      addPage: string;
      filterClean: string;
      filterColor: string;
      filterOriginal: string;
    };
    sign: {
      newSignature: string;
      drawTab: string;
      typeTab: string;
      uploadTab: string;
      clearBtn: string;
      signBtn: string;
      signing: string;
    };
    convert: {
      convertBtn: string;
      converting: string;
      downloadBtn: string;
    };
    imagesToPdf: {
      convertBtn: string;
      converting: string;
      pageSize: string;
      fitImage: string;
      standardA4: string;
    };
    pdfToImages: {
      convertBtn: string;
      converting: string;
      downloadZip: string;
      format: string;
    };
    watermark: {
      applyBtn: string;
      applying: string;
      watermarkTextLabel: string;
      pageNumbersLabel: string;
    };
    sanitize: {
      sanitizeBtn: string;
      sanitizing: string;
      cleanSuccess: string;
    };
  };
  trust: {
    title: string;
    subtitle: string;
    zeroUploads: string;
    zeroUploadsDesc: string;
    speed: string;
    speedDesc: string;
    privacy: string;
    privacyDesc: string;
    portability: string;
    portabilityDesc: string;
  };
  formats: {
    title: string;
    subtitle: string;
    badge: string;
  };
  footer: {
    desc: string;
    rights: string;
    organize: string;
    convert: string;
    editScan: string;
  };
}

export const DICTIONARY: Record<Language, Translations> = {
  EN: {
  "nav": {
    "merge": "Merge PDF",
    "split": "Split PDF",
    "scan": "Scan to PDF",
    "convert": "Convert PDF",
    "edit": "Edit PDF Text",
    "compress": "Compress PDF",
    "rotate": "Rotate PDF",
    "sign": "Sign PDF",
    "imagesToPdf": "Images to PDF",
    "pdfToImages": "PDF to Images",
    "watermark": "Watermark & Numbers",
    "sanitize": "Sanitize Metadata",
    "allTools": "All Tools",
    "installApp": "Install App",
    "searchPlaceholder": "Search tools..."
  },
  "hero": {
    "titleStart": "Every PDF Tool You Need,",
    "titleHighlight": "All in One Place",
    "subtitle": "Merge, split, scan, sign, convert, edit, and organize your PDF files with fast, easy-to-use client-side tools.",
    "searchPlaceholder": "Search all PDF tools (e.g., scan, sign, merge, word)..."
  },
  "filters": {
    "all": "All Tools",
    "popular": "Popular",
    "scan_edit": "Scanner & Edit",
    "organize": "Organize",
    "convert": "Convert"
  },
  "tools": {
    "editTitle": "Edit PDF Text",
    "editDesc": "Click any existing text in your PDF to edit, replace, whiteout, or add new text directly in your browser.",
    "scanTitle": "Scan to PDF",
    "scanDesc": "Camera capture, automatic corner detection, and B&W document enhancement.",
    "compressTitle": "Compress PDF",
    "compressDesc": "Reduce PDF file size while maintaining document clarity.",
    "signTitle": "Sign PDF",
    "signDesc": "Draw or type electronic signatures and position them anywhere on your document.",
    "mergeTitle": "Merge PDF",
    "mergeDesc": "Combine multiple PDF files into one single document with drag-and-drop order.",
    "convertTitle": "Universal Converter",
    "convertDesc": "Convert Word, Excel, PowerPoint, Text, and Images to and from PDF.",
    "splitTitle": "Split PDF",
    "splitDesc": "Extract specific page ranges, odd/even pages, or separate pages into new files.",
    "rotateTitle": "Rotate PDF",
    "rotateDesc": "Rotate individual pages or entire documents permanently with live visual preview.",
    "imagesToPdfTitle": "Images to PDF",
    "imagesToPdfDesc": "Convert JPG, PNG, and WebP collections into standard A4 or full-bleed PDFs.",
    "pdfToImagesTitle": "PDF to Images",
    "pdfToImagesDesc": "Render pages into crisp, high-resolution PNG or JPG image files.",
    "watermarkTitle": "Watermark & Page Numbers",
    "watermarkDesc": "Stamp custom diagonal text watermarks and automatic page numbering across every page.",
    "sanitizeTitle": "Sanitize PDF Metadata",
    "sanitizeDesc": "Inspect and permanently strip hidden author names, creation software, and timestamps."
  },
  "common": {
    "home": "Home",
    "tools": "Tools",
    "shareTool": "Share Tool",
    "copied": "Link Copied!",
    "download": "Download",
    "processing": "Processing...",
    "clear": "Clear",
    "clearAll": "Clear All",
    "remove": "Remove",
    "backToHome": "Back to iKnowAPDF Home",
    "originalSize": "Original Size",
    "compressedSize": "Compressed Size",
    "reduction": "Saved",
    "about": "About Us",
    "contact": "Contact Support",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "installModalTitle": "Install iKnowAPDF App",
    "installModalDesc": "iKnowAPDF runs 100% locally on your computer or phone with offline access. To install:",
    "installDesktop": "Desktop (Chrome / Edge / Brave):",
    "installDesktopDesc": "Click the install monitor icon directly inside your browser address bar on the right.",
    "installMobile": "Mobile (Safari / Chrome iOS & Android):",
    "installMobileDesc": "Tap the Share button, then tap \"Add to Home Screen\".",
    "gotIt": "Got it!",
    "close": "Close"
  },
  "dropzone": {
    "browseOrDrop": "Click to browse or drop your files here",
    "dropHere": "Drop your files here...",
    "supportsSingle": "Supports a single file up to your browser memory capacity.",
    "supportsMultiple": "Supports multiple files. You can drop them together or select one by one.",
    "pasteHint": "You can also paste directly with Ctrl+V.",
    "processedLocally": "Processed locally in browser memory"
  },
  "howItWorks": {
    "titleTemplate": "How to Use {tool} in 3 Simple Steps",
    "step1Title": "1. Select or Drop Your Document",
    "step1Desc": "Drag and drop your file into the workspace above or click to browse from your device. Your file is loaded directly into local browser memory without uploading to any remote server.",
    "step2Title": "2. Customize & Preview Live",
    "step2Desc": "Configure your options, inspect pages in real time, and apply edits or optimizations instantaneously using our client-side WebAssembly and HTML5 Canvas engine.",
    "step3Title": "3. Instant Watermark-Free Download",
    "step3Desc": "Export your finished, ISO-compliant document straight to your computer or smartphone storage with zero watermarks, zero sign-ups, and zero cloud retention."
  },
  "toolTrust": {
    "whyChooseTemplate": "Why Process Your Documents with iKnowAPDF's {tool}?",
    "whyChooseDesc": "Most online PDF utilities upload your private files to remote cloud servers, placing sensitive tax returns, legal contracts, bank statements, and personal IDs at risk of third-party storage or data breaches. iKnowAPDF eliminates cloud uploads entirely by running the full document processing pipeline inside your browser's sandboxed memory.",
    "ramTitle": "100% Local RAM Execution",
    "ramDesc": "Every byte of your file stays on your device. Closing or refreshing your browser tab immediately purges the document buffer from memory.",
    "zeroWaitTitle": "Zero Upload & Download Wait",
    "zeroWaitDesc": "Because files never travel across the internet to a server queue, even large multi-page PDF documents are processed in seconds.",
    "fidelityTitle": "Studio-Grade Output Fidelity",
    "fidelityDesc": "Built on ISO 32000-1 compliant PDF-Lib and PDF.js engines to preserve sharp vector typography, page geometry, and layout structure."
  },
  "faq": {
    "headingTemplate": "Frequently Asked Questions — {tool}",
    "homepageHeading": "Frequently Asked Questions",
    "homepageFaqs": [
      {
        "question": "How do your PDF tools work 100% client-side?",
        "answer": "Our tools compile core document utilities directly to native WebAssembly, JavaScript, and HTML5 Canvas engines inside your browser tab. Your files are processed entirely in your computer's local memory and never transmitted over the internet to a remote server."
      },
      {
        "question": "Are my documents uploaded, tracked, or stored anywhere?",
        "answer": "Zero bytes are uploaded. We do not operate document storage servers, and there is zero cloud logging. When you close or refresh your browser tab, the document buffer is immediately purged from RAM."
      },
      {
        "question": "Is there any limit on file size or number of pages?",
        "answer": "Unlike traditional online converters that cap free users at 10 MB or 20 pages, our client-side architecture has no artificial paywalls or limits. As long as your computer or smartphone has sufficient memory, you can process files of any size."
      },
      {
        "question": "Can I use iKnowAPDF without an internet connection?",
        "answer": "Yes. Once this web app finishes loading in your browser, our offline Service Worker caches the core scripts and assets. You can disconnect your Wi-Fi and continue scanning, compressing, merging, and signing documents offline."
      },
      {
        "question": "Do you add any watermark to my exported PDF documents?",
        "answer": "Never. All tools generate clean, professional, watermark-free documents in standard ISO 32000-1 PDF format."
      }
    ],
    "toolFaqs": {
      "qLocalProcess": "How does {tool} process my files without uploading them?",
      "aLocalProcess": "Unlike traditional cloud converters that upload your private PDFs to remote servers, iKnowAPDF executes {tool} 100% locally inside your web browser using WebAssembly, PDF.js, and HTML5 Canvas APIs. Your document never leaves your computer or phone.",
      "qFreeNoWatermark": "Is {tool} completely free and free of watermarks?",
      "aFreeNoWatermark": "Yes. You can use {tool} as many times as you need without creating an account, subscribing to a plan, or dealing with watermarks on your exported documents.",
      "qConfidential": "Is it safe to process confidential contracts, tax forms, or medical records?",
      "aConfidential": "Yes. Because zero bytes are transmitted over the internet, your sensitive bank statements, legal contracts, IDs, and medical records remain strictly in your device's local RAM and are immediately cleared when you close the tab.",
      "qLimits": "Are there any file size or page count limits?",
      "aLimits": "We do not impose artificial paywalls, daily queues, or page limits. As long as your device browser has available memory, you can process multi-page PDF documents of any size.",
      "qDevices": "Which devices and browsers are supported?",
      "aDevices": "iKnowAPDF works seamlessly across Windows, macOS, Linux, Chromebook, iPhone/iPad (iOS Safari), and Android (Chrome) without installing any desktop software or browser plugins."
    }
  },
  "toolUi": {
    "compress": {
      "recommended": "Recommended",
      "recommendedDesc": "Good balance of compression and visual clarity",
      "extreme": "Extreme Compression",
      "extremeDesc": "Maximum size reduction for email and uploads",
      "lossless": "Lossless / High Quality",
      "losslessDesc": "Preserve maximum vector & image fidelity",
      "compressBtn": "Compress PDF Document",
      "downloadBtn": "Download Compressed PDF",
      "analyzing": "Analyzing PDF streams...",
      "optimizing": "Optimizing document pages..."
    },
    "merge": {
      "queueTitle": "Document Queue",
      "queueDesc": "Files are merged from top to bottom. Use the arrows to reorder.",
      "clearAll": "Clear All",
      "mergeBtn": "Merge PDFs",
      "merging": "Merging Documents...",
      "downloadBtn": "Download Merged PDF",
      "addMorePrompt": "Add at least {n} more PDF to enable merging.",
      "readyPrompt": "Ready to merge {n} PDFs into one file."
    },
    "split": {
      "rangeTitle": "Page Range or Selection",
      "rangeDesc": "Click thumbnails to toggle pages or enter page ranges manually.",
      "rangePlaceholder": "e.g., 1-3, 5, 8-10",
      "splitBtn": "Split & Download PDF",
      "extracting": "Extracting Pages...",
      "page": "Page"
    },
    "rotate": {
      "rotateLeft": "Rotate Left 90°",
      "rotateRight": "Rotate Right 90°",
      "rotateAll": "Rotate All Pages",
      "rotateBtn": "Apply Rotation",
      "rotating": "Rotating Document...",
      "downloadBtn": "Download Rotated PDF"
    },
    "scan": {
      "takePhoto": "Take Photo",
      "takePhotoDesc": "Use your phone or web camera with rear-lens auto selection",
      "uploadImage": "Upload Image",
      "uploadImageDesc": "Select an existing JPG, PNG, or WebP receipt, invoice, or page photo",
      "exportBtn": "Export Combined PDF",
      "exporting": "Generating PDF...",
      "addPage": "Add Another Page",
      "filterClean": "Clean B&W",
      "filterColor": "Color Crisp",
      "filterOriginal": "Original"
    },
    "sign": {
      "newSignature": "New Signature",
      "drawTab": "Draw",
      "typeTab": "Type",
      "uploadTab": "Upload",
      "clearBtn": "Clear",
      "signBtn": "Sign & Download PDF",
      "signing": "Applying Signatures..."
    },
    "convert": {
      "convertBtn": "Convert to PDF",
      "converting": "Converting File...",
      "downloadBtn": "Download Converted File"
    },
    "imagesToPdf": {
      "convertBtn": "Convert Images to PDF",
      "converting": "Building PDF...",
      "pageSize": "Page Sizing",
      "fitImage": "Fit Image Size",
      "standardA4": "Standard A4"
    },
    "pdfToImages": {
      "convertBtn": "Convert to Images",
      "converting": "Rendering Pages...",
      "downloadZip": "Download All as ZIP",
      "format": "Output Format"
    },
    "watermark": {
      "applyBtn": "Apply Watermark & Download",
      "applying": "Stamping Pages...",
      "watermarkTextLabel": "Watermark Text",
      "pageNumbersLabel": "Page Numbers"
    },
    "sanitize": {
      "sanitizeBtn": "Sanitize & Download PDF",
      "sanitizing": "Removing Metadata...",
      "cleanSuccess": "All hidden metadata successfully stripped!"
    }
  },
  "trust": {
    "title": "Engineered for Security, Speed, and Portability",
    "subtitle": "A self-contained client-side architecture that eliminates privacy vulnerabilities while delivering enterprise-grade performance.",
    "zeroUploads": "Zero Server Uploads",
    "zeroUploadsDesc": "Documents are parsed, edited, and rendered locally in your browser memory. Files never touch external storage.",
    "speed": "Instant Local Speed",
    "speedDesc": "Powered by compiled WebAssembly and native HTML5 canvas engines. Processing begins immediately with zero queue latency.",
    "privacy": "Bank-Grade Privacy",
    "privacyDesc": "Ideal for medical, legal, and financial files where confidentiality and compliance are strictly mandatory.",
    "portability": "Cross-Platform Access",
    "portabilityDesc": "Works uniformly across modern web browsers on mobile, desktop, and tablets without requiring plugins or native app installation."
  },
  "formats": {
    "title": "Universal Document Format Support",
    "subtitle": "High-performance handling for major business and creative document standards directly inside modern web browsers.",
    "badge": "Universal Engine"
  },
  "footer": {
    "desc": "Client-side private PDF suite. Process sensitive documents in browser memory with zero server uploads and zero retention.",
    "rights": "All rights reserved. 100% Client-Side Private PDF Suite.",
    "organize": "Organize PDF",
    "convert": "Convert PDF",
    "editScan": "Edit & Scan"
  }
},
  FR: {
  "nav": {
    "merge": "Fusionner PDF",
    "split": "Diviser PDF",
    "scan": "Numériser en PDF",
    "convert": "Convertir PDF",
    "edit": "Modifier le texte PDF",
    "compress": "Compresser PDF",
    "rotate": "Faire pivoter PDF",
    "sign": "Signer PDF",
    "imagesToPdf": "Images en PDF",
    "pdfToImages": "PDF en Images",
    "watermark": "Filigrane et numéros",
    "sanitize": "Nettoyer métadonnées",
    "allTools": "Tous les outils",
    "installApp": "Installer l'app",
    "searchPlaceholder": "Rechercher des outils..."
  },
  "hero": {
    "titleStart": "Tous les outils PDF dont vous avez besoin,",
    "titleHighlight": "Au même endroit",
    "subtitle": "Fusionnez, divisez, numérisez, signez, convertissez, modifiez et organisez vos fichiers PDF avec des outils rapides 100% locaux.",
    "searchPlaceholder": "Rechercher un outil (ex: numériser, signer, fusionner, compresser)..."
  },
  "filters": {
    "all": "Tous les outils",
    "popular": "Populaires",
    "scan_edit": "Numériser & Éditer",
    "organize": "Organiser",
    "convert": "Convertir"
  },
  "tools": {
    "editTitle": "Modifier le texte PDF",
    "editDesc": "Cliquez sur n'importe quel texte existant pour modifier, remplacer ou ajouter du texte directement dans votre navigateur.",
    "scanTitle": "Numériser en PDF",
    "scanDesc": "Capture par caméra, détection automatique des bords et optimisation du document.",
    "compressTitle": "Compresser PDF",
    "compressDesc": "Réduisez la taille de vos fichiers PDF tout en préservant la netteté et la qualité du document.",
    "signTitle": "Signer PDF",
    "signDesc": "Dessinez ou tapez des signatures électroniques et positionnez-les n'importe où sur votre document.",
    "mergeTitle": "Fusionner PDF",
    "mergeDesc": "Combinez plusieurs fichiers PDF en un seul document avec réorganisation par glisser-déposer.",
    "convertTitle": "Convertisseur Universel",
    "convertDesc": "Convertissez Word, Excel, PowerPoint, texte et images vers et depuis le format PDF.",
    "splitTitle": "Diviser PDF",
    "splitDesc": "Extrayez des plages de pages spécifiques ou séparez les pages en nouveaux fichiers.",
    "rotateTitle": "Faire pivoter PDF",
    "rotateDesc": "Faites pivoter des pages individuelles ou le document entier avec aperçu en direct.",
    "imagesToPdfTitle": "Images en PDF",
    "imagesToPdfDesc": "Convertissez vos collections JPG, PNG et WebP en documents PDF propres au format A4.",
    "pdfToImagesTitle": "PDF en Images",
    "pdfToImagesDesc": "Extrayez et convertissez les pages PDF en images haute résolution PNG ou JPG.",
    "watermarkTitle": "Filigrane et numérotation",
    "watermarkDesc": "Ajoutez des filigranes personnalisés et la numérotation automatique des pages à vos documents.",
    "sanitizeTitle": "Nettoyer les métadonnées",
    "sanitizeDesc": "Supprimez l'auteur, les logiciels de création, dates et métadonnées cachées pour une confidentialité totale."
  },
  "common": {
    "home": "Accueil",
    "tools": "Outils",
    "shareTool": "Partager l'outil",
    "copied": "Lien copié !",
    "download": "Télécharger",
    "processing": "Traitement en cours...",
    "clear": "Effacer",
    "clearAll": "Tout effacer",
    "remove": "Supprimer",
    "backToHome": "Retour à l'accueil iKnowAPDF",
    "originalSize": "Taille d'origine",
    "compressedSize": "Taille compressée",
    "reduction": "Économisé",
    "about": "À propos",
    "contact": "Support technique",
    "privacy": "Confidentialité",
    "terms": "Conditions d'utilisation",
    "installModalTitle": "Installer l'application iKnowAPDF",
    "installModalDesc": "iKnowAPDF s'exécute à 100% localement sur votre ordinateur ou mobile avec accès hors ligne :",
    "installDesktop": "Ordinateur (Chrome / Edge / Brave) :",
    "installDesktopDesc": "Cliquez sur l'icône d'installation dans la barre d'adresse de votre navigateur à droite.",
    "installMobile": "Mobile (Safari / Chrome iOS et Android) :",
    "installMobileDesc": "Appuyez sur Partager, puis sur \"Sur l'écran d'accueil\".",
    "gotIt": "Compris !",
    "close": "Fermer"
  },
  "dropzone": {
    "browseOrDrop": "Cliquez pour parcourir ou déposez vos fichiers ici",
    "dropHere": "Déposez vos fichiers ici...",
    "supportsSingle": "Prend en charge un seul fichier jusqu'à la limite de la mémoire du navigateur.",
    "supportsMultiple": "Prend en charge plusieurs fichiers. Glissez-les ensemble ou sélectionnez-les un par un.",
    "pasteHint": "Vous pouvez également coller directement avec Ctrl+V.",
    "processedLocally": "Traité localement dans la mémoire du navigateur"
  },
  "howItWorks": {
    "titleTemplate": "Comment utiliser {tool} en 3 étapes simples",
    "step1Title": "1. Sélectionnez ou déposez votre document",
    "step1Desc": "Glissez-déposez votre fichier dans la zone ci-dessus ou parcourez votre appareil. Votre fichier est chargé directement dans la mémoire locale sans aucun envoi vers un serveur externe.",
    "step2Title": "2. Personnalisez et prévisualisez en direct",
    "step2Desc": "Configurez vos options, inspectez les pages en temps réel et appliquez vos modifications instantanément grâce à notre moteur WebAssembly et Canvas HTML5.",
    "step3Title": "3. Téléchargement immédiat sans filigrane",
    "step3Desc": "Exportez votre document conforme ISO directement sur votre appareil, sans filigrane, sans inscription et sans aucune conservation dans le cloud."
  },
  "toolTrust": {
    "whyChooseTemplate": "Pourquoi traiter vos documents avec {tool} sur iKnowAPDF ?",
    "whyChooseDesc": "La plupart des outils PDF en ligne envoient vos fichiers confidentiels vers des serveurs distants, exposant vos données personnelles. iKnowAPDF supprime totalement les téléversements en exécutant l'intégralité du traitement dans la mémoire isolée de votre navigateur.",
    "ramTitle": "Exécution 100% locale en mémoire vive",
    "ramDesc": "Chaque octet de votre fichier reste sur votre appareil. Fermer ou actualiser l'onglet efface instantanément le document de la mémoire.",
    "zeroWaitTitle": "Zéro temps d'attente de téléversement",
    "zeroWaitDesc": "Comme les fichiers ne transitent pas sur internet vers une file d'attente, même les documents volumineux sont traités en quelques secondes.",
    "fidelityTitle": "Fidélité de sortie de niveau studio",
    "fidelityDesc": "Basé sur les moteurs PDF-Lib et PDF.js conformes ISO 32000-1 pour préserver la netteté des polices, la géométrie et la mise en page."
  },
  "faq": {
    "headingTemplate": "Foire aux questions — {tool}",
    "homepageHeading": "Foire aux questions",
    "homepageFaqs": [
      {
        "question": "Comment fonctionnent vos outils PDF 100% côté client ?",
        "answer": "Nos outils compilent les fonctionnalités directement en WebAssembly, JavaScript et HTML5 Canvas dans votre onglet. Vos fichiers sont traités exclusivement dans la mémoire locale de votre appareil sans jamais être envoyés vers un serveur."
      },
      {
        "question": "Mes documents sont-ils téléversés ou conservés quelque part ?",
        "answer": "Zéro octet n'est envoyé. Nous n'exploitons aucun serveur de stockage et ne tenons aucun journal dans le cloud. Lorsque vous fermez ou actualisez l'onglet, le document est immédiatement purgé de la RAM."
      },
      {
        "question": "Y a-t-il une limite de taille ou de nombre de pages ?",
        "answer": "Contrairement aux convertisseurs en ligne payants qui imposent des limites à 10 Mo ou 20 pages, notre architecture locale n'impose aucune restriction artificielle, dans la limite de la mémoire de votre appareil."
      },
      {
        "question": "Puis-je utiliser iKnowAPDF sans connexion internet ?",
        "answer": "Oui. Dès le chargement initial, notre Service Worker met en cache les scripts principaux. Vous pouvez couper votre connexion Wi-Fi et continuer à numériser, compresser, fusionner et signer hors ligne."
      },
      {
        "question": "Ajoutez-vous un filigrane sur mes documents exportés ?",
        "answer": "Jamais. Tous les outils génèrent des fichiers propres et professionnels, conformes à la norme ISO 32000-1, sans le moindre filigrane."
      }
    ],
    "toolFaqs": {
      "qLocalProcess": "Comment l'outil {tool} traite-t-il mes fichiers sans les envoyer sur un serveur ?",
      "aLocalProcess": "Contrairement aux convertisseurs cloud traditionnels, iKnowAPDF exécute {tool} intégralement dans votre navigateur grâce à WebAssembly, PDF.js et HTML5 Canvas. Votre document ne quitte jamais votre ordinateur ou téléphone.",
      "qFreeNoWatermark": "Est-ce que {tool} est totalement gratuit et sans filigrane ?",
      "aFreeNoWatermark": "Oui. Vous pouvez utiliser {tool} autant de fois que nécessaire, sans créer de compte, sans abonnement et sans aucun filigrane sur vos documents finaux.",
      "qConfidential": "Est-il sûr de traiter des contrats confidentiels, déclarations fiscales ou dossiers médicaux ?",
      "aConfidential": "Oui. Étant donné qu'aucun octet ne transite sur internet, vos données sensibles restent strictement dans la mémoire vive de votre appareil et sont effacées dès la fermeture de la page.",
      "qLimits": "Existe-t-il des limites de taille de fichier ou de pages ?",
      "aLimits": "Nous n'imposons aucune barrière tarifaire ni limite journalière. Tant que votre appareil dispose de mémoire disponible, vous pouvez traiter des documents de toute taille.",
      "qDevices": "Quels appareils et navigateurs sont pris en charge ?",
      "aDevices": "iKnowAPDF fonctionne parfaitement sur Windows, macOS, Linux, Chromebook, iPhone/iPad (Safari iOS) et Android (Chrome), sans installer aucun logiciel ni extension."
    }
  },
  "toolUi": {
    "compress": {
      "recommended": "Recommandé",
      "recommendedDesc": "Bon équilibre entre compression et netteté visuelle",
      "extreme": "Compression maximale",
      "extremeDesc": "Taille minimale idéale pour emails et formulaires",
      "lossless": "Sans perte / Haute qualité",
      "losslessDesc": "Conserve la qualité maximale des images et vecteurs",
      "compressBtn": "Compresser le document PDF",
      "downloadBtn": "Télécharger le PDF compressé",
      "analyzing": "Analyse des flux du PDF...",
      "optimizing": "Optimisation des pages..."
    },
    "merge": {
      "queueTitle": "File d'attente des documents",
      "queueDesc": "Les fichiers sont fusionnés de haut en bas. Utilisez les flèches pour réordonner.",
      "clearAll": "Tout effacer",
      "mergeBtn": "Fusionner les PDF",
      "merging": "Fusion des documents en cours...",
      "downloadBtn": "Télécharger le PDF fusionné",
      "addMorePrompt": "Ajoutez au moins {n} autre PDF pour activer la fusion.",
      "readyPrompt": "Prêt à fusionner {n} PDF en un seul fichier."
    },
    "split": {
      "rangeTitle": "Plage de pages ou sélection",
      "rangeDesc": "Cliquez sur les miniatures ou saisissez manuellement des plages de pages.",
      "rangePlaceholder": "ex: 1-3, 5, 8-10",
      "splitBtn": "Diviser et télécharger le PDF",
      "extracting": "Extraction des pages...",
      "page": "Page"
    },
    "rotate": {
      "rotateLeft": "Pivoter à gauche 90°",
      "rotateRight": "Pivoter à droite 90°",
      "rotateAll": "Pivoter toutes les pages",
      "rotateBtn": "Appliquer la rotation",
      "rotating": "Rotation du document...",
      "downloadBtn": "Télécharger le PDF pivoté"
    },
    "scan": {
      "takePhoto": "Prendre une photo",
      "takePhotoDesc": "Utilisez la caméra de votre téléphone ou webcam avec détection d'objectif",
      "uploadImage": "Importer une image",
      "uploadImageDesc": "Sélectionnez un reçu, facture ou document existant en JPG, PNG ou WebP",
      "exportBtn": "Exporter le PDF combiné",
      "exporting": "Création du PDF...",
      "addPage": "Ajouter une autre page",
      "filterClean": "N&B net",
      "filterColor": "Couleur vive",
      "filterOriginal": "Original"
    },
    "sign": {
      "newSignature": "Nouvelle signature",
      "drawTab": "Dessiner",
      "typeTab": "Taper",
      "uploadTab": "Importer",
      "clearBtn": "Effacer",
      "signBtn": "Signer et télécharger le PDF",
      "signing": "Application des signatures..."
    },
    "convert": {
      "convertBtn": "Convertir en PDF",
      "converting": "Conversion en cours...",
      "downloadBtn": "Télécharger le fichier converti"
    },
    "imagesToPdf": {
      "convertBtn": "Convertir les images en PDF",
      "converting": "Création du document PDF...",
      "pageSize": "Format de page",
      "fitImage": "Ajuster à l'image",
      "standardA4": "Standard A4"
    },
    "pdfToImages": {
      "convertBtn": "Convertir en images",
      "converting": "Rendu des pages...",
      "downloadZip": "Télécharger tout en ZIP",
      "format": "Format de sortie"
    },
    "watermark": {
      "applyBtn": "Appliquer le filigrane et télécharger",
      "applying": "Application sur les pages...",
      "watermarkTextLabel": "Texte du filigrane",
      "pageNumbersLabel": "Numérotation des pages"
    },
    "sanitize": {
      "sanitizeBtn": "Nettoyer et télécharger le PDF",
      "sanitizing": "Suppression des métadonnées...",
      "cleanSuccess": "Toutes les métadonnées cachées ont été supprimées avec succès !"
    }
  },
  "trust": {
    "title": "Conçu pour la sécurité, la vitesse et la portabilité",
    "subtitle": "Une architecture 100% côté client autonome qui élimine les risques de confidentialité tout en assurant des performances professionnelles.",
    "zeroUploads": "Zéro téléversement serveur",
    "zeroUploadsDesc": "Les documents sont analysés, modifiés et générés localement dans la mémoire de votre navigateur.",
    "speed": "Vitesse locale instantanée",
    "speedDesc": "Propulsé par WebAssembly et Canvas HTML5. Le traitement démarre instantanément sans file d'attente.",
    "privacy": "Confidentialité bancaire",
    "privacyDesc": "Idéal pour les dossiers médicaux, juridiques et financiers où la conformité est obligatoire.",
    "portability": "Accès multi-plateforme",
    "portabilityDesc": "Fonctionne de manière transparente sur mobile, ordinateur et tablette sans nécessiter d'installation."
  },
  "formats": {
    "title": "Support universel des formats de documents",
    "subtitle": "Prise en charge ultra-rapide des principaux formats de documents professionnels directement dans votre navigateur.",
    "badge": "Moteur Universel"
  },
  "footer": {
    "desc": "Suite PDF privée côté client. Traitez vos documents sensibles dans la mémoire du navigateur sans téléversement.",
    "rights": "Tous droits réservés. Suite PDF 100% privée côté client.",
    "organize": "Organiser PDF",
    "convert": "Convertir PDF",
    "editScan": "Éditer & Scanner"
  }
},
  ES: {
  "nav": {
    "merge": "Unir PDF",
    "split": "Dividir PDF",
    "scan": "Escanear a PDF",
    "convert": "Convertir PDF",
    "edit": "Editar texto PDF",
    "compress": "Comprimir PDF",
    "rotate": "Rotar PDF",
    "sign": "Firmar PDF",
    "imagesToPdf": "Imágenes a PDF",
    "pdfToImages": "PDF a Imágenes",
    "watermark": "Marca de agua y números",
    "sanitize": "Limpiar metadatos",
    "allTools": "Todas las herramientas",
    "installApp": "Instalar app",
    "searchPlaceholder": "Buscar herramientas..."
  },
  "hero": {
    "titleStart": "Todas las herramientas PDF que necesitas,",
    "titleHighlight": "En un solo lugar",
    "subtitle": "Une, divide, escanea, firma, convierte, edita y organiza tus archivos PDF con herramientas rápidas 100% privadas.",
    "searchPlaceholder": "Buscar herramientas (ej: escanear, firmar, unir, comprimir)..."
  },
  "filters": {
    "all": "Todas las herramientas",
    "popular": "Populares",
    "scan_edit": "Escanear & Editar",
    "organize": "Organizar",
    "convert": "Convertir"
  },
  "tools": {
    "editTitle": "Editar texto PDF",
    "editDesc": "Haz clic en cualquier texto existente de tu PDF para editarlo, reemplazarlo o agregar nuevo texto en tu navegador.",
    "scanTitle": "Escanear a PDF",
    "scanDesc": "Captura con cámara, detección automática de esquinas y mejora de documentos en blanco y negro.",
    "compressTitle": "Comprimir PDF",
    "compressDesc": "Reduce el tamaño de tus archivos PDF manteniendo la máxima nitidez y calidad.",
    "signTitle": "Firmar PDF",
    "signDesc": "Dibuja o escribe firmas electrónicas y colócalas en cualquier lugar de tu documento.",
    "mergeTitle": "Unir PDF",
    "mergeDesc": "Combina varios archivos PDF en un solo documento con ordenación por arrastrar y soltar.",
    "convertTitle": "Convertidor Universal",
    "convertDesc": "Convierte Word, Excel, PowerPoint, texto e imágenes a y desde el formato PDF.",
    "splitTitle": "Dividir PDF",
    "splitDesc": "Extrae rangos de páginas específicos o separa páginas en nuevos archivos independientes.",
    "rotateTitle": "Rotar PDF",
    "rotateDesc": "Gira páginas individuales o todo el documento de forma permanente con vista previa en vivo.",
    "imagesToPdfTitle": "Imágenes a PDF",
    "imagesToPdfDesc": "Convierte colecciones de JPG, PNG y WebP en documentos PDF de alta calidad en formato A4.",
    "pdfToImagesTitle": "PDF a Imágenes",
    "pdfToImagesDesc": "Convierte páginas de PDF en imágenes PNG o JPG de alta resolución con descarga en ZIP.",
    "watermarkTitle": "Marca de agua y numeración",
    "watermarkDesc": "Agrega marcas de agua diagonales y numeración de páginas automática en todo el PDF.",
    "sanitizeTitle": "Limpiar metadatos PDF",
    "sanitizeDesc": "Inspecciona y elimina nombres de autor, programas de edición y fechas ocultas para total privacidad."
  },
  "common": {
    "home": "Inicio",
    "tools": "Herramientas",
    "shareTool": "Compartir herramienta",
    "copied": "¡Enlace copiado!",
    "download": "Descargar",
    "processing": "Procesando...",
    "clear": "Borrar",
    "clearAll": "Borrar todo",
    "remove": "Eliminar",
    "backToHome": "Volver al inicio de iKnowAPDF",
    "originalSize": "Tamaño original",
    "compressedSize": "Tamaño comprimido",
    "reduction": "Ahorrado",
    "about": "Acerca de nosotros",
    "contact": "Soporte técnico",
    "privacy": "Política de privacidad",
    "terms": "Términos del servicio",
    "installModalTitle": "Instalar aplicación iKnowAPDF",
    "installModalDesc": "iKnowAPDF se ejecuta 100% localmente en tu ordenador o móvil con acceso sin conexión:",
    "installDesktop": "Escritorio (Chrome / Edge / Brave):",
    "installDesktopDesc": "Haz clic en el icono de instalación en la barra de direcciones de tu navegador a la derecha.",
    "installMobile": "Móvil (Safari / Chrome iOS y Android):",
    "installMobileDesc": "Toca Compartir y luego \"Agregar a pantalla de inicio\".",
    "gotIt": "¡Entendido!",
    "close": "Cerrar"
  },
  "dropzone": {
    "browseOrDrop": "Haga clic para buscar o arrastre sus archivos aquí",
    "dropHere": "Suelte sus archivos aquí...",
    "supportsSingle": "Admite un solo archivo hasta la capacidad de memoria de su navegador.",
    "supportsMultiple": "Admite múltiples archivos. Puede arrastrarlos juntos o seleccionarlos uno por uno.",
    "pasteHint": "También puede pegar directamente con Ctrl+V.",
    "processedLocally": "Procesado localmente en la memoria del navegador"
  },
  "howItWorks": {
    "titleTemplate": "Cómo usar {tool} en 3 sencillos pasos",
    "step1Title": "1. Seleccione o arrastre su documento",
    "step1Desc": "Arrastre y suelte su archivo en el área de trabajo o haga clic para buscar en su dispositivo. Su archivo se carga directamente en la memoria local sin subirse a ningún servidor remoto.",
    "step2Title": "2. Personalice y previsualice en vivo",
    "step2Desc": "Configure sus preferencias, revise las páginas en tiempo real y aplique cambios de inmediato mediante nuestro motor local de WebAssembly y Canvas HTML5.",
    "step3Title": "3. Descarga instantánea sin marcas de agua",
    "step3Desc": "Exporte su documento final compatible con ISO directo al almacenamiento de su dispositivo, sin marcas de agua, sin registros y sin almacenamiento en la nube."
  },
  "toolTrust": {
    "whyChooseTemplate": "¿Por qué procesar sus documentos con {tool} en iKnowAPDF?",
    "whyChooseDesc": "La mayoría de las herramientas PDF en línea suben sus archivos a servidores externos, exponiendo documentos confidenciales. iKnowAPDF elimina por completo las subidas ejecutando todo el proceso en la memoria aislada de su navegador.",
    "ramTitle": "Ejecución 100% local en memoria RAM",
    "ramDesc": "Cada byte de su archivo permanece en su dispositivo. Al cerrar o recargar la pestaña, el documento se borra de la memoria al instante.",
    "zeroWaitTitle": "Cero esperas de subida y descarga",
    "zeroWaitDesc": "Dado que los archivos no viajan por internet hacia una cola de servidor, incluso documentos grandes se procesan en segundos.",
    "fidelityTitle": "Fidelidad de salida de nivel profesional",
    "fidelityDesc": "Construido sobre motores PDF-Lib y PDF.js compatibles con ISO 32000-1 para conservar tipografías nítidas, geometría y diseño original."
  },
  "faq": {
    "headingTemplate": "Preguntas frecuentes — {tool}",
    "homepageHeading": "Preguntas frecuentes",
    "homepageFaqs": [
      {
        "question": "¿Cómo funcionan las herramientas PDF 100% en el cliente?",
        "answer": "Nuestras herramientas compilan las utilidades centrales en WebAssembly, JavaScript y Canvas HTML5 dentro de su navegador. Sus archivos se procesan exclusivamente en la memoria de su dispositivo sin enviarse a servidores."
      },
      {
        "question": "¿Mis documentos se suben, rastrean o guardan en algún lugar?",
        "answer": "Se suben cero bytes. No operamos servidores de almacenamiento de documentos y no existe registro en la nube. Al cerrar o actualizar la pestaña, la memoria RAM se borra de inmediato."
      },
      {
        "question": "¿Hay límites de tamaño de archivo o número de páginas?",
        "answer": "A diferencia de convertidores con muros de pago que limitan a 10 MB o 20 páginas, nuestra arquitectura cliente no impone restricciones artificiales mientras su dispositivo disponga de memoria suficiente."
      },
      {
        "question": "¿Puedo usar iKnowAPDF sin conexión a internet?",
        "answer": "Sí. Una vez cargada la web, nuestro Service Worker guarda en caché los recursos principales. Puede desconectar el Wi-Fi y continuar escaneando, comprimiendo, uniendo y firmando sin conexión."
      },
      {
        "question": "¿Añaden alguna marca de agua a los documentos exportados?",
        "answer": "Nunca. Todas las herramientas generan archivos limpios, profesionales y libres de marcas de agua bajo la norma ISO 32000-1."
      }
    ],
    "toolFaqs": {
      "qLocalProcess": "¿Cómo procesa {tool} mis archivos sin subirlos a un servidor?",
      "aLocalProcess": "A diferencia de convertidores en la nube que suben sus archivos privados, iKnowAPDF ejecuta {tool} 100% localmente en su navegador usando WebAssembly, PDF.js y Canvas HTML5. Su documento nunca sale de su dispositivo.",
      "qFreeNoWatermark": "¿Es {tool} completamente gratuito y sin marcas de agua?",
      "aFreeNoWatermark": "Sí. Puede usar {tool} todas las veces que lo necesite sin crear cuentas, sin suscripciones y sin marcas de agua en los archivos exportados.",
      "qConfidential": "¿Es seguro procesar contratos confidenciales, declaraciones fiscales o documentos médicos?",
      "aConfidential": "Sí. Debido a que no se transmiten bytes por internet, sus registros bancarios, contratos e identificaciones permanecen estrictamente en la memoria RAM y se borran al cerrar la pestaña.",
      "qLimits": "¿Existen límites de tamaño o cantidad de páginas?",
      "aLimits": "No imponemos colas diarias ni límites de páginas. Mientras el navegador de su dispositivo cuente con memoria disponible, puede procesar documentos de cualquier extensión.",
      "qDevices": "¿Qué dispositivos y navegadores son compatibles?",
      "aDevices": "iKnowAPDF funciona de manera óptima en Windows, macOS, Linux, Chromebook, iPhone/iPad (Safari iOS) y Android (Chrome), sin instalar programas ni extensiones."
    }
  },
  "toolUi": {
    "compress": {
      "recommended": "Recomendado",
      "recommendedDesc": "Equilibrio ideal entre reducción de peso y nitidez visual",
      "extreme": "Compresión máxima",
      "extremeDesc": "El menor tamaño posible para correos y envíos",
      "lossless": "Sin pérdidas / Alta calidad",
      "losslessDesc": "Conserva la máxima fidelidad en imágenes y vectores",
      "compressBtn": "Comprimir documento PDF",
      "downloadBtn": "Descargar PDF comprimido",
      "analyzing": "Analizando flujos del PDF...",
      "optimizing": "Optimizando páginas del documento..."
    },
    "merge": {
      "queueTitle": "Cola de documentos",
      "queueDesc": "Los archivos se combinan de arriba hacia abajo. Use las flechas para ordenar.",
      "clearAll": "Borrar todo",
      "mergeBtn": "Unir archivos PDF",
      "merging": "Uniendo documentos...",
      "downloadBtn": "Descargar PDF unido",
      "addMorePrompt": "Agregue al menos {n} PDF más para activar la unión.",
      "readyPrompt": "Listo para unir {n} documentos en un solo PDF."
    },
    "split": {
      "rangeTitle": "Rango de páginas o selección",
      "rangeDesc": "Haga clic en las miniaturas o escriba rangos de páginas manualmente.",
      "rangePlaceholder": "ej: 1-3, 5, 8-10",
      "splitBtn": "Dividir y descargar PDF",
      "extracting": "Extrayendo páginas...",
      "page": "Página"
    },
    "rotate": {
      "rotateLeft": "Girar a la izquierda 90°",
      "rotateRight": "Girar a la derecha 90°",
      "rotateAll": "Girar todas las páginas",
      "rotateBtn": "Aplicar rotación",
      "rotating": "Rotando documento...",
      "downloadBtn": "Descargar PDF rotado"
    },
    "scan": {
      "takePhoto": "Tomar foto",
      "takePhotoDesc": "Use la cámara de su móvil o webcam con detección de lente",
      "uploadImage": "Subir imagen",
      "uploadImageDesc": "Seleccione una foto de recibo, factura o página en JPG, PNG o WebP",
      "exportBtn": "Exportar PDF combinado",
      "exporting": "Generando PDF...",
      "addPage": "Agregar otra página",
      "filterClean": "B/N nítido",
      "filterColor": "Color vivo",
      "filterOriginal": "Original"
    },
    "sign": {
      "newSignature": "Nueva firma",
      "drawTab": "Dibujar",
      "typeTab": "Escribir",
      "uploadTab": "Subir",
      "clearBtn": "Borrar",
      "signBtn": "Firmar y descargar PDF",
      "signing": "Aplicando firmas..."
    },
    "convert": {
      "convertBtn": "Convertir a PDF",
      "converting": "Convirtiendo archivo...",
      "downloadBtn": "Descargar archivo convertido"
    },
    "imagesToPdf": {
      "convertBtn": "Convertir imágenes a PDF",
      "converting": "Creando PDF...",
      "pageSize": "Tamaño de página",
      "fitImage": "Ajustar a imagen",
      "standardA4": "Estándar A4"
    },
    "pdfToImages": {
      "convertBtn": "Convertir a imágenes",
      "converting": "Procesando páginas...",
      "downloadZip": "Descargar todo en ZIP",
      "format": "Formato de salida"
    },
    "watermark": {
      "applyBtn": "Aplicar marca de agua y descargar",
      "applying": "Estampando páginas...",
      "watermarkTextLabel": "Texto de marca de agua",
      "pageNumbersLabel": "Números de página"
    },
    "sanitize": {
      "sanitizeBtn": "Limpiar y descargar PDF",
      "sanitizing": "Eliminando metadatos...",
      "cleanSuccess": "¡Todos los metadatos ocultos han sido eliminados con éxito!"
    }
  },
  "trust": {
    "title": "Diseñado para seguridad, velocidad y portabilidad",
    "subtitle": "Una arquitectura autónoma 100% del lado del cliente que elimina riesgos de privacidad con rendimiento empresarial.",
    "zeroUploads": "Cero subidas al servidor",
    "zeroUploadsDesc": "Los documentos se procesan, editan y generan localmente en la memoria de su navegador.",
    "speed": "Velocidad local instantánea",
    "speedDesc": "Impulsado por WebAssembly y Canvas HTML5. El procesamiento comienza de inmediato sin colas de espera.",
    "privacy": "Privacidad de nivel bancario",
    "privacyDesc": "Ideal para documentos médicos, legales y financieros donde la confidencialidad es indispensable.",
    "portability": "Acceso multiplataforma",
    "portabilityDesc": "Funciona en navegadores web modernos en móviles, ordenadores y tablets sin necesidad de instalar apps."
  },
  "formats": {
    "title": "Compatibilidad universal de formatos",
    "subtitle": "Gestión ultrarrápida de los principales estándares documentales directamente en su navegador web.",
    "badge": "Motor Universal"
  },
  "footer": {
    "desc": "Suite PDF privada del lado del cliente. Procese documentos sensibles en la memoria del navegador sin subidas al servidor.",
    "rights": "Todos los derechos reservados. Suite PDF 100% privada del lado del cliente.",
    "organize": "Organizar PDF",
    "convert": "Convertir PDF",
    "editScan": "Editar & Escanear"
  }
},
  RU: {
  "nav": {
    "merge": "Объединить PDF",
    "split": "Разделить PDF",
    "scan": "Сканировать в PDF",
    "convert": "Конвертировать PDF",
    "edit": "Редактировать PDF",
    "compress": "Сжать PDF",
    "rotate": "Повернуть PDF",
    "sign": "Подписать PDF",
    "imagesToPdf": "Изображения в PDF",
    "pdfToImages": "PDF в изображения",
    "watermark": "Водяные знаки",
    "sanitize": "Очистить метаданные",
    "allTools": "Все инструменты",
    "installApp": "Установить приложение",
    "searchPlaceholder": "Поиск инструментов..."
  },
  "hero": {
    "titleStart": "Все необходимые инструменты PDF,",
    "titleHighlight": "В одном месте",
    "subtitle": "Объединяйте, разделяйте, сканируйте, подписывайте, конвертируйте, редактируйте и организуйте PDF локально и быстро.",
    "searchPlaceholder": "Поиск инструментов (сканирование, подпись, сжатие, word)..."
  },
  "filters": {
    "all": "Все инструменты",
    "popular": "Популярные",
    "scan_edit": "Скан и Редактор",
    "organize": "Организация",
    "convert": "Конвертация"
  },
  "tools": {
    "editTitle": "Редактировать текст PDF",
    "editDesc": "Нажмите на любой текст в PDF, чтобы изменить, заменить или добавить новый текст прямо в браузере.",
    "scanTitle": "Сканировать в PDF",
    "scanDesc": "Съемка на камеру, автоопределение углов и улучшение четкости документов.",
    "compressTitle": "Сжать PDF",
    "compressDesc": "Уменьшите размер файлов PDF с сохранением высокой четкости и качества документа.",
    "signTitle": "Подписать PDF",
    "signDesc": "Рисуйте или вводите электронные подписи, инициалы и штампы в любом месте документа.",
    "mergeTitle": "Объединить PDF",
    "mergeDesc": "Объедините несколько файлов PDF в один документ с простым изменением порядка страниц.",
    "convertTitle": "Универсальный конвертер",
    "convertDesc": "Конвертируйте Word, Excel, PowerPoint, текст и изображения в PDF и обратно локально.",
    "splitTitle": "Разделить PDF",
    "splitDesc": "Извлеките нужные диапазоны страниц или разделите страницы на отдельные файлы.",
    "rotateTitle": "Повернуть PDF",
    "rotateDesc": "Поворачивайте отдельные страницы или весь документ с наглядным предпросмотром.",
    "imagesToPdfTitle": "Изображения в PDF",
    "imagesToPdfDesc": "Преобразуйте фото JPG, PNG и WebP в аккуратный PDF с форматом A4 или по размеру фото.",
    "pdfToImagesTitle": "PDF в изображения",
    "pdfToImagesDesc": "Извлекайте страницы PDF в изображения PNG или JPG высокого разрешения с загрузкой в ZIP.",
    "watermarkTitle": "Водяные знаки и нумерация",
    "watermarkDesc": "Добавляйте текстовые водяные знаки и автоматическую нумерацию страниц по всему документу.",
    "sanitizeTitle": "Очистить метаданные PDF",
    "sanitizeDesc": "Удалите имя автора, программы создания и скрытые метаданные для полной конфиденциальности."
  },
  "common": {
    "home": "Главная",
    "tools": "Инструменты",
    "shareTool": "Поделиться",
    "copied": "Ссылка скопирована!",
    "download": "Скачать",
    "processing": "Обработка...",
    "clear": "Очистить",
    "clearAll": "Очистить все",
    "remove": "Удалить",
    "backToHome": "Назад на главную iKnowAPDF",
    "originalSize": "Исходный размер",
    "compressedSize": "Сжатый размер",
    "reduction": "Сэкономлено",
    "about": "О нас",
    "contact": "Контакты и поддержка",
    "privacy": "Политика конфиденциальности",
    "terms": "Условия использования",
    "installModalTitle": "Установить приложение iKnowAPDF",
    "installModalDesc": "iKnowAPDF работает на 100% локально на вашем ПК или телефоне офлайн:",
    "installDesktop": "Компьютер (Chrome / Edge / Brave):",
    "installDesktopDesc": "Нажмите на значок установки прямо в адресной строке браузера справа.",
    "installMobile": "Мобильные устройства (Safari / Chrome iOS и Android):",
    "installMobileDesc": "Нажмите кнопку «Поделиться», затем выберите «На экран «Домой»».",
    "gotIt": "Понятно!",
    "close": "Закрыть"
  },
  "dropzone": {
    "browseOrDrop": "Нажмите для выбора или перетащите файлы сюда",
    "dropHere": "Отпустите файлы сюда...",
    "supportsSingle": "Поддерживает один файл в пределах памяти вашего браузера.",
    "supportsMultiple": "Поддерживает несколько файлов. Можно перетащить сразу несколько или добавлять по одному.",
    "pasteHint": "Также можно вставить напрямую сочетанием Ctrl+V.",
    "processedLocally": "Обработка локально в памяти браузера"
  },
  "howItWorks": {
    "titleTemplate": "Как использовать {tool} за 3 простых шага",
    "step1Title": "1. Выберите или перетащите документ",
    "step1Desc": "Перетащите файл в рабочую область выше или выберите на устройстве. Файл загружается прямо в оперативную память браузера без отправки на удаленные серверы.",
    "step2Title": "2. Настройте и проверьте результат",
    "step2Desc": "Выберите параметры, просматривайте страницы в реальном времени и применяйте изменения мгновенно с помощью локального движка WebAssembly и HTML5 Canvas.",
    "step3Title": "3. Мгновенное скачивание без водяных знаков",
    "step3Desc": "Сохраните готовый документ стандарта ISO на свой компьютер или смартфон без водяных знаков, без регистрации и без сохранения в облаке."
  },
  "toolTrust": {
    "whyChooseTemplate": "Почему стоит обрабатывать документы в {tool} на iKnowAPDF?",
    "whyChooseDesc": "Большинство онлайн-сервисов загружают конфиденциальные файлы на сторонние серверы. iKnowAPDF полностью исключает передачу данных, выполняя всю обработку в изолированной оперативной памяти браузера.",
    "ramTitle": "100% локальная обработка в RAM",
    "ramDesc": "Все байты вашего файла остаются на вашем устройстве. Закрытие вкладки моментально удаляет данные из памяти.",
    "zeroWaitTitle": "Никакого ожидания загрузки",
    "zeroWaitDesc": "Поскольку файлы не передаются через интернет в очередь сервера, даже большие документы обрабатываются за считанные секунды.",
    "fidelityTitle": "Студийное качество выходного файла",
    "fidelityDesc": "Построено на движках PDF-Lib и PDF.js стандарта ISO 32000-1 для идеального сохранения векторных шрифтов и структуры макета."
  },
  "faq": {
    "headingTemplate": "Часто задаваемые вопросы — {tool}",
    "homepageHeading": "Часто задаваемые вопросы",
    "homepageFaqs": [
      {
        "question": "Как инструменты PDF работают на 100% на стороне клиента?",
        "answer": "Наши инструменты компилируют код прямо в WebAssembly, JavaScript и HTML5 Canvas внутри вашей вкладки. Ваши файлы обрабатываются исключительно в оперативной памяти компьютера и никогда не передаются на сторонние серверы."
      },
      {
        "question": "Загружаются ли мои файлы на сервер или сохраняются ли где-то?",
        "answer": "Ноль байтов передается по сети. Мы не используем серверы хранения документов и не ведем логов в облаке. При закрытии или обновлении вкладки буфер файла мгновенно стирается из RAM."
      },
      {
        "question": "Есть ли ограничения по размеру файла или числу страниц?",
        "answer": "В отличие от платных онлайн-конвертеров с лимитами 10 МБ или 20 страниц, наша локальная архитектура не имеет искусственных ограничений — вы можете обрабатывать файлы любого размера, пока хватает памяти устройства."
      },
      {
        "question": "Можно ли использовать iKnowAPDF без подключения к интернету?",
        "answer": "Да. После первоначальной загрузки Service Worker кэширует ключевые скрипты. Вы можете отключить Wi-Fi и продолжать сканировать, сжимать, объединять и подписывать документы офлайн."
      },
      {
        "question": "Добавляются ли водяные знаки на экспортируемые файлы?",
        "answer": "Никогда. Все инструменты создают чистые профессиональные документы стандарта ISO 32000-1 без каких-либо водяных знаков."
      }
    ],
    "toolFaqs": {
      "qLocalProcess": "Как инструмент {tool} обрабатывает файлы без загрузки на сервер?",
      "aLocalProcess": "В отличие от традиционных облачных конвертеров, iKnowAPDF запускает {tool} полностью в браузере с помощью WebAssembly, PDF.js и HTML5 Canvas. Ваш документ никогда не покидает ваше устройство.",
      "qFreeNoWatermark": "Является ли {tool} бесплатным и без водяных знаков?",
      "aFreeNoWatermark": "Да. Вы можете использовать {tool} неограниченное количество раз без создания учетной записи, подписок и без водяных знаков на готовых документах.",
      "qConfidential": "Безопасно ли обрабатывать конфиденциальные договоры, налоговые или медицинские документы?",
      "aConfidential": "Да. Так как данные не передаются через интернет, банковские выписки, юридические соглашения и паспорта остаются строго в локальной RAM и стираются при закрытии вкладки.",
      "qLimits": "Есть ли ограничения по размеру файла или количеству страниц?",
      "aLimits": "Мы не устанавливаем платных барьеров или лимитов страниц. Пока на вашем устройстве достаточно оперативной памяти, вы можете обрабатывать файлы любого объема.",
      "qDevices": "Какие устройства и браузеры поддерживаются?",
      "aDevices": "iKnowAPDF безупречно работает в Windows, macOS, Linux, Chromebook, на iPhone/iPad (Safari iOS) и Android (Chrome) без установки дополнительных программ или плагинов."
    }
  },
  "toolUi": {
    "compress": {
      "recommended": "Рекомендуемый",
      "recommendedDesc": "Оптимальный баланс между сжатием и четкостью",
      "extreme": "Максимальное сжатие",
      "extremeDesc": "Наименьший размер файла для почты и загрузок",
      "lossless": "Без потерь / Высокое качество",
      "losslessDesc": "Максимальное сохранение графики и векторных шрифтов",
      "compressBtn": "Сжать документ PDF",
      "downloadBtn": "Скачать сжатый PDF",
      "analyzing": "Анализ структуры PDF...",
      "optimizing": "Оптимизация страниц документа..."
    },
    "merge": {
      "queueTitle": "Очередь документов",
      "queueDesc": "Файлы объединяются сверху вниз. Используйте стрелки для изменения порядка.",
      "clearAll": "Очистить все",
      "mergeBtn": "Объединить файлы PDF",
      "merging": "Объединение документов...",
      "downloadBtn": "Скачать объединенный PDF",
      "addMorePrompt": "Добавьте еще как минимум {n} PDF для объединения.",
      "readyPrompt": "Готово к объединению {n} PDF в один файл."
    },
    "split": {
      "rangeTitle": "Диапазон страниц или выбор",
      "rangeDesc": "Нажимайте на миниатюры для выбора страниц или введите диапазон вручную.",
      "rangePlaceholder": "напр., 1-3, 5, 8-10",
      "splitBtn": "Разделить и скачать PDF",
      "extracting": "Извлечение страниц...",
      "page": "Страница"
    },
    "rotate": {
      "rotateLeft": "Повернуть влево 90°",
      "rotateRight": "Повернуть вправо 90°",
      "rotateAll": "Повернуть все страницы",
      "rotateBtn": "Применить поворот",
      "rotating": "Поворот документа...",
      "downloadBtn": "Скачать повернутый PDF"
    },
    "scan": {
      "takePhoto": "Сделать фото",
      "takePhotoDesc": "Используйте камеру телефона или веб-камеру с автовыбором объектива",
      "uploadImage": "Загрузить фото",
      "uploadImageDesc": "Выберите снимок квитанции, счета или документа в JPG, PNG или WebP",
      "exportBtn": "Экспорт в один PDF",
      "exporting": "Создание PDF...",
      "addPage": "Добавить еще страницу",
      "filterClean": "Четкий Ч/Б",
      "filterColor": "Яркий цвет",
      "filterOriginal": "Оригинал"
    },
    "sign": {
      "newSignature": "Новая подпись",
      "drawTab": "Нарисовать",
      "typeTab": "Ввести текст",
      "uploadTab": "Загрузить",
      "clearBtn": "Очистить",
      "signBtn": "Подписать и скачать PDF",
      "signing": "Добавление подписей..."
    },
    "convert": {
      "convertBtn": "Конвертировать в PDF",
      "converting": "Конвертация файла...",
      "downloadBtn": "Скачать готовый файл"
    },
    "imagesToPdf": {
      "convertBtn": "Преобразовать в PDF",
      "converting": "Создание документа PDF...",
      "pageSize": "Размер страницы",
      "fitImage": "По размеру фото",
      "standardA4": "Стандартный A4"
    },
    "pdfToImages": {
      "convertBtn": "Преобразовать в изображения",
      "converting": "Рендеринг страниц...",
      "downloadZip": "Скачать все в ZIP",
      "format": "Формат изображений"
    },
    "watermark": {
      "applyBtn": "Применить водяной знак и скачать",
      "applying": "Нанесение водяных знаков...",
      "watermarkTextLabel": "Текст водяного знака",
      "pageNumbersLabel": "Номера страниц"
    },
    "sanitize": {
      "sanitizeBtn": "Очистить и скачать PDF",
      "sanitizing": "Удаление скрытых метаданных...",
      "cleanSuccess": "Все скрытые метаданные успешно удалены!"
    }
  },
  "trust": {
    "title": "Создано для безопасности, скорости и мобильности",
    "subtitle": "Автономная архитектура на стороне клиента, устраняющая угрозы конфиденциальности при высоком качестве.",
    "zeroUploads": "Без загрузки на сервер",
    "zeroUploadsDesc": "Документы анализируются, редактируются и создаются локально в оперативной памяти вашего браузера.",
    "speed": "Мгновенная скорость работы",
    "speedDesc": "На базе WebAssembly и Canvas HTML5. Обработка начинается моментально без ожидания очереди.",
    "privacy": "Банковский уровень защиты",
    "privacyDesc": "Идеально подходит для медицинской, юридической и финансовой документации.",
    "portability": "Доступ на любых платформах",
    "portabilityDesc": "Работает одинаково быстро на смартфонах, компьютерах и планшетах без установки сторонних программ."
  },
  "formats": {
    "title": "Поддержка всех ключевых форматов",
    "subtitle": "Высокоскоростная обработка корпоративных и персональных документов прямо в вашем браузере.",
    "badge": "Универсальный Движок"
  },
  "footer": {
    "desc": "Конфиденциальные инструменты PDF в браузере. Обработка документов в оперативной памяти без загрузки на серверы.",
    "rights": "Все права защищены. 100% конфиденциальные инструменты PDF в браузере.",
    "organize": "Организация PDF",
    "convert": "Конвертация PDF",
    "editScan": "Редактор и Скан"
  }
},
  AR: {
  "nav": {
    "merge": "دمج PDF",
    "split": "تقسيم PDF",
    "scan": "مسح إلى PDF",
    "convert": "تحويل PDF",
    "edit": "تعديل نص PDF",
    "compress": "ضغط PDF",
    "rotate": "تدوير PDF",
    "sign": "توقيع PDF",
    "imagesToPdf": "الصور إلى PDF",
    "pdfToImages": "تحويل PDF إلى صور",
    "watermark": "علامة مائية وترقيم",
    "sanitize": "تنظيف البيانات الوصفية",
    "allTools": "جميع الأدوات",
    "installApp": "تثبيت التطبيق",
    "searchPlaceholder": "البحث عن أدوات..."
  },
  "hero": {
    "titleStart": "كل أدوات PDF التي تحتاجها،",
    "titleHighlight": "في مكان واحد",
    "subtitle": "ادمج وقسّم وامسح ووقّع وحوّل وعدّل ونظّم ملفات PDF مع خصوصية كاملة بنسبة 100% داخل متصفحك.",
    "searchPlaceholder": "ابحث عن أي أداة (دمج، توقيع، مسح، تحويل، ضغط)..."
  },
  "filters": {
    "all": "جميع الأدوات",
    "popular": "الشائعة",
    "scan_edit": "المسح والتعديل",
    "organize": "تنظيم",
    "convert": "تحويل"
  },
  "tools": {
    "editTitle": "تعديل نص PDF",
    "editDesc": "انقر على أي نص موجود داخل ملف PDF لتعديله أو استبداله أو مسحه أو إضافة نص جديد مباشرة.",
    "scanTitle": "مسح إلى PDF",
    "scanDesc": "التقاط بالكاميرا مع تحديد تلقائي للحواف وفلاتر تباين للمستندات الورقية والإيصالات.",
    "compressTitle": "ضغط PDF",
    "compressDesc": "تقليل حجم ملفات PDF مع الحفاظ على أقصى درجات الوضوح والجودة العالية.",
    "signTitle": "توقيع PDF",
    "signDesc": "رسم أو كتابة توقيعك الإلكتروني ووضع الأختام والتواريخ في أي مكان على المستند.",
    "mergeTitle": "دمج PDF",
    "mergeDesc": "دمج عدة ملفات PDF في مستند واحد منظم مع إمكانية ترتيب الصفحات بالسحب والإفلات.",
    "convertTitle": "محول PDF الشامل",
    "convertDesc": "تحويل ملفات Word و Excel و PowerPoint والصور والنصوص من وإلى صيغة PDF.",
    "splitTitle": "تقسيم PDF",
    "splitDesc": "استخراج نطاقات صفحات محددة أو فصل الصفحات الفردية إلى مستندات مستقلة.",
    "rotateTitle": "تدوير PDF",
    "rotateDesc": "تدوير صفحات محددة أو كامل المستند بشكل دائم مع معاينة بصرية فورية.",
    "imagesToPdfTitle": "تحويل الصور إلى PDF",
    "imagesToPdfDesc": "تحويل مجموعات صور JPG و PNG و WebP إلى ملفات PDF احترافية بمقاس A4.",
    "pdfToImagesTitle": "تحويل PDF إلى صور",
    "pdfToImagesDesc": "استخراج صفحات مستندات PDF إلى صور PNG أو JPG عالية الدقة في ملف ZIP.",
    "watermarkTitle": "علامة مائية وترقيم الصفحات",
    "watermarkDesc": "إضافة علامات مائية مائلة (سري، مسودة) وترقيم الصفحات تلقائياً لكل صفحة.",
    "sanitizeTitle": "تنظيف بيانات PDF الوصفية",
    "sanitizeDesc": "إزالة بيانات الكاتب والبرامج وتواريخ التعديل المخفية لضمان الخصوصية التامة."
  },
  "common": {
    "home": "الرئيسية",
    "tools": "الأدوات",
    "shareTool": "مشاركة الأداة",
    "copied": "تم نسخ الرابط!",
    "download": "تحميل",
    "processing": "جاري المعالجة...",
    "clear": "مسح",
    "clearAll": "مسح الكل",
    "remove": "إزالة",
    "backToHome": "الرجوع للرئيسية iKnowAPDF",
    "originalSize": "الحجم الأصلي",
    "compressedSize": "الحجم بعد الضغط",
    "reduction": "تم توفير",
    "about": "من نحن",
    "contact": "اتصل بنا والدعم",
    "privacy": "سياسة الخصوصية",
    "terms": "شروط الخدمة",
    "installModalTitle": "تثبيت تطبيق iKnowAPDF",
    "installModalDesc": "يعمل iKnowAPDF محلياً بنسبة 100% على حاسوبك أو هاتفك مع دعم العمل بدون إنترنت. للتثبيت:",
    "installDesktop": "أجهزة الكمبيوتر (Chrome / Edge / Brave):",
    "installDesktopDesc": "انقر على أيقونة التثبيت الموجودة مباشرة داخل شريط عنوان المتصفح على الجانب.",
    "installMobile": "الهواتف الذكية (Safari / Chrome على iOS و Android):",
    "installMobileDesc": "اضغط على زر المشاركة ثم اختر \"إضافة إلى الشاشة الرئيسية\".",
    "gotIt": "حسناً، فهمت!",
    "close": "إغلاق"
  },
  "dropzone": {
    "browseOrDrop": "انقر للاختيار أو اسحب ملفاتك هنا",
    "dropHere": "أفلت ملفاتك هنا...",
    "supportsSingle": "يدعم ملفاً واحداً حتى سعة ذاكرة المتصفح المتوفرة.",
    "supportsMultiple": "يدعم عدة ملفات معاً. يمكنك سحبها دفعة واحدة أو إضافتها واحداً تلو الآخر.",
    "pasteHint": "يمكنك أيضاً اللصق مباشرة باستخدام اختصار Ctrl+V.",
    "processedLocally": "تتم المعالجة محلياً داخل ذاكرة المتصفح"
  },
  "howItWorks": {
    "titleTemplate": "كيفية استخدام {tool} في 3 خطوات بسيطة",
    "step1Title": "1. اختر أو اسحب مستندك",
    "step1Desc": "اسحب ملفك وأفلته في مساحة العمل أعلاه أو انقر لاختياره من جهازك. يتم تحميل الملف مباشرة في ذاكرة المتصفح المحلية دون رفعه إلى أي خادم خارجي.",
    "step2Title": "2. اضبط الخيارات وعاين مباشرة",
    "step2Desc": "اضبط الخيارات والإعدادات المفضلة، عاين الصفحات في الوقت الفعلي، وطبّق التعديلات فورياً بفضل محرك WebAssembly و HTML5 Canvas المدمج في المتصفح.",
    "step3Title": "3. تحميل فوري ونظيف بدون علامة مائية",
    "step3Desc": "قم بتصدير مستندك القياسي المتوافق مع معايير ISO مباشرة إلى ذاكرة هاتفك أو حاسوبك بدون أي علامات مائية وبدون تسجيل وبدون حفظ في السحابة."
  },
  "toolTrust": {
    "whyChooseTemplate": "لماذا تختار {tool} عبر منصة iKnowAPDF؟",
    "whyChooseDesc": "معظم أدوات PDF عبر الإنترنت تقوم برفع ملفاتك الخاصة إلى خوادم سحابية بعيدة مما يعرض بياناتك الحساسة للمخاطر. منصة iKnowAPDF تلغي الرفع السحابي تماماً وتقوم بتنفيذ معالجة المستندات بنسبة 100% داخل ذاكرة متصفحك المحمية.",
    "ramTitle": "معالجة محلية 100% في الذاكرة العشوائية (RAM)",
    "ramDesc": "كل بايت من ملفك يبقى حصرياً داخل جهازك. بمجرد إغلاق لسان التبويب أو تحديثه يتم مسح المستند نهائياً من الذاكرة.",
    "zeroWaitTitle": "سرعة فورية بدون انتظار رفع أو تنزيل",
    "zeroWaitDesc": "نظراً لعدم نقل الملفات عبر الإنترنت إلى طوابير انتظار الخوادم، تتم معالجة المستندات الكبيرة متعددة الصفحات في ثوانٍ معدودة.",
    "fidelityTitle": "دقة وجودة إخراج احترافية فائقة",
    "fidelityDesc": "مبني على محركات PDF-Lib و PDF.js المتوافقة مع معايير ISO 32000-1 للحفاظ على حدة الخطوط وسلامة التصميم وتنسيق الصفحات."
  },
  "faq": {
    "headingTemplate": "الأسئلة الشائعة — {tool}",
    "homepageHeading": "الأسئلة الشائعة",
    "homepageFaqs": [
      {
        "question": "كيف تعمل أدوات PDF الخاصة بكم محلياً 100% في المتصفح؟",
        "answer": "تقوم أدواتنا بتشغيل المحركات البرمجية مباشرة عبر تقنيات WebAssembly و JavaScript و HTML5 Canvas داخل لسان تبويب متصفحك. تتم معالجة ملفاتك بالكامل في الذاكرة المحلية لجهازك دون إرسالها نهائياً عبر الإنترنت إلى أي خادم بعيد."
      },
      {
        "question": "هل يتم رفع مستنداتي أو تتبعها أو تخزينها في أي مكان؟",
        "answer": "لا يتم رفع أي بايت على الإطلاق. نحن لا نشغل خوادم لتخزين المستندات ولا يوجد أي تسجيل في السحابة. بمجرد إغلاق لسان تبويب المتصفح أو تحديثه، يتم مسح المستند نهائياً من الذاكرة العشوائية RAM."
      },
      {
        "question": "هل يوجد حد أقصى لحجم الملف أو عدد الصفحات؟",
        "answer": "على عكس المحولات التقليدية عبر الإنترنت التي تفرض قيوداً صارمة مثل 10 ميجابايت أو 20 صفحة، فإن بنيتنا المحلية لا تفرض أي قيود أو اشتراكات. طالما يمتلك جهازك ذاكرة كافية، يمكنك معالجة ملفات بأي حجم."
      },
      {
        "question": "هل يمكنني استخدام iKnowAPDF بدون اتصال بالإنترنت؟",
        "answer": "نعم. بمجرد اكتمال تحميل هذا التطبيق في متصفحك، يقوم Service Worker بتخزين الملفات البرمجية الأساسية. يمكنك فصل شبكة Wi-Fi ومتابعة المسح والضغط والدمج والتوقيع بدون إنترنت."
      },
      {
        "question": "هل تضعون أي علامات مائية على ملفاتي المصدرة؟",
        "answer": "أبداً. جميع الأدوات تنتج مستندات نظيفة واحترافية وبدون أي علامة مائية بصيغة PDF القياسية المتوافقة مع ISO 32000-1."
      }
    ],
    "toolFaqs": {
      "qLocalProcess": "كيف تعالج أداة {tool} ملفاتي بدون رفعها إلى خادم؟",
      "aLocalProcess": "على عكس المحولات السحابية التقليدية التي ترفع ملفاتك إلى خوادم بعيدة، تنفذ iKnowAPDF أداة {tool} محلياً 100% داخل متصفحك باستخدام WebAssembly و PDF.js و HTML5 Canvas. لا يغادر مستندك هاتفك أو حاسوبك إطلاقاً.",
      "qFreeNoWatermark": "هل أداة {tool} مجانية تماماً وبدون أي علامات مائية؟",
      "aFreeNoWatermark": "نعم. يمكنك استخدام {tool} بعدد غير محدود من المرات بدون إنشاء حساب، وبدون اشتراك، وبدون أي علامات مائية على المستندات المصدرة.",
      "qConfidential": "هل من الآمن معالجة العقود السرية والبيانات الضريبية والسجلات الطبية؟",
      "aConfidential": "نعم بكل تأكيد. نظراً لعدم نقل أي بايت عبر الإنترنت، تظل كشوفات الحسابات والعقود القانونية والهويات محفوظة بشكل صارم في ذاكرة جهازك فقط ويتم مسحها فور إغلاق الصفحة.",
      "qLimits": "هل هناك قيود على حجم الملفات أو عدد الصفحات؟",
      "aLimits": "نحن لا نفرض طوابير انتظار يومية ولا قيوداً على عدد الصفحات. طالما تتوفر ذاكرة كافية في جهازك، يمكنك معالجة مستندات متعددة الصفحات بأي حجم.",
      "qDevices": "ما هي الأجهزة والمتصفحات المدعومة؟",
      "aDevices": "تعمل iKnowAPDF بسلاسة تامة عبر Windows و macOS و Linux و Chromebook و iPhone/iPad (متصفح Safari) و Android (متصفح Chrome) بدون تثبيت أي برامج أو إضافات."
    }
  },
  "toolUi": {
    "compress": {
      "recommended": "موصى به",
      "recommendedDesc": "توازن مثالي بين تقليل الحجم والحفاظ على دقة المستند",
      "extreme": "أقصى ضغط",
      "extremeDesc": "أصغر حجم ممكن للملف مناسب للبريد الإلكتروني والمواقع",
      "lossless": "بدون فقدان الجودة",
      "losslessDesc": "الحفاظ على أعلى جودة للمتجهات والرسومات والخطوط",
      "compressBtn": "ضغط مستند PDF",
      "downloadBtn": "تحميل ملف PDF المضغوط",
      "analyzing": "جاري تحليل بنية ملف PDF...",
      "optimizing": "جاري تحسين صفحات المستند..."
    },
    "merge": {
      "queueTitle": "قائمة المستندات",
      "queueDesc": "يتم دمج الملفات من الأعلى إلى الأسفل. استخدم الأسهم لإعادة الترتيب.",
      "clearAll": "مسح الكل",
      "mergeBtn": "دمج ملفات PDF",
      "merging": "جاري دمج المستندات...",
      "downloadBtn": "تحميل ملف PDF المدمج",
      "addMorePrompt": "أضف {n} ملف PDF آخر على الأقل لتفعيل خيار الدمج.",
      "readyPrompt": "جاهز لدمج {n} مستندات في ملف واحد."
    },
    "split": {
      "rangeTitle": "نطاق الصفحات أو التحديد",
      "rangeDesc": "انقر على صور الصفحات لاختيارها أو اكتب أرقام النطاقات يدوياً.",
      "rangePlaceholder": "مثال: 1-3, 5, 8-10",
      "splitBtn": "تقسيم وتحميل PDF",
      "extracting": "جاري استخراج الصفحات...",
      "page": "صفحة"
    },
    "rotate": {
      "rotateLeft": "تدوير لليسار 90°",
      "rotateRight": "تدوير لليمين 90°",
      "rotateAll": "تدوير جميع الصفحات",
      "rotateBtn": "تطبيق التدوير",
      "rotating": "جاري تدوير المستند...",
      "downloadBtn": "تحميل ملف PDF المعدل"
    },
    "scan": {
      "takePhoto": "التقاط صورة",
      "takePhotoDesc": "استخدم كاميرا هاتفك أو الويب مع التحديد التلقائي للعدسة",
      "uploadImage": "رفع صورة",
      "uploadImageDesc": "اختر صورة فاتورة أو إيصال أو وثيقة موجودة بصيغة JPG أو PNG أو WebP",
      "exportBtn": "تصدير ملف PDF المجمع",
      "exporting": "جاري إنشاء ملف PDF...",
      "addPage": "إضافة صفحة أخرى",
      "filterClean": "أبيض وأسود نقي",
      "filterColor": "ألوان واضحة",
      "filterOriginal": "الصورة الأصلية"
    },
    "sign": {
      "newSignature": "توقيع جديد",
      "drawTab": "رسم التوقيع",
      "typeTab": "كتابة بالخط",
      "uploadTab": "رفع صورة",
      "clearBtn": "مسح",
      "signBtn": "توقيع وتحميل PDF",
      "signing": "جاري تطبيق التوقيعات..."
    },
    "convert": {
      "convertBtn": "تحويل إلى PDF",
      "converting": "جاري تحويل الملف...",
      "downloadBtn": "تحميل الملف المحول"
    },
    "imagesToPdf": {
      "convertBtn": "تحويل الصور إلى PDF",
      "converting": "جاري إنشاء ملف PDF...",
      "pageSize": "حجم الصفحة",
      "fitImage": "مطابقة لحجم الصورة",
      "standardA4": "مقاس A4 القياسي"
    },
    "pdfToImages": {
      "convertBtn": "تحويل إلى صور",
      "converting": "جاري استخراج الصفحات...",
      "downloadZip": "تحميل الكل كملف ZIP",
      "format": "صيغة الصور"
    },
    "watermark": {
      "applyBtn": "تطبيق العلامة المائية والتحميل",
      "applying": "جاري ختم الصفحات...",
      "watermarkTextLabel": "نص العلامة المائية",
      "pageNumbersLabel": "ترقيم الصفحات"
    },
    "sanitize": {
      "sanitizeBtn": "تنظيف وتحميل PDF",
      "sanitizing": "جاري إزالة البيانات الوصفية...",
      "cleanSuccess": "تم تنظيف وحذف جميع البيانات الوصفية المخفية بنجاح!"
    }
  },
  "trust": {
    "title": "مصمم لتحقيق أعلى درجات الأمان والسرعة والسهولة",
    "subtitle": "بنية متكاملة تعمل بالكامل داخل المتصفح تلغي ثغرات الخصوصية وتمنحك أداءً فائق الجودة والسرعة.",
    "zeroUploads": "بدون رفع إلى أي خادم",
    "zeroUploadsDesc": "تتم قراءة المستندات وتعديلها ومعالجتها داخل ذاكرة متصفحك. لا تلمس ملفاتك أي خوادم خارجية.",
    "speed": "سرعة معالجة فورية",
    "speedDesc": "مدعوم بمحركات WebAssembly و Canvas. تبدأ المعالجة مباشرة وبدون أي انتظار أو طوابير.",
    "privacy": "أمان بمستوى مصرفي",
    "privacyDesc": "مثالي للمستندات الطبية والقانونية والمالية حيث تكون حماية الخصوصية أمراً إجبارياً وأساسياً.",
    "portability": "دعم شامل لجميع الأجهزة",
    "portabilityDesc": "يعمل بسلاسة عبر جميع المتصفحات الحديثة على الهواتف وأجهزة الكمبيوتر والأجهزة اللوحية دون الحاجة لتثبيت أي برامج."
  },
  "formats": {
    "title": "دعم شامل لمختلف صيغ المستندات",
    "subtitle": "معالجة فائقة السرعة لأهم معايير وصيغ المستندات الإدارية والمكتبية مباشرة داخل متصفحك.",
    "badge": "محرك معالجة شامل"
  },
  "footer": {
    "desc": "أدوات PDF خاصة تعمل داخل متصفحك. معالجة المستندات الحساسة في ذاكرة الجهاز دون رفعها إلى أي خادم خارجي.",
    "rights": "جميع الحقوق محفوظة. أدوات PDF آمنة وتعمل 100% داخل جهازك دون رفع أي ملفات.",
    "organize": "تنظيم PDF",
    "convert": "تحويل PDF",
    "editScan": "المسح والتعديل"
  }
},
};
