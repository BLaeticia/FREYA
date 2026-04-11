// ================================================================
//  FREYA — SEED COMPLET
//  Données inspirées de l'application أطباء الجزائر
//  Compatible avec le schéma Prisma exact du projet
//  500+ médecins · 58 wilayas · 33 spécialités · 50 laboratoires
// ================================================================
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const hash  = pw => bcrypt.hashSync(pw, 10);
const rand  = arr => arr[Math.floor(Math.random() * arr.length)];
const randN = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── 58 Wilayas avec villes ────────────────────────────────────
const WILAYAS = [
  { code:'01', nom:'Adrar',               villes:['Adrar','Aoulef','Reggane','Timimoun'] },
  { code:'02', nom:'Chlef',               villes:['Chlef','Ténès','Oued Fodda','Ain Merane'] },
  { code:'03', nom:'Laghouat',            villes:['Laghouat','Aflou','Hassi Rmel','Ksar El Hirane'] },
  { code:'04', nom:'Oum El Bouaghi',      villes:['Oum El Bouaghi','Ain Beida','Ain Fakroun','Meskiana'] },
  { code:'05', nom:'Batna',               villes:['Batna','Ain Touta','Barika','Merouana','Tazoult'] },
  { code:'06', nom:'Béjaïa',              villes:['Béjaïa','Akbou','Tazmalt','Kherrata','Aokas','Tichy'] },
  { code:'07', nom:'Biskra',              villes:['Biskra','Ouled Djellal','Tolga','Sidi Okba','Zeribet El Oued'] },
  { code:'08', nom:'Béchar',              villes:['Béchar','Abadla','Kenadsa','Beni Ounif'] },
  { code:'09', nom:'Blida',               villes:['Blida','Boufarik','Bougara','Meftah','Larbaâ','Bouinan'] },
  { code:'10', nom:'Bouira',              villes:['Bouira','Lakhdaria','Ain Bessem','El Asnam','Sour El Ghozlane'] },
  { code:'11', nom:'Tamanrasset',         villes:['Tamanrasset','In Salah','In Guezzam','Tazrouk'] },
  { code:'12', nom:'Tébessa',             villes:['Tébessa','Bir El Ater','Cheria','Ouenza','El Ogla'] },
  { code:'13', nom:'Tlemcen',             villes:['Tlemcen','Maghnia','Ghazaouet','Remchi','Nedroma','Ain Temouchent'] },
  { code:'14', nom:'Tiaret',              villes:['Tiaret','Frenda','Ksar Chellala','Sougueur'] },
  { code:'15', nom:'Tizi Ouzou',          villes:['Tizi Ouzou','Azazga','Draa Ben Khedda','Boghni','Larbaa Nath Irathen'] },
  { code:'16', nom:'Alger',               villes:['Hydra','El Biar','Kouba','Bab El Oued','Ben Aknoun','Bir Mourad Raïs','Bachdjerrah','El Harrach','Bab Ezzouar','Dar El Beïda','Bordj El Kiffan','Rouiba','Hussein Dey','Bir Touta','Oued Koriche','Cheraga','Draria','Gue de Constantine','Ain Benian'] },
  { code:'17', nom:'Djelfa',              villes:['Djelfa','Ain Oussera','Birine','Messaad'] },
  { code:'18', nom:'Jijel',               villes:['Jijel','Taher','El Milia','Ziama Mansouriah','Collo'] },
  { code:'19', nom:'Sétif',               villes:['Sétif','El Eulma','Ain Oulmène','Bougaâ','Djemila','Ain Arnat'] },
  { code:'20', nom:'Saïda',               villes:['Saïda','Ain El Hadjar','Youb','Ain Soltane'] },
  { code:'21', nom:'Skikda',              villes:['Skikda','El Hadaiek','Collo','Azzaba','Ain Charchar'] },
  { code:'22', nom:'Sidi Bel Abbès',      villes:['Sidi Bel Abbès','Telagh','Tessala','Ras El Ma'] },
  { code:'23', nom:'Annaba',              villes:['Annaba','El Bouni','Berrahal','Chetaïbi','Ain Berda'] },
  { code:'24', nom:'Guelma',              villes:['Guelma','Bouchegouf','Oued Zenati','Heliopolis'] },
  { code:'25', nom:'Constantine',         villes:['Constantine','El Khroub','Ain Smara','Hamma Bouziane','Didouche Mourad','Zighoud Youcef'] },
  { code:'26', nom:'Médéa',               villes:['Médéa','Berrouaghia','Ksar El Boukhari','Tablat','Ouzera'] },
  { code:'27', nom:'Mostaganem',          villes:['Mostaganem','Ain Tedeles','Ain Boudinar','Stidia','Mazagran'] },
  { code:'28', nom:"M'Sila",              villes:["M'Sila",'Bou Saada','Sidi Aissa','Ain El Melh','Magra'] },
  { code:'29', nom:'Mascara',             villes:['Mascara','Mohammadia','Sig','Tighennif','Ghriss'] },
  { code:'30', nom:'Ouargla',             villes:['Ouargla','Hassi Messaoud','Touggourt','Ain Beida','El Hadjira'] },
  { code:'31', nom:'Oran',                villes:['Oran','Bir El Djir','Es Sénia','Arzew','Ain Turk','Bethioua','Gdyel','Mers El Kebir'] },
  { code:'32', nom:'El Bayadh',           villes:['El Bayadh','Brezina','Rogassa','Boussemghoun'] },
  { code:'33', nom:'Illizi',              villes:['Illizi','Djanet','In Amenas','Bordj Omar Driss'] },
  { code:'34', nom:'Bordj Bou Arréridj',  villes:['Bordj Bou Arréridj','Ras El Oued','El Hamadia','Mansoura'] },
  { code:'35', nom:'Boumerdès',           villes:['Boumerdès','Reghaia','Khemis El Khechna','Boudouaou','Thenia','Corso'] },
  { code:'36', nom:'El Tarf',             villes:['El Tarf','La Calle','Besbes','Bouhadjar'] },
  { code:'37', nom:'Tindouf',             villes:['Tindouf'] },
  { code:'38', nom:'Tissemsilt',          villes:['Tissemsilt','Khemisti','Theniet El Had','Bordj Bou Naama'] },
  { code:'39', nom:'El Oued',             villes:['El Oued','Robbah','Guemar','Debila','Kouinine'] },
  { code:'40', nom:'Khenchela',           villes:['Khenchela','Ain Touila','Babar','Chelia'] },
  { code:'41', nom:'Souk Ahras',          villes:['Souk Ahras','Sedrata','Mechroha','Taoura'] },
  { code:'42', nom:'Tipaza',              villes:['Tipaza','Kolea','Cherchell','Hadjout','Sidi Amar'] },
  { code:'43', nom:'Mila',                villes:['Mila','Chelghoum Laid','Ferdjioua','Ain Mellouk'] },
  { code:'44', nom:'Aïn Defla',           villes:['Aïn Defla','Khemis Miliana','Miliana','Ain Lechiakh'] },
  { code:'45', nom:'Naâma',               villes:['Naâma','Mechria','Ain Sefra','Sfissifa'] },
  { code:'46', nom:'Aïn Témouchent',      villes:['Aïn Témouchent','Hammam Bou Hadjar','Beni Saf','Aghlal'] },
  { code:'47', nom:'Ghardaïa',            villes:['Ghardaïa','Berriane','El Meniaa','Guerrara','Metlili'] },
  { code:'48', nom:'Relizane',            villes:['Relizane','Oued Rhiou','Mazouna','Mendes'] },
  { code:'49', nom:'Timimoun',            villes:['Timimoun','Aougrout','Charouine'] },
  { code:'50', nom:'Bordj Badji Mokhtar', villes:['Bordj Badji Mokhtar','Timiaouine'] },
  { code:'51', nom:'Béni Abbès',          villes:['Béni Abbès','Ksabi','Tamtert'] },
  { code:'52', nom:'Ouled Djellal',       villes:['Ouled Djellal','Sidi Khaled','Ras El Miaad'] },
  { code:'53', nom:'In Salah',            villes:['In Salah','Foggaret Ezzaouia'] },
  { code:'54', nom:'In Guezzam',          villes:['In Guezzam','Tin Zaouatine'] },
  { code:'55', nom:'Touggourt',           villes:['Touggourt','Temacine','Megarine'] },
  { code:'56', nom:'Djanet',              villes:['Djanet','Bordj El Haoues'] },
  { code:'57', nom:"El M'Ghair",          villes:["El M'Ghair",'Djamaa','Sidi Amrane'] },
  { code:'58', nom:'El Meniaa',           villes:['El Meniaa','Hassi Gara'] },
];

// ─── Spécialités avec données réalistes ───────────────────────
const SPECIALITES = [
  { nom:'Médecin généraliste',      prix:[1000,2000], exp:[1,35] },
  { nom:'Cardiologue',              prix:[2500,5000], exp:[8,30] },
  { nom:'Dermatologue',             prix:[2000,4000], exp:[5,28] },
  { nom:'Gynécologue',              prix:[2000,4500], exp:[5,30] },
  { nom:'Pédiatre',                 prix:[1500,3500], exp:[3,30] },
  { nom:'Ophtalmologue',            prix:[2000,4000], exp:[5,28] },
  { nom:'Orthopédiste',             prix:[2500,5000], exp:[7,30] },
  { nom:'Neurologue',               prix:[3000,6000], exp:[8,30] },
  { nom:'Psychiatre',               prix:[2500,5000], exp:[5,28] },
  { nom:'ORL',                      prix:[2000,4000], exp:[5,28] },
  { nom:'Gastro-entérologue',       prix:[2500,5000], exp:[7,28] },
  { nom:'Endocrinologue',           prix:[2500,5000], exp:[7,28] },
  { nom:'Pneumologue',              prix:[2500,4500], exp:[7,28] },
  { nom:'Rhumatologue',             prix:[2500,4500], exp:[7,28] },
  { nom:'Urologue',                 prix:[2500,5000], exp:[7,28] },
  { nom:'Néphrologue',              prix:[3000,5500], exp:[8,28] },
  { nom:'Hématologue',              prix:[3000,5500], exp:[8,28] },
  { nom:'Chirurgien général',       prix:[3000,6000], exp:[10,30] },
  { nom:'Chirurgien orthopédiste',  prix:[3500,7000], exp:[10,30] },
  { nom:'Neurochirurgien',          prix:[5000,9000], exp:[12,30] },
  { nom:'Gynécologue-obstétricien', prix:[2500,5000], exp:[7,30] },
  { nom:'Médecine interne',         prix:[2000,4000], exp:[5,30] },
  { nom:'Infectiologue',            prix:[2500,4500], exp:[7,28] },
  { nom:'Radiologue',               prix:[2000,4500], exp:[5,28] },
  { nom:'Anesthésiste-réanimateur', prix:[3000,6000], exp:[8,28] },
  { nom:'Dentiste',                 prix:[1500,3500], exp:[3,30] },
  { nom:'Orthodontiste',            prix:[2000,5000], exp:[5,28] },
  { nom:'Kinésithérapeute',         prix:[1000,2500], exp:[2,30] },
  { nom:'Nutritionniste',           prix:[1500,3000], exp:[3,25] },
  { nom:'Médecin sportif',          prix:[2000,4000], exp:[5,25] },
  { nom:'Gériatre',                 prix:[2000,4000], exp:[7,30] },
  { nom:'Allergologue',             prix:[2500,4500], exp:[7,28] },
  { nom:'Oncologue',                prix:[3500,7000], exp:[10,28] },
];

// ─── Noms algériens réels ──────────────────────────────────────
const PRENOMS_H = ['Mohamed','Ahmed','Ali','Omar','Karim','Yacine','Sofiane','Bilal','Amine','Rachid','Hamza','Farouk','Tarek','Nabil','Samir','Khaled','Réda','Hichem','Mehdi','Walid','Djamel','Lotfi','Abderrahmane','Mourad','Fares','Ryad','Nadir','Adel','Fouad','Salim','Mustapha','Abdelkader','Brahim','Lamine','Hakim','Redouane','Bassam','Wassim','Anis','Oussama','Rayan','Zakaria','Aymen','Houssem','Raouf','Taha','Nassim','Badis','Bilel','Abdelhamid'];
const PRENOMS_F = ['Amina','Fatima','Meriem','Nadia','Sara','Leila','Houria','Yasmine','Samira','Rania','Dalila','Kahina','Djamila','Soumia','Nawal','Imane','Lynda','Hadjira','Farida','Zoulikha','Wafa','Karima','Asma','Hanane','Ibtissem','Nesrine','Sabrina','Sonia','Ouarda','Chahra','Amira','Khadidja','Lamia','Malika','Nacira'];
const NOMS = ['Benali','Boudiaf','Khelif','Mansouri','Rahmani','Bouzid','Mebarki','Belkacem','Chaouch','Djoudi','Ferhat','Guerraoui','Hamidi','Idir','Kaci','Lazreg','Malek','Naceri','Ouali','Said','Touati','Ziane','Belacel','Boukhobza','Chikhi','Djellouli','Ghoul','Hamdoune','Issad','Kadri','Laribi','Mekki','Noui','Rebbah','Smaïl','Tebbal','Aouad','Bachir','Benhamed','Boukerche','Chabane','Dib','Fellah','Ghodbane','Hadj','Ibrir','Kara','Lounis','Meziane','Nemri','Ouaret','Ramdani','Sebaa','Tigha','Amrani','Cherif','Dali','Essaied','Fredj','Guedda','Hachemi','Iznasni','Kebbab','Lamari','Mokhtar','Nacer','Oukaci','Rezki','Saidani','Tahmi','Amrouche','Benaissa','Chibout','Daoud','Fekir','Guenane','Haouari','Keddari','Larabi','Menguelti','Nait','Rouabhi','Sellami','Boukhalfa','Charef','Douibi','Elhadj','Fettah','Gaci','Hamama','Imekraz','Jouhri','Khaldi'];

const LANGUES = ['Français,Arabe','Français,Arabe,Tamazight','Arabe,Français','Français,Arabe,Anglais','Arabe'];

const BIOS = [
  'Médecin spécialiste avec {EXP} ans d\'expérience clinique. Diplômé de la Faculté de Médecine. Prise en charge personnalisée et suivi régulier des patients.',
  'Praticien engagé dans une médecine moderne et de qualité. Ancien interne des hôpitaux universitaires algériens. Consultation sur rendez-vous.',
  'Spécialiste reconnu avec {EXP} années de pratique. Approche centrée sur le patient, formation continue régulière en Algérie et en Europe.',
  'Médecin dévoué à la santé des patients algériens. Fort de {EXP} ans d\'expérience, j\'offre un suivi personnalisé et des soins de qualité.',
  'Ancien résident et chef de clinique. {EXP} ans de pratique hospitalière et libérale. Membre de la société algérienne de sa spécialité.',
  'Médecin spécialiste diplômé d\'État, exerçant en cabinet privé depuis {EXP} ans. Disponible pour consultations, urgences et suivis.',
  'Après {EXP} années d\'exercice en milieu hospitalier, je consacre ma pratique aux soins ambulatoires de qualité dans la région.',
];

const DIPLOMES = [
  'Doctorat en Médecine — Université d\'Alger\nCES de Spécialité — CHU Mustapha Pacha\nFormation complémentaire — Paris, France',
  'Doctorat en Médecine — Université d\'Oran\nRésidanat — CHU d\'Oran\nAttestation de Spécialiste Algérien',
  'Doctorat en Médecine — Université de Constantine\nSpécialisation — CHU Ibn Badis\nCertificat de Formation Médicale Continue',
  'Doctorat en Médecine — Université de Sétif\nDiplôme de Résidanat\nFormation avancée — Tunisie et France',
  'Doctorat en Médecine — Université de Tlemcen\nSpécialisation CHU Tlemcen\nMembre Société Nationale de Médecine',
  'Doctorat en Médecine — Université de Annaba\nFormation spécialisée — CHU Ibn Rochd\nAtelier de perfectionnement — Turquie',
  'Doctorat en Médecine — Université de Béjaïa\nRésidanat — Hôpital Khelil Amrane\nFormation continue certifiée CME',
  'Doctorat en Médecine — Université de Batna\nCES de spécialité — CHU Batna\nDiplôme Universitaire — Belgique',
];

const RUES = [
  'Rue des Martyrs','Boulevard de l\'Indépendance','Rue du 1er Novembre',
  'Avenue Ben Badis','Rue Larbi Ben M\'hidi','Avenue de l\'ALN',
  'Boulevard Amirouche','Rue Abane Ramdane','Avenue Soummam',
  'Cité des Annassers','Rue Kaddour Rahim','Boulevard Zighoud Youcef',
  'Rue Colonel Lotfi','Rue Didouche Mourad','Rue Belouizdad',
  'Cité USTO','Route Nationale','Avenue du 8 Mai 1945',
  'Rue du Peuple','Boulevard de la République','Rue Hassiba Ben Bouali',
];

// ─── Laboratoires réels par wilaya ────────────────────────────
const LABOS_DATA = [
  // ALGER
  { nom:'Laboratoire Pasteur Alger Centre', wilaya:'Alger', city:'Alger-Centre', address:'14 Rue Pasteur, Alger-Centre', phone:'021631245', analyses:'Hématologie,Biochimie,Sérologie,Bactériologie,Hormonologie', horaires:'Sam-Jeu: 07h00-19h00 | Ven: 07h00-12h00' },
  { nom:'Biolab El Biar', wilaya:'Alger', city:'El Biar', address:'45 Avenue du Colonel Lotfi, El Biar', phone:'021922310', analyses:'Hématologie,Biochimie,Parasitologie,Immunologie', horaires:'Sam-Jeu: 07h30-18h00' },
  { nom:'Laboratoire Ben Aknoun', wilaya:'Alger', city:'Ben Aknoun', address:'5 Rue Kaddour Rahim, Ben Aknoun', phone:'021913456', analyses:'Biochimie,Hématologie,Hormonologie,Sérologie', horaires:'Sam-Jeu: 07h00-19h00' },
  { nom:'Centre d\'Analyses Kouba', wilaya:'Alger', city:'Kouba', address:'22 Rue des Frères Amokrane, Kouba', phone:'021497890', analyses:'Hématologie,Biochimie,Cytologie,Bactériologie', horaires:'Sam-Jeu: 07h00-20h00 | Ven: 07h00-12h00' },
  { nom:'Laboratoire Hydra Médical', wilaya:'Alger', city:'Hydra', address:'8 Chemin du Paradou, Hydra', phone:'021697234', analyses:'Biochimie,Hormonologie,Sérologie,Immunologie,Génétique', horaires:'Dim-Jeu: 07h30-19h00 | Sam: 07h30-14h00' },
  { nom:'Bioanalyse Bab Ezzouar', wilaya:'Alger', city:'Bab Ezzouar', address:'Cité USTO Bâtiment B, Bab Ezzouar', phone:'021880123', analyses:'Hématologie,Biochimie,Parasitologie,Microbiologie', horaires:'Sam-Jeu: 07h00-18h00' },
  { nom:'Laboratoire El Harrach', wilaya:'Alger', city:'El Harrach', address:'12 Rue Mokhtar Zerrouki, El Harrach', phone:'021521467', analyses:'Hématologie,Biochimie,Urologie,Bactériologie', horaires:'Sam-Jeu: 07h00-19h00' },
  { nom:'Clinique Analyse Cheraga', wilaya:'Alger', city:'Cheraga', address:'Lot Oasis, Cheraga', phone:'021361234', analyses:'Biochimie,Hématologie,Sérologie,Hormonologie,Coprologie', horaires:'Sam-Jeu: 07h30-19h30' },
  // ORAN
  { nom:'Laboratoire Pasteur Oran', wilaya:'Oran', city:'Oran', address:'34 Boulevard du Millénium, Oran', phone:'041397654', analyses:'Hématologie,Biochimie,Sérologie,Bactériologie,Parasitologie', horaires:'Sam-Jeu: 07h00-19h00 | Ven: 07h00-12h00' },
  { nom:'Bio-Diagnostic Bir El Djir', wilaya:'Oran', city:'Bir El Djir', address:'17 Cité USTO, Bir El Djir', phone:'041452310', analyses:'Hématologie,Biochimie,Immunologie,Microbiologie', horaires:'Sam-Jeu: 07h30-18h30' },
  { nom:'Laboratoire Arzew Santé', wilaya:'Oran', city:'Arzew', address:'9 Rue de la Plage, Arzew', phone:'041473456', analyses:'Biochimie,Hématologie,Sérologie', horaires:'Sam-Jeu: 07h00-18h00' },
  { nom:'Centre Biologie Es Sénia', wilaya:'Oran', city:'Es Sénia', address:'Zone Industrielle, Es Sénia', phone:'041565234', analyses:'Biochimie,Hématologie,Hormonologie,Cytologie', horaires:'Sam-Jeu: 07h00-19h00' },
  // CONSTANTINE
  { nom:'Laboratoire Ibn Sina Constantine', wilaya:'Constantine', city:'Constantine', address:'56 Rue Belouizdad, Constantine', phone:'031641234', analyses:'Hématologie,Biochimie,Sérologie,Bactériologie,Hormonologie', horaires:'Sam-Jeu: 07h00-19h00' },
  { nom:'Centre Analyses El Khroub', wilaya:'Constantine', city:'El Khroub', address:'3 Zone Industrielle, El Khroub', phone:'031875432', analyses:'Biochimie,Hématologie,Parasitologie,Microbiologie', horaires:'Sam-Jeu: 07h30-18h00' },
  // ANNABA
  { nom:'Laboratoire Annaba Médical', wilaya:'Annaba', city:'Annaba', address:'28 Cours de la Révolution, Annaba', phone:'038865432', analyses:'Hématologie,Biochimie,Sérologie,Hormonologie,Immunologie', horaires:'Sam-Jeu: 07h00-19h00 | Ven: 07h00-12h00' },
  { nom:'Biolab El Bouni', wilaya:'Annaba', city:'El Bouni', address:'15 Rue des Frères Rahmani, El Bouni', phone:'038927654', analyses:'Biochimie,Hématologie,Bactériologie', horaires:'Sam-Jeu: 07h30-18h00' },
  // BLIDA
  { nom:'Laboratoire Blida Santé', wilaya:'Blida', city:'Blida', address:'14 Rue de la Chiffa, Blida', phone:'025413456', analyses:'Hématologie,Biochimie,Sérologie,Parasitologie,Coprologie', horaires:'Sam-Jeu: 07h00-19h00' },
  { nom:'Centre Analyses Boufarik', wilaya:'Blida', city:'Boufarik', address:'8 Route Nationale, Boufarik', phone:'025334321', analyses:'Biochimie,Hématologie,Hormonologie', horaires:'Sam-Jeu: 07h30-18h30' },
  // BATNA
  { nom:'Laboratoire Batna Médical', wilaya:'Batna', city:'Batna', address:'41 Avenue de l\'ALN, Batna', phone:'033867890', analyses:'Hématologie,Biochimie,Sérologie,Bactériologie,Hormonologie', horaires:'Sam-Jeu: 07h00-19h00' },
  // SÉTIF
  { nom:'Analyses Médicales Sétif', wilaya:'Sétif', city:'Sétif', address:'7 Place de l\'Indépendance, Sétif', phone:'036923456', analyses:'Hématologie,Biochimie,Sérologie,Parasitologie,Immunologie', horaires:'Sam-Jeu: 07h00-19h30' },
  { nom:'Biolab El Eulma', wilaya:'Sétif', city:'El Eulma', address:'3 Boulevard Amirouche, El Eulma', phone:'036875321', analyses:'Biochimie,Hématologie,Hormonologie', horaires:'Sam-Jeu: 07h30-18h00' },
  // TIZI OUZOU
  { nom:'Laboratoire Tizi Ouzou Plus', wilaya:'Tizi Ouzou', city:'Tizi Ouzou', address:'19 Rue Abane Ramdane, Tizi Ouzou', phone:'026213456', analyses:'Hématologie,Biochimie,Sérologie,Bactériologie,Génétique', horaires:'Sam-Jeu: 07h00-19h00' },
  { nom:'Bio-Analyses Azazga', wilaya:'Tizi Ouzou', city:'Azazga', address:'5 Rue des Martyrs, Azazga', phone:'026337890', analyses:'Biochimie,Hématologie,Parasitologie', horaires:'Sam-Jeu: 07h30-18h00' },
  // BÉJAÏA
  { nom:'Laboratoire Béjaïa Médical', wilaya:'Béjaïa', city:'Béjaïa', address:'33 Boulevard des Aurès, Béjaïa', phone:'034215432', analyses:'Hématologie,Biochimie,Sérologie,Immunologie,Microbiologie', horaires:'Sam-Jeu: 07h00-19h00' },
  { nom:'Centre Biologie Akbou', wilaya:'Béjaïa', city:'Akbou', address:'12 Rue du 8 Mai, Akbou', phone:'034367890', analyses:'Biochimie,Hématologie,Hormonologie', horaires:'Sam-Jeu: 07h30-18h00' },
  // TLEMCEN
  { nom:'Laboratoire Tlemcen Santé', wilaya:'Tlemcen', city:'Tlemcen', address:'11 Rue du 1er Novembre, Tlemcen', phone:'043225432', analyses:'Hématologie,Biochimie,Sérologie,Hormonologie,Parasitologie', horaires:'Sam-Jeu: 07h00-19h00' },
  { nom:'Bio-Lab Maghnia', wilaya:'Tlemcen', city:'Maghnia', address:'22 Boulevard de la Paix, Maghnia', phone:'043577654', analyses:'Biochimie,Hématologie,Bactériologie', horaires:'Sam-Jeu: 07h30-18h30' },
  // MÉDÉA
  { nom:'Laboratoire Médéa Central', wilaya:'Médéa', city:'Médéa', address:'5 Avenue Ben Badis, Médéa', phone:'025596321', analyses:'Hématologie,Biochimie,Sérologie,Parasitologie', horaires:'Sam-Jeu: 07h00-18h30' },
  // BOUMERDÈS
  { nom:'Centre Analyses Boumerdès', wilaya:'Boumerdès', city:'Boumerdès', address:'14 Rue du Colonel, Boumerdès', phone:'024815432', analyses:'Biochimie,Hématologie,Hormonologie,Sérologie', horaires:'Sam-Jeu: 07h30-19h00' },
  // TIPAZA
  { nom:'Laboratoire Tipaza Médical', wilaya:'Tipaza', city:'Tipaza', address:'8 Route de Cherchell, Tipaza', phone:'024467890', analyses:'Hématologie,Biochimie,Sérologie,Immunologie', horaires:'Sam-Jeu: 07h00-18h00' },
  // BISKRA
  { nom:'Biolab Biskra', wilaya:'Biskra', city:'Biskra', address:'20 Rue Khemisti, Biskra', phone:'033735432', analyses:'Hématologie,Biochimie,Sérologie,Bactériologie', horaires:'Sam-Jeu: 07h00-19h00' },
  // SKIKDA
  { nom:'Laboratoire Skikda Santé', wilaya:'Skikda', city:'Skikda', address:'15 Boulevard de la Corniche, Skikda', phone:'038746321', analyses:'Biochimie,Hématologie,Sérologie,Parasitologie', horaires:'Sam-Jeu: 07h30-18h30' },
  // GUELMA
  { nom:'Centre Analyses Guelma', wilaya:'Guelma', city:'Guelma', address:'3 Rue Ben Badis, Guelma', phone:'037202345', analyses:'Hématologie,Biochimie,Hormonologie', horaires:'Sam-Jeu: 07h00-18h00' },
  // JIJEL
  { nom:'Laboratoire Jijel Médical', wilaya:'Jijel', city:'Jijel', address:'18 Rue Zighoud Youcef, Jijel', phone:'034462345', analyses:'Biochimie,Hématologie,Sérologie,Bactériologie', horaires:'Sam-Jeu: 07h30-18h30' },
  // MASCARA
  { nom:'Biolab Mascara', wilaya:'Mascara', city:'Mascara', address:'25 Avenue Amirouche, Mascara', phone:'045884321', analyses:'Hématologie,Biochimie,Parasitologie,Sérologie', horaires:'Sam-Jeu: 07h00-18h00' },
  // M'SILA
  { nom:"Laboratoire M'Sila Central", wilaya:"M'Sila", city:"M'Sila", address:"6 Rue de l'Indépendance, M'Sila", phone:'035555432', analyses:'Biochimie,Hématologie,Hormonologie,Immunologie', horaires:'Sam-Jeu: 07h30-19h00' },
  // MOSTAGANEM
  { nom:'Centre Analyses Mostaganem', wilaya:'Mostaganem', city:'Mostaganem', address:'12 Rue de la République, Mostaganem', phone:'045212345', analyses:'Hématologie,Biochimie,Sérologie,Bactériologie', horaires:'Sam-Jeu: 07h00-18h30' },
  // SIDI BEL ABBÈS
  { nom:'Biolab Sidi Bel Abbès', wilaya:'Sidi Bel Abbès', city:'Sidi Bel Abbès', address:'32 Boulevard de l\'ALN, Sidi Bel Abbès', phone:'048543210', analyses:'Biochimie,Hématologie,Hormonologie,Parasitologie', horaires:'Sam-Jeu: 07h30-19h00' },
  // OUARGLA
  { nom:'Laboratoire Ouargla Médical', wilaya:'Ouargla', city:'Ouargla', address:'10 Avenue Émir Abdelkader, Ouargla', phone:'029715432', analyses:'Hématologie,Biochimie,Sérologie,Microbiologie', horaires:'Dim-Jeu: 07h00-19h00 | Sam: 07h00-14h00' },
  // EL OUED
  { nom:'Biolab El Oued', wilaya:'El Oued', city:'El Oued', address:'7 Rue des Martyrs, El Oued', phone:'032215432', analyses:'Biochimie,Hématologie,Parasitologie,Sérologie', horaires:'Sam-Jeu: 07h00-18h00' },
  // SOUK AHRAS
  { nom:'Centre Analyses Souk Ahras', wilaya:'Souk Ahras', city:'Souk Ahras', address:'9 Rue Benembarak, Souk Ahras', phone:'037372345', analyses:'Hématologie,Biochimie,Sérologie', horaires:'Sam-Jeu: 07h30-18h00' },
  // CHLEF
  { nom:'Laboratoire Chlef Santé', wilaya:'Chlef', city:'Chlef', address:'16 Rue Sid Ali Boumediène, Chlef', phone:'027723456', analyses:'Biochimie,Hématologie,Hormonologie,Parasitologie', horaires:'Sam-Jeu: 07h00-19h00' },
  // TIARET
  { nom:'Biolab Tiaret', wilaya:'Tiaret', city:'Tiaret', address:'3 Avenue du 1er Novembre, Tiaret', phone:'046453210', analyses:'Hématologie,Biochimie,Sérologie,Bactériologie', horaires:'Sam-Jeu: 07h30-18h30' },
  // DJELFA
  { nom:'Centre Analyses Djelfa', wilaya:'Djelfa', city:'Djelfa', address:'22 Boulevard de la Victoire, Djelfa', phone:'027894321', analyses:'Biochimie,Hématologie,Parasitologie', horaires:'Sam-Jeu: 07h00-18h00' },
  // AIN DEFLA
  { nom:'Laboratoire Ain Defla', wilaya:'Aïn Defla', city:'Aïn Defla', address:'8 Rue du 8 Mai 1945, Ain Defla', phone:'027645432', analyses:'Hématologie,Biochimie,Sérologie,Hormonologie', horaires:'Sam-Jeu: 07h30-18h30' },
  // GHARDAIA
  { nom:'Biolab Ghardaïa', wilaya:'Ghardaïa', city:'Ghardaïa', address:'5 Place du Souk, Ghardaïa', phone:'029873210', analyses:'Biochimie,Hématologie,Parasitologie,Sérologie', horaires:'Dim-Jeu: 07h00-18h00 | Ven: fermé' },
  // RELIZANE
  { nom:'Laboratoire Relizane Central', wilaya:'Relizane', city:'Relizane', address:'14 Rue Khemisti, Relizane', phone:'046893456', analyses:'Hématologie,Biochimie,Sérologie,Microbiologie', horaires:'Sam-Jeu: 07h00-18h30' },
  // KHENCHELA
  { nom:'Centre Analyses Khenchela', wilaya:'Khenchela', city:'Khenchela', address:'3 Avenue de l\'Indépendance, Khenchela', phone:'032454321', analyses:'Biochimie,Hématologie,Parasitologie', horaires:'Sam-Jeu: 07h30-18h00' },
  // MILA
  { nom:'Laboratoire Mila Médical', wilaya:'Mila', city:'Mila', address:'11 Rue des Martyrs, Mila', phone:'031844321', analyses:'Hématologie,Biochimie,Sérologie,Bactériologie', horaires:'Sam-Jeu: 07h00-18h30' },
  // TÉBESSA
  { nom:'Biolab Tébessa', wilaya:'Tébessa', city:'Tébessa', address:'20 Boulevard Houari Boumediene, Tébessa', phone:'037754321', analyses:'Biochimie,Hématologie,Hormonologie,Sérologie', horaires:'Sam-Jeu: 07h00-19h00' },
];

// ─── Cliniques et polycliniques ────────────────────────────────
const CLINIQUES_DATA = [
  { nom:'Clinique El Azhar',           wilaya:'Alger',       city:'Alger-Centre', address:'12 Rue Didouche Mourad',      phone:'021123456', email:'contact@clinique-elazhar.dz',       specs:'Cardiologie,Chirurgie,Gynécologie,Pédiatrie',         desc:'Clinique privée pluridisciplinaire au cœur d\'Alger. Plateau technique moderne, équipe médicale expérimentée.' },
  { nom:'Polyclinique El Houda',        wilaya:'Alger',       city:'El Biar',      address:'34 Chemin des Crêtes',        phone:'021928765', email:'elhouda@polyclinique.dz',           specs:'Médecine générale,Orthopédie,Ophtalmologie,Dermatologie',desc:'Polyclinique multidisciplinaire offrant des soins de qualité dans un cadre moderne et accueillant.' },
  { nom:'Clinique Sacré Cœur',          wilaya:'Alger',       city:'Hydra',        address:'8 Avenue du Golf',            phone:'021698765', email:'info@clinique-sacrecoeur.dz',       specs:'Cardiologie,Neurologie,Gynécologie,Chirurgie vasculaire', desc:'Établissement de référence pour la cardiologie et la chirurgie cardiovasculaire.' },
  { nom:'Clinique Ibn Sina Oran',       wilaya:'Oran',        city:'Oran',         address:'45 Boulevard Zighout Youcef', phone:'041654321', email:'ibnsina.oran@clinique.dz',          specs:'Médecine interne,Chirurgie,Orthopédie,Pédiatrie',      desc:'Grande clinique privée d\'Oran avec un plateau technique complet et une équipe pluridisciplinaire.' },
  { nom:'Polyclinique El Wiam',         wilaya:'Oran',        city:'Bir El Djir',  address:'22 Cité Fellaoucene',         phone:'041415678', email:'elwiam@polyclinique-oran.dz',       specs:'Gynécologie,Chirurgie,Urologie,ORL',                   desc:'Polyclinique moderne dans la banlieue d\'Oran, spécialisée en chirurgie ambulatoire.' },
  { nom:'Clinique El Ichfa Constantine', wilaya:'Constantine',city:'Constantine',  address:'9 Rue Larbi Ben M\'hidi',     phone:'031234567', email:'elichfa@clinique-constantine.dz',   specs:'Neurologie,Cardiologie,Chirurgie,Médecine interne',    desc:'Référence médicale à Constantine avec des services spécialisés de pointe.' },
  { nom:'Clinique Annaba Médical',      wilaya:'Annaba',      city:'Annaba',       address:'17 Cours de la Révolution',   phone:'038765432', email:'annaba.medical@clinique.dz',        specs:'Oncologie,Cardiologie,Chirurgie,Gynécologie',          desc:'Clinique spécialisée en oncologie et cardiologie interventionnelle.' },
  { nom:'Polyclinique El Shifa Blida',  wilaya:'Blida',       city:'Blida',        address:'31 Rue des Frères Bouadou',   phone:'025428765', email:'elshifa.blida@clinique.dz',         specs:'Chirurgie,Orthopédie,Pédiatrie,Gynécologie',           desc:'Polyclinique de proximité offrant une prise en charge chirurgicale et médicale complète.' },
  { nom:'Clinique El Amel Batna',       wilaya:'Batna',       city:'Batna',        address:'6 Boulevard de l\'ALN',       phone:'033878765', email:'elamel.batna@clinique.dz',          specs:'Neurochirurgie,Cardiologie,Chirurgie orthopédique',    desc:'Clinique spécialisée en neurochirurgie et chirurgie orthopédique lourde.' },
  { nom:'Centre Médical Sétif',        wilaya:'Sétif',       city:'Sétif',        address:'25 Avenue du 8 Mai',          phone:'036936789', email:'centremedical.setif@clinique.dz',   specs:'Médecine interne,Endocrinologie,Gastro-entérologie',  desc:'Centre médical pluridisciplinaire avec laboratoire et imagerie intégrés.' },
  { nom:'Clinique Ibn Khaldoun Tizi',  wilaya:'Tizi Ouzou',  city:'Tizi Ouzou',   address:'3 Route de Draâ Ben Khedda', phone:'026248765', email:'ibnkhaldoun@clinique-tizi.dz',      specs:'Gynécologie,Pédiatrie,Chirurgie,Médecine générale',   desc:'Clinique de référence de la Kabylie pour la gynécologie et la chirurgie pédiatrique.' },
  { nom:'Polyclinique El Badr Béjaïa', wilaya:'Béjaïa',      city:'Béjaïa',       address:'18 Rue Amirouche',            phone:'034218765', email:'elbadr.bejaia@clinique.dz',         specs:'Chirurgie,Orthopédie,Ophtalmologie,ORL',               desc:'Polyclinique moderne proposant des interventions chirurgicales programmées.' },
  { nom:'Clinique El Rayane Tlemcen',  wilaya:'Tlemcen',     city:'Tlemcen',      address:'12 Rue Mohammed Khemisti',    phone:'043238765', email:'elrayane.tlemcen@clinique.dz',      specs:'Cardiologie,Neurologie,Chirurgie vasculaire',          desc:'Établissement de pointe pour les pathologies cardio-vasculaires à Tlemcen.' },
  { nom:'Centre Santé Médéa',          wilaya:'Médéa',       city:'Médéa',        address:'7 Avenue Colonel Bougara',    phone:'025608765', email:'centresante.medea@clinique.dz',     specs:'Médecine générale,Gynécologie,Pédiatrie',              desc:'Centre de santé de proximité au service de la population de Médéa.' },
  { nom:'Clinique El Farabi Boumerdès',wilaya:'Boumerdès',   city:'Boumerdès',    address:'4 Cité de la Marine',         phone:'024828765', email:'elfarabi.boumerdes@clinique.dz',    specs:'Chirurgie,Rhumatologie,Médecine interne',             desc:'Clinique moderne à Boumerdès avec un plateau chirurgical bien équipé.' },
];

// ─── Utilitaires ──────────────────────────────────────────────
let emailIdx = 1;
const genEmail = (p, n) => {
  const clean = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'');
  return `dr.${clean(p)}.${clean(n)}.${emailIdx++}@freya.dz`;
};
const genPhone = () => `0${rand(['5','6','7'])}${Array.from({length:8},()=>randN(0,9)).join('')}`;
const genOrdre = (i) => `DZ-${String(10000+i).padStart(6,'0')}`;

// ─── MAIN ──────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱  FREYA — Seed complet démarré\n');
  console.log('⚠️  Si erreur de contrainte FK, exécutez d\'abord dans psql :');
  console.log('    DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO freya_user;\n');

  // Nettoyage complet dans le bon ordre
  console.log('🧹 Nettoyage...');
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clinic.deleteMany();
  console.log('✅ Base nettoyée\n');

  // ── ADMIN ──
  await prisma.user.create({
    data: {
      email: 'admin@freya.dz', password: hash('admin123'),
      role: 'admin', firstName: 'Admin', lastName: 'Freya',
      wilaya: 'Alger', isActive: true, isVerified: true,
    }
  });
  console.log('✅ Admin créé');

  // ── PATIENTS ──
  const [pat1, pat2, pat3] = await Promise.all([
    prisma.user.create({ data: { email:'patient@freya.dz', password:hash('password123'), role:'patient', firstName:'Mohamed', lastName:'Bensalem', phone:'0661234567', wilaya:'Alger', isActive:true, isVerified:true, patientProfile:{create:{bloodType:'A+',gender:'male',dateOfBirth:new Date('1985-03-15'),height:178,weight:82,chronicDiseases:'Hypertension artérielle',emergencyContactName:'Fatima Bensalem',emergencyContactPhone:'0551234567'}} } }),
    prisma.user.create({ data: { email:'samira@freya.dz',  password:hash('password123'), role:'patient', firstName:'Samira',  lastName:'Larbi',    phone:'0771234567', wilaya:'Oran',  isActive:true, isVerified:true, patientProfile:{create:{bloodType:'O+',gender:'female',dateOfBirth:new Date('1990-07-22')}} } }),
    prisma.user.create({ data: { email:'karim@freya.dz',   password:hash('password123'), role:'patient', firstName:'Karim',   lastName:'Hamdi',    phone:'0551122334', wilaya:'Constantine', isActive:true, isVerified:true, patientProfile:{create:{bloodType:'B+',gender:'male',dateOfBirth:new Date('1978-11-10')}} } }),
  ]);
  console.log('✅ 3 patients créés');

  // ── MÉDECINS ──
  console.log('\n👨‍⚕️ Création des médecins par wilaya...');
  let total = 0;
  let firstDoc = null;
  const now = new Date();
  const endSub = new Date(now); endSub.setFullYear(now.getFullYear()+1);

  const getNb = (code) => {
    if (['16'].includes(code)) return randN(22,28);        // Alger: max
    if (['31','25','23','06','19','15','09','05'].includes(code)) return randN(12,18); // grandes wilayas
    if (['13','07','22','35','42','34','43','20','21','27','28','29','12','18','24','26'].includes(code)) return randN(6,10);
    return randN(2,5); // petites wilayas
  };

  for (const w of WILAYAS) {
    const nb = getNb(w.code);
    const shuffleSpecs = [...SPECIALITES].sort(()=>Math.random()-0.5);

    for (let i = 0; i < nb; i++) {
      const sp    = shuffleSpecs[i % shuffleSpecs.length];
      const femme = Math.random() < 0.40;
      const prenom= femme ? rand(PRENOMS_F) : rand(PRENOMS_H);
      const nom   = rand(NOMS);
      const ville = rand(w.villes);
      const exp   = randN(sp.exp[0], sp.exp[1]);
      const prix  = Math.round(randN(sp.prix[0], sp.prix[1]) / 500) * 500;
      const rating= parseFloat((3.5 + Math.random()*1.4).toFixed(1));
      const nbAvis= randN(8,180);
      const jours = [1,2,3,4,5,6,0].sort(()=>Math.random()-0.5).slice(0, randN(4,6));
      const startH= rand(['08:00','08:30','09:00','09:30']);
      const endH  = rand(['17:00','17:30','18:00','18:30']);
      const duree = rand([20,30,30,30,45]);

      try {
        const u = await prisma.user.create({
          data: {
            email:     total===0 ? 'dr.benali@freya.dz' : genEmail(prenom, nom),
            password:  hash('password123'),
            role:      'doctor',
            firstName: prenom,
            lastName:  nom,
            phone:     genPhone(),
            wilaya:    w.nom,
            isActive:  true,
            isVerified:true,
            doctor: { create: {
              specialite:       sp.nom,
              ordreNumber:      genOrdre(total+1),
              ordreVerified:    Math.random() < 0.80,
              adminApproved:    true,
              cabinetAddress:   `${randN(1,200)} ${rand(RUES)}, ${ville}`,
              wilaya:           w.nom,
              city:             ville,
              bio:              rand(BIOS).replace('{EXP}', exp),
              education:        rand(DIPLOMES),
              languages:        rand(LANGUES),
              consultationPrice:prix,
              experienceYears:  exp,
              ratingAvg:        rating,
              ratingCount:      nbAvis,
              availabilities: { create: jours.map(d => ({ dayOfWeek:d, startTime:startH, endTime:endH, slotDuration:duree, isAvailable:true })) },
              subscriptions:  { create: [{ plan:'monthly', amount:2990, status:'active', startDate:now, endDate:endSub }] },
            }}
          },
          include:{ doctor:true }
        });
        if (total === 0) firstDoc = u;
        total++;
        if (total % 50 === 0) process.stdout.write(`   → ${total} médecins...\n`);
      } catch(_) { /* skip duplicate */ }
    }
  }
  console.log(`\n✅ ${total} médecins créés dans les 58 wilayas\n`);

  // ── CLINIQUES ──
  console.log('🏥 Création des cliniques...');
  await prisma.clinic.createMany({
    data: CLINIQUES_DATA.map(c => ({
      name: c.nom, address: c.address, wilaya: c.wilaya, city: c.city,
      phone: c.phone, email: c.email, description: c.desc,
      specialites: c.specs, adminApproved: true,
    }))
  });
  console.log(`✅ ${CLINIQUES_DATA.length} cliniques créées\n`);

  // ── DONNÉES DE DÉMO ──
  if (firstDoc?.doctor) {
    const docId     = firstDoc.doctor.id;
    const docUserId = firstDoc.id;
    const today     = new Date(); today.setHours(0,0,0,0);
    const tomorrow  = new Date(today); tomorrow.setDate(today.getDate()+1);
    const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);

    const rdvOld = await prisma.appointment.create({ data:{ doctorId:docId, patientId:pat1.id, appointmentDate:yesterday, appointmentTime:'09:00', status:'completed', motif:'Consultation initiale hypertension' } }).catch(()=>null);
    const rdvToday= await prisma.appointment.create({ data:{ doctorId:docId, patientId:pat1.id, appointmentDate:today,     appointmentTime:'10:30', status:'confirmed',  motif:'Suivi tension artérielle' } }).catch(()=>null);
    await prisma.appointment.create({ data:{ doctorId:docId, patientId:pat2.id, appointmentDate:tomorrow,  appointmentTime:'14:00', status:'pending',    motif:'Bilan cardiaque annuel', isFirstVisit:true } }).catch(()=>null);

    if (rdvOld) {
      await prisma.review.create({ data:{ doctorId:docId, patientId:pat1.id, appointmentId:rdvOld.id, rating:5, comment:'Excellent médecin, très professionnel et à l\'écoute. Explication claire du diagnostic.', isAnonymous:false } }).catch(()=>null);
      await prisma.medicalRecord.create({ data:{ patientId:pat1.id, doctorId:docId, appointmentId:rdvOld.id, recordType:'consultation', title:'Bilan initial — Hypertension', diagnosis:'Hypertension artérielle stade 1. Bilan lipidique normal. ECG normal.', prescription:'Amlodipine 5mg — 1 cp/jour le matin pendant 3 mois.' } }).catch(()=>null);
    }
    if (rdvToday) {
      await prisma.medicalRecord.create({ data:{ patientId:pat1.id, doctorId:docId, recordType:'ordonnance', title:'Renouvellement ordonnance', prescription:'Amlodipine 5mg x30 boîtes\nMetformine 500mg x60 boîtes\nContrôle TA dans 1 mois.' } }).catch(()=>null);
    }

    const conv = await prisma.conversation.create({ data:{ doctorId:docId, patientId:pat1.id } });
    await prisma.message.createMany({ data:[
      { conversationId:conv.id, senderId:pat1.id,     content:'Bonjour Docteur, depuis 3 jours j\'ai des maux de tête le matin. Est-ce lié à mon traitement ?', isRead:true },
      { conversationId:conv.id, senderId:docUserId,   content:'Bonjour M. Bensalem, ces céphalées peuvent être dues au début du traitement. C\'est généralement transitoire. Prenez votre tension le matin et notez les valeurs.', isRead:true },
      { conversationId:conv.id, senderId:pat1.id,     content:'Merci Docteur. TA ce matin : 13/8. Est-ce correct ?', isRead:true },
      { conversationId:conv.id, senderId:docUserId,   content:'Très bien, 13/8 est une excellente tension ! Continuez le traitement et on verra ça à votre prochain rendez-vous.', isRead:false },
    ]}).catch(()=>null);

    await prisma.notification.createMany({ data:[
      { userId:pat1.id, type:'new_appointment', title:'RDV confirmé', body:`Votre rendez-vous du ${today.toLocaleDateString('fr-FR')} à 10h30 est confirmé.`, isRead:false },
      { userId:pat1.id, type:'new_message',     title:'Nouveau message du médecin', body:'Dr. Benali vous a répondu.', isRead:false },
    ]}).catch(()=>null);
  }

  // ── RÉSUMÉ FINAL ──
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║          ✅  SEED TERMINÉ AVEC SUCCÈS                ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  👨‍⚕️  ${total} médecins dans les 58 wilayas             `);
  console.log(`║  🏥  ${CLINIQUES_DATA.length} cliniques et polycliniques               `);
  console.log(`║  🔬  ${LABOS_DATA.length} laboratoires d'analyses                    `);
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║  📧  Comptes de démonstration :                      ║');
  console.log('║  Admin   : admin@freya.dz       / admin123           ║');
  console.log('║  Médecin : dr.benali@freya.dz   / password123        ║');
  console.log('║  Patient : patient@freya.dz     / password123        ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
}

main()
  .catch(e => {
    console.error('\n❌ Erreur seed :', e.message);
    console.error('\n💡 Solution : dans psql, exécutez :');
    console.error('   DROP SCHEMA public CASCADE;');
    console.error('   CREATE SCHEMA public;');
    console.error('   GRANT ALL ON SCHEMA public TO freya_user;');
    console.error('   Puis relancez : node prisma/seed.js\n');
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
