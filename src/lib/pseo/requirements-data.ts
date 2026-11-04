import type { RequirementPage } from "./requirements-types";

/**
 * Real-world upload requirements, each checked against the cited sources on
 * `verifiedOn`. Exam specs change every session — re-check the official
 * notice/bulletin before each application window and update `verifiedOn`.
 *
 * KB/MB convention: 1 MB = 1024 KB (matches `formatKb`). Targets leave a
 * margin under the max (and stay above any min) so either convention passes.
 */
export const REQUIREMENT_PAGES: RequirementPage[] = [
  // -------------------------------------------------------------------------
  // SSC (CGL 2026 / CHSL 2026)
  // -------------------------------------------------------------------------
  {
    slug: "ssc-photo-signature-size",
    title: "SSC Photo & Signature Size 2026: Signature 10–20 KB",
    h1: "SSC Photo and Signature Size (CGL & CHSL 2026)",
    metaDescription:
      "SSC captures your photo live; you only upload a signature: JPEG, 10–20 KB, about 6.0 × 2.0 cm. Resize your signature to 18 KB free in your browser.",
    portal: "Staff Selection Commission (SSC)",
    country: "India",
    category: "exam",
    intro:
      "For SSC CGL 2026 and CHSL 2026 you do not upload a photo file: the application captures a live photograph through your webcam or phone. The only image you upload is your signature, as a JPEG/JPG of 10 to 20 KB, about 6.0 cm wide × 2.0 cm high. The compressor below is preset to 18 KB and works on your device, so your signature is never uploaded to us.",
    specs: [
      {
        item: "Signature",
        format: "JPEG / JPG",
        minKb: 10,
        maxKb: 20,
        dimensions: "About 6.0 cm (width) × 2.0 cm (height)",
        notes:
          "Para 9.6 of the CGL 2026 and CHSL 2026 notices. The OTR annexure of the same notices says about 4.0 cm × 2.0 cm, so a wide, clear signature fits either. PwD (VH) candidates may use a thumb impression.",
        tool: "compress-image",
        targetKb: 18,
      },
    ],
    primaryTool: "compress-image",
    primaryTargetKb: 18,
    steps: [
      "Sign on plain white paper with a dark pen, large enough to stay readable. The notice says blurred or miniature signatures will be rejected.",
      "Scan or photograph the signature in good light and crop it to a wide rectangle, roughly 3 : 1 (about 6.0 × 2.0 cm).",
      "Save it as a JPG and drop it into the compressor above. It is preset to 18 KB, inside the 10–20 KB window.",
      "Check the result is between 10 KB and 20 KB and still sharp. If it comes out under 10 KB, start again from a larger or higher-quality scan.",
      "Log in at ssc.gov.in, upload the signature, and capture your live photo when the application prompts you.",
    ],
    tips: [
      "Live photo: find good light and a plain background, keep the camera at eye level and look straight ahead (notice para 9.4).",
      "Do not wear a cap, mask or glasses/spectacles while the live photo is captured.",
      "Keep your whole face inside the area marked by the camera: not too close and not too far.",
      "Never point the camera at an existing printed photo. The notice says applications with a photo of a pre-existing photograph will be rejected.",
      "The notices say applications submitted through Aadhaar-based authentication will not be rejected because the photo or signature misses the prescribed standards.",
    ],
    faqs: [
      {
        q: "Do I need to upload a passport photo for SSC CGL or CHSL 2026?",
        a: "No. According to the 2026 notices, you don't need a pre-existing photograph. The application module captures a live photo while you fill in the form. If the webcam doesn't work, the notice says to use the QR code on the Upload Documents page to capture the photo with your phone.",
      },
      {
        q: "What is the SSC signature size in KB?",
        a: "10 KB to 20 KB, in JPEG/JPG format, according to para 9.6 of both the CGL 2026 and CHSL 2026 notices. The image should be about 6.0 cm wide and 2.0 cm high.",
      },
      {
        q: "The notice says 6.0 cm in one place and 4.0 cm in another. Which is right?",
        a: "Both figures appear in the same notices: para 9.6 says about 6.0 × 2.0 cm and the One-Time Registration annexure says about 4.0 × 2.0 cm. Both are approximate, and the KB range (10–20 KB) is the same in both places. A clear signature cropped to a wide rectangle on a white background is the safest choice.",
      },
      {
        q: "My signature file is smaller than 10 KB. What should I do?",
        a: "A compressor can only make files smaller. Re-scan or re-photograph the signature at a higher resolution or with a larger crop, then compress it back into the 10–20 KB range.",
      },
      {
        q: "Does this apply to SSC MTS, GD or other SSC exams?",
        a: "We checked the CGL 2026 and CHSL 2026 notices. Every SSC exam has its own notice, so confirm the signature rules in the notice for your exam before applying.",
      },
      {
        q: "Is my signature uploaded to iKnowAPDF?",
        a: "No. The compression runs entirely in your browser, and the file never leaves your device.",
      },
    ],
    sources: [
      {
        label: "SSC: Notice of Combined Graduate Level Examination, 2026 (paras 9.4–9.6, Annexure III)",
        url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
      },
      {
        label: "SSC: Notice of Combined Higher Secondary (10+2) Level Examination, 2026 (paras 9.4–9.6)",
        url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_chsl_2026.pdf",
      },
      { label: "Staff Selection Commission: official website", url: "https://ssc.gov.in/" },
    ],
    verifiedOn: "2026-11-04",
  },

  // -------------------------------------------------------------------------
  // IBPS (CRP PO/MT-XVI, 2026)
  // -------------------------------------------------------------------------
  {
    slug: "ibps-photo-signature-size",
    title: "IBPS Photo, Signature & Thumb Size: 20–50 KB Guide",
    h1: "IBPS Photo, Signature, Thumb Impression & Declaration Size",
    metaDescription:
      "IBPS PO/MT-XVI: photo 20–50 KB (200×230 px), signature 10–20 KB, thumb 20–50 KB, declaration 50–100 KB. Resize each one free in your browser.",
    portal: "Institute of Banking Personnel Selection (IBPS)",
    country: "India",
    category: "exam",
    intro:
      "IBPS asks for four JPG/JPEG images: a photograph of 20–50 KB (200 × 230 px preferred), a signature of 10–20 KB (140 × 60 px), a left thumb impression of 20–50 KB (240 × 240 px) and a hand-written declaration of 50–100 KB (800 × 400 px). Your 10th certificate goes as an A4 PDF of up to 500 KB. These figures come from the CRP PO/MT-XVI notification (2026), and the compressor below is preset to 45 KB for the photograph.",
    specs: [
      {
        item: "Photograph",
        format: "JPG / JPEG",
        minKb: 20,
        maxKb: 50,
        dimensions: "200 × 230 px preferred (4.5 cm × 3.5 cm)",
        notes:
          "Recent passport-style colour photo, light (preferably white) background. A live photo is also captured separately during the application.",
        tool: "compress-image",
        targetKb: 45,
      },
      {
        item: "Signature",
        format: "JPG / JPEG",
        minKb: 10,
        maxKb: 20,
        dimensions: "140 × 60 px preferred",
        notes: "Sign on white paper with a black ink pen. Not in capital letters.",
        tool: "compress-image",
        targetKb: 18,
      },
      {
        item: "Left thumb impression",
        format: "JPG / JPEG",
        minKb: 20,
        maxKb: 50,
        dimensions: "240 × 240 px at 200 DPI (3 cm × 3 cm)",
        notes: "Black or blue ink on white paper.",
        tool: "compress-image",
        targetKb: 45,
      },
      {
        item: "Hand-written declaration",
        format: "JPG / JPEG",
        minKb: 50,
        maxKb: 100,
        dimensions: "800 × 400 px at 200 DPI (10 cm × 5 cm)",
        notes: "In English, in your own handwriting, black ink on white paper, not in capital letters.",
        tool: "compress-image",
        targetKb: 90,
      },
      {
        item: "10th / SSLC certificate (and Clause J(ix) certificate, if applicable)",
        format: "PDF",
        maxKb: 500,
        dimensions: "A4 page",
        notes: "If the scan is larger than 500 KB, the notification says to lower the scan DPI or colours.",
        tool: "compress-pdf",
        targetKb: 450,
      },
    ],
    primaryTool: "compress-image",
    primaryTargetKb: 45,
    steps: [
      "Scan each item at a minimum of 200 DPI in true colour, as the notification recommends.",
      "Crop each image to the edge of the photo, signature, thumb impression or declaration, then resize it to the preferred pixel size (for example 200 × 230 px for the photo).",
      "Compress each JPG into its range. The tool above is set to 45 KB for the photo; set it to about 45 KB for the thumb impression, 18 KB for the signature and 90 KB for the declaration.",
      "Save the 10th certificate as an A4 PDF and compress it under 500 KB if needed.",
      "Upload each file in its own slot. IBPS says the system won't let you continue until the photo and signature meet the specifications.",
    ],
    tips: [
      "A signature or declaration written in CAPITAL LETTERS is not accepted.",
      "If your signature on the attendance sheet or call letter doesn't match the uploaded one, the notification says you will be disqualified.",
      "Photo: no caps, hats or dark glasses. Religious headwear is allowed as long as it doesn't cover your face, and glasses must not reflect light over your eyes.",
      "The declaration must be in English and in your own handwriting. One written by someone else, or in another language, makes the application invalid.",
      "No left thumb? The notification gives an order of alternatives (right thumb, then fingers). Say which finger you used in the uploaded document.",
    ],
    faqs: [
      {
        q: "What is the IBPS photo size in KB?",
        a: "Between 20 KB and 50 KB, in JPG/JPEG format, with 200 × 230 pixels preferred, according to the CRP PO/MT-XVI notification.",
      },
      {
        q: "What should the IBPS hand-written declaration say?",
        a: "The notification gives this text: “I, ______ (Name of the candidate), hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required.” Write it yourself in English, not in capital letters.",
      },
      {
        q: "My declaration image is over 100 KB. How do I fix it?",
        a: "Resize it to about 800 × 400 px and compress it to around 90 KB with the image compressor above. Keep it above 50 KB so the handwriting stays readable and inside the allowed range.",
      },
      {
        q: "Do these sizes apply to IBPS Clerk, RRB or SO?",
        a: "We checked these figures against the PO/MT-XVI notification. IBPS publishes a scanning guideline annexure in each notification, so check the one for your recruitment, because figures can differ.",
      },
      {
        q: "Are my photo and documents uploaded to your server?",
        a: "No. iKnowAPDF compresses files locally in your browser, so nothing is sent to us.",
      },
    ],
    sources: [
      {
        label: "IBPS: Detailed Notification CRP PO/MT-XVI (Annexure III: Guidelines for scanning and upload of documents)",
        url: "https://www.ibps.in/wp-content/uploads/Detailed-Notification_CRP-PO-XVI_Final_V1_30.06.2026.pdf",
      },
      { label: "IBPS: official website", url: "https://www.ibps.in/" },
    ],
    verifiedOn: "2026-11-04",
  },

  // -------------------------------------------------------------------------
  // NEET (UG) 2026 — NTA
  // -------------------------------------------------------------------------
  {
    slug: "neet-document-size-requirements",
    title: "NEET UG Photo, Signature & Document Size (KB) 2026",
    h1: "NEET UG Photo, Signature, Thumb Impression & PDF Size Requirements",
    metaDescription:
      "NEET UG 2026: photo 10–200 KB, signature 10–100 KB, finger & thumb impressions 50–200 KB, certificate PDFs 50–300 KB. Resize free in your browser.",
    portal: "National Testing Agency (NTA): NEET (UG)",
    country: "India",
    category: "exam",
    intro:
      "As per the NEET (UG) 2026 information bulletin, the passport-size photo must be a JPG/JPEG of 10–200 KB and the signature 10–100 KB, while certificates (category, Class X, address proof, PwD/UDID) go as PDFs of 50–300 KB. The bulletin gives two ranges for the left- and right-hand finger and thumb impressions (10–200 KB and 50–300 KB), so aim for 50–200 KB to satisfy both. NTA revises the bulletin every session, so always check your current notification.",
    specs: [
      {
        item: "Passport-size photograph",
        format: "JPG / JPEG",
        minKb: 10,
        maxKb: 200,
        dimensions: "Face covering about 80% of the image, ears visible, white background",
        notes: "Colour or black & white, without a mask. Use the same photo you will paste on the attendance sheet.",
        tool: "compress-image",
        targetKb: 180,
      },
      {
        item: "Signature",
        format: "JPG / JPEG",
        minKb: 10,
        maxKb: 100,
        tool: "compress-image",
        targetKb: 90,
      },
      {
        item: "Left and right hand fingers and thumb impressions",
        format: "JPG / JPEG",
        minKb: 50,
        maxKb: 200,
        notes:
          "The bulletin lists 10–200 KB in item (iii) and 50–300 KB in its later section. A file of 50–200 KB satisfies both. Unclear impressions are rejected.",
        tool: "compress-image",
        targetKb: 150,
      },
      {
        item: "Identity proof (only if not verifying via Aadhaar or DigiLocker)",
        format: "JPG / JPEG",
        minKb: 10,
        maxKb: 200,
        tool: "compress-image",
        targetKb: 180,
      },
      {
        item: "Class X (or equivalent) certificate and marksheet",
        format: "PDF",
        minKb: 50,
        maxKb: 300,
        notes: "Each one as a separate PDF. If marks are in CGPA, the conversion/equivalence certificate is also 50–300 KB.",
        tool: "jpg-to-pdf",
        targetKb: 280,
      },
      {
        item: "Category certificate (if applicable)",
        format: "PDF",
        minKb: 50,
        maxKb: 300,
        tool: "compress-pdf",
        targetKb: 280,
      },
      {
        item: "Address proof (present and permanent)",
        format: "PDF",
        minKb: 50,
        maxKb: 300,
        tool: "compress-pdf",
        targetKb: 280,
      },
      {
        item: "PwD / PwBD / UDID certificate (if applicable)",
        format: "PDF",
        minKb: 50,
        maxKb: 300,
        tool: "compress-pdf",
        targetKb: 280,
      },
    ],
    primaryTool: "compress-image",
    primaryTargetKb: 180,
    steps: [
      "Use a recent passport-size photo with a white background, where your face (with ears visible and no mask) fills about 80% of the image.",
      "Scan your signature and your left- and right-hand finger and thumb impressions clearly, and save them as JPG files.",
      "Compress the photo to about 180 KB (preset above), the signature to about 90 KB and the impressions to about 150 KB.",
      "Turn certificate scans or phone photos into PDFs with JPG to PDF, and keep each file between 50 KB and 300 KB. If a PDF is under 50 KB, re-scan at a higher resolution rather than compressing.",
      "Upload carefully. The bulletin says you will not be allowed to correct the photo, signature or impressions later.",
      "Be ready to capture a live photo with your webcam, or with your phone through the QR code on the form.",
    ],
    tips: [
      "Spectacles are allowed in the photo only if you wear them regularly.",
      "Polaroid and computer-generated photos are not accepted, and an unclear photo can get the application rejected.",
      "Keep 6–8 passport-size and 4–6 postcard-size (4″ × 6″) colour photos with a white background for the exam centre, counselling and admission.",
      "Unclear finger and thumb impressions are rejected, so press firmly and scan in good light.",
      "Uploading a fabricated photo, or someone else's, is treated as unfair means.",
    ],
    faqs: [
      {
        q: "What is the NEET UG 2026 photo size in KB?",
        a: "Between 10 KB and 200 KB, in JPG/JPEG format, according to the NEET (UG) 2026 information bulletin. Your face (with ears) should cover about 80% of the photo, against a white background.",
      },
      {
        q: "Do I need to upload a postcard-size photo for NEET 2026?",
        a: "The 2026 bulletin's upload list doesn't include a postcard-size photo. It asks you to keep 4–6 postcard-size (4″ × 6″) colour photos with a white background for later use. Check the bulletin for your session, because this has changed between years.",
      },
      {
        q: "Why do you suggest 50–200 KB for the finger and thumb impressions?",
        a: "The 2026 bulletin gives 10–200 KB in one place and 50–300 KB in another. A file between 50 KB and 200 KB meets both, so it can't be rejected for size whichever rule the portal enforces.",
      },
      {
        q: "My certificate PDF is only 30 KB. Is that a problem?",
        a: "Yes. The bulletin asks for PDFs between 50 KB and 300 KB. Re-scan at a higher resolution, or convert a clearer photo of the document with JPG to PDF, so the file is above 50 KB.",
      },
      {
        q: "Are my documents uploaded to iKnowAPDF?",
        a: "No. All compression and conversion happens in your browser, so your photo, signature and certificates stay on your device.",
      },
    ],
    sources: [
      {
        label: "NTA: Information Bulletin for NEET (UG) 2026 (Step 2(d), upload specifications)",
        url: "https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/02/202602231394640855.pdf",
      },
      { label: "NEET (UG): official NTA website", url: "https://neet.nta.nic.in/" },
    ],
    verifiedOn: "2026-11-04",
  },

  // -------------------------------------------------------------------------
  // JEE (Main) 2027 — NTA
  // -------------------------------------------------------------------------
  {
    slug: "jee-main-photo-signature-size",
    title: "JEE Main 2027 Photo & Signature Size: 10–200 KB Guide",
    h1: "JEE Main 2027 Photo, Signature and Document Size",
    metaDescription:
      "JEE Main 2027 bulletin: photo 10–200 KB JPG, signature 10–100 KB, Class 10 certificate PDF 50–300 KB. Resize or compress free in your browser.",
    portal: "National Testing Agency (NTA): JEE (Main)",
    country: "India",
    category: "exam",
    intro:
      "As per the JEE (Main) 2027 information bulletin, the scanned passport-size photo must be a colour JPG/JPEG between 10 KB and 200 KB, the signature 10–100 KB, and the Class 10 certificate or marksheet a PDF between 50 KB and 300 KB. You will also capture a live photo while filling in the form. The compressor below is preset to 180 KB for the photo.",
    specs: [
      {
        item: "Passport-size photograph",
        format: "JPG / JPEG",
        minKb: 10,
        maxKb: 200,
        dimensions: "Colour, face covering about 80% (ears visible, no mask), white background",
        tool: "compress-image",
        targetKb: 180,
      },
      {
        item: "Signature",
        format: "JPG / JPEG",
        minKb: 10,
        maxKb: 100,
        tool: "compress-image",
        targetKb: 90,
      },
      {
        item: "Class 10 (or equivalent) certificate / marksheet",
        format: "PDF",
        minKb: 50,
        maxKb: 300,
        notes: "Must be clearly legible.",
        tool: "jpg-to-pdf",
        targetKb: 280,
      },
      {
        item: "Disability / UDID certificate (if applicable)",
        format: "PDF",
        minKb: 50,
        maxKb: 300,
        tool: "compress-pdf",
        targetKb: 280,
      },
      {
        item: "Certificate of physical limitation to write (if applicable)",
        format: "PDF",
        minKb: 50,
        maxKb: 300,
        tool: "compress-pdf",
        targetKb: 280,
      },
      {
        item: "Non-Indian passport (foreign nationals, including OCI)",
        format: "PDF",
        minKb: 50,
        maxKb: 300,
        tool: "compress-pdf",
        targetKb: 280,
      },
    ],
    primaryTool: "compress-image",
    primaryTargetKb: 180,
    steps: [
      "Use a recent colour passport-size photo with a white background, where your face (ears visible, no mask) fills about 80% of the frame.",
      "Scan or photograph your signature clearly and save it as a JPG.",
      "Compress the photo to about 180 KB (preset above) and the signature to about 90 KB, so both stay inside their ranges.",
      "Convert your Class 10 certificate or marksheet to a PDF with JPG to PDF and keep it between 50 KB and 300 KB.",
      "Upload the files on jeemain.nta.nic.in, then capture your live photo with a webcam, or with your phone through the QR code.",
    ],
    tips: [
      "The uploaded photo must be in colour against a white background, so don't use a black & white photo for JEE Main.",
      "For the live photo, use a white background with proper lighting and keep 80% of your face visible, with ears showing and no mask.",
      "NTA advises updating your Aadhaar with a recent photo and correct details before applying.",
      "After the correction window closes, you can't change the photo, signature or certificates.",
      "Using someone else's photo, signature or certificate is treated as unfair means.",
    ],
    faqs: [
      {
        q: "What is the JEE Main 2027 photo size?",
        a: "Between 10 KB and 200 KB, in JPG/JPEG format, according to the JEE (Main) 2027 information bulletin. It must be a colour photo with about 80% face coverage, ears visible, no mask, against a white background.",
      },
      {
        q: "What is the JEE Main signature size?",
        a: "10 KB to 100 KB in JPG/JPEG format, and clearly legible. Some older guides list 4–30 KB, but the 2027 bulletin says 10–100 KB.",
      },
      {
        q: "What format should the Class 10 certificate be in?",
        a: "A clearly legible PDF between 50 KB and 300 KB. If you only have phone photos, convert them to a single PDF with JPG to PDF, then check that the size is inside the range.",
      },
      {
        q: "Do I still need to upload a photo if I capture a live photo?",
        a: "Yes. The 2027 bulletin asks for both: a live photo captured during the form and a recent scanned passport-size photo.",
      },
      {
        q: "Does iKnowAPDF upload my files anywhere?",
        a: "No. Compression and conversion run locally in your browser, and nothing is sent to our servers.",
      },
    ],
    sources: [
      {
        label: "NTA: Information Bulletin, Joint Entrance Examination (Main) 2027 (upload specifications)",
        url: "https://cdnbbsr.s3waas.gov.in/s3f8e59f4b2fe7c5705bf878bbd494ccdf/uploads/2026/10/202610241890224107.pdf",
      },
      { label: "JEE (Main): official NTA website", url: "https://jeemain.nta.nic.in/" },
    ],
    verifiedOn: "2026-11-04",
  },

  // -------------------------------------------------------------------------
  // CUET (UG) 2026 — NTA
  // -------------------------------------------------------------------------
  {
    slug: "cuet-ug-photo-signature-size",
    title: "CUET UG Photo & Signature Size: Photo 10–200 KB",
    h1: "CUET (UG) Photo, Signature and Document Size",
    metaDescription:
      "CUET (UG) 2026 bulletin: photo 10–200 KB JPG, signature 10–50 KB, UDID certificate PDF 50–300 KB, ID proof 10–200 KB. Resize free in your browser.",
    portal: "National Testing Agency (NTA): CUET (UG)",
    country: "India",
    category: "exam",
    intro:
      "As per the CUET (UG) 2026 information bulletin, upload a colour passport-size photo as a JPG/JPEG of 10–200 KB and a signature of 10–50 KB. That signature limit is tighter than the 10–100 KB NTA allows for NEET and JEE Main. Disability/UDID certificates go as PDFs of 50–300 KB. The next bulletin may change these figures, so always check your current notification.",
    specs: [
      {
        item: "Passport-size photograph",
        format: "JPG / JPEG",
        minKb: 10,
        maxKb: 200,
        dimensions: "Colour, face covering about 80% (ears visible, no mask), white background",
        tool: "compress-image",
        targetKb: 180,
      },
      {
        item: "Signature",
        format: "JPG / JPEG",
        minKb: 10,
        maxKb: 50,
        tool: "compress-image",
        targetKb: 45,
      },
      {
        item: "Disability / UDID certificate (if applicable)",
        format: "PDF",
        minKb: 50,
        maxKb: 300,
        tool: "compress-pdf",
        targetKb: 280,
      },
      {
        item: "Identity proof (only if not verifying via Aadhaar or DigiLocker)",
        format: "JPG / JPEG",
        minKb: 10,
        maxKb: 200,
        tool: "compress-image",
        targetKb: 180,
      },
    ],
    primaryTool: "compress-image",
    primaryTargetKb: 180,
    steps: [
      "Use a recent colour passport-size photo with a white background, where your face (ears visible, no mask) fills about 80% of the image.",
      "Compress the photo to about 180 KB with the tool above.",
      "Scan your signature and set the compressor to about 45 KB. The CUET limit is 50 KB, not 100 KB.",
      "If you need to upload a UDID/disability certificate, save it as a PDF between 50 KB and 300 KB.",
      "Upload the files on the CUET (UG) portal, then capture your live photo with a webcam, or with your phone through the QR code.",
    ],
    tips: [
      "Don't reuse a NEET or JEE signature file without checking it. Anything over 50 KB will be too large for CUET (UG).",
      "For the live photo, use a light-coloured background with proper lighting and keep 80% of your face visible, with ears showing and no mask.",
      "NTA advises updating your Aadhaar with a recent photo and correct details before applying.",
      "Using someone else's photo, signature or certificate is treated as unfair means.",
    ],
    faqs: [
      {
        q: "What is the CUET UG photo size?",
        a: "Between 10 KB and 200 KB, in JPG/JPEG format, according to the CUET (UG) 2026 information bulletin. It must be a recent colour photo with about 80% face coverage against a white background.",
      },
      {
        q: "What is the CUET UG signature size?",
        a: "10 KB to 50 KB in JPG/JPEG format, and clearly legible.",
      },
      {
        q: "Do I need to upload my Class 10 certificate for CUET (UG)?",
        a: "The 2026 bulletin's upload section lists only the photograph, the signature, the disability/UDID certificate (if applicable) and an identity proof for candidates who aren't verifying through Aadhaar or DigiLocker. Check the bulletin for your year in case this changes.",
      },
      {
        q: "Are my photo and signature uploaded to your server?",
        a: "No. iKnowAPDF processes the files locally in your browser.",
      },
    ],
    sources: [
      {
        label: "NTA: CUET (UG) 2026 Information Bulletin (upload specifications)",
        url: "https://cdnbbsr.s3waas.gov.in/s3d1a21da7bca4abff8b0b61b87597de73/uploads/2026/01/202601031633478370.pdf",
      },
      { label: "CUET (UG): official NTA website", url: "https://cuet.nta.nic.in/" },
    ],
    verifiedOn: "2026-11-04",
  },

  // -------------------------------------------------------------------------
  // US visa (DS-160) digital photo — U.S. Department of State
  // -------------------------------------------------------------------------
  {
    slug: "ds-160-photo-size",
    title: "DS-160 Photo Size: 600×600 px, Under 240 KB JPEG",
    h1: "DS-160 Visa Photo Size and Digital Image Requirements",
    metaDescription:
      "US visa (DS-160) photo: square JPEG, 600×600 to 1200×1200 px, 240 KB or less, colour sRGB. Resize and compress yours free in your browser.",
    portal: "U.S. Department of State: visa application (DS-160)",
    country: "United States",
    category: "visa",
    intro:
      "The U.S. Department of State requires the digital photo for a visa application to be a square JPEG between 600 × 600 and 1200 × 1200 pixels, 240 KB or smaller, in 24-bit colour (sRGB). The compressor below is preset to 230 KB. If your photo is larger than 1200 px, set an exact size of 600 × 600 px.",
    specs: [
      {
        item: "Digital photo (camera or phone)",
        format: "JPEG",
        maxKb: 240,
        dimensions: "Square; 600 × 600 px (min) to 1200 × 1200 px (max)",
        notes:
          "Colour, 24 bits per pixel, sRGB. Compression ratio should be 20:1 or less. travel.state.gov blocks automated access, so we checked the official page's archived copy (June 2025) and its indexed text.",
        tool: "compress-image",
        targetKb: 230,
      },
      {
        item: "Scanned printed photo",
        format: "JPEG",
        maxKb: 240,
        dimensions: "Scan at 300 pixels per inch, crop to exactly 600 × 600 px",
        notes: "Only if you are digitising an existing printed photo.",
        tool: "compress-image",
        targetKb: 230,
      },
    ],
    primaryTool: "compress-image",
    primaryTargetKb: 230,
    steps: [
      "Take the photo in front of a plain white or off-white background. It must have been taken within the last 6 months and reflect how you look now.",
      "Crop it square so your head (chin to top of hair) takes up 50%–69% of the image height.",
      "Resize it to 600 × 600 px, or any square size up to 1200 × 1200 px, and save it as a JPEG.",
      "Compress it to 240 KB or less. The tool above is preset to 230 KB.",
      "Upload it in the photo step of your DS-160.",
    ],
    tips: [
      "Eyeglasses are not allowed in new visa photos, except in rare medical cases backed by a signed medical statement.",
      "No hats or head coverings unless worn daily for a religious purpose. Your full face must be visible with no shadows on it.",
      "No headphones, wireless hands-free devices or similar items.",
      "Don't use filters or edit the photo to change your appearance. The State Department says photos must not be digitally enhanced or altered.",
      "Don't over-compress. The State Department says the compression ratio should be 20:1 or less, which for a 600 × 600 photo means not going much below about 53 KB.",
      "A Department of State employee makes the final decision on whether your photo is acceptable.",
    ],
    faqs: [
      {
        q: "What size should a DS-160 photo be in pixels?",
        a: "Square, at least 600 × 600 pixels and no more than 1200 × 1200 pixels. If you scan a printed photo, the State Department says to scan at 300 pixels per inch and crop to exactly 600 × 600 pixels.",
      },
      {
        q: "What is the maximum file size for a US visa photo?",
        a: "240 KB (kilobytes) or less, in JPEG format.",
      },
      {
        q: "Can I upload a PNG or HEIC photo?",
        a: "No. The digital image must be a JPEG. Convert the photo to JPEG first, then resize and compress it.",
      },
      {
        q: "Can I wear glasses in my DS-160 photo?",
        a: "No, except in rare cases where they can't be removed for medical reasons, such as after eye surgery. In that case you need a signed medical statement.",
      },
      {
        q: "Is my photo uploaded to iKnowAPDF?",
        a: "No. The photo is resized and compressed in your browser and never leaves your device.",
      },
    ],
    sources: [
      {
        label: "U.S. Department of State: Digital Image Requirements (travel.state.gov)",
        url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/digital-image-requirements.html",
      },
      {
        label: "U.S. Department of State: Photo Requirements (travel.state.gov)",
        url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html",
      },
      {
        label: "Archived copy of the official Digital Image Requirements page (Wayback Machine, June 2025)",
        url: "https://web.archive.org/web/20250601232915/https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/digital-image-requirements.html",
      },
    ],
    verifiedOn: "2026-11-04",
  },

  // -------------------------------------------------------------------------
  // GST registration (India) — GST portal tutorial
  // -------------------------------------------------------------------------
  {
    slug: "compress-pdf-for-gst-registration",
    title: "GST Registration Document Size: Compress PDF Under 1 MB",
    h1: "GST Registration Upload Size Limits (PDF & JPEG)",
    metaDescription:
      "GST registration: photos up to 100 KB; business-place and signatory proofs up to 1 MB; e-KYC up to 2 MB. Compress PDFs and photos free in your browser.",
    portal: "GST Portal (Goods and Services Tax Network)",
    country: "India",
    category: "government",
    intro:
      "On the GST portal's new registration form for normal taxpayers, the proof of principal or additional place of business and the proof of appointment of the authorised signatory must be PDF or JPEG files of up to 1 MB each. Photographs of promoters/partners and the authorised signatory are limited to 100 KB, and e-KYC documents can be up to 2 MB. The PDF compressor below is preset to 950 KB.",
    specs: [
      {
        item: "Proof of principal place of business",
        format: "PDF or JPEG",
        maxKb: 1024,
        notes: "To submit several documents, combine them into a single file.",
        tool: "compress-pdf",
        targetKb: 950,
      },
      {
        item: "Proof of additional place of business",
        format: "PDF or JPEG",
        maxKb: 1024,
        notes: "Up to 2 documents.",
        tool: "compress-pdf",
        targetKb: 950,
      },
      {
        item: "Proof of appointment of authorised signatory",
        format: "PDF or JPEG",
        maxKb: 1024,
        tool: "compress-pdf",
        targetKb: 950,
      },
      {
        item: "Photograph of promoter / partner",
        format: "PDF or JPEG",
        maxKb: 100,
        tool: "compress-image",
        targetKb: 90,
      },
      {
        item: "Photograph of authorised signatory",
        format: "PDF or JPEG",
        maxKb: 100,
        tool: "compress-image",
        targetKb: 90,
      },
      {
        item: "E-KYC documents",
        format: "PDF or JPEG",
        maxKb: 2048,
        notes: "The name must be spelled as in the PAN/CBDT database.",
        tool: "compress-pdf",
        targetKb: 1900,
      },
    ],
    primaryTool: "compress-pdf",
    primaryTargetKb: 950,
    steps: [
      "Gather your proof of place of business. For premises not covered by the standard options, the portal tutorial asks for a consent letter plus a document showing the consenter's ownership, such as a Municipal Khata copy or electricity bill.",
      "If one proof has several pages or documents, merge them into a single PDF. The portal takes one file per upload field.",
      "Compress each PDF to under 1 MB. The tool above is preset to 950 KB.",
      "Compress each photograph to under 100 KB. Open the image compressor and set the target to 90 KB.",
      "Upload the files in the Document Upload section of each tab and check that they are clearly readable before you submit.",
    ],
    tips: [
      "The portal rejects blank files with the message “The document uploaded is blank. Kindly upload the document again.”",
      "If the portal warns that a document may not be clearly legible, choose Retry and upload a sharper scan rather than continuing.",
      "Bank account details have been optional at registration since 27 December 2018. You add them through a non-core amendment after your GSTIN is granted.",
      "Over-compressing a scanned PDF can make small text unreadable, so check the pages before you upload.",
    ],
    faqs: [
      {
        q: "What is the maximum file size for GST registration documents?",
        a: "1 MB per file (PDF or JPEG) for the proof of principal or additional place of business and the proof of appointment of the authorised signatory. Photographs are limited to 100 KB, and e-KYC documents to 2 MB, according to the GST portal's registration user manual.",
      },
      {
        q: "What size should the photograph be for GST registration?",
        a: "Up to 100 KB, as a JPEG (PDF is also accepted for this field). Use the image compressor with a target of about 90 KB.",
      },
      {
        q: "I have more than one document for the place of business. What do I do?",
        a: "The tutorial says to append all the documents into a single file. Merge them into one PDF, then compress the result to under 1 MB.",
      },
      {
        q: "Why is the preset 950 KB instead of 1 MB?",
        a: "Portals don't always state whether 1 MB means 1,000 KB or 1,024 KB. 950 KB is under both, so the file is accepted either way.",
      },
      {
        q: "Is it safe to compress PAN, Aadhaar or business documents here?",
        a: "Yes. iKnowAPDF compresses files entirely in your browser, so your documents never leave your device or reach our servers.",
      },
    ],
    sources: [
      {
        label: "GST Portal user manual: Apply for New Registration (Normal Taxpayer)",
        url: "https://tutorial.gst.gov.in/userguide/registration/Apply_for_Registration_Normal_Taxpayer.htm",
      },
      { label: "GST Portal: official website", url: "https://www.gst.gov.in/" },
    ],
    verifiedOn: "2026-11-04",
  },

  // -------------------------------------------------------------------------
  // India Post GDS online engagement
  // -------------------------------------------------------------------------
  {
    slug: "india-post-gds-photo-signature-size",
    title: "India Post GDS Photo & Signature Size: 50 KB / 20 KB",
    h1: "India Post GDS Online Engagement: Photo and Signature Size",
    metaDescription:
      "India Post GDS registration: photo JPG/JPEG up to 50 KB, signature up to 20 KB. Compress yours to 45 KB and 18 KB free, right in your browser.",
    portal: "India Post: Gramin Dak Sevak (GDS) Online Engagement",
    country: "India",
    category: "government",
    intro:
      "The India Post GDS online engagement portal asks for your latest photo and signature in JPG/JPEG format. The photo must not exceed 50 KB and the signature must not exceed 20 KB. The registration instructions don't specify pixel dimensions. The compressor below is preset to 45 KB for the photo; set it to 18 KB for your signature.",
    specs: [
      {
        item: "Photo",
        format: "JPG / JPEG",
        maxKb: 50,
        notes: "Your latest photo. The registration instructions specify no pixel dimensions.",
        tool: "compress-image",
        targetKb: 45,
      },
      {
        item: "Signature",
        format: "JPG / JPEG",
        maxKb: 20,
        tool: "compress-image",
        targetKb: 18,
      },
    ],
    primaryTool: "compress-image",
    primaryTargetKb: 45,
    steps: [
      "Take or scan a recent photo and save it as a JPG.",
      "Compress it to about 45 KB with the tool above, so it stays under the 50 KB limit.",
      "Sign on plain paper, scan or photograph it, crop it tightly, and compress it to about 18 KB (under 20 KB).",
      "Fill in the registration form on indiapostgdsonline.gov.in and upload both images.",
      "Review everything before submitting. The portal says registration data can't be edited after submission.",
    ],
    tips: [
      "Register only once. Duplicate registrations aren't allowed, and your mobile number and email ID must be unique.",
      "Enter your date of birth exactly as it appears on your secondary school (10th) certificate.",
      "Persons with disability must produce the PWD certificate at original certificate verification if selected.",
      "Each GDS schedule has its own notification. The latest one listed on the portal when we checked was Schedule-I, January 2025, so check the current notification for any changes.",
    ],
    faqs: [
      {
        q: "What is the photo size for India Post GDS online registration?",
        a: "JPG/JPEG, not exceeding 50 KB, according to the registration instructions on the official GDS portal.",
      },
      {
        q: "What is the signature size for India Post GDS?",
        a: "JPG/JPEG, not exceeding 20 KB.",
      },
      {
        q: "Are there pixel dimensions for the GDS photo?",
        a: "The registration instructions on the portal give only the file format and maximum size, not pixel dimensions. Use a clear, recent photo and keep it under 50 KB.",
      },
      {
        q: "Can I change my photo after submitting the registration?",
        a: "The portal says there is no provision to edit the data after submission, so check the photo and signature before you submit.",
      },
      {
        q: "Is my photo uploaded to iKnowAPDF?",
        a: "No. Compression happens in your browser, and the file never leaves your device.",
      },
    ],
    sources: [
      {
        label: "India Post GDS Online Engagement portal: registration instructions (items 14 & 15)",
        url: "https://indiapostgdsonline.gov.in/",
      },
    ],
    verifiedOn: "2026-11-04",
  },

  // -------------------------------------------------------------------------
  // IRCC (Canada) online applications
  // -------------------------------------------------------------------------
  {
    slug: "compress-pdf-for-ircc",
    title: "IRCC Upload Size Limit: Compress PDF Under 4 MB Free",
    h1: "IRCC Document Upload Size Limits (4 MB and 5 MB)",
    metaDescription:
      "IRCC per-file limits: 4 MB for the IRCC secure account, PR Portal and online citizenship; 5 MB for the IRCC Portal. Compress PDFs free in your browser.",
    portal: "Immigration, Refugees and Citizenship Canada (IRCC)",
    country: "Canada",
    category: "visa",
    intro:
      "IRCC's file size limit depends on which account you apply through. It's 4 MB per file for the IRCC secure account, the online citizenship application, the Asylum portal and the Permanent Residence Portal, and 5 MB for the IRCC Portal (including its new version). IRCC notes the limit can be as low as 2 MB for some applications, so check what your form says. The compressor below is preset to just under 4 MB.",
    specs: [
      {
        item: "IRCC secure account",
        format: "Per file (PDF, JPG and others your form accepts)",
        maxKb: 4096,
        tool: "compress-pdf",
        targetKb: 3900,
      },
      {
        item: "Permanent Residence Portal",
        format: "Per file",
        maxKb: 4096,
        tool: "compress-pdf",
        targetKb: 3900,
      },
      {
        item: "Online citizenship application",
        format: "Per file",
        maxKb: 4096,
        tool: "compress-pdf",
        targetKb: 3900,
      },
      {
        item: "Asylum portal",
        format: "Per file",
        maxKb: 4096,
        tool: "compress-pdf",
        targetKb: 3900,
      },
      {
        item: "IRCC Portal (including the new version)",
        format: "Per file",
        maxKb: 5120,
        tool: "compress-pdf",
        targetKb: 4800,
      },
    ],
    primaryTool: "compress-pdf",
    primaryTargetKb: 3900,
    steps: [
      "Check which account you're applying through and the limit your upload page shows (IRCC says it can be as low as 2 MB).",
      "When scanning, IRCC suggests a lower resolution of around 96 DPI (150 DPI for some images) to keep files small.",
      "Drop your PDF into the compressor above. It's preset to about 3.8 MB for a 4 MB limit; aim for about 4.7 MB for the 5 MB IRCC Portal.",
      "Open the compressed file and make sure every page, stamp and signature is still readable.",
      "Upload the compressed file in the matching slot of your application.",
    ],
    tips: [
      "Making a PDF in Word? IRCC suggests the “Minimum size” option when saving, and lowering image resolution before you insert images.",
      "Crop empty space around photographed documents, and reduce the image size, before converting them to PDF.",
      "Remove images you don't need from a document, as IRCC recommends, rather than over-compressing the important pages.",
      "If your form shows a lower limit (for example 2 MB), set the compressor target just under that number instead.",
    ],
    faqs: [
      {
        q: "What is the IRCC file size limit?",
        a: "It depends on the account: 4 MB per file for the IRCC secure account, the online citizenship application, the Asylum portal and the Permanent Residence Portal, and 5 MB for the IRCC Portal (including its new version), according to IRCC's help centre.",
      },
      {
        q: "IRCC says the limit can be 2 MB. When does that apply?",
        a: "IRCC's advice on reducing file size says the limit “can be as low as 2 MB” depending on the online application you use. Always go by the limit shown in your own application.",
      },
      {
        q: "Will compressing my PDF make it unreadable?",
        a: "Not if you leave a sensible margin. Text-based PDFs shrink with little visible change. Scanned pages lose some sharpness at strong settings, so check every page before uploading.",
      },
      {
        q: "Are my passport and bank documents uploaded to iKnowAPDF?",
        a: "No. The PDF is compressed in your browser, and your documents never leave your device.",
      },
    ],
    sources: [
      {
        label: "IRCC Help Centre: Is there a file size limit for documents I upload to my account?",
        url: "https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1123",
      },
      {
        label: "IRCC Help Centre: How to reduce the size of a file",
        url: "https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1213&top=23",
      },
    ],
    verifiedOn: "2026-11-04",
  },

  // -------------------------------------------------------------------------
  // Email providers (Gmail, Outlook, Yahoo Mail)
  // -------------------------------------------------------------------------
  {
    slug: "compress-pdf-for-email",
    title: "Compress PDF for Email: Gmail, Outlook & Yahoo Limits",
    h1: "Compress a PDF for Email (Gmail, Outlook and Yahoo Mail Limits)",
    metaDescription:
      "Gmail and Yahoo Mail allow 25 MB per email, Outlook.com 20 MB and Exchange 10 MB by default. Compress your PDF to fit, free and private in your browser.",
    portal: "Gmail, Outlook and Yahoo Mail",
    country: "Global",
    category: "email",
    intro:
      "Personal Gmail and Yahoo Mail accounts cap attachments at 25 MB per message, Outlook.com allows 20 MB including the email itself, and Microsoft says Exchange work accounts default to 10 MB. If your PDF is over the limit, compress it below. The tool is preset to 14 MB, which fits all three personal services with room to spare.",
    specs: [
      {
        item: "Gmail (personal accounts)",
        format: "Total attachments per email",
        maxKb: 25600,
        notes:
          "Above the limit, Gmail removes the attachment and adds it as a Google Drive link instead. Work and school limits are set by the Google Workspace admin.",
        tool: "compress-pdf",
        targetKb: 18432,
      },
      {
        item: "Yahoo Mail",
        format: "Total attachments per email",
        maxKb: 25600,
        notes: "Combined size of all attachments in a message, incoming or outgoing.",
        tool: "compress-pdf",
        targetKb: 18432,
      },
      {
        item: "Outlook.com",
        format: "Whole email (attachments + message)",
        maxKb: 20480,
        notes: "Microsoft says the limit includes both the attachment and the email.",
        tool: "compress-pdf",
        targetKb: 14336,
      },
      {
        item: "Outlook with an Exchange (work) account",
        format: "Whole email (default limit)",
        maxKb: 10240,
        notes: "Microsoft's stated default. Your organisation may set a different limit.",
        tool: "compress-pdf",
        targetKb: 7168,
      },
    ],
    primaryTool: "compress-pdf",
    primaryTargetKb: 14336,
    steps: [
      "Check the limit for the account you're sending from, and the one you're sending to: 25 MB for Gmail and Yahoo Mail, 20 MB for Outlook.com, and usually 10 MB for Exchange work accounts.",
      "Drop your PDF into the compressor above. It's preset to 14 MB; set about 7 MB for an Exchange work account, or about 18 MB if both sides use Gmail or Yahoo.",
      "Download the compressed PDF and check that it's readable.",
      "Attach it to your email. If you're sending several files, remember the limit applies to all attachments together.",
      "Still too big? Split the PDF, or share it as a Google Drive or OneDrive link, which Google and Microsoft both suggest for large files.",
    ],
    tips: [
      "The limit applies to all attachments in one email combined, not to each file separately.",
      "Email encodes attachments when sending, so a file just under the limit can still be rejected. Leave some headroom.",
      "The recipient's limit matters too. A work inbox may accept less than your personal account can send.",
      "Scanned PDFs shrink the most. Text-only PDFs are already small, and compression won't change them much.",
    ],
    faqs: [
      {
        q: "What is the Gmail attachment size limit?",
        a: "25 MB for personal Gmail accounts. If your attachments together are larger, Gmail removes them and inserts a Google Drive link instead. For work or school accounts, the administrator sets the limits.",
      },
      {
        q: "What is the Outlook attachment size limit?",
        a: "Microsoft says the limit is 20 MB for internet accounts such as Outlook.com and 10 MB by default for Exchange (business) accounts. Both figures include the email itself, not just the attachment.",
      },
      {
        q: "What is the Yahoo Mail attachment limit?",
        a: "Yahoo says the combined attachments in a message must not exceed 25 MB, for both incoming and outgoing email.",
      },
      {
        q: "Why is the preset 14 MB and not 25 MB?",
        a: "14 MB fits under Outlook.com's 20 MB limit and leaves headroom for the message and the encoding email adds, so the same file works with Gmail, Yahoo Mail and Outlook.com.",
      },
      {
        q: "Is my PDF uploaded anywhere when I compress it?",
        a: "No. iKnowAPDF compresses the PDF in your browser, so the file stays on your device until you attach it.",
      },
    ],
    sources: [
      { label: "Gmail Help: Attachment size limits", url: "https://support.google.com/mail/answer/6584" },
      {
        label: "Microsoft Support: Send large files with Outlook",
        url: "https://support.microsoft.com/en-us/office/send-large-files-with-outlook-8c698842-b462-4a4c-8d53-5c5dd04f77ef",
      },
      { label: "Yahoo Help: Attachment size limits in Yahoo Mail", url: "https://help.yahoo.com/kb/SLN5673.html" },
    ],
    verifiedOn: "2026-11-04",
  },
];

const BY_SLUG = new Map(REQUIREMENT_PAGES.map((p) => [p.slug, p]));

export function getRequirementPage(slug: string): RequirementPage | undefined {
  return BY_SLUG.get(slug);
}
