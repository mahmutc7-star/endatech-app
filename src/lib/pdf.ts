/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDFModule from "jspdf";
import autoTable from "jspdf-autotable";

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

const BRAND_BLUE = "#1e3a5f";
const BRAND_LIGHT = "#f0f7ff";
const GRAY = "#64748b";
const DARK = "#1e293b";

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

export function generateQuotePDF(quote: QuoteData): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function addPageFooter() {
    const footerY = pageHeight - 12;
    doc.setFontSize(7);
    doc.setTextColor(GRAY);
    doc.text("EndaTech — Airconditioning & Klimaattechniek — info@endatech.nl — 06-41088447", pageWidth / 2, footerY, { align: "center" });
    doc.text(`${quote.quoteNumber} — Pagina ${doc.getNumberOfPages()}`, pageWidth / 2, footerY + 4, { align: "center" });
  }

  function checkNewPage(needed: number): void {
    if (y + needed > pageHeight - 25) {
      addPageFooter();
      doc.addPage();
      y = margin;
    }
  }

  function drawSectionTitle(title: string): void {
    checkNewPage(12);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(BRAND_BLUE);
    doc.text(title, margin, y);
    y += 2;
    doc.setDrawColor(BRAND_BLUE);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;
  }

  function drawKeyValue(key: string, value: string, keyWidth = 45): void {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(GRAY);
    doc.text(key, margin, y);
    doc.setTextColor(DARK);
    doc.setFont("helvetica", "normal");
    doc.text(value || "—", margin + keyWidth, y);
    y += 5;
  }

  // ═══════════════════════════════════════════════════
  // HEADER
  // ═══════════════════════════════════════════════════
  doc.setFillColor(BRAND_BLUE);
  doc.rect(0, 0, pageWidth, 38, "F");

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#ffffff");
  doc.text("EndaTech", margin, 16);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Airconditioning & Klimaattechniek", margin, 22);

  // Right side: quote info
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(quote.signed ? "OVEREENKOMST" : "OFFERTE", pageWidth - margin, 12, { align: "right" });
  doc.setFontSize(14);
  doc.text(quote.quoteNumber, pageWidth - margin, 20, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Datum: ${formatDate(quote.createdAt)}`, pageWidth - margin, 26, { align: "right" });
  if (quote.validUntil) {
    doc.text(`Geldig tot: ${formatDate(quote.validUntil)}`, pageWidth - margin, 31, { align: "right" });
  }

  y = 48;

  // ═══════════════════════════════════════════════════
  // STATUS BANNER (if signed)
  // ═══════════════════════════════════════════════════
  if (quote.signed) {
    doc.setFillColor("#dcfce7");
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#166534");
    doc.text("DIGITAAL ONDERTEKEND", pageWidth / 2, y + 6.5, { align: "center" });
    y += 16;
  }

  // ═══════════════════════════════════════════════════
  // TWO-COLUMN: Company info + Customer info
  // ═══════════════════════════════════════════════════
  const colWidth = contentWidth / 2 - 5;

  // Left: EndaTech
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND_BLUE);
  doc.text("Van", margin, y);
  y += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(DARK);
  doc.text("EndaTech", margin, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GRAY);
  doc.text("info@endatech.nl", margin, y);
  y += 4;
  doc.text("06-41088447", margin, y);
  y += 4;
  doc.text("www.endatech.nl", margin, y);

  // Right: Customer
  const customerX = margin + colWidth + 10;
  let yCustomer = y - 17;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND_BLUE);
  doc.text("Aan", customerX, yCustomer);
  yCustomer += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(DARK);
  doc.text(quote.name, customerX, yCustomer);
  yCustomer += 4;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GRAY);
  doc.text(quote.address, customerX, yCustomer);
  yCustomer += 4;
  doc.text(`${quote.postalCode} ${quote.city}`, customerX, yCustomer);
  yCustomer += 4;
  doc.text(quote.email, customerX, yCustomer);
  yCustomer += 4;
  doc.text(quote.phone, customerX, yCustomer);

  y += 14;

  // ═══════════════════════════════════════════════════
  // PROJECT DETAILS
  // ═══════════════════════════════════════════════════
  drawSectionTitle("Projectgegevens");
  drawKeyValue("Type pand:", quote.propertyType);
  drawKeyValue("Ruimte(s):", quote.rooms);
  y += 4;

  // ═══════════════════════════════════════════════════
  // DESCRIPTION
  // ═══════════════════════════════════════════════════
  if (quote.description) {
    drawSectionTitle("Omschrijving");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(DARK);
    const descLines = doc.splitTextToSize(quote.description, contentWidth);
    checkNewPage(descLines.length * 4 + 4);
    doc.text(descLines, margin, y);
    y += descLines.length * 4 + 6;
  }

  // ═══════════════════════════════════════════════════
  // LINE ITEMS TABLE
  // ═══════════════════════════════════════════════════
  if (quote.lines.length > 0) {
    drawSectionTitle("Specificatie");

    const tableResult = autoTable(doc, {
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
      },
      headStyles: {
        fillColor: BRAND_BLUE,
        textColor: "#ffffff",
        fontStyle: "bold",
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 18, halign: "center" },
        3: { cellWidth: 28, halign: "right" },
        4: { cellWidth: 28, halign: "right" },
      },
      alternateRowStyles: { fillColor: "#f8fafc" },
    });

    y = (tableResult as unknown as { finalY: number }).finalY + 6;
  }

  // ═══════════════════════════════════════════════════
  // TOTALS
  // ═══════════════════════════════════════════════════
  const subtotal = quote.lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const btwPct = quote.btwPercentage;
  const btwAmount = subtotal * (btwPct / 100);
  const totalInclBtw = subtotal + btwAmount;

  if (subtotal > 0 || quote.totalAmount) {
    checkNewPage(30);
    const totalsX = pageWidth - margin - 70;

    doc.setFillColor(BRAND_LIGHT);
    doc.roundedRect(totalsX - 5, y - 2, 75, 28, 2, 2, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(GRAY);
    doc.text("Subtotaal (excl. BTW)", totalsX, y + 4);
    doc.setTextColor(DARK);
    doc.text(`\u20AC ${fmt(subtotal)}`, pageWidth - margin, y + 4, { align: "right" });

    doc.setTextColor(GRAY);
    doc.text(`BTW (${btwPct}%)`, totalsX, y + 10);
    doc.setTextColor(DARK);
    doc.text(`\u20AC ${fmt(btwAmount)}`, pageWidth - margin, y + 10, { align: "right" });

    doc.setDrawColor("#cbd5e1");
    doc.line(totalsX, y + 14, pageWidth - margin, y + 14);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(BRAND_BLUE);
    doc.text("Totaal (incl. BTW)", totalsX, y + 21);
    doc.text(`\u20AC ${fmt(totalInclBtw)}`, pageWidth - margin, y + 21, { align: "right" });

    y += 36;
  }

  // ═══════════════════════════════════════════════════
  // VOORWAARDEN & JURIDISCHE TEKST
  // ═══════════════════════════════════════════════════
  checkNewPage(80);
  drawSectionTitle("Voorwaarden en bepalingen");

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(DARK);

  const terms = [
    {
      title: "1. Overeenkomst",
      text: "Door ondertekening van deze offerte komt een overeenkomst tot stand tussen de klant en EndaTech voor de levering en installatie van de hierboven beschreven producten en diensten. De overeenkomst is bindend voor beide partijen."
    },
    {
      title: "2. Prijzen en betaling",
      text: "Alle genoemde prijzen zijn inclusief BTW, tenzij anders vermeld. Betaling dient te geschieden binnen 14 dagen na factuurdatum. Bij niet-tijdige betaling is de klant van rechtswege in verzuim en is EndaTech gerechtigd wettelijke rente en incassokosten in rekening te brengen. EndaTech behoudt het eigendom van geleverde producten tot volledige betaling (eigendomsvoorbehoud)."
    },
    {
      title: "3. Uitvoering en installatie",
      text: "EndaTech voert alle installaties uit door gecertificeerde monteurs (F-Gassen gecertificeerd conform EU-verordening 517/2014). De installatiedatum wordt in overleg met de klant vastgesteld na ondertekening. De klant zorgt voor vrije en veilige toegang tot de installatie\u00ADlocatie. EndaTech is niet aansprakelijk voor vertraging door omstandigheden buiten haar macht (overmacht)."
    },
    {
      title: "4. Garantie",
      text: "Op de installatie geeft EndaTech 12 maanden garantie op arbeid. Op geleverde apparatuur geldt de fabrieksgarantie van de betreffende fabrikant. Garantie vervalt bij onoordeelkundig gebruik, wijzigingen door derden, of het niet naleven van onderhouds\u00ADvoorschriften. Garantieclaims dienen schriftelijk te worden gemeld binnen 14 dagen na constatering."
    },
    {
      title: "5. Aansprakelijkheid",
      text: "De aansprakelijkheid van EndaTech is in alle gevallen beperkt tot het factuurbedrag van de betreffende opdracht. EndaTech is niet aansprakelijk voor indirecte schade, gevolgschade, gederfde winst of gemiste besparingen. EndaTech is niet aansprakelijk voor schade aan bestaande installaties of constructies die niet voorzienbaar was. De klant is verantwoordelijk voor het verstrekken van juiste en volledige informatie over de installatie\u00ADlocatie."
    },
    {
      title: "6. Annulering",
      text: "De klant kan de overeenkomst kosteloos annuleren tot 48 uur voor de geplande installatiedatum. Bij latere annulering is EndaTech gerechtigd annuleringskosten van maximaal 25% van het offertebedrag in rekening te brengen. Bij no-show worden de volledige gemaakte kosten doorberekend."
    },
    {
      title: "7. Oplevering en acceptatie",
      text: "Na installatie wordt het werk opgeleverd en gecontroleerd in aanwezigheid van de klant. De klant ontvangt een instructie over het gebruik van de apparatuur. Eventuele gebreken dienen direct bij oplevering te worden gemeld. Na oplevering zonder opmerkingen wordt het werk als geaccepteerd beschouwd."
    },
    {
      title: "8. Klachten en geschillen",
      text: "Klachten dienen schriftelijk te worden gemeld via info@endatech.nl binnen 14 dagen na ontdekking. EndaTech streeft ernaar klachten binnen 10 werkdagen af te handelen. Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden bij voorkeur in onderling overleg opgelost. Indien dit niet lukt, is de bevoegde rechter in Nederland exclusief bevoegd."
    },
    {
      title: "9. Digitale ondertekening",
      text: "Deze offerte wordt digitaal ondertekend conform de Europese eIDAS-verordening (EU 910/2014). De digitale handtekening heeft dezelfde rechtskracht als een handgeschreven handtekening. Bij ondertekening worden ter verificatie vastgelegd: de handtekening, het IP-adres, apparaatgegevens, tijdstip en (indien beschikbaar) de locatie van de ondertekenaar."
    },
    {
      title: "10. Privacy",
      text: "Persoonsgegevens worden verwerkt conform de AVG (Algemene Verordening Gegevensbescherming). Zie ons privacybeleid op www.endatech.nl/privacy voor meer informatie over de verwerking van uw gegevens."
    },
  ];

  for (const term of terms) {
    const titleLines = doc.splitTextToSize(term.title, contentWidth);
    const textLines = doc.splitTextToSize(term.text, contentWidth);
    const totalHeight = titleLines.length * 3.5 + textLines.length * 3.5 + 4;

    checkNewPage(totalHeight);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(DARK);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 3.5 + 1;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(GRAY);
    doc.text(textLines, margin, y);
    y += textLines.length * 3.5 + 4;
  }

  // ═══════════════════════════════════════════════════
  // ONDERTEKENING SECTIE
  // ═══════════════════════════════════════════════════
  checkNewPage(70);
  drawSectionTitle("Ondertekening");

  if (quote.signed && quote.signedAt) {
    // Signed state
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(DARK);
    doc.text("Door ondertekening verklaart de klant akkoord te gaan met de bovenstaande offerte", margin, y);
    doc.text("en de bijbehorende voorwaarden.", margin, y + 4);
    y += 12;

    // Signature details in two columns
    const sigCol1 = margin;
    const sigCol2 = margin + colWidth + 10;

    // Left: Signature image
    doc.setFillColor(BRAND_LIGHT);
    doc.roundedRect(sigCol1, y, colWidth, 40, 2, 2, "F");

    doc.setFontSize(8);
    doc.setTextColor(GRAY);
    doc.text("Handtekening klant:", sigCol1 + 4, y + 6);

    if (quote.signature) {
      try {
        doc.addImage(quote.signature, "PNG", sigCol1 + 10, y + 9, colWidth - 20, 25);
      } catch {
        doc.setTextColor(GRAY);
        doc.text("[Handtekening opgeslagen in systeem]", sigCol1 + 4, y + 22);
      }
    }

    // Right: Signature metadata
    doc.setFillColor(BRAND_LIGHT);
    doc.roundedRect(sigCol2, y, colWidth, 40, 2, 2, "F");

    let metaY = y + 6;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(DARK);
    doc.text("Ondertekeningsgegevens:", sigCol2 + 4, metaY);
    metaY += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(GRAY);

    doc.text(`Naam: ${quote.name}`, sigCol2 + 4, metaY);
    metaY += 4;
    doc.text(`Datum: ${formatDateTime(quote.signedAt)}`, sigCol2 + 4, metaY);
    metaY += 4;
    if (quote.signedIp) {
      doc.text(`IP-adres: ${quote.signedIp}`, sigCol2 + 4, metaY);
      metaY += 4;
    }
    if (quote.signedDevice) {
      try {
        const device = JSON.parse(quote.signedDevice);
        doc.text(`Apparaat: ${device.deviceType || "Onbekend"} — ${device.platform || ""}`, sigCol2 + 4, metaY);
        metaY += 4;
      } catch { /* skip */ }
    }
    if (quote.signedLocation) {
      try {
        const loc = JSON.parse(quote.signedLocation);
        if (loc.latitude && loc.longitude) {
          doc.text(`Locatie: ${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`, sigCol2 + 4, metaY);
        }
      } catch { /* skip */ }
    }

    y += 48;

    // Legal verification stamp
    checkNewPage(18);
    doc.setFillColor("#dcfce7");
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
    doc.setDrawColor("#86efac");
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "S");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#166534");
    doc.text("DIGITAAL ONDERTEKEND EN RECHTSGELDIG", pageWidth / 2, y + 5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(
      `Ondertekend op ${formatDateTime(quote.signedAt)} conform eIDAS-verordening (EU 910/2014)`,
      pageWidth / 2, y + 10, { align: "center" }
    );

    y += 20;

  } else {
    // Unsigned state — space for manual signature
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(DARK);
    doc.text("Door ondertekening gaat de klant akkoord met de bovenstaande offerte en de bijbehorende voorwaarden.", margin, y);
    y += 10;

    // Signature line customer
    doc.setDrawColor(GRAY);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 15, margin + 70, y + 15);
    doc.setFontSize(8);
    doc.setTextColor(GRAY);
    doc.text("Handtekening klant", margin, y + 20);
    doc.text(`Naam: ${quote.name}`, margin, y + 25);
    doc.text("Datum: ____________________", margin, y + 30);

    // Signature line EndaTech
    const endaX = margin + colWidth + 10;
    doc.line(endaX, y + 15, endaX + 70, y + 15);
    doc.text("Namens EndaTech", endaX, y + 20);
    doc.text("Datum: ____________________", endaX, y + 25);

    y += 38;
  }

  // ═══════════════════════════════════════════════════
  // FOOTER ON ALL PAGES
  // ═══════════════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPageFooter();
  }

  // Return as Buffer
  return Buffer.from(doc.output("arraybuffer"));
}
