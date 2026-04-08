/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDFModule from "jspdf";
import autoTable from "jspdf-autotable";
import { readFileSync } from "fs";
import { join } from "path";

// Handle both ESM and CJS imports for Node.js/Vercel compatibility
const jsPDF = ("jsPDF" in jsPDFModule ? (jsPDFModule as any).jsPDF : jsPDFModule) as any;

interface QuoteLine {
  productName: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface QuoteData {
  quoteNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  propertyType: string;
  rooms: string;
  description: string | null;
  totalAmount: number | null;
  btwPercentage: number;
  validUntil: string | null;
  status: string;
  signed: boolean;
  signedAt: string | null;
  signature: string | null;
  signedIp: string | null;
  signedDevice: string | null;
  signedLocation: string | null;
  lines: QuoteLine[];
  createdAt: string;
}

// ── EndaTech huisstijl kleuren ──
const BRAND_RED = "#CC0000";
const BRAND_BLUE = "#0066CC";
const BRAND_DARK = "#1a1a2e";
const BRAND_LIGHT_BLUE = "#e8f4fd";
const GRAY = "#64748b";
const DARK = "#1e293b";
const LIGHT_GRAY = "#f8fafc";

function fmt(n: number): string {
  return n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Amsterdam",
  });
}

// Load logo at module level
let logoBase64: string | null = null;
try {
  const logoPath = join(process.cwd(), "public", "logo-horizontal.png");
  const logoBuffer = readFileSync(logoPath);
  logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
} catch {
  // Logo not available — will use text fallback
}

export function generateQuotePDF(quote: QuoteData): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ── Helper functions ──

  function addPageFooter() {
    // Red bottom stripe
    doc.setFillColor(BRAND_RED);
    doc.rect(0, pageHeight - 8, pageWidth, 8, "F");

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#ffffff");
    doc.text(
      "EndaTech  \u2022  Duurzaam koelen en verwarmen  \u2022  info@endatech.nl  \u2022  06-41088447  \u2022  www.endatech.nl",
      pageWidth / 2, pageHeight - 3, { align: "center" }
    );

    // Page number above red stripe
    doc.setTextColor(GRAY);
    doc.setFontSize(7);
    doc.text(
      `${quote.quoteNumber}  \u2014  Pagina ${doc.getNumberOfPages()}`,
      pageWidth / 2, pageHeight - 12, { align: "center" }
    );
  }

  function checkNewPage(needed: number): void {
    if (y + needed > pageHeight - 25) {
      addPageFooter();
      doc.addPage();
      y = margin;
    }
  }

  function drawSectionTitle(title: string): void {
    checkNewPage(14);
    // Blue accent line
    doc.setFillColor(BRAND_BLUE);
    doc.rect(margin, y, 3, 6, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(BRAND_DARK);
    doc.text(title, margin + 6, y + 5);
    y += 10;
  }

  function drawKeyValue(key: string, value: string, keyWidth = 40): void {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(GRAY);
    doc.text(key, margin + 6, y);
    doc.setTextColor(DARK);
    doc.text(value || "\u2014", margin + keyWidth, y);
    y += 5;
  }

  // ═══════════════════════════════════════════════════
  // HEADER — Blue top bar with logo
  // ═══════════════════════════════════════════════════

  // Blue header bar
  doc.setFillColor(BRAND_BLUE);
  doc.rect(0, 0, pageWidth, 32, "F");

  // Red accent line under header
  doc.setFillColor(BRAND_RED);
  doc.rect(0, 32, pageWidth, 1.5, "F");

  // Logo or text
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "PNG", margin, 4, 55, 24);
    } catch {
      // Fallback to text
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor("#ffffff");
      doc.text("ENDATECH", margin, 18);
    }
  } else {
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#ffffff");
    doc.text("ENDA", margin, 18);
    doc.setTextColor(BRAND_RED);
    const endaWidth = doc.getTextWidth("ENDA");
    doc.text("TECH", margin + endaWidth, 18);
    doc.setFontSize(8);
    doc.setTextColor("#ffffff");
    doc.text("Duurzaam koelen en verwarmen", margin, 24);
  }

  // Right: Document type + quote number
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#ffffff");
  const docType = quote.signed ? "OVEREENKOMST" : "OFFERTE";
  doc.text(docType, pageWidth - margin, 11, { align: "right" });

  doc.setFontSize(15);
  doc.text(quote.quoteNumber, pageWidth - margin, 19, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Datum: ${formatDate(quote.createdAt)}`, pageWidth - margin, 25, { align: "right" });
  if (quote.validUntil) {
    doc.text(`Geldig tot: ${formatDate(quote.validUntil)}`, pageWidth - margin, 30, { align: "right" });
  }

  y = 42;

  // ═══════════════════════════════════════════════════
  // STATUS BANNER (if signed)
  // ═══════════════════════════════════════════════════
  if (quote.signed) {
    doc.setFillColor("#dcfce7");
    doc.setDrawColor("#86efac");
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "FD");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#166534");
    doc.text("\u2713  DIGITAAL ONDERTEKEND", pageWidth / 2, y + 6.5, { align: "center" });
    y += 16;
  }

  // ═══════════════════════════════════════════════════
  // TWO-COLUMN: EndaTech + Klant
  // ═══════════════════════════════════════════════════
  const colWidth = contentWidth / 2 - 5;
  const startY = y;

  // Left column: EndaTech info
  doc.setFillColor(BRAND_LIGHT_BLUE);
  doc.roundedRect(margin, y, colWidth, 28, 2, 2, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND_BLUE);
  doc.text("VAN", margin + 5, y + 5);
  doc.setFontSize(10);
  doc.setTextColor(BRAND_DARK);
  doc.text("EndaTech", margin + 5, y + 11);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GRAY);
  doc.text("info@endatech.nl", margin + 5, y + 16);
  doc.text("06-41088447", margin + 5, y + 20);
  doc.text("www.endatech.nl", margin + 5, y + 24);

  // Right column: Customer info
  const rightX = margin + colWidth + 10;
  doc.setFillColor(LIGHT_GRAY);
  doc.roundedRect(rightX, y, colWidth, 28, 2, 2, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND_RED);
  doc.text("AAN", rightX + 5, y + 5);
  doc.setFontSize(10);
  doc.setTextColor(BRAND_DARK);
  doc.text(quote.name, rightX + 5, y + 11);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GRAY);
  doc.text(quote.address, rightX + 5, y + 16);
  doc.text(`${quote.postalCode} ${quote.city}`, rightX + 5, y + 20);
  doc.text(`${quote.email}  \u2022  ${quote.phone}`, rightX + 5, y + 24);

  y = startY + 34;

  // ═══════════════════════════════════════════════════
  // PROJECT DETAILS
  // ═══════════════════════════════════════════════════
  drawSectionTitle("Projectgegevens");
  drawKeyValue("Type pand:", quote.propertyType);
  drawKeyValue("Ruimte(s):", quote.rooms);
  y += 3;

  // ═══════════════════════════════════════════════════
  // DESCRIPTION
  // ═══════════════════════════════════════════════════
  if (quote.description) {
    drawSectionTitle("Omschrijving");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(DARK);
    const descLines = doc.splitTextToSize(quote.description, contentWidth - 6);
    checkNewPage(descLines.length * 4 + 4);
    doc.text(descLines, margin + 6, y);
    y += descLines.length * 4 + 6;
  }

  // ═══════════════════════════════════════════════════
  // LINE ITEMS TABLE
  // ═══════════════════════════════════════════════════
  if (quote.lines.length > 0) {
    drawSectionTitle("Specificatie");

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Product", "Omschrijving", "Aantal", "Prijs/stuk", "Totaal"]],
      body: quote.lines.map((line) => [
        line.productName,
        line.description || "",
        String(line.quantity),
        `\u20AC ${fmt(line.unitPrice)}`,
        `\u20AC ${fmt(line.lineTotal)}`,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: "#e2e8f0",
        lineWidth: 0.1,
        textColor: DARK,
      },
      headStyles: {
        fillColor: BRAND_BLUE,
        textColor: "#ffffff",
        fontStyle: "bold",
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: "bold" },
        1: { cellWidth: "auto" },
        2: { cellWidth: 18, halign: "center" },
        3: { cellWidth: 28, halign: "right" },
        4: { cellWidth: 28, halign: "right", fontStyle: "bold" },
      },
      alternateRowStyles: { fillColor: BRAND_LIGHT_BLUE },
    });

    const lastTable = (doc as any).lastAutoTable || (doc as any).previousAutoTable;
    y = (lastTable?.finalY ?? y + quote.lines.length * 10 + 20) + 6;
  }

  // ═══════════════════════════════════════════════════
  // TOTALS
  // ═══════════════════════════════════════════════════
  const subtotal = quote.lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const btwPct = quote.btwPercentage;
  const btwAmount = subtotal * (btwPct / 100);
  const totalInclBtw = subtotal + btwAmount;

  if (subtotal > 0 || quote.totalAmount) {
    checkNewPage(35);
    const totalsX = pageWidth - margin - 75;
    const totalsWidth = 75;

    // Totals box
    doc.setFillColor(LIGHT_GRAY);
    doc.roundedRect(totalsX, y, totalsWidth, 30, 2, 2, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(GRAY);
    doc.text("Subtotaal (excl. BTW)", totalsX + 4, y + 6);
    doc.setTextColor(DARK);
    doc.text(`\u20AC ${fmt(subtotal)}`, pageWidth - margin - 4, y + 6, { align: "right" });

    doc.setTextColor(GRAY);
    doc.text(`BTW (${btwPct}%)`, totalsX + 4, y + 12);
    doc.setTextColor(DARK);
    doc.text(`\u20AC ${fmt(btwAmount)}`, pageWidth - margin - 4, y + 12, { align: "right" });

    // Separator
    doc.setDrawColor(BRAND_BLUE);
    doc.setLineWidth(0.5);
    doc.line(totalsX + 3, y + 16, pageWidth - margin - 3, y + 16);

    // Total with brand blue
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(BRAND_BLUE);
    doc.text("Totaal incl. BTW", totalsX + 4, y + 24);
    doc.setTextColor(BRAND_RED);
    doc.text(`\u20AC ${fmt(totalInclBtw)}`, pageWidth - margin - 4, y + 24, { align: "right" });

    y += 38;
  }

  // Validity note
  if (quote.validUntil) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(GRAY);
    doc.text(`Deze offerte is geldig tot ${formatDate(quote.validUntil)}.`, pageWidth - margin, y, { align: "right" });
    y += 8;
  }

  // ═══════════════════════════════════════════════════
  // VOORWAARDEN & JURIDISCHE TEKST
  // ═══════════════════════════════════════════════════
  checkNewPage(80);
  drawSectionTitle("Voorwaarden en bepalingen");

  const terms = [
    { title: "1. Overeenkomst", text: "Door ondertekening van deze offerte komt een overeenkomst tot stand tussen de klant en EndaTech voor de levering en installatie van de hierboven beschreven producten en diensten. De overeenkomst is bindend voor beide partijen." },
    { title: "2. Prijzen en betaling", text: "Alle genoemde prijzen zijn inclusief BTW, tenzij anders vermeld. Betaling dient te geschieden binnen 14 dagen na factuurdatum. Bij niet-tijdige betaling is de klant van rechtswege in verzuim en is EndaTech gerechtigd wettelijke rente en incassokosten in rekening te brengen. EndaTech behoudt het eigendom van geleverde producten tot volledige betaling (eigendomsvoorbehoud)." },
    { title: "3. Uitvoering en installatie", text: "EndaTech voert alle installaties uit door gecertificeerde monteurs (F-Gassen gecertificeerd conform EU-verordening 517/2014). De installatiedatum wordt in overleg met de klant vastgesteld na ondertekening. De klant zorgt voor vrije en veilige toegang tot de installatielocatie. EndaTech is niet aansprakelijk voor vertraging door omstandigheden buiten haar macht (overmacht)." },
    { title: "4. Garantie", text: "Op de installatie geeft EndaTech 12 maanden garantie op arbeid. Op geleverde apparatuur geldt de fabrieksgarantie van de betreffende fabrikant. Garantie vervalt bij onoordeelkundig gebruik, wijzigingen door derden, of het niet naleven van onderhoudsvoorschriften. Garantieclaims dienen schriftelijk te worden gemeld binnen 14 dagen na constatering." },
    { title: "5. Aansprakelijkheid", text: "De aansprakelijkheid van EndaTech is in alle gevallen beperkt tot het factuurbedrag van de betreffende opdracht. EndaTech is niet aansprakelijk voor indirecte schade, gevolgschade, gederfde winst of gemiste besparingen. De klant is verantwoordelijk voor het verstrekken van juiste en volledige informatie over de installatielocatie." },
    { title: "6. Annulering", text: "De klant kan de overeenkomst kosteloos annuleren tot 48 uur voor de geplande installatiedatum. Bij latere annulering is EndaTech gerechtigd annuleringskosten van maximaal 25% van het offertebedrag in rekening te brengen. Bij no-show worden de volledige gemaakte kosten doorberekend." },
    { title: "7. Oplevering en acceptatie", text: "Na installatie wordt het werk opgeleverd en gecontroleerd in aanwezigheid van de klant. De klant ontvangt een instructie over het gebruik van de apparatuur. Eventuele gebreken dienen direct bij oplevering te worden gemeld. Na oplevering zonder opmerkingen wordt het werk als geaccepteerd beschouwd." },
    { title: "8. Klachten en geschillen", text: "Klachten dienen schriftelijk te worden gemeld via info@endatech.nl binnen 14 dagen na ontdekking. Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden bij voorkeur in onderling overleg opgelost. Indien dit niet lukt, is de bevoegde rechter in Nederland exclusief bevoegd." },
    { title: "9. Digitale ondertekening", text: "Deze offerte wordt digitaal ondertekend conform de Europese eIDAS-verordening (EU 910/2014). De digitale handtekening heeft dezelfde rechtskracht als een handgeschreven handtekening. Bij ondertekening worden ter verificatie vastgelegd: de handtekening, het IP-adres, apparaatgegevens, tijdstip en (indien beschikbaar) de locatie van de ondertekenaar." },
    { title: "10. Privacy", text: "Persoonsgegevens worden verwerkt conform de AVG (Algemene Verordening Gegevensbescherming). Zie ons privacybeleid op www.endatech.nl/privacy voor meer informatie." },
  ];

  for (const term of terms) {
    const titleLines = doc.splitTextToSize(term.title, contentWidth);
    const textLines = doc.splitTextToSize(term.text, contentWidth - 6);
    const totalHeight = titleLines.length * 3.5 + textLines.length * 3.5 + 4;

    checkNewPage(totalHeight);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(BRAND_DARK);
    doc.text(titleLines, margin + 6, y);
    y += titleLines.length * 3.5 + 1;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(GRAY);
    doc.text(textLines, margin + 6, y);
    y += textLines.length * 3.5 + 3;
  }

  // ═══════════════════════════════════════════════════
  // ONDERTEKENING SECTIE
  // ═══════════════════════════════════════════════════
  checkNewPage(70);
  drawSectionTitle("Ondertekening");

  if (quote.signed && quote.signedAt) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(DARK);
    doc.text("Door ondertekening verklaart de klant akkoord te gaan met de bovenstaande offerte en de bijbehorende voorwaarden.", margin + 6, y);
    y += 10;

    const sigCol1 = margin;
    const sigCol2 = margin + colWidth + 10;

    // Left: Signature image
    doc.setFillColor(BRAND_LIGHT_BLUE);
    doc.roundedRect(sigCol1, y, colWidth, 40, 2, 2, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(BRAND_BLUE);
    doc.text("Handtekening klant", sigCol1 + 5, y + 6);

    if (quote.signature) {
      try {
        doc.addImage(quote.signature, "PNG", sigCol1 + 10, y + 9, colWidth - 20, 25);
      } catch {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(GRAY);
        doc.text("[Handtekening opgeslagen in systeem]", sigCol1 + 5, y + 22);
      }
    }

    // Right: Signature metadata
    doc.setFillColor(LIGHT_GRAY);
    doc.roundedRect(sigCol2, y, colWidth, 40, 2, 2, "F");

    let metaY = y + 6;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(BRAND_DARK);
    doc.text("Verificatiegegevens", sigCol2 + 5, metaY);
    metaY += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(GRAY);
    doc.text(`Naam: ${quote.name}`, sigCol2 + 5, metaY); metaY += 4;
    doc.text(`Datum: ${formatDateTime(quote.signedAt)}`, sigCol2 + 5, metaY); metaY += 4;
    if (quote.signedIp) { doc.text(`IP-adres: ${quote.signedIp}`, sigCol2 + 5, metaY); metaY += 4; }
    if (quote.signedDevice) {
      try {
        const device = JSON.parse(quote.signedDevice);
        doc.text(`Apparaat: ${device.deviceType || "Onbekend"} \u2014 ${device.platform || ""}`, sigCol2 + 5, metaY); metaY += 4;
      } catch { /* skip */ }
    }
    if (quote.signedLocation) {
      try {
        const loc = JSON.parse(quote.signedLocation);
        if (loc.latitude && loc.longitude) {
          doc.text(`Locatie: ${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`, sigCol2 + 5, metaY);
        }
      } catch { /* skip */ }
    }

    y += 48;

    // Legal stamp
    checkNewPage(18);
    doc.setFillColor("#dcfce7");
    doc.setDrawColor("#86efac");
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "FD");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#166534");
    doc.text("\u2713  DIGITAAL ONDERTEKEND EN RECHTSGELDIG", pageWidth / 2, y + 5.5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(
      `Ondertekend op ${formatDateTime(quote.signedAt)} conform eIDAS-verordening (EU 910/2014)`,
      pageWidth / 2, y + 10.5, { align: "center" }
    );

    y += 20;

  } else {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(DARK);
    doc.text("Door ondertekening gaat de klant akkoord met de bovenstaande offerte en de bijbehorende voorwaarden.", margin + 6, y);
    y += 12;

    // Signature lines
    doc.setDrawColor(GRAY);
    doc.setLineWidth(0.3);

    // Customer
    doc.line(margin, y + 18, margin + 72, y + 18);
    doc.setFontSize(8);
    doc.setTextColor(GRAY);
    doc.text("Handtekening klant", margin, y + 23);
    doc.text(`Naam: ${quote.name}`, margin, y + 28);
    doc.text("Datum: ____________________", margin, y + 33);

    // EndaTech
    const endaX = margin + colWidth + 10;
    doc.line(endaX, y + 18, endaX + 72, y + 18);
    doc.text("Namens EndaTech", endaX, y + 23);
    doc.text("Datum: ____________________", endaX, y + 28);

    y += 40;
  }

  // ═══════════════════════════════════════════════════
  // FOOTER ON ALL PAGES
  // ═══════════════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPageFooter();
  }

  return Buffer.from(doc.output("arraybuffer"));
}
