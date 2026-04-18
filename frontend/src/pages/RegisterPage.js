import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showExistModal, setShowExistModal] = useState(false);

  const [form, setForm] = useState({
  identifier: '', // Pour l'étape 1 (Email ou Tel)
  first_name: '',
  last_name: '', 
  birthDate: '',
  gender: '',
  password: '', 
  phone: '',
  });

  const navigate = useNavigate();

  // --- LOGIQUE DE NAVIGATION ---
  const handleNextStep = () => {
    if (step === 1) {
      //Si l'utilisateur existe déjà
      if (form.identifier === "test@gmail.com" || form.identifier === "0555555555") {
        setShowExistModal(true);
      } else {
        setStep(2);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  // 1. On prépare le "carton" (payload) avec les noms exacts attendus par le serveur
  const dataToSend = {
    // On envoie les deux au cas où, ou on laisse le backend décider
    email: form.identifier.includes('@') ? form.identifier : '', 
    phone: form.phone || (form.identifier.includes('@') ? '' : form.identifier),
    
    // ATTENTION : On utilise camelCase ici pour correspondre à ton middleware Prisma
    firstName: form.first_name, 
    lastName: form.last_name,
    
    password: form.password,
    
    // Vérifie si ton backend veut birth_date ou birthDate
    birthDate: form.birthDate, 
    
    // Genre : assure-toi que le backend attend 'F'/'M' ou 'female'/'male'
    gender: form.gender === 'F' ? 'female' : 'male', 
    
    role: 'patient'
  };

  // 2. DEBUG : Très important pour toi ce soir
  // Fais un clic droit sur ta page > Inspecter > Console.
  // Tu verras exactement ce que tu envoies avant que ça plante.
  console.log("Tentative d'envoi avec ces données :", dataToSend);

  setLoading(true);

  try {
    // 3. L'APPEL API (Sans les accolades autour de dataToSend !)
    await authAPI.registerPatient(dataToSend); 
    
    toast.success('Inscription réussie ! Bienvenue sur Freya :)');
    navigate('/login');
  } catch (err) {
    // 4. On récupère le VRAI message d'erreur du moteur (backend)
    const errorDetail = err.response?.data?.error || err.response?.data?.message;
    console.log("Erreur detaillée :", errorDetail);
    
    toast.error(errorDetail || "Erreur de communication avec le serveur");
  } finally {
    setLoading(false);
  }
};

    
  const getPasswordStrength = (password) => {
  if (!password) return { label: '', color: 'transparent', width: '0%' };
  if (password.length < 6) return { label: 'Faible', color: '#EF4444', width: '30%' };
  if (password.length < 10) return { label: 'Moyen', color: '#F59E0B', width: '60%' };
  // "Fort" correspond à ton image avec ta couleur verte
  return { label: 'Fort', color: '#16A34A', width: '100%' };
  };
  
  //--------Styles ---------

  const s = {
    root: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #0E4D6E 50%, #065a50 100%)', //a modifier si necessaire= backgroundColor: '#F0F2F5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: '20px', position: 'relative', overflow: 'hidden',
    },

    card: {
      backgroundColor: '#fff', borderRadius: '8px', padding: '40px',
      width: '100%', maxWidth: '540px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'relative', overflow: 'hidden',
    },
    backLink: {
      display: 'flex', alignItems: 'center', color: '#0D9488',
      cursor: 'pointer', marginBottom: '20px', fontSize: '14px', fontWeight: '600'
    },
    title: { fontSize: '24px', fontWeight: '700', color: '#05293C', marginBottom: '20px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '700', color: '#05293C', marginBottom: '8px' },
    input: {
      width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #D7DADC',
      fontSize: '16px', marginBottom: '20px', boxSizing: 'border-box',
    },
    nextBtn: {
      width: '100%', padding: '14px', backgroundColor: '#0D9488',
      color: '#fff', border: 'none', borderRadius: '8px',
      fontSize: '16px', fontWeight: '700', cursor: 'pointer',
    },
    // Progress Bar (Bas de la carte)
    progressContainer: { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#E5E7EB' },
    progressBar: (currentStep) => ({
      width: `${(currentStep / 5) * 100}%`, height: '100%',
      backgroundColor: '#2DD4BF', transition: 'width 0.3s ease'
    }),
    // Modal 
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(5, 41, 60, 0.6)', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    },
    modalCard: {
      backgroundColor: '#fff', padding: '32px', borderRadius: '8px',
      maxWidth: '500px', width: '90%', textAlign: 'center'
    }
  };

  return (
    <div style={s.root}>
      <div style={s.card}>
        
        {/* Bouton retour  */}
        {step > 1 && (
          <div style={s.backLink} onClick={() => setStep(step - 1)}>
            ← Étape précédente
          </div>
        )}

        {/* Identifiant */}
        {step === 1 && (
          <>
            <div style={s.title}>Inscrivez-vous sur Freya</div>
            <label style={s.label}>ADRESSE E-MAIL OU NUMÉRO DE TÉLÉPHONE</label>
            <input 
              style={s.input} 
              placeholder="Ex : nom@email.com ou 06 12 34 56 78"
              value={form.identifier}
              onChange={e => setForm({...form, identifier: e.target.value})}
            />
            <button style={s.nextBtn} onClick={handleNextStep}>Continuer</button>
          </>
        )}

        {/* Nom & Prénom */}
        {step === 2 && (
          <>
            <div style={s.title}>Comment vous appelez-vous ?</div>
            <p style={{color:'#64748B', fontSize:'14px', marginBottom:'15px'}}>{form.identifier}</p>
            
            <label style={s.label}>Prénom (requis)</label>
            <input style={s.input} value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
            
            <label style={s.label}>Nom (requis)</label>
            <input style={s.input} value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
            
            <button style={s.nextBtn} onClick={() => setStep(3)}>Continuer</button>
          </>
        )}

        {/* Date de naissance & Genre */}
        {step === 3 && (
          <>
            <div style={s.title}>Ajoutez les informations suivantes pour vos soignants</div>
            
            <label style={s.label}>Date de naissance (requis)</label>
            <input style={s.input} type="text" placeholder="jj / mm / aaaa" 
              value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} />
            
            <label style={s.label}>Sexe (requis)</label>
            <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
               <button 
                style={{flex:1, padding:'12px', borderRadius:'8px', border: form.gender === 'F' ? '2px solid #0070B9' : '1px solid #D7DADC', backgroundColor:'#fff', cursor:'pointer'}}
                onClick={() => setForm({...form, gender: 'F'})}
               >Féminin</button>
               <button 
                style={{flex:1, padding:'12px', borderRadius:'8px', border: form.gender === 'M' ? '2px solid #0070B9' : '1px solid #D7DADC', backgroundColor:'#fff', cursor:'pointer'}}
                onClick={() => setForm({...form, gender: 'M'})}
               >Masculin</button>
            </div>
            
            <button style={s.nextBtn} disabled={!form.gender} onClick={() => setStep(4)}>Continuer</button>
          </>
        )}

        {/* Mot de passe */}
        {step === 4 && (
          <>
            <div style={s.title}>Créez un mot de passe robuste</div>
            <label style={s.label}>Mot de passe (requis)</label>
            
            <input
             style={s.input} 
             type="password" 
             value={form.password} 
             onChange={e => setForm({...form, password: e.target.value})} 
            />
            
        {/* Indicateur visuel dynamique */}
         {form.password && (
         <div style={{ marginBottom: '20px' }}>
         <div style={{
          fontSize: '13px', 
          fontWeight: '600',
          color: getPasswordStrength(form.password).color,
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
          }}>
          <span>{getPasswordStrength(form.password).label === 'Fort' ? '✔' : '●'}</span>
          Niveau de sécurité : {getPasswordStrength(form.password).label}
          </div>
        {/* Petite barre de progression sous le texte (optionnel mais très pro) */}
         <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '2px', marginTop: '5px' }}>
          <div style={{ 
            height: '100%', 
            width: getPasswordStrength(form.password).width, 
            background: getPasswordStrength(form.password).color,
            transition: 'all 0.3s ease',
            borderRadius: '2px'
          }} />
         </div>
         </div>
        )}

      <button 
      style={{...s.nextBtn, backgroundColor: '#0D9488'}} // Ton vert
      disabled={form.password.length < 6}
      onClick={() => setStep(5)}
      >
       Continuer
      </button>
      </>
      )}

        {/* Numéro de téléphone final */}
        {step === 5 && (
          <>
            <div style={s.title}>Quel est votre numéro de téléphone ?</div>
            <label style={s.label}>Numéro de téléphone</label>
            <input style={s.input} placeholder="06 12 34 56 78" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            
            <button style={s.nextBtn} onClick={handleSubmit}>Terminer l'inscription</button>
          </>
        )}

        {/* BARRE DE PROGRESSION thinna juste en bas a chaque etape  */}
        <div style={s.progressContainer}>
          <div style={s.progressBar(step)} />
        </div>

      </div>

      {/* MODALE COMPTE EXISTANT */}
      {showExistModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalCard}>
            <h2 style={{fontSize:'22px', fontWeight:'700', marginBottom:'15px'}}>Un compte existe déjà</h2>
            <p style={{color:'#4A5568', marginBottom:'25px'}}>
              Ce numéro ou email ({form.identifier}) est déjà associé à un compte.
            </p>
            <div style={{display:'flex', gap:'12px'}}>
              <button 
                style={{flex:1, padding:'12px', border:'1px solid #0070B9', borderRadius:'8px', color:'#0070B9', backgroundColor:'#fff', fontWeight:'700', cursor:'pointer'}}
                onClick={() => setShowExistModal(false)}
              >UTILISER UN AUTRE</button>
              <button 
                style={{flex:1, padding:'12px', border:'none', borderRadius:'8px', color:'#fff', backgroundColor:'#0070B9', fontWeight:'700', cursor:'pointer'}}
                onClick={() => navigate('/login')}
              >SE CONNECTER</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}