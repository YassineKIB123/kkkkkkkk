// Cluster 3: Legal Workflows, Digital Signatures & Encryption
export const cluster3Articles = [
  {
    slug: "digital-signature-vs-electronic-signature-pdf",
    title: "Digital vs. Electronic Signatures in PDFs: ESIGN, eIDAS, and SHA-256 Hashes",
    seoTitle: "Digital vs Electronic Signature in PDF: ESIGN & eIDAS",
    description: "The difference between simple electronic signatures, SHA-256 document hashes and certificate-based digital signatures in PDFs, and when each one is used.",
    category: "legal",
    tags: ["Digital Signatures", "SHA-256", "eIDAS", "ESIGN Act", "Sign PDF"],
    publishedAt: "2026-05-04",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "sign",
      title: "Sign a PDF in Your Browser",
      description: "Draw, type, or upload your signature and optionally append a page listing SHA-256 hashes of the document — processed on your device.",
      buttonText: "Open PDF Signer",
      href: "/tools/sign-pdf",
      highlightText: "Optional SHA-256 summary page"
    },
    blocks: [
      {
        type: "paragraph",
        text: "In everyday business, 'electronic signature' and 'digital signature' are often used as synonyms. In law and in the PDF format, they describe different things. Knowing which one a document actually needs helps you avoid both under-protecting important agreements and paying for tooling you don't need."
      },
      {
        type: "callout",
        variant: "info",
        title: "Not Legal Advice",
        text: "This article explains general concepts. Signature requirements vary by country, industry and document type — check with a lawyer for anything high-stakes."
      },
      {
        type: "heading2",
        id: "the-legal-and-technical-divide",
        text: "Three Levels of Electronic Signatures (US ESIGN Act & EU eIDAS)"
      },
      {
        type: "paragraph",
        text: "The US ESIGN Act and UETA give electronic signatures legal effect in most commercial contexts, and the EU's eIDAS Regulation (No 910/2014) defines simple, advanced, and qualified electronic signatures. In practice you will meet three levels:"
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Simple electronic signature (SES): A drawn, typed, or image signature placed on a document. Widely used for everyday agreements such as NDAs, freelance contracts and purchase orders, although some documents (wills, certain real-estate or court documents) have stricter rules.",
          "Signature plus an integrity record: A simple signature combined with evidence about the document — for example SHA-256 hashes and timestamps — that helps show what was signed and when.",
          "Certificate-based digital signature (AdES/QES, PAdES): Uses an X.509 certificate from a certificate authority, often on a smart card or hardware token, and is embedded in the PDF so that any later change is detected by PDF readers. Qualified signatures are required for some regulated transactions in the EU."
        ]
      },
      {
        type: "heading2",
        id: "how-pdf-signatures-function",
        text: "How SHA-256 Document Hashing Works in the Browser"
      },
      {
        type: "paragraph",
        text: "In iKnowAPDF's [Sign PDF](/tools/sign-pdf) tool you can place drawn, typed, or uploaded signatures and date stamps, and tick **'Append Tamper-Evident SHA-256 Audit Certificate Page'**. When enabled, your browser's built-in Web Crypto API computes a SHA-256 hash of the original PDF and of the signed content, and the tool adds a summary page listing both:"
      },
      {
        type: "code",
        title: "Computing a SHA-256 Hash with the Web Crypto API",
        language: "ts",
        code: `// Runs in your browser tab (see src/lib/pdf/pdf-utils.ts):
const hashBuffer = await window.crypto.subtle.digest("SHA-256", pdfBytes);
const sha256Hex = Array.from(new Uint8Array(hashBuffer))
  .map((b) => b.toString(16).padStart(2, "0"))
  .join("");`
      },
      {
        type: "callout",
        variant: "warning",
        title: "A Hash Page Is Not a Certificate-Based Digital Signature",
        text: "The summary page records fingerprints of the file at signing time. It is not a cryptographic PDF signature: PDF readers won't flag later edits automatically, and it doesn't identify the signer with a certificate. Keep your own copies of the original and signed files so the hashes can be checked later, and use a certificate-based signing service when a document requires one."
      },
      {
        type: "step",
        number: 1,
        title: "Open Your Document in Sign PDF",
        text: "Load the PDF in [Sign PDF](/tools/sign-pdf) and create a signature by drawing, typing, or uploading an image."
      },
      {
        type: "step",
        number: 2,
        title: "Add a Date & (Optionally) the SHA-256 Page",
        text: "Add today's date stamp and, if you want an integrity record, tick 'Append Tamper-Evident SHA-256 Audit Certificate Page'."
      },
      {
        type: "step",
        number: 3,
        title: "Download and Keep Copies",
        text: "Download the signed PDF and store it together with the original so the listed hashes can be verified if questions come up later."
      },
      {
        type: "toolCta",
        toolId: "sign"
      },
      {
        type: "faq",
        items: [
          {
            question: "Is a contract signed with iKnowAPDF legally binding?",
            answer: "Under the ESIGN Act (15 U.S.C. § 7001) and UETA, a signature can't be denied legal effect solely because it is electronic, and eIDAS has a similar rule for simple electronic signatures. Whether a particular contract is enforceable depends on the parties, the jurisdiction and the type of document — iKnowAPDF can't guarantee that."
          },
          {
            question: "Is my document uploaded when I sign it?",
            answer: "No. Creating, placing and hashing signatures all happen in your browser tab."
          },
          {
            question: "Can I save my signature for next time?",
            answer: "Yes. Saving a signature stores the image in your browser's localStorage on that device, so you can reuse it. Clear your browser data to remove it."
          },
          {
            question: "Can I add a CONFIDENTIAL or APPROVED stamp while signing?",
            answer: "Yes. Sign PDF has an optional diagonal watermark field. For more control over opacity and placement, use [Watermark PDF](/tools/watermark-pdf)."
          }
        ]
      }
    ],
    relatedSlugs: [
      "audit-trail-digital-signatures-contracts",
      "aes-256-password-protect-pdf-locally",
      "flatten-interactive-pdf-form-fields"
    ]
  },
  {
    slug: "aes-256-password-protect-pdf-locally",
    title: "PDF Encryption Explained: RC4 vs. AES-128 vs. AES-256 & Cleaning Metadata First",
    seoTitle: "PDF Encryption Explained: RC4, AES-128 & AES-256",
    description: "How PDF encryption evolved from 40-bit RC4 to AES-256, why metadata can stay readable in a locked PDF, and why to clean a file before encrypting it.",
    category: "legal",
    tags: ["AES-256", "Encryption", "Password Protect", "Document Security", "Sanitize PDF"],
    publishedAt: "2026-05-12",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "sanitize",
      title: "Clean Hidden Metadata Before Encrypting",
      description: "Clear document metadata and old revisions in your browser, then encrypt the clean file with the tool of your choice.",
      buttonText: "Sanitize PDF First",
      href: "/tools/sanitize-pdf",
      highlightText: "No uploads"
    },
    blocks: [
      {
        type: "paragraph",
        text: "Before emailing tax returns, estate plans or board papers, many people add a password to the PDF. Two pitfalls are common: uploading the unencrypted file to an unknown 'free password protector' website, and assuming that a password-protected PDF hides everything — when some encryption settings leave the XMP metadata readable."
      },
      {
        type: "callout",
        variant: "info",
        title: "What iKnowAPDF Does and Doesn't Do",
        text: "iKnowAPDF does not currently add or remove PDF passwords. Use it to clean the document first, then encrypt with a trusted desktop tool such as Adobe Acrobat, LibreOffice's PDF export, or qpdf."
      },
      {
        type: "heading2",
        id: "the-evolution-of-pdf-encryption",
        text: "PDF Encryption Revisions (R2 to R6)"
      },
      {
        type: "paragraph",
        text: "Not all password-protected PDFs are equally strong. The standard security handler has gone through several revisions:"
      },
      {
        type: "comparisonTable",
        headers: ["Security Revision", "Cipher", "PDF Version", "Key Derivation", "Status Today"],
        rows: [
          ["Revision 2 (R=2)", "40-bit RC4", "PDF 1.1 – 1.3", "MD5", "Broken — can be cracked quickly"],
          ["Revision 3 (R=3)", "Up to 128-bit RC4", "PDF 1.4", "MD5 (50 iterations)", "Obsolete"],
          ["Revision 4 (R=4)", "128-bit RC4 or AES", "PDF 1.5 – 1.6", "MD5-based", "Legacy compatibility only"],
          ["Revision 6 (R=6)", "256-bit AES", "PDF 1.7 ext. 3 / PDF 2.0", "SHA-256/384/512 based", "Current recommendation"]
        ]
      },
      {
        type: "paragraph",
        text: "Even with AES-256, the password is the weak point: a short or common password can be guessed regardless of the cipher. Use a long passphrase."
      },
      {
        type: "heading2",
        id: "user-vs-owner-passwords",
        text: "Why Clean Metadata and Old Revisions Before Encrypting"
      },
      {
        type: "paragraph",
        text: "The PDF standard lets an encryptor leave the XMP /Metadata stream unencrypted (controlled by the /EncryptMetadata flag), mainly so desktop search can index it. When that happens, author names, titles and similar details remain readable even though the page content is locked. Incremental saves can also carry earlier drafts inside the file. Cleaning the document first removes both issues."
      },
      {
        type: "heading3",
        id: "raw-xmp-leak-inspection",
        text: "Example: Readable Metadata in an Encrypted PDF"
      },
      {
        type: "code",
        title: "XMP Metadata Left Unencrypted (/EncryptMetadata false)",
        language: "pdf",
        code: `% Metadata stream left in plaintext when /EncryptMetadata is false
14 0 obj
<<
  /Type /Metadata
  /Subtype /XML
  /Length 1240
>>
stream
<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
   <dc:creator><rdf:Seq><rdf:li>Senior Managing Partner (j.doe@mergers-corp.com)</rdf:li></rdf:Seq></dc:creator>
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">Acquisition_Project_Titan_v4_Draft.docx</rdf:li></rdf:Alt></dc:title>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
endstream
endobj`
      },
      {
        type: "callout",
        variant: "security",
        title: "Clean First, Encrypt Last",
        text: "Run the file through the [PDF Sanitizer](/tools/sanitize-pdf) to clear document metadata and rebuild it without old revisions, then apply encryption as the very last step."
      },
      {
        type: "step",
        number: 1,
        title: "Load the PDF into the Sanitizer",
        text: "Open [Sanitize PDF](/tools/sanitize-pdf) and drop in your file. It is processed in your browser."
      },
      {
        type: "step",
        number: 2,
        title: "Clear Metadata & Rebuild",
        text: "Keep the options to clear the /Info fields and strip XMP / rebuild the file enabled."
      },
      {
        type: "step",
        number: 3,
        title: "Encrypt the Clean File",
        text: "Add an AES-256 password with a trusted desktop tool (for example `qpdf --encrypt <user-pw> <owner-pw> 256 -- in.pdf out.pdf`), and share the password through a different channel than the file."
      },
      {
        type: "toolCta",
        toolId: "sanitize"
      },
      {
        type: "faq",
        items: [
          {
            question: "Why can metadata be visible in an encrypted PDF?",
            answer: "The encryption dictionary can set /EncryptMetadata to false, which leaves the XMP metadata stream unencrypted so it can be indexed. Author names and titles in that stream are then readable without the password."
          },
          {
            question: "Can earlier drafts be recovered from a password-protected PDF?",
            answer: "If the file was saved incrementally before encryption, earlier revisions may still be inside it and readable to anyone with the password. Rebuilding the file with the sanitizer before encrypting removes them."
          },
          {
            question: "Does sanitizing reduce image or font quality?",
            answer: "No. Pages, fonts and images are copied without re-compression. Only document-level metadata and old revisions are dropped (bookmarks are not carried over)."
          },
          {
            question: "Can iKnowAPDF recover a forgotten PDF password?",
            answer: "No. iKnowAPDF doesn't crack or remove passwords. Store passwords in a password manager."
          }
        ]
      }
    ],
    relatedSlugs: [
      "fix-encrypted-permissions-restricted-pdf",
      "digital-signature-vs-electronic-signature-pdf",
      "sanitize-pdf-metadata-redaction"
    ]
  },
  {
    slug: "fix-encrypted-permissions-restricted-pdf",
    title: "'PDF Permissions Restricted' on Bank Statements: What It Means and What You Can Do",
    seoTitle: "Restricted Bank Statement PDF: What You Can Do",
    description: "Why banks restrict statement PDFs with an owner password, what the permission flags control, and legitimate ways account holders can work with these files.",
    category: "legal",
    tags: ["Bank Statement", "Permissions Restricted", "CPA Workflow", "Financial Security"],
    publishedAt: "2026-05-20",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "merge",
      title: "Combine Statements into One Packet",
      description: "Merge statements and supporting documents in the order you choose — in your browser, without uploading financial records.",
      buttonText: "Open PDF Merger",
      href: "/tools/merge-pdf",
      highlightText: "No uploads"
    },
    blocks: [
      {
        type: "paragraph",
        text: "Accountants, mortgage processors and small business owners regularly download legitimate bank statements, only to find they can't combine them into a tax or loan packet or copy figures into a spreadsheet. The viewer says 'This document has permissions restrictions.' Here is what that means and how to work with such files legitimately."
      },
      {
        type: "heading2",
        id: "why-banks-lock-statements",
        text: "Why Banks Restrict Statement PDFs"
      },
      {
        type: "paragraph",
        text: "Some banks apply an 'owner password' to statements. This sets a permissions value (/P) in the PDF's security dictionary that asks viewers to disable actions such as printing, copying text, or changing pages. The file still opens without a password, but the content is encrypted and compliant viewers enforce the restrictions."
      },
      {
        type: "heading3",
        id: "the-encrypt-dictionary-anatomy",
        text: "Anatomy of the /Encrypt Dictionary"
      },
      {
        type: "code",
        title: "Standard Security Handler /Encrypt Dictionary (ISO 32000-1 § 7.6)",
        language: "pdf",
        code: `% Owner-password restrictions on a statement
14 0 obj
<<
  /Filter /Standard
  /V 4
  /R 4
  /P -1028        % Permission bits: which actions viewers should allow
  /Length 128
  /U <4a8f9c2d1b...>
  /O <b7e12f6a9e...>
>>
endobj
% Page content is encrypted even though no password is needed to open it`
      },
      {
        type: "callout",
        variant: "warning",
        title: "iKnowAPDF Does Not Decrypt PDFs",
        text: "Our tools don't remove passwords or decrypt files. Because the page content of a restricted PDF is encrypted, running it through tools like Merge or Sanitize may fail or produce blank pages. Use one of the options below instead."
      },
      {
        type: "heading2",
        id: "step-by-step-unrestriction",
        text: "Legitimate Ways to Work with a Restricted Statement"
      },
      {
        type: "step",
        number: 1,
        title: "Ask the Bank for an Unrestricted Copy or a Data Export",
        text: "Most online banking portals offer CSV, Excel or OFX exports of transactions, which are far better for analysis than copying from a PDF. Some banks also provide unrestricted statement copies on request."
      },
      {
        type: "step",
        number: 2,
        title: "Print to PDF if Printing Is Allowed",
        text: "If the statement allows printing, your operating system's 'Print to PDF' / 'Save as PDF' produces a new, unrestricted file you can then [merge](/tools/merge-pdf) with other documents."
      },
      {
        type: "step",
        number: 3,
        title: "Use a Desktop Tool on Your Own Machine",
        text: "Desktop tools such as qpdf (`qpdf --decrypt in.pdf out.pdf`) can remove owner restrictions from files you are authorized to use, without uploading them. Then combine and [compress](/tools/compress-pdf) the result as needed."
      },
      {
        type: "callout",
        variant: "security",
        title: "Keep Client Financial Data Off Unknown Websites",
        text: "Accountants in the US are subject to the FTC Safeguards Rule under the Gramm-Leach-Bliley Act. Uploading client statements to random web tools is hard to square with a written information security program — keep processing on systems you control."
      },
      {
        type: "toolCta",
        toolId: "merge"
      },
      {
        type: "faq",
        items: [
          {
            question: "Is it legal to remove restrictions from my own statements?",
            answer: "Generally, working with your own records (or a client's, with authorization) for accounting or tax purposes is routine, but rules and bank terms vary by country. When in doubt, ask the bank for an unrestricted copy or a data export."
          },
          {
            question: "Can iKnowAPDF open a PDF if I don't know the password?",
            answer: "No. iKnowAPDF doesn't crack passwords or decrypt files."
          },
          {
            question: "Will printing to PDF change transaction amounts or dates?",
            answer: "No, the visible content is the same, though the new file may lose selectable text or links depending on your printer driver."
          },
          {
            question: "How do I combine statements once they're unrestricted?",
            answer: "Use [Merge PDF](/tools/merge-pdf) to combine them in order, and [Compress PDF](/tools/compress-pdf) if the packet is too large for the lender's portal."
          }
        ]
      }
    ],
    relatedSlugs: [
      "aes-256-password-protect-pdf-locally",
      "audit-trail-digital-signatures-contracts",
      "sanitize-pdf-metadata-redaction"
    ]
  },
  {
    slug: "audit-trail-digital-signatures-contracts",
    title: "How to Keep a Record of Signed PDF Contracts: Audit Trails Explained",
    seoTitle: "Audit Trails for Signed PDF Contracts Explained",
    description: "What an e-signature audit trail is, what it can and can't prove, and how freelancers and small businesses can keep a simple record of signed PDF contracts.",
    category: "legal",
    tags: ["Audit Trail", "Contract Signing", "ESIGN Act", "SHA-256", "Sign PDF"],
    publishedAt: "2026-05-28",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "sign",
      title: "Sign a Contract with a SHA-256 Summary Page",
      description: "Add your signature and date, and optionally append a page listing SHA-256 hashes of the document — in your browser.",
      buttonText: "Open PDF Signer",
      href: "/tools/sign-pdf",
      highlightText: "No account needed"
    },
    blocks: [
      {
        type: "paragraph",
        text: "Freelancers and small businesses often wonder whether they need a paid e-signature subscription to send a few client agreements. US law (the ESIGN Act and state UETA laws) doesn't require any particular provider. What matters is being able to show that the parties intended to sign, agreed to do business electronically, and that the record wasn't changed afterwards. This article explains what an audit trail contributes and what a simple self-managed approach can and can't do."
      },
      {
        type: "callout",
        variant: "info",
        title: "Not Legal Advice",
        text: "Requirements differ by jurisdiction and document type. For high-value or regulated agreements, a dedicated e-signature service or a lawyer's advice is worth it."
      },
      {
        type: "heading2",
        id: "the-four-legal-pillars",
        text: "Four Things an E-Signature Record Should Show"
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Intent to sign: Each party deliberately applied a signature.",
          "Consent to do business electronically: The parties agreed to use electronic records (often stated in the contract itself).",
          "Association with the record: The signature belongs to this specific document.",
          "Record integrity and retention: You can show the document wasn't altered after signing and you kept a copy."
        ]
      },
      {
        type: "heading2",
        id: "the-self-contained-certificate",
        text: "What a Paid Service Adds"
      },
      {
        type: "paragraph",
        text: "Services like DocuSign or Adobe Sign send the document to each signer by email, log who opened and signed it from which address and when, and apply a certificate-based digital signature so later changes are detected automatically. That third-party log is the main thing a self-managed approach doesn't have."
      },
      {
        type: "heading3",
        id: "audit-certificate-spec",
        text: "What the iKnowAPDF Summary Page Contains"
      },
      {
        type: "paragraph",
        text: "In [Sign PDF](/tools/sign-pdf), the optional SHA-256 page records the file name, page count, number of signatures placed, the signing time (UTC), and two SHA-256 hashes computed in your browser: one of the original file and one of the signed content before the summary page was added. For example:"
      },
      {
        type: "code",
        title: "Example SHA-256 Summary Page",
        language: "text",
        code: `=== CERTIFICATE OF COMPLETION & CRYPTOGRAPHIC AUDIT TRAIL ===
Document File Name: Master_Services_Agreement_2026.pdf
Original Page Count: 8 Page(s)
Signatures / Stamps Placed: 2 Item(s)

SHA-256 DIGESTS:
Pre-Signing Source PDF SHA-256:
  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
Post-Signing Payload SHA-256:
  8f434346648f6b96df89dda901c5176b10e6d059612d559c41438b2929e741cf`
      },
      {
        type: "paragraph",
        text: "These hashes let you show which original file was signed, as long as you keep that original. They do not identify who signed, and they are not a certificate-based PDF signature, so PDF readers will not warn about later edits."
      },
      {
        type: "step",
        number: 1,
        title: "Agree on Electronic Signing",
        text: "Include a short clause in the contract stating that the parties agree to sign electronically."
      },
      {
        type: "step",
        number: 2,
        title: "Sign and Add the Summary Page",
        text: "Open the agreement in [Sign PDF](/tools/sign-pdf), place your signature and date, and tick 'Append Tamper-Evident SHA-256 Audit Certificate Page'."
      },
      {
        type: "step",
        number: 3,
        title: "Exchange and Keep Records",
        text: "Send the signed PDF to the other party by email (which gives you a timestamped record of delivery), and keep the original, the signed file and the email thread together."
      },
      {
        type: "toolCta",
        toolId: "sign"
      },
      {
        type: "faq",
        items: [
          {
            question: "Will a court accept a contract signed this way?",
            answer: "Electronic signatures are generally admissible, but how much weight a record gets depends on the evidence you can produce — who signed, how the document was exchanged, and whether it was changed. Hashes, emails and retained copies all help; for disputes-prone or high-value deals, use a service that independently logs signer identity."
          },
          {
            question: "Where are my signed contracts stored?",
            answer: "Wherever you save them. iKnowAPDF doesn't store your documents; the file is processed in your browser and downloaded to your device, so keeping backups is up to you."
          },
          {
            question: "Does the SHA-256 summary page cost extra?",
            answer: "No. It is free and computed in your browser with the Web Crypto API."
          },
          {
            question: "Can someone alter the signed PDF after downloading it?",
            answer: "Anyone can edit a PDF file. What the hashes give you is a way to check: if you still have your copies, any alteration of the original or signed content produces a different hash. A certificate-based digital signature is needed if you want PDF readers to detect changes automatically."
          }
        ]
      }
    ],
    relatedSlugs: [
      "digital-signature-vs-electronic-signature-pdf",
      "aes-256-password-protect-pdf-locally",
      "sanitize-pdf-metadata-redaction"
    ]
  }
];
