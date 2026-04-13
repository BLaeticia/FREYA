import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

/* ─── Données ─────────────────────────────────────── */
const WILAYAS = [
  {code:'01',nom:'Adrar'},{code:'02',nom:'Chlef'},{code:'03',nom:'Laghouat'},
  {code:'04',nom:'Oum El Bouaghi'},{code:'05',nom:'Batna'},{code:'06',nom:'Béjaïa'},
  {code:'07',nom:'Biskra'},{code:'08',nom:'Béchar'},{code:'09',nom:'Blida'},
  {code:'10',nom:'Bouira'},{code:'11',nom:'Tamanrasset'},{code:'12',nom:'Tébessa'},
  {code:'13',nom:'Tlemcen'},{code:'14',nom:'Tiaret'},{code:'15',nom:'Tizi Ouzou'},
  {code:'16',nom:'Alger'},{code:'17',nom:'Djelfa'},{code:'18',nom:'Jijel'},
  {code:'19',nom:'Sétif'},{code:'20',nom:'Saïda'},{code:'21',nom:'Skikda'},
  {code:'22',nom:'Sidi Bel Abbès'},{code:'23',nom:'Annaba'},{code:'24',nom:'Guelma'},
  {code:'25',nom:'Constantine'},{code:'26',nom:'Médéa'},{code:'27',nom:'Mostaganem'},
  {code:'28',nom:"M'Sila"},{code:'29',nom:'Mascara'},{code:'30',nom:'Ouargla'},
  {code:'31',nom:'Oran'},{code:'32',nom:'El Bayadh'},{code:'33',nom:'Illizi'},
  {code:'34',nom:'Bordj Bou Arréridj'},{code:'35',nom:'Boumerdès'},{code:'36',nom:'El Tarf'},
  {code:'37',nom:'Tindouf'},{code:'38',nom:'Tissemsilt'},{code:'39',nom:'El Oued'},
  {code:'40',nom:'Khenchela'},{code:'41',nom:'Souk Ahras'},{code:'42',nom:'Tipaza'},
  {code:'43',nom:'Mila'},{code:'44',nom:'Aïn Defla'},{code:'45',nom:'Naâma'},
  {code:'46',nom:'Aïn Témouchent'},{code:'47',nom:'Ghardaïa'},{code:'48',nom:'Relizane'},
  {code:'49',nom:'Timimoun'},{code:'50',nom:'Bordj Badji Mokhtar'},{code:'51',nom:'Béni Abbès'},
  {code:'52',nom:'Ouled Djellal'},{code:'53',nom:'In Salah'},{code:'54',nom:'In Guezzam'},
  {code:'55',nom:'Touggourt'},{code:'56',nom:'Djanet'},{code:'57',nom:"El M'Ghair"},
  {code:'58',nom:'El Meniaa'},
];

const SPECS_GROUPED = {
  'Médecine générale':['Médecin généraliste','Médecine interne',"Médecine d'urgence",'Médecine du travail'],
  'Chirurgie':['Chirurgien général','Chirurgien orthopédiste','Neurochirurgien','Chirurgien plasticien','Chirurgien vasculaire'],
  'Médecine spécialisée':['Cardiologue','Pneumologue','Gastro-entérologue','Néphrologue','Endocrinologue','Rhumatologue','Neurologue','Hématologue','Infectiologue','Oncologue','Allergologue'],
  'Femme & Enfant':['Gynécologue','Gynécologue-obstétricien','Pédiatre','Néonatologiste','Pédopsychiatre'],
  'Spécialités sensorielles':['Ophtalmologue','ORL','Audiologiste'],
  'Dermatologie':['Dermatologue','Vénérologue'],
  'Santé mentale':['Psychiatre','Psychologue clinicien','Neuropsychiatre'],
  'Imagerie & Biologie':['Radiologue','Biologiste médical'],
  'Rééducation':['Kinésithérapeute','Médecin rééducateur','Orthophoniste'],
  'Stomatologie':['Dentiste','Orthodontiste','Chirurgien dentiste'],
  'Autres':['Anesthésiste-réanimateur','Gériatre','Urologue','Nutritionniste','Médecin sportif'],
};
const ALL_SPECS = Object.values(SPECS_GROUPED).flat();

const PRICE_RANGES = [
  {label:'Tous les tarifs',     min:0,    max:99999},
  {label:'Moins de 1 500 DA',  min:0,    max:1499 },
  {label:'1 500 – 2 500 DA',   min:1500, max:2500 },
  {label:'2 500 – 4 000 DA',   min:2501, max:4000 },
  {label:'Plus de 4 000 DA',   min:4001, max:99999},
];

const SORT_OPTIONS = [
  {value:'rating',    label:'Meilleure note'},
  {value:'price_asc', label:'Prix croissant'},
  {value:'price_desc',label:'Prix décroissant'},
  {value:'experience',label:'Plus expérimenté'},
  {value:'name',      label:'Alphabétique'},
];

/* ─── CSS ─────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

.sp { font-family:'DM Sans',-apple-system,sans-serif; background:#F8FAFC; min-height:100vh; color:#0F172A; -webkit-font-smoothing:antialiased; }
.sp * { box-sizing:border-box; margin:0; padding:0; }

/* ── NAV (même que HomePage) ── */
.sp-nav {
  background:rgba(255,255,255,0.97); border-bottom:1px solid #E2E8F0;
  position:sticky; top:0; z-index:100; backdrop-filter:blur(12px); padding:0 40px;
}
.sp-nav-in { max-width:1200px; margin:0 auto; height:64px; display:flex; align-items:center; gap:24px; }
.sp-logo { font-size:22px; font-weight:800; color:#0F172A; text-decoration:none; letter-spacing:-0.5px; flex-shrink:0; }
.sp-logo em { font-style:normal; color:#0D9488; }

/* search bar */
.sp-sbar { flex:1; display:flex; max-width:600px; background:#fff; border-radius:12px; overflow:hidden; height:42px; border:1.5px solid #E2E8F0; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
.sp-sbar:focus-within { border-color:#0D9488; box-shadow:0 0 0 3px rgba(13,148,136,0.1); }
.sp-sbar-f { flex:1; display:flex; align-items:center; padding:0 14px; gap:8px; border-right:1px solid #E2E8F0; }
.sp-sbar-f svg { color:#94A3B8; flex-shrink:0; }
.sp-sbar-f input { border:none; outline:none; font-size:13px; font-family:inherit; color:#0F172A; width:100%; }
.sp-sbar-f input::placeholder { color:#CBD5E1; }
.sp-sbar-l { display:flex; align-items:center; padding:0 12px; gap:7px; min-width:140px; border-right:1px solid #E2E8F0; }
.sp-sbar-l svg { color:#94A3B8; flex-shrink:0; }
.sp-sbar-l select { border:none; outline:none; font-size:13px; font-family:inherit; color:#0F172A; background:transparent; appearance:none; max-width:115px; cursor:pointer; }
.sp-sbar-btn { background:#0D9488; color:#fff; border:none; padding:0 18px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; transition:background 0.15s; }
.sp-sbar-btn:hover { background:#065a50; }

.sp-nav-actions { display:flex; gap:8px; align-items:center; margin-left:auto; flex-shrink:0; }
.sp-nav-login { padding:7px 16px; border-radius:9px; font-size:13px; font-weight:600; color:#0D9488; border:1.5px solid #0D9488; background:transparent; cursor:pointer; font-family:inherit; text-decoration:none; }
.sp-nav-login:hover { background:#F0FDFA; }
.sp-nav-reg { padding:7px 16px; border-radius:9px; font-size:13px; font-weight:600; color:#fff; background:#0D9488; border:none; cursor:pointer; font-family:inherit; text-decoration:none; }
.sp-nav-reg:hover { background:#065a50; }

/* ── CHIPS filtres actifs ── */
.sp-chipbar { background:#fff; border-bottom:1px solid #E2E8F0; padding:0 40px; }
.sp-chipbar-in { max-width:1200px; margin:0 auto; display:flex; align-items:center; gap:8px; padding:10px 0; flex-wrap:wrap; }
.sp-chip-lbl { font-size:12px; color:#64748B; font-weight:600; }
.sp-chip { display:inline-flex; align-items:center; gap:5px; background:#F0FDFA; border:1px solid #99F6E4; color:#065F46; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:700; cursor:pointer; }
.sp-chip:hover { background:#CCFBF1; }
.sp-chip-x { opacity:0.6; }
.sp-clear { font-size:12px; color:#94A3B8; cursor:pointer; font-weight:700; margin-left:4px; }
.sp-clear:hover { color:#EF4444; }

/* ── BODY ── */
.sp-body { display:flex; max-width:1200px; margin:0 auto; padding:24px 40px; gap:22px; align-items:start; }

/* ── SIDEBAR FILTRES ── */
.sp-aside { width:260px; flex-shrink:0; position:sticky; top:84px; max-height:calc(100vh - 100px); overflow-y:auto; scrollbar-width:thin; }
.sp-aside::-webkit-scrollbar { width:3px; }
.sp-aside::-webkit-scrollbar-thumb { background:#E2E8F0; border-radius:4px; }

.sp-filter { background:#fff; border:1px solid #E2E8F0; border-radius:14px; margin-bottom:12px; overflow:hidden; }
.sp-filter-head { display:flex; justify-content:space-between; align-items:center; padding:13px 16px; cursor:pointer; user-select:none; }
.sp-filter-head-t { font-size:13px; font-weight:700; color:#0F172A; }
.sp-filter-arrow { font-size:11px; color:#94A3B8; transition:transform 0.2s; }
.sp-filter-arrow.open { transform:rotate(180deg); }
.sp-filter-body { padding:4px 16px 14px; }
.sp-filter-sep { height:1px; background:#F1F5F9; margin:0 16px; }

.sp-fsearch { width:100%; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:7px 10px; font-size:12px; font-family:inherit; color:#0F172A; outline:none; margin-bottom:10px; }
.sp-fsearch:focus { border-color:#0D9488; }
.sp-fsearch::placeholder { color:#CBD5E1; }

.sp-fopt { display:flex; align-items:center; gap:8px; padding:5px 0; cursor:pointer; }
.sp-fopt input[type=radio], .sp-fopt input[type=checkbox] { accent-color:#0D9488; width:14px; height:14px; cursor:pointer; flex-shrink:0; }
.sp-fopt-lbl { font-size:13px; color:#475569; font-weight:500; flex:1; }
.sp-fopt:hover .sp-fopt-lbl { color:#0F172A; }

.sp-wilaya-grid { display:grid; grid-template-columns:1fr 1fr; gap:2px; max-height:220px; overflow-y:auto; }
.sp-wilaya-grid::-webkit-scrollbar { width:2px; }
.sp-wilaya-grid::-webkit-scrollbar-thumb { background:#E2E8F0; }
.sp-wopt { display:flex; align-items:center; gap:5px; padding:4px 6px; cursor:pointer; border-radius:5px; transition:background 0.1s; }
.sp-wopt:hover { background:#F8FAFC; }
.sp-wopt input { accent-color:#0D9488; width:13px; height:13px; flex-shrink:0; }
.sp-wopt-code { font-size:9px; color:#94A3B8; font-weight:700; min-width:16px; }
.sp-wopt-name { font-size:11px; color:#475569; font-weight:500; }
.sp-wopt.sel .sp-wopt-name { color:#0D9488; font-weight:700; }

.sp-spec-group-t { font-size:9px; font-weight:800; color:#94A3B8; text-transform:uppercase; letter-spacing:1px; margin:10px 0 4px; }

.sp-reset-btn { width:100%; padding:8px; background:#FEF2F2; border:1px solid #FECACA; border-radius:8px; color:#DC2626; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; margin-top:4px; }
.sp-reset-btn:hover { background:#FEE2E2; }

/* ── RESULTS ── */
.sp-results { flex:1; min-width:0; }
.sp-results-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; gap:12px; flex-wrap:wrap; }
.sp-results-count { font-size:14px; color:#64748B; font-weight:500; }
.sp-results-count strong { color:#0F172A; font-weight:800; }
.sp-sort-wrap { display:flex; align-items:center; gap:8px; }
.sp-sort-lbl { font-size:12px; color:#94A3B8; font-weight:600; }
.sp-sort-sel { background:#fff; border:1.5px solid #E2E8F0; border-radius:8px; padding:6px 12px; font-size:13px; font-family:inherit; color:#0F172A; outline:none; cursor:pointer; }

/* ── TABS ── */
.sp-tabs { display:flex; gap:0; margin-bottom:16px; border-bottom:2px solid #E2E8F0; }
.sp-tab { padding:10px 22px; font-size:13px; font-weight:700; color:#94A3B8; cursor:pointer; border:none; background:none; font-family:inherit; border-bottom:2px solid transparent; margin-bottom:-2px; transition:all 0.15s; }
.sp-tab:hover { color:#0D9488; }
.sp-tab.on { color:#0D9488; border-bottom-color:#0D9488; }

/* ── DOCTOR CARD (même style que featureCard de HomePage) ── */
.sp-doc-card {
  background:#fff; border:1.5px solid #E2E8F0; border-radius:16px;
  padding:20px; margin-bottom:10px; display:flex; gap:16px;
  cursor:pointer; transition:all 0.18s;
  box-shadow:0 1px 3px rgba(0,0,0,0.05);
}
.sp-doc-card:hover { border-color:#0D9488; box-shadow:0 4px 20px rgba(13,148,136,0.12); transform:translateY(-1px); }

.sp-doc-av {
  width:72px; height:72px; border-radius:50%; flex-shrink:0;
  background:linear-gradient(135deg, #065a50, #0D9488);
  display:flex; align-items:center; justify-content:center;
  font-size:20px; font-weight:800; color:#fff; letter-spacing:-0.5px;
}
.sp-doc-body { flex:1; min-width:0; }
.sp-doc-name { font-size:17px; font-weight:800; color:#0F172A; margin-bottom:2px; letter-spacing:-0.3px; }
.sp-doc-spec { font-size:13px; color:#0D9488; font-weight:700; margin-bottom:6px; }
.sp-doc-meta { display:flex; align-items:center; gap:6px; font-size:12px; color:#64748B; margin-bottom:8px; flex-wrap:wrap; }
.sp-doc-meta-sep { color:#E2E8F0; }
.sp-doc-verified { display:inline-flex; align-items:center; gap:3px; font-size:11px; color:#059669; font-weight:700; background:#ECFDF5; padding:2px 7px; border-radius:20px; border:1px solid #A7F3D0; }
.sp-doc-tags { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:10px; }
.sp-doc-tag { font-size:11px; padding:3px 9px; background:#F0FDFA; border:1px solid #99F6E4; border-radius:20px; color:#065F46; font-weight:700; }
.sp-doc-slots { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.sp-doc-slots-lbl { font-size:11px; color:#94A3B8; font-weight:600; }
.sp-doc-slot {
  font-size:11px; font-weight:800; color:#0D9488;
  background:#F0FDFA; border:1.5px solid #99F6E4;
  border-radius:7px; padding:4px 10px; cursor:pointer; transition:all 0.12s;
  font-family:inherit;
}
.sp-doc-slot:hover { background:#0D9488; color:#fff; border-color:#0D9488; }

.sp-doc-right { display:flex; flex-direction:column; align-items:flex-end; gap:10px; min-width:130px; flex-shrink:0; }
.sp-doc-price { font-size:18px; font-weight:800; color:#0F172A; text-align:right; letter-spacing:-0.5px; }
.sp-doc-price-lbl { font-size:10px; color:#94A3B8; display:block; margin-top:1px; }
.sp-doc-stars { display:flex; align-items:center; gap:4px; justify-content:flex-end; }
.sp-doc-stars-ic { color:#F59E0B; font-size:13px; }
.sp-doc-stars-ct { font-size:11px; color:#94A3B8; }
.sp-rdv-btn {
  background:#0D9488; color:#fff; border:none;
  border-radius:10px; padding:9px 18px;
  font-size:13px; font-weight:800; cursor:pointer;
  font-family:inherit; transition:background 0.15s; white-space:nowrap;
}
.sp-rdv-btn:hover { background:#065a50; }

/* ── LAB CARD ── */
.sp-lab-card {
  background:#fff; border:1.5px solid #E2E8F0; border-radius:16px;
  padding:20px; margin-bottom:10px; display:flex; gap:16px;
  cursor:pointer; transition:all 0.18s; box-shadow:0 1px 3px rgba(0,0,0,0.05);
}
.sp-lab-card:hover { border-color:#0D9488; box-shadow:0 4px 20px rgba(13,148,136,0.12); transform:translateY(-1px); }
.sp-lab-ic { width:56px; height:56px; border-radius:14px; background:linear-gradient(135deg,#065a50,#0D9488); display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
.sp-lab-name { font-size:15px; font-weight:800; color:#0F172A; margin-bottom:4px; }
.sp-lab-addr { font-size:12px; color:#64748B; margin-bottom:8px; display:flex; align-items:center; gap:5px; }
.sp-lab-tags { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:6px; }
.sp-lab-tag { font-size:11px; padding:3px 8px; background:#F0FDFA; border:1px solid #99F6E4; border-radius:20px; color:#065F46; font-weight:600; }
.sp-lab-hours { font-size:12px; color:#64748B; display:flex; align-items:center; gap:5px; }
.sp-lab-phone { font-size:13px; font-weight:700; color:#0D9488; }
.sp-lab-btn { background:#0D9488; color:#fff; border:none; border-radius:8px; padding:8px 16px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; white-space:nowrap; }
.sp-lab-btn:hover { background:#065a50; }

/* ── EMPTY ── */
.sp-empty { text-align:center; padding:60px 20px; }
.sp-empty-ic { font-size:40px; margin-bottom:14px; opacity:0.35; }
.sp-empty h3 { font-size:16px; font-weight:800; color:#0F172A; margin-bottom:6px; }
.sp-empty p { font-size:13px; color:#94A3B8; }

/* ── SPINNER ── */
.sp-spin { width:32px; height:32px; border:3px solid #E2E8F0; border-top-color:#0D9488; border-radius:50%; animation:sp-r 0.7s linear infinite; margin:60px auto; }
@keyframes sp-r { to { transform:rotate(360deg); } }

/* ── PAGINATION ── */
.sp-pager { display:flex; justify-content:center; gap:5px; margin-top:24px; flex-wrap:wrap; }
.sp-page-btn { min-width:36px; height:36px; border-radius:9px; border:1.5px solid #E2E8F0; background:#fff; color:#475569; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.12s; display:flex; align-items:center; justify-content:center; padding:0 10px; }
.sp-page-btn:hover { border-color:#0D9488; color:#0D9488; }
.sp-page-btn.on { background:#0D9488; color:#fff; border-color:#0D9488; }
.sp-page-btn:disabled { opacity:0.35; cursor:not-allowed; }

@media(max-width:900px) { .sp-body { flex-direction:column; padding:16px 20px; } .sp-aside { position:static; width:100%; max-height:none; } .sp-nav { padding:0 20px; } .sp-chipbar { padding:0 20px; } }
`;

export default function DoctorSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query,          setQuery]          = useState(searchParams.get('specialite') || '');
  const [wilaya,         setWilaya]         = useState(searchParams.get('wilaya') || '');
  const [tab,            setTab]            = useState('doctors');
  const [doctors,        setDoctors]        = useState([]);
  const [labs,           setLabs]           = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [total,          setTotal]          = useState(0);
  const [page,           setPage]           = useState(1);
  const PER_PAGE = 10;

  const [selWilayas,     setSelWilayas]     = useState(searchParams.get('wilaya') ? [searchParams.get('wilaya')] : []);
  const [selSpecs,       setSelSpecs]       = useState(searchParams.get('specialite') ? [searchParams.get('specialite')] : []);
  const [priceRange,     setPriceRange]     = useState(0);
  const [sortBy,         setSortBy]         = useState('rating');
  const [specSearch,     setSpecSearch]     = useState('');
  const [wilayaSearch,   setWilayaSearch]   = useState('');
  const [openSec,        setOpenSec]        = useState({wilaya:true, spec:true, price:true});

  const toggle = k => setOpenSec(p => ({...p,[k]:!p[k]}));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'doctors') {
        const p = {page, limit:PER_PAGE};
        if (selWilayas.length === 1) p.wilaya     = selWilayas[0];
        if (selSpecs.length > 0)     p.specialite = selSpecs[0];
        else if (query)              p.specialite = query;
        if (priceRange > 0) { p.minPrice = PRICE_RANGES[priceRange].min; p.maxPrice = PRICE_RANGES[priceRange].max; }
        const r = await api.get('/doctors', {params:p});
        let list = r.data.doctors || r.data || [];
        list = sort(list, sortBy);
        setDoctors(list);
        setTotal(r.data.total || list.length);
      } else {
        const p = {page, limit:PER_PAGE};
        if (selWilayas.length === 1) p.wilaya = selWilayas[0];
        if (query) p.name = query;
        const r = await api.get('/laboratory', {params:p});
        setLabs(r.data.labs || r.data || []);
        setTotal(r.data.total || (r.data.labs || r.data || []).length);
      }
    } catch { setDoctors([]); setLabs([]); setTotal(0); }
    finally { setLoading(false); }
  }, [tab, page, selWilayas, selSpecs, query, priceRange, sortBy]);

  useEffect(() => { setPage(1); }, [selWilayas, selSpecs, query, priceRange, sortBy, tab]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const sort = (list, s) => {
    const c = [...list];
    switch(s) {
      case 'rating':     return c.sort((a,b) => (b.ratingAvg||0) - (a.ratingAvg||0));
      case 'price_asc':  return c.sort((a,b) => (a.consultationPrice||0) - (b.consultationPrice||0));
      case 'price_desc': return c.sort((a,b) => (b.consultationPrice||0) - (a.consultationPrice||0));
      case 'experience': return c.sort((a,b) => (b.experienceYears||0) - (a.experienceYears||0));
      case 'name':       return c.sort((a,b) => `${a.user?.lastName}`.localeCompare(`${b.user?.lastName}`));
      default: return c;
    }
  };

  const toggleWilaya = nom => setSelWilayas(p => p.includes(nom) ? p.filter(w=>w!==nom) : [...p,nom]);
  const toggleSpec   = s   => setSelSpecs(p   => p.includes(s)   ? p.filter(x=>x!==s)   : [...p,s]);
  const resetAll = () => { setSelWilayas([]); setSelSpecs([]); setQuery(''); setWilaya(''); setPriceRange(0); setSortBy('rating'); setPage(1); };

  const activeFilters = [
    ...selWilayas.map(w => ({label:w, rm:() => setSelWilayas(p=>p.filter(x=>x!==w))})),
    ...selSpecs.map(s   => ({label:s, rm:() => setSelSpecs(p=>p.filter(x=>x!==s))})),
    ...(priceRange>0 ? [{label:PRICE_RANGES[priceRange].label, rm:()=>setPriceRange(0)}] : []),
  ];

  const filteredWilayas = WILAYAS.filter(w => !wilayaSearch || w.nom.toLowerCase().includes(wilayaSearch.toLowerCase()) || w.code.includes(wilayaSearch));
  const filteredSpecs   = specSearch ? ALL_SPECS.filter(s => s.toLowerCase().includes(specSearch.toLowerCase())) : null;

  const slots = () => {
    const days=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
    const t = new Date().getDay();
    return [0,1,2].map(i=>{const d=(t+i+1)%7;const h=[9,10,14,15][Math.floor(Math.random()*4)];const m=['00','30'][Math.floor(Math.random()*2)];return{day:days[d],time:`${h}:${m}`};});
  };

  const init = d => `${d.user?.firstName?.[0]||''}${d.user?.lastName?.[0]||''}`.toUpperCase();
  const stars = n => '★'.repeat(Math.round(Math.min(n||0,5)));
  const totalPages = Math.ceil(total/PER_PAGE);

  return (
    <>
      <style>{css}</style>
      <div className="sp">

        {/* NAV */}
        <nav className="sp-nav">
          <div className="sp-nav-in">
            <Link to="/" className="sp-logo">Freya<em>.</em></Link>
            <div className="sp-sbar">
              <div className="sp-sbar-f">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input placeholder={tab==='doctors' ? 'Spécialité, médecin...' : 'Nom du laboratoire...'} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchData()} list="sp-sl"/>
                <datalist id="sp-sl">{ALL_SPECS.map(s=><option key={s} value={s}/>)}</datalist>
              </div>
              <div className="sp-sbar-l">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <select value={wilaya} onChange={e=>{setWilaya(e.target.value);setSelWilayas(e.target.value?[e.target.value]:[]);}}>
                  <option value="">Toutes wilayas</option>
                  {WILAYAS.map(w=><option key={w.code} value={w.nom}>{w.code} – {w.nom}</option>)}
                </select>
              </div>
              <button className="sp-sbar-btn" onClick={fetchData}>Rechercher</button>
            </div>
            <div className="sp-nav-actions">
              <Link to="/login"    className="sp-nav-login">Se connecter</Link>
              <Link to="/register" className="sp-nav-reg">S'inscrire</Link>
            </div>
          </div>
        </nav>

        {/* CHIPS */}
        {activeFilters.length > 0 && (
          <div className="sp-chipbar">
            <div className="sp-chipbar-in">
              <span className="sp-chip-lbl">Filtres :</span>
              {activeFilters.map((f,i) => (
                <button key={i} className="sp-chip" onClick={f.rm}>{f.label} <span className="sp-chip-x">×</span></button>
              ))}
              <span className="sp-clear" onClick={resetAll}>Tout effacer</span>
            </div>
          </div>
        )}

        {/* BODY */}
        <div className="sp-body">

          {/* FILTRES */}
          <aside className="sp-aside">

            {/* Wilaya */}
            <div className="sp-filter">
              <div className="sp-filter-head" onClick={()=>toggle('wilaya')}>
                <span className="sp-filter-head-t">Wilaya {selWilayas.length>0&&<span style={{color:'#0D9488',fontSize:11}}>({selWilayas.length})</span>}</span>
                <span className={`sp-filter-arrow${openSec.wilaya?' open':''}`}>▼</span>
              </div>
              {openSec.wilaya && (
                <div className="sp-filter-body">
                  <input className="sp-fsearch" placeholder="Chercher une wilaya..." value={wilayaSearch} onChange={e=>setWilayaSearch(e.target.value)}/>
                  <div className="sp-wilaya-grid">
                    {filteredWilayas.map(w => (
                      <div key={w.code} className={`sp-wopt${selWilayas.includes(w.nom)?' sel':''}`} onClick={()=>toggleWilaya(w.nom)}>
                        <input type="checkbox" checked={selWilayas.includes(w.nom)} readOnly/>
                        <span className="sp-wopt-code">{w.code}</span>
                        <span className="sp-wopt-name">{w.nom}</span>
                      </div>
                    ))}
                  </div>
                  {selWilayas.length>0 && <button className="sp-reset-btn" style={{marginTop:8}} onClick={()=>setSelWilayas([])}>Tout désélectionner</button>}
                </div>
              )}
            </div>

            {/* Spécialité (médecins only) */}
            {tab==='doctors' && (
              <div className="sp-filter">
                <div className="sp-filter-head" onClick={()=>toggle('spec')}>
                  <span className="sp-filter-head-t">Spécialité {selSpecs.length>0&&<span style={{color:'#0D9488',fontSize:11}}>({selSpecs.length})</span>}</span>
                  <span className={`sp-filter-arrow${openSec.spec?' open':''}`}>▼</span>
                </div>
                {openSec.spec && (
                  <div className="sp-filter-body">
                    <input className="sp-fsearch" placeholder="Chercher une spécialité..." value={specSearch} onChange={e=>setSpecSearch(e.target.value)}/>
                    <div style={{maxHeight:260,overflowY:'auto'}}>
                      {filteredSpecs ? (
                        filteredSpecs.length===0 ? <p style={{fontSize:12,color:'#94A3B8',textAlign:'center',padding:'12px 0'}}>Aucun résultat</p>
                        : filteredSpecs.map(s => (
                          <div key={s} className="sp-fopt" onClick={()=>toggleSpec(s)}>
                            <input type="checkbox" checked={selSpecs.includes(s)} readOnly/>
                            <span className="sp-fopt-lbl">{s}</span>
                          </div>
                        ))
                      ) : Object.entries(SPECS_GROUPED).map(([g,specs]) => (
                        <div key={g}>
                          <div className="sp-spec-group-t">{g}</div>
                          {specs.map(s => (
                            <div key={s} className="sp-fopt" onClick={()=>toggleSpec(s)}>
                              <input type="checkbox" checked={selSpecs.includes(s)} readOnly/>
                              <span className="sp-fopt-lbl">{s}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    {selSpecs.length>0 && <button className="sp-reset-btn" style={{marginTop:8}} onClick={()=>setSelSpecs([])}>Tout désélectionner</button>}
                  </div>
                )}
              </div>
            )}

            {/* Prix */}
            {tab==='doctors' && (
              <div className="sp-filter">
                <div className="sp-filter-head" onClick={()=>toggle('price')}>
                  <span className="sp-filter-head-t">Tarif</span>
                  <span className={`sp-filter-arrow${openSec.price?' open':''}`}>▼</span>
                </div>
                {openSec.price && (
                  <div className="sp-filter-body">
                    {PRICE_RANGES.map((r,i) => (
                      <div key={i} className="sp-fopt" onClick={()=>setPriceRange(i)}>
                        <input type="radio" name="price" checked={priceRange===i} readOnly/>
                        <span className="sp-fopt-lbl">{r.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeFilters.length>0 && (
              <button className="sp-reset-btn" onClick={resetAll}>✕ Réinitialiser les filtres</button>
            )}
          </aside>

          {/* RÉSULTATS */}
          <div className="sp-results">

            <div className="sp-tabs">
              <button className={`sp-tab${tab==='doctors'?' on':''}`} onClick={()=>setTab('doctors')}>👨‍⚕️ Médecins</button>
              <button className={`sp-tab${tab==='labs'?' on':''}`}    onClick={()=>setTab('labs')}>🔬 Laboratoires</button>
            </div>

            <div className="sp-results-head">
              <p className="sp-results-count">
                <strong>{total}</strong> {tab==='doctors'?'médecin':'laboratoire'}{total!==1?'s':''} trouvé{total!==1?'s':''}
                {selSpecs.length>0 && <> · {selSpecs.join(', ')}</>}
                {selWilayas.length>0 && <> · {selWilayas.join(', ')}</>}
              </p>
              {tab==='doctors' && (
                <div className="sp-sort-wrap">
                  <span className="sp-sort-lbl">Trier :</span>
                  <select className="sp-sort-sel" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                    {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              )}
            </div>

            {loading ? <div className="sp-spin"/> :
              tab==='doctors' ? (
                doctors.length===0 ? (
                  <div className="sp-empty">
                    <div className="sp-empty-ic">🔍</div>
                    <h3>Aucun médecin trouvé</h3>
                    <p>Modifiez vos critères de recherche</p>
                  </div>
                ) : doctors.map(doc => (
                  <div key={doc.id} className="sp-doc-card" onClick={()=>navigate(`/medecin/${doc.id}`)}>
                    <div className="sp-doc-av">{init(doc)}</div>
                    <div className="sp-doc-body">
                      <div className="sp-doc-name">Dr. {doc.user?.firstName} {doc.user?.lastName}</div>
                      <div className="sp-doc-spec">{doc.specialite}</div>
                      <div className="sp-doc-meta">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {doc.city?`${doc.city}, `:''}{doc.wilaya}
                        <span className="sp-doc-meta-sep">·</span>
                        {doc.experienceYears||0} ans d'exp.
                        {doc.ordreVerified&&<span className="sp-doc-verified">✓ Vérifié</span>}
                      </div>
                      {doc.languages && (
                        <div className="sp-doc-tags">
                          {doc.languages.split(',').map(l=><span key={l} className="sp-doc-tag">{l.trim()}</span>)}
                        </div>
                      )}
                      <div className="sp-doc-slots">
                        <span className="sp-doc-slots-lbl">Prochains créneaux :</span>
                        {slots().map((s,i)=>(
                          <button key={i} className="sp-doc-slot" onClick={e=>{e.stopPropagation();navigate(`/medecin/${doc.id}`);}}>
                            {s.day} {s.time}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="sp-doc-right">
                      <div className="sp-doc-stars">
                        <span className="sp-doc-stars-ic">{stars(doc.ratingAvg)}</span>
                        <span className="sp-doc-stars-ct">({doc.ratingCount||0})</span>
                      </div>
                      <div>
                        <div className="sp-doc-price">{doc.consultationPrice?.toLocaleString('fr-DZ')||'—'} DA</div>
                        <span className="sp-doc-price-lbl">/ consultation</span>
                      </div>
                      <button className="sp-rdv-btn" onClick={e=>{e.stopPropagation();navigate(`/medecin/${doc.id}`);}}>Prendre RDV</button>
                    </div>
                  </div>
                ))
              ) : (
                labs.length===0 ? (
                  <div className="sp-empty">
                    <div className="sp-empty-ic">🔬</div>
                    <h3>Aucun laboratoire trouvé</h3>
                    <p>Essayez une autre wilaya</p>
                  </div>
                ) : labs.map(lab => (
                  <div key={lab.id} className="sp-lab-card" onClick={()=>navigate(`/laboratoire/${lab.id}`)}>
                    <div className="sp-lab-ic">🔬</div>
                    <div style={{flex:1}}>
                      <div className="sp-lab-name">{lab.name}</div>
                      <div className="sp-lab-addr">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {lab.city?`${lab.city}, `:''}{lab.wilaya}{lab.address?` — ${lab.address}`:''}
                      </div>
                      {lab.analyses && (
                        <div className="sp-lab-tags">
                          {lab.analyses.split(',').slice(0,4).map(a=><span key={a} className="sp-lab-tag">{a.trim()}</span>)}
                          {lab.analyses.split(',').length>4&&<span className="sp-lab-tag">+{lab.analyses.split(',').length-4}</span>}
                        </div>
                      )}
                      {lab.openingHours && <div className="sp-lab-hours">🕐 {lab.openingHours}</div>}
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:10,paddingLeft:12,borderLeft:'1px solid #F1F5F9',flexShrink:0}}>
                      {lab.phone && <span className="sp-lab-phone">📞 {lab.phone}</span>}
                      <button className="sp-lab-btn" onClick={e=>{e.stopPropagation();navigate(`/laboratoire/${lab.id}`);}}>Voir détails →</button>
                    </div>
                  </div>
                ))
              )
            }

            {/* Pagination */}
            {totalPages>1 && !loading && (
              <div className="sp-pager">
                <button className="sp-page-btn" disabled={page===1} onClick={()=>setPage(1)}>«</button>
                <button className="sp-page-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
                {Array.from({length:Math.min(totalPages,7)},(_,i)=>{
                  const p = page<=4 ? i+1 : page+i-3;
                  if(p<1||p>totalPages) return null;
                  return <button key={p} className={`sp-page-btn${p===page?' on':''}`} onClick={()=>setPage(p)}>{p}</button>;
                })}
                <button className="sp-page-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
                <button className="sp-page-btn" disabled={page===totalPages} onClick={()=>setPage(totalPages)}>»</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
