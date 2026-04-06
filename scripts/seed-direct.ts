/**
 * seed-direct.ts
 * Seeds AircoModel table directly without reading from a JSON file.
 * All 195 records are hardcoded in this script.
 *
 * Usage: npx tsx scripts/seed-direct.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Format: [Merk, Modelcode, Unittype, Productlijn, Serie, Systeemtype, Kleur, koelkW, verwarmkW, BTU, Poorten, Fase, Opmerking]
type RawRow = [
  string,              // 0  Merk
  string | null,       // 1  Modelcode
  string | null,       // 2  Unittype
  string | null,       // 3  Productlijn
  string | null,       // 4  Serie
  string | null,       // 5  Systeemtype
  string | null,       // 6  Kleur
  number | null,       // 7  koelkW
  number | null,       // 8  verwarmkW
  string | null,       // 9  BTU
  string | null,       // 10 Poorten
  string | null,       // 11 Fase
  string | null,       // 12 Opmerking
];

const RECORDS: RawRow[] = [
  // ===== GREE =====
  ["Gree","GWH09AVCXB-K6DNA1B","Wand","Airy","Airy","Single Split",null,2.7,3,"9000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH12AVCXD-K6DNA1A","Wand","Airy","Airy","Single Split",null,3.5,3.8,"12000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH18AVDXE-K6DNA1A","Wand","Airy","Airy","Single Split",null,5.3,5.6,"18000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH09ATAXB-K6DNA1B","Wand","Charmo","Charmo","Single Split",null,2.5,2.8,"9000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH12ATAXB-K6DNA1D","Wand","Charmo","Charmo","Single Split",null,3.2,3.4,"12000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH18ATAXB-K6DNA1A","Wand","Charmo","Charmo","Single Split",null,4.6,5.3,"18000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH09AUCXB-K6DNA1A","Wand","Clivia","Clivia","Single Split","wit",2.7,3,"9000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH12AUCXB-K6DNA1A","Wand","Clivia","Clivia","Single Split","wit",3.5,3.8,"12000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH12AUCXB-K6DNA1A","Wand","Clivia","Clivia","Single Split","antraciet",3.5,3.8,"12000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH12AUCXB-K6DNA1A","Wand","Clivia","Clivia","Single Split","zilver",3.5,3.8,"12000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH18AUCXD-K6DNA1A","Wand","Clivia","Clivia","Single Split","wit",5.3,5.3,"18000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH18AUCXD-K6DNA1A","Wand","Clivia","Clivia","Single Split","antraciet",5.3,5.3,"18000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH18AUCXD-K6DNA1A","Wand","Clivia","Clivia","Single Split","zilver",5.3,5.3,"18000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH24AUCXF-K6DNA1A","Wand","Clivia","Clivia","Single Split","wit",7.1,7.3,"24000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH24AUCXF-K6DNA1A","Wand","Clivia","Clivia","Single Split","antraciet",7.1,7.3,"24000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GEH09AA-K6DNA1F","Console","Console","Console","Single Split",null,2.7,2.9,"9000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GEH12AA-K6DNA1A","Console","Console","Console","Single Split",null,3.5,3.8,"12000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GEH18AA-K6DNA1F","Console","Console","Console","Single Split",null,5.2,5.3,"18000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH09ACC-K6DNA1A","Wand","Fairy","Fairy","Single Split","antraciet",2.7,3,"9000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH09ACC-K6DNA1F","Wand","Fairy","Fairy","Single Split","white",2.7,3,"9000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH09ACC-K6DNA1F","Wand","Fairy","Fairy","Single Split","zilver",2.7,3,"9000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH12ACC-K6DNA1D","Wand","Fairy","Fairy","Single Split","antraciet",3.5,3.8,"12000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH12ACC-K6DNA1F","Wand","Fairy","Fairy","Single Split","white",3.5,3.8,"12000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH12ACC-K6DNA1F","Wand","Fairy","Fairy","Single Split","zilver",3.5,3.7,"12000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH18ACD-K6DNA1D","Wand","Fairy","Fairy","Single Split","antraciet",5.2,5.6,"18000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH18ACD-K6DNA1I","Wand","Fairy","Fairy","Single Split","white",5.2,5.6,"18000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH18ACD-K6DNA1I","Wand","Fairy","Fairy","Single Split","zilver",5.2,5.3,"18000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH24ACE-K6DNA1I","Wand","Fairy","Fairy","Single Split","white",7.1,7.8,"24000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWH24ACE-K6DNA1II","Wand","Fairy","Fairy","Single Split","antraciet",7.1,7.8,"24000",null,"1-fase","Outdoor model niet apart vermeld in catalogus"],
  ["Gree","GWHD18NK6OO","Buitenunit","Free Match","Free Match","Multisplit",null,5.3,5.65,null,"2","1-fase","Free Match buitenunit"],
  ["Gree","GWHD21NK6OO","Buitenunit","Free Match","Free Match","Multisplit",null,6.1,6.5,null,"3","1-fase","Free Match buitenunit"],
  ["Gree","GWHD24NK6OO","Buitenunit","Free Match","Free Match","Multisplit",null,7.1,8.6,null,"3","1-fase","Free Match buitenunit"],
  ["Gree","GWHD28NK6OO","Buitenunit","Free Match","Free Match","Multisplit",null,8,9.5,null,"4","1-fase","Free Match buitenunit"],
  ["Gree","GWHD36NK6OO","Buitenunit","Free Match","Free Match","Multisplit",null,10.6,11,null,"4","1-fase","Free Match buitenunit"],
  ["Gree","GWHD42NK6OO","Buitenunit","Free Match","Free Match","Multisplit",null,12.1,13,null,"5","1-fase","Free Match buitenunit"],
  ["Gree","GKH09EB-K6DNA5A","Cassette","Free Match","Cassette","Multisplit",null,2.8,3,"9000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GKH12EB-K6DNA5A","Cassette","Free Match","Cassette","Multisplit",null,3.5,3.85,"12000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GKH18EB-K6DNA3A","Cassette","Free Match","Cassette","Multisplit",null,5,5.5,"18000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GKH24EC-K6DNA6A","Cassette","Free Match","Cassette","Multisplit",null,7.1,8,"24000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GEH09AA-K6DNA1E","Console","Free Match","Console","Multisplit",null,2.6,2.8,"9000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GEH12AA-K6DNA1A","Console","Free Match","Console","Multisplit",null,3.5,3.8,"12000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GEH18AA-K3DNA1C","Console","Free Match","Console","Multisplit",null,5.3,5.8,"18000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GFH09CA-K6DNA1B","Kanaal","Free Match","Kanaal","Multisplit",null,2.5,2.8,"9000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GFH12CA-K6DNA1B","Kanaal","Free Match","Kanaal","Multisplit",null,3.5,3.8,"12000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GFH18CB-K6DNA1B","Kanaal","Free Match","Kanaal","Multisplit",null,5.2,5.5,"18000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GFH21EA-K3DNA1A","Kanaal","Free Match","Kanaal","Multisplit",null,6,6.6,"21000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GTH09BA-K3DNA1A","Vloer/Plafond","Free Match","Vloer/Plafond","Multisplit",null,2.5,2.8,"9000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GTH12BA-K3DNA1A","Vloer/Plafond","Free Match","Vloer/Plafond","Multisplit",null,3.5,3.8,"12000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GTH18BA-K3DNA1A","Vloer/Plafond","Free Match","Vloer/Plafond","Multisplit",null,5.2,5.5,"18000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GTH24BA-K3DNA1A","Vloer/Plafond","Free Match","Vloer/Plafond","Multisplit",null,7.1,8,"24000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GWH07ACC-K6DNA1A","Wand","Free Match","Fairy","Multisplit",null,2,2.3,"7000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GWH09ACC-K6DNA1F","Wand","Free Match","Fairy","Multisplit",null,2.7,3,"9000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GWH09AUCXB-K6DNA1A","Wand","Free Match","Clivia","Multisplit",null,2.7,3,"9000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GWH12ACC-K6DNA1F","Wand","Free Match","Fairy","Multisplit",null,3.5,3.8,"12000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GWH12AUCXB-K6DNA1A","Wand","Free Match","Clivia","Multisplit",null,3.5,3.8,"12000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GWH18ACD-K6DNA1I","Wand","Free Match","Fairy","Multisplit",null,5.2,5.6,"18000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GWH18AUCXD-K6DNA1A","Wand","Free Match","Clivia","Multisplit",null,5.3,5.4,"18000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GWH24ACE-K6DNA1A","Wand","Free Match","Fairy","Multisplit",null,7.1,7.8,"24000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GWH24AUCXF-K6DNA1A","Wand","Free Match","Clivia","Multisplit",null,7.1,7.3,"24000",null,"1-fase","Free Match binnendeel"],
  ["Gree","GRH09DB-K6NA1A","Dakairco","Shark IV","Shark IV","Camper/Caravan",null,2.6,2.5,"Dakairco",null,"1-fase","Dakairco"],
  ["Gree","GRH12DB-K6NA1A","Dakairco","Shark IV","Shark IV","Camper/Caravan",null,3.5,3.4,"Dakairco",null,"1-fase","Dakairco"],
  ["Gree","GUD100W1/NhA-X","Buitenunit","U-Match","U-Match","Commercieel split",null,10,11.5,null,null,"3-fase","U-Match buitenunit"],
  ["Gree","GUD125W1/NhA-X","Buitenunit","U-Match","U-Match","Commercieel split",null,12.5,13.5,null,null,"3-fase","U-Match buitenunit"],
  ["Gree","GUD160W1/NhA-X","Buitenunit","U-Match","U-Match","Commercieel split",null,16,17,null,null,"3-fase","U-Match buitenunit"],
  ["Gree","GUD35W1/NhA-S","Buitenunit","U-Match","U-Match","Commercieel split",null,3.5,4,null,null,"1-fase","U-Match buitenunit"],
  ["Gree","GUD50W1/NhA-S","Buitenunit","U-Match","U-Match","Commercieel split",null,5,5.6,null,null,"1-fase","U-Match buitenunit"],
  ["Gree","GUD71W1/NhA-S","Buitenunit","U-Match","U-Match","Commercieel split",null,7.1,8,null,null,"1-fase","U-Match buitenunit"],
  ["Gree","GUD100T1/A-S","Cassette","U-Match","Cassette","Commercieel split",null,10,11.5,"36000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD125T1/A-S","Cassette","U-Match","Cassette","Commercieel split",null,12.5,13.5,"48000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD160T1/A-S","Cassette","U-Match","Cassette","Commercieel split",null,16,17,"60000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD35T1/A-S","Cassette","U-Match","Cassette","Commercieel split",null,3.5,4,"12000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD50T1/A-S","Cassette","U-Match","Cassette","Commercieel split",null,5,5.6,"18000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD71T1/A-S","Cassette","U-Match","Cassette","Commercieel split",null,7.1,8,"24000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD100PH1/A-T","Kanaal","U-Match","Kanaal","Commercieel split",null,10,11.5,"36000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD125PHS1/A-T","Kanaal","U-Match","Kanaal","Commercieel split",null,12.5,13.5,"48000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD160PH1/A-T","Kanaal","U-Match","Kanaal","Commercieel split",null,16,17,"60000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD35PS1/A-T","Kanaal","U-Match","Kanaal","Commercieel split",null,3.5,4,"12000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD50PS1/A-T","Kanaal","U-Match","Kanaal","Commercieel split",null,5,5.6,"18000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD71PHS1/A-T","Kanaal","U-Match","Kanaal","Commercieel split",null,7.1,8,"24000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD100ZD1/A-T","Vloer/Plafond","U-Match","Vloer/Plafond","Commercieel split",null,10,11.5,"36000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD125ZD1/A-T","Vloer/Plafond","U-Match","Vloer/Plafond","Commercieel split",null,12.5,13.5,"48000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD160ZD1/A-T","Vloer/Plafond","U-Match","Vloer/Plafond","Commercieel split",null,16,17,"60000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD35ZD1A-T","Vloer/Plafond","U-Match","Vloer/Plafond","Commercieel split",null,3.5,4,"12000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD50ZD1/A-T","Vloer/Plafond","U-Match","Vloer/Plafond","Commercieel split",null,5,5.6,"18000",null,"1-fase","U-Match binnendeel"],
  ["Gree","GUD71ZD1/A-T","Vloer/Plafond","U-Match","Vloer/Plafond","Commercieel split",null,7.1,8,"24000",null,"1-fase","U-Match binnendeel"],

  // ===== MITSUBISHI ELECTRIC =====
  ["Mitsubishi Electric","MXZ-2F33VF","Buitenunit","Multi Split","MXZ","Multisplit",null,null,null,null,"2",null,"Multi split buiten-unit"],
  ["Mitsubishi Electric","MXZ-2F53VF","Buitenunit","Multi Split","MXZ","Multisplit",null,null,null,null,"2",null,"Multi split buiten-unit"],
  ["Mitsubishi Electric","MXZ-2FD42VF","Buitenunit","Multi Split","MXZ","Multisplit",null,null,null,null,"2",null,"Multi split buiten-unit"],
  ["Mitsubishi Electric","MXZ-3F54VF","Buitenunit","Multi Split","MXZ","Multisplit",null,null,null,null,"3",null,"Multi split buiten-unit"],
  ["Mitsubishi Electric","MXZ-3F68VF","Buitenunit","Multi Split","MXZ","Multisplit",null,null,null,null,"3",null,"Multi split buiten-unit"],
  ["Mitsubishi Electric","MXZ-4F72VF","Buitenunit","Multi Split","MXZ","Multisplit",null,null,null,null,"4",null,"Multi split buiten-unit"],
  ["Mitsubishi Electric","MXZ-4F80VA","Buitenunit","Multi Split","MXZ","Multisplit",null,null,null,null,"4",null,"Multi split buiten-unit"],
  ["Mitsubishi Electric","MXZ-5E102VA","Buitenunit","Multi Split","MXZ","Multisplit",null,null,null,null,"5",null,"Multi split buiten-unit"],
  ["Mitsubishi Electric","MXZ-6D122VA","Buitenunit","Multi Split","MXZ","Multisplit",null,null,null,null,"6",null,"Multi split buiten-unit"],
  ["Mitsubishi Electric","PUMY-P112YKM","Buitenunit","Multi Split","PUMY","Multisplit",null,null,null,null,"8 (met branch box)",null,"VRF/City Multi buiten-unit"],
  ["Mitsubishi Electric","PUMY-P125YKM","Buitenunit","Multi Split","PUMY","Multisplit",null,null,null,null,"8 (met branch box)",null,"VRF/City Multi buiten-unit"],
  ["Mitsubishi Electric","PUMY-P140YKM","Buitenunit","Multi Split","PUMY","Multisplit",null,null,null,null,"8 (met branch box)",null,"VRF/City Multi buiten-unit"],
  ["Mitsubishi Electric","PUMY-P200YKM","Buitenunit","Multi Split","PUMY","Multisplit",null,null,null,null,"8 (met branch box)",null,"VRF/City Multi buiten-unit"],
  ["Mitsubishi Electric","PUMY-SP112 VKM/YKM","Buitenunit","Multi Split","PUMY","Multisplit",null,null,null,null,"8 (met branch box)",null,"VRF/City Multi buiten-unit"],
  ["Mitsubishi Electric","PUMY-SP125 VKM/YKM","Buitenunit","Multi Split","PUMY","Multisplit",null,null,null,null,"8 (met branch box)",null,"VRF/City Multi buiten-unit"],
  ["Mitsubishi Electric","PUMY-SP140 VKM/YKM","Buitenunit","Multi Split","PUMY","Multisplit",null,null,null,null,"8 (met branch box)",null,"VRF/City Multi buiten-unit"],
  ["Mitsubishi Electric","MLZ-KP","Cassette","RAC residentieel","MLZ-KP","Residentieel",null,null,null,null,null,null,"Cassette-unit 1-zijdig; brochure op serieniveau"],
  ["Mitsubishi Electric","MFZ-KT","Vloer","RAC residentieel","MFZ-KT","Residentieel",null,null,null,null,null,null,"Vloer-unit; brochure op serieniveau"],
  ["Mitsubishi Electric","MSZ-AP","Wand","RAC residentieel","MSZ-AP","Residentieel",null,null,null,null,null,null,"Compacte wand-unit; brochure op serieniveau"],
  ["Mitsubishi Electric","MSZ-EF","Wand","RAC residentieel","MSZ-EF","Residentieel",null,null,null,null,null,null,"Design wand-unit; brochure op serieniveau"],
  ["Mitsubishi Electric","MSZ-LN","Wand","RAC residentieel","MSZ-LN","Residentieel",null,null,null,null,null,null,"Diamond-serie; brochure op serieniveau"],

  // ===== MITSUI =====
  ["Mitsui","CDX12HP24P","Wand","CDX Dynamic","CDX","Monosplit",null,3.5,2.6,"12000",null,"1-fase","Hoog rendement muur mono"],
  ["Mitsui","CDX18HP24P","Wand","CDX Dynamic","CDX","Monosplit",null,5.3,4.2,"18000",null,"1-fase","Hoog rendement muur mono"],
  ["Mitsui","CDX24HP24P","Wand","CDX Dynamic","CDX","Monosplit",null,7,5,"24000",null,"1-fase","Hoog rendement muur mono"],
  ["Mitsui","CDX9HP24P","Wand","CDX Dynamic","CDX","Monosplit",null,2.7,2.5,"9000",null,"1-fase","Hoog rendement muur mono"],
  ["Mitsui","CDXD12HP24P","Wand","CDX Dynamic","CDX","Multisplit",null,5.3,4.5,"Dual 12000","2","1-fase","Dual multi"],
  ["Mitsui","CDXD9HP24P","Wand","CDX Dynamic","CDX","Multisplit",null,4.1,3.8,"Dual 9000","2","1-fase","Dual multi"],
  ["Mitsui","CDXP45HP24P","Wand","CDX Dynamic","CDX","Multisplit",null,12.3,9.5,"4x9000+12000","5","1-fase","Penta multi"],
  ["Mitsui","CDXQ39HP24P","Wand","CDX Dynamic","CDX","Multisplit",null,10.5,8.5,"3x9000+12000","4","1-fase","Quadri multi"],
  ["Mitsui","CDXT30HP24P","Wand","CDX Dynamic","CDX","Multisplit",null,7.9,6,"2x9000+12000","3","1-fase","Trial multi"],
  ["Mitsui","MXX12HP24P","Cassette","Cassette lijn","MXX","Commercieel",null,3.5,2.7,"12000",null,"1-fase","Cassette lijn"],
  ["Mitsui","MXX18HP24P","Cassette","Cassette lijn","MXX","Commercieel",null,5.3,4.2,"18000",null,"1-fase","Cassette lijn"],
  ["Mitsui","MXX24HP24P","Cassette","Cassette lijn","MXX","Commercieel",null,7,6,"24000",null,"1-fase","Cassette lijn"],
  ["Mitsui","MXX36HP24X","Cassette","Cassette lijn","MXX","Commercieel",null,10.5,8.5,"36000",null,"1-fase","Cassette lijn"],
  ["Mitsui","MFX12HP24X","Console","Console lijn","MFX","Commercieel",null,3.5,2.6,"12000",null,"1-fase","Console lijn"],
  ["Mitsui","MFX17HP24X","Console","Console lijn","MFX","Commercieel",null,5,4,"17000",null,"1-fase","Console lijn"],
  ["Mitsui","MXX36HP24P3X","Cassette","Driefasen cassette","MXX","Commercieel",null,10.5,8.2,"36000",null,"3-fase","Driefasen cassette"],
  ["Mitsui","MXX48HP24P3P","Cassette","Driefasen cassette","MXX","Commercieel",null,14,11,"48000",null,"3-fase","Driefasen cassette"],
  ["Mitsui","MXX60HP24P3P","Cassette","Driefasen cassette","MXX","Commercieel",null,15.3,11.9,"60000",null,"3-fase","Driefasen cassette"],
  ["Mitsui","MNX36HP24P3P","Kanaal","Driefasen kanaal","MNX","Commercieel",null,10.6,8.8,"36000",null,"3-fase","Driefasen kanaal"],
  ["Mitsui","MNX48HP24P3P","Kanaal","Driefasen kanaal","MNX","Commercieel",null,14,11.5,"48000",null,"3-fase","Driefasen kanaal"],
  ["Mitsui","MNX60HP24P3P","Kanaal","Driefasen kanaal","MNX","Commercieel",null,15.3,12.5,"60000",null,"3-fase","Driefasen kanaal"],
  ["Mitsui","MFX36HP24P3X","Vloer/Plafond","Driefasen vloer plafond","MFX","Commercieel",null,10.5,8.6,"36000",null,"3-fase","Driefasen vloer plafond"],
  ["Mitsui","MFX48HP24P3P","Vloer/Plafond","Driefasen vloer plafond","MFX","Commercieel",null,14,11.2,"48000",null,"3-fase","Driefasen vloer plafond"],
  ["Mitsui","MFX60HP24P3P","Vloer/Plafond","Driefasen vloer plafond","MFX","Commercieel",null,15.5,11.9,"60000",null,"3-fase","Driefasen vloer plafond"],
  ["Mitsui","MNX12HP24P","Kanaal","Kanaal lijn","MNX","Commercieel",null,3.5,2.7,"12000",null,"1-fase","Kanaal lijn"],
  ["Mitsui","MNX18HP24P","Kanaal","Kanaal lijn","MNX","Commercieel",null,5.3,4.3,"18000",null,"1-fase","Kanaal lijn"],
  ["Mitsui","MNX24HP24P","Kanaal","Kanaal lijn","MNX","Commercieel",null,7.1,5.6,"24000",null,"1-fase","Kanaal lijn"],
  ["Mitsui","MNX36HP24P","Kanaal","Kanaal lijn","MNX","Commercieel",null,10.5,8.4,"36000",null,"1-fase","Kanaal lijn"],
  ["Mitsui","MUX55HP24P","Kolom","Kolom lijn","MUX","Commercieel",null,14.1,11.4,"55000",null,"3-fase","Kolom lijn"],
  ["Mitsui","MTX12HP24F","Wand","MTX Trend","MTX","Monosplit",null,3.5,3,"12000",null,"1-fase","Trend lijn muur mono"],
  ["Mitsui","MTX18HP24X","Wand","MTX Trend","MTX","Monosplit",null,5.3,4.5,"18000",null,"1-fase","Trend lijn muur mono"],
  ["Mitsui","MTX24HP24X","Wand","MTX Trend","MTX","Monosplit",null,7,6.1,"24000",null,"1-fase","Trend lijn muur mono"],
  ["Mitsui","MTX9HP24F","Wand","MTX Trend","MTX","Monosplit",null,2.6,2.3,"9000",null,"1-fase","Trend lijn muur mono"],
  ["Mitsui","MTXD12HP24X","Wand","MTX Trend","MTX","Multisplit",null,5.3,4.8,"Dual 12000","2","1-fase","Dual multi"],
  ["Mitsui","MTXD9HP24X","Wand","MTX Trend","MTX","Multisplit",null,4.1,3.7,"Dual 9000","2","1-fase","Dual multi"],
  ["Mitsui","MTXP45HP24","Wand","MTX Trend","MTX","Multisplit",null,12.3,9.5,"4x9000+12000","5","1-fase","Penta multi"],
  ["Mitsui","MTXQ33HP24","Wand","MTX Trend","MTX","Multisplit",null,8.2,6.5,"4x9000","4","1-fase","Quadri multi"],
  ["Mitsui","MTXQ39HP24","Wand","MTX Trend","MTX","Multisplit",null,10.6,9,"3x9000+12000","4","1-fase","Quadri multi"],
  ["Mitsui","MTXT30HP24X","Wand","MTX Trend","MTX","Multisplit",null,7.9,5.6,"2x9000+12000","3","1-fase","Trial multi"],
  ["Mitsui","NODS13HP","Wand","Monobloc","NOD","Commercieel",null,2.59,3.82,"13000",null,"1-fase","Monobloc / zonder buitenunit"],
  ["Mitsui","MFX18HP24X","Vloer/Plafond","Vloer plafond lijn","MFX","Commercieel",null,5.4,4,"18000",null,"1-fase","Vloer plafond lijn"],
  ["Mitsui","MFX24HP24P","Vloer/Plafond","Vloer plafond lijn","MFX","Commercieel",null,7.2,5.5,"24000",null,"1-fase","Vloer plafond lijn"],
  ["Mitsui","MFX36HP24X","Vloer/Plafond","Vloer plafond lijn","MFX","Commercieel",null,10.5,8.6,"36000",null,"1-fase","Vloer plafond lijn"],
  ["Mitsui","ZDX12HP14","Wand","ZDX Dynamic Platinum","ZDX","Monosplit",null,3.5,2.5,"12000",null,"1-fase","Ultra hoog rendement muur mono"],
  ["Mitsui","ZDX18HP14","Wand","ZDX Dynamic Platinum","ZDX","Monosplit",null,5.2,4.2,"18000",null,"1-fase","Ultra hoog rendement muur mono"],
  ["Mitsui","ZDX24HP14","Wand","ZDX Dynamic Platinum","ZDX","Monosplit",null,7,5.3,"24000",null,"1-fase","Ultra hoog rendement muur mono"],
  ["Mitsui","ZDX9HP14","Wand","ZDX Dynamic Platinum","ZDX","Monosplit",null,2.6,2.4,"9000",null,"1-fase","Ultra hoog rendement muur mono"],
  ["Mitsui","ZDXDHP14","Wand","ZDX Dynamic Platinum","ZDX","Multisplit",null,5.1,4,"9000+12000","2","1-fase","Dual multi"],
  ["Mitsui","ZDXT30HP14","Wand","ZDX Dynamic Platinum","ZDX","Multisplit",null,7.9,5.6,"3x9000","3","1-fase","Trial multi"],

  // ===== MITSUBISHI HEAVY INDUSTRIES =====
  ["Mitsubishi Heavy Industries","SCM","Buitenunit","Consumenten Series 2023","SCM multisplit","Multisplit",null,null,null,null,"2-5 binnendelen",null,"Multisplit systeem voor minimaal 2 tot maximaal 5 ruimten"],
  ["Mitsubishi Heavy Industries","SRK20ZS-WF + SRC20ZS-W","Wand","Premium Series","SRK-ZS-WF","Single Split","Titanium / Contrast zwart-wit",2,2.7,"7000",null,"1-fase","SEER 8,5 / SCOP 4,6"],
  ["Mitsubishi Heavy Industries","SRK25ZS-WF + SRC25ZS-W2","Wand","Premium Series","SRK-ZS-WF","Single Split","Titanium / Contrast zwart-wit",2.5,3.2,"9000",null,"1-fase","SEER 8,5 / SCOP 4,7"],
  ["Mitsubishi Heavy Industries","SRK35ZS-WF + SRC35ZS-W2","Wand","Premium Series","SRK-ZS-WF","Single Split","Titanium / Contrast zwart-wit",3.5,4,"12000",null,"1-fase","SEER 8,4 / SCOP 4,7"],
  ["Mitsubishi Heavy Industries","SRK50ZS-WF + SRC50ZS-W","Wand","Premium Series","SRK-ZS-WF","Single Split","Titanium / Contrast zwart-wit",5,5.8,"18000",null,"1-fase","SEER 7,0 / SCOP 4,6"],
  ["Mitsubishi Heavy Industries","SRK20ZSX-WF + SRC20ZSX-W","Wand","Diamond Series","SRK-ZSX-WF","Single Split","Titanium / Contrast zwart-wit",2,2.7,"7000",null,"1-fase","SEER 10,0 / SCOP 5,2"],
  ["Mitsubishi Heavy Industries","SRK25ZSX-WF + SRC25ZSX-W","Wand","Diamond Series","SRK-ZSX-WF","Single Split","Titanium / Contrast zwart-wit",2.5,3.2,"9000",null,"1-fase","SEER 10,3 / SCOP 5,2"],
  ["Mitsubishi Heavy Industries","SRK35ZSX-WF + SRC35ZSX-W","Wand","Diamond Series","SRK-ZSX-WF","Single Split","Titanium / Contrast zwart-wit",3.5,4.3,"12000",null,"1-fase","SEER 9,5 / SCOP 5,1"],
  ["Mitsubishi Heavy Industries","SRK50ZSX-WF + SRC50ZSX-W2","Wand","Diamond Series","SRK-ZSX-WF","Single Split","Titanium / Contrast zwart-wit",5,6,"18000",null,"1-fase","SEER 8,3 / SCOP 4,7"],
  ["Mitsubishi Heavy Industries","SRK60ZSX-WF + SRC60ZSX-W1","Wand","Diamond Series","SRK-ZSX-WF","Single Split","Titanium / Contrast zwart-wit",6.1,6.8,"21000",null,"1-fase","SEER 7,8 / SCOP 4,7"],
  ["Mitsubishi Heavy Industries","SRK63ZR-WF + SRC63ZR-W","Wand","Diamond Series","SRK-ZR-WF","Single Split",null,6.3,7.1,"24000",null,"1-fase","SEER 8,1 / SCOP 4,7"],
  ["Mitsubishi Heavy Industries","SRK71ZR-WF + SRC71ZR-W","Wand","Diamond Series","SRK-ZR-WF","Single Split",null,7.1,8,"24000",null,"1-fase","SEER 7,4 / SCOP 4,5"],
  ["Mitsubishi Heavy Industries","SRK80ZR-WF + SRC80ZR-W","Wand","Diamond Series","SRK-ZR-WF","Single Split",null,8,9,"30000",null,"1-fase","SEER 7,0 / SCOP 4,4"],
  ["Mitsubishi Heavy Industries","SRK100ZR-WF + FDC100VSA/W1","Wand","Diamond Series","SRK-ZR-WF","Single Split",null,10,11.2,"36000",null,"3-fase","SEER 6,2 / SCOP 4,4"],
  ["Mitsubishi Heavy Industries","SRF25ZS-W + SRC25ZS-W2","Vloer","SRF Series","SRF Series","Single Split",null,2.5,2.9,"9000",null,"1-fase","SEER 7,4 / SCOP 4,0"],
  ["Mitsubishi Heavy Industries","SRF35ZS-W + SRC35ZS-W2","Vloer","SRF Series","SRF Series","Single Split",null,3.5,4.5,"12000",null,"1-fase","SEER 8,1 / SCOP 4,7"],
  ["Mitsubishi Heavy Industries","SRF50ZSX-W + SRC50ZSX-W2","Vloer","SRF Series","SRF Series","Single Split",null,5,6,"18000",null,"1-fase","SEER 7,5 / SCOP 4,6"],
  ["Mitsubishi Heavy Industries","SRR25ZS-W + SRC25ZS-W2","Kanaal","SRR Series","SRR Series","Single Split",null,2.5,3.4,"9000",null,"1-fase","SEER 6,6 / SCOP 4,1"],
  ["Mitsubishi Heavy Industries","SRR35ZS-W + SRC35ZS-W2","Kanaal","SRR Series","SRR Series","Single Split",null,3.5,4.2,"12000",null,"1-fase","SEER 6,8 / SCOP 4,1"],
  ["Mitsubishi Heavy Industries","SRR50ZS-W","Kanaal","SRR Series","SRR Series","Multisplit",null,5,null,"18000",null,"1-fase","Alleen leverbaar als multisplit"],
  ["Mitsubishi Heavy Industries","SRR60ZS-W","Kanaal","SRR Series","SRR Series","Multisplit",null,6,null,"21000",null,"1-fase","Alleen leverbaar als multisplit"],

  // ===== LG =====
  ["LG","PC09ST.NSJ","Wand","DUALCOOL Standard Plus","Standard Plus","Single Split",null,2.5,3.3,"9000",null,"1-fase","LG RAC 2024"],
  ["LG","PC12ST.NSJ","Wand","DUALCOOL Standard Plus","Standard Plus","Single Split",null,3.5,4,"12000",null,"1-fase","LG RAC 2024"],
  ["LG","AP09RK.NSJ","Wand","DUALCOOL Premium","Premium","Single Split",null,2.5,3.3,"9000",null,"1-fase","LG RAC 2024"],
  ["LG","AP12RK.NSJ","Wand","DUALCOOL Premium","Premium","Single Split",null,3.5,4,"12000",null,"1-fase","LG RAC 2024"],
  ["LG","A09GA2.NSE","Wand","ARTCOOL Gallery","Gallery","Single Split",null,2.5,3.3,"9000",null,"1-fase","LG RAC 2024"],
  ["LG","A12GA2.NSE","Wand","ARTCOOL Gallery","Gallery","Single Split",null,3.5,4,"12000",null,"1-fase","LG RAC 2024"],
  ["LG","AC09BK.NSJ","Wand","DUALCOOL Deluxe","Deluxe","Single Split",null,2.5,3.3,"9000",null,"1-fase","LG RAC 2024"],
  ["LG","AC12BK.NSJ","Wand","DUALCOOL Deluxe","Deluxe","Single Split",null,3.5,4,"12000",null,"1-fase","LG RAC 2024"],
  ["LG","H09S1P.NS1","Wand","DUALCOOL Premium+","Premium+","Single Split",null,2.5,3.2,"9000",null,"1-fase","A+++ serie"],
  ["LG","H12S1P.NS1","Wand","DUALCOOL Premium+","Premium+","Single Split",null,3.5,4,"12000",null,"1-fase","A+++ serie"],
];

// ----- Mapping functions -----

function mapBrand(merk: string): string {
  if (merk === "Mitsubishi Heavy Industries") return "Mitsubishi Heavy";
  return merk;
}

function mapType(unittype: string | null, systeemtype: string | null): string {
  if (!unittype) return systeemtype || "Overig";
  if (unittype.includes("Wand")) return "Wand";
  if (unittype === "Console" || unittype === "Console / Vloer-Plafond") return "Console";
  if (unittype.includes("Cassette") || unittype === "1-zijdige cassette") return "Cassette";
  if (unittype === "Kanaal") return "Kanaal";
  if (unittype.includes("Vloer/Plafond") || unittype === "Vloer-Plafond") return "Vloer/Plafond";
  if (unittype === "Vloer") return "Vloer";
  if (unittype === "Buitenunit") return "Buitenunit";
  if (unittype === "Dakairco") return "Dakairco";
  if (unittype === "Kolom") return "Kolom";
  return systeemtype || "Overig";
}

function buildDescription(row: RawRow): string {
  const [, , , productlijn, serie, systeemtype, kleur, , , btu, poorten, fase, opmerking] = row;
  const parts: string[] = [];
  if (productlijn) parts.push(productlijn);
  if (serie && serie !== productlijn) parts.push(`Serie: ${serie}`);
  if (systeemtype) parts.push(systeemtype);
  if (kleur) parts.push(`Kleur: ${kleur}`);
  if (fase) parts.push(fase);
  if (btu && btu !== "Dakairco") parts.push(`${btu} BTU/h`);
  if (poorten) parts.push(`${poorten} poorten`);
  if (opmerking) parts.push(opmerking);
  return parts.join(" | ");
}

// ----- Main seed function -----

async function main() {
  // Filter out records without modelcode
  const valid = RECORDS.filter((r) => r[1] && r[1].trim() !== "");
  console.log(`Total records: ${RECORDS.length}, with Modelcode: ${valid.length}`);

  // Track duplicates: brand::model -> count
  const seen = new Map<string, number>();
  let ok = 0;
  let errors = 0;

  for (const row of valid) {
    const brand = mapBrand(row[0]);
    let model = row[1]!;
    const kleur = row[6];
    const key = `${brand}::${model}`;
    const count = seen.get(key) || 0;
    seen.set(key, count + 1);

    // Handle duplicates: append color or counter
    if (count > 0 && kleur) {
      model = `${model} (${kleur})`;
    } else if (count > 0) {
      model = `${model} (#${count + 1})`;
    }

    const type = mapType(row[2], row[5]);
    const coolingCapacity = row[7] != null ? `${row[7]} kW` : null;
    const heatingCapacity = row[8] != null ? `${row[8]} kW` : null;
    const description = buildDescription(row);

    try {
      await prisma.aircoModel.upsert({
        where: { brand_model: { brand, model } },
        create: {
          brand,
          model,
          type,
          coolingCapacity,
          heatingCapacity,
          description,
          active: true,
        },
        update: {
          type,
          coolingCapacity,
          heatingCapacity,
          description,
        },
      });
      ok++;
      if (ok % 20 === 0) process.stdout.write(".");
    } catch (e: unknown) {
      console.error(`\nError ${brand} ${model}: ${e instanceof Error ? e.message : e}`);
      errors++;
    }
  }

  console.log(`\n\nDone: ${ok} created/updated, ${errors} errors`);
  console.log(`Total unique models in DB after seed: ${ok}`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
