import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronRight, AlertTriangle, Check, Loader2, Star, Quote } from 'lucide-react';
import { Button } from '../components/Button';
import { UserLead } from '../types';

// ==================================================================================
// CONFIGURATION SYSTEME.IO - ETAPE 1 (CAPTURE)
// ==================================================================================
const SYSTEME_IO_ACTION_URL = "https://starmix-ia.systeme.io/capture"; 

const TESTIMONIALS = [
  {
    text: "Je dors enfin tranquille. Fini les moustiquaires qui tiennent chaud !",
    author: "Aminata D.",
    location: "Dakar"
  },
  {
    text: "Efficace dès le premier soir pour mes enfants. Je recommande vivement.",
    author: "Jean-Marc K.",
    location: "Abidjan"
  },
  {
    text: "L'odeur est agréable, rien à voir avec les insecticides toxiques habituels.",
    author: "Sonia M.",
    location: "Libreville"
  }
];

interface CapturePageProps {
  onComplete: (lead: UserLead) => void;
}

export const CapturePage: React.FC<CapturePageProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setIsSubmitting(true);

      // Logique d'envoi vers Systeme.io (Fire & Forget)
      if (SYSTEME_IO_ACTION_URL) {
        try {
          const formData = new FormData();
          formData.append('first_name', name);
          formData.append('email', email);
          
          await fetch(SYSTEME_IO_ACTION_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
          });
          console.log("Contact envoyé à Systeme.io (Capture)");
        } catch (error) {
          console.error("Erreur d'intégration Systeme.io:", error);
        }
      }

      // Simulation d'un petit délai pour l'expérience utilisateur
      setTimeout(() => {
        setIsSubmitting(false);
        onComplete({ name, email });
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-lime-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Content (Hidden on small mobile, visible on desktop) */}
        <div className="hidden md:block space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-lime-100 text-lime-700 font-bold text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
            </span>
            Nouvelle Formule 2026
          </div>
          <h1 className="text-5xl font-black text-slate-900 leading-tight">
            Nuits Paisibles,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-600">
              Famille Protégée.
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-md">
            Rejoignez +2000 familles qui ont dit ADIEU aux moustiques sans produits toxiques.
          </p>
          <div className="space-y-3">
            {['100% Naturel & Sûr', 'Efficacité Instantanée', 'Livraison Gratuite'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-lime-100 flex items-center justify-center text-lime-600">
                  <Check size={14} strokeWidth={3} />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right Card (Form) */}
        <div className="w-full bg-white rounded-3xl shadow-2xl shadow-lime-900/10 overflow-hidden transform transition-all hover:scale-[1.01] border border-white">
          <div className="bg-gradient-to-r from-lime-500 to-emerald-600 p-4 text-center">
            <p className="text-white font-bold tracking-wide uppercase text-sm">🎁 Guide Gratuit + Offre Exclusive</p>
          </div>
          
          <div className="p-8 md:p-10 pb-6">
            <div className="flex justify-center mb-6 md:hidden">
              <div className="w-16 h-16 bg-gradient-to-tr from-lime-100 to-emerald-100 rounded-2xl rotate-3 flex items-center justify-center text-emerald-600 shadow-inner">
                <ShieldCheck size={32} />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center mb-2 leading-tight md:hidden">
              Stop aux Moustiques 🦟
            </h2>
            <p className="text-slate-600 text-center mb-6 md:hidden">
              Protégez votre famille dès ce soir.
            </p>
             
            <div className="text-center mb-8 hidden md:block">
               <h3 className="text-2xl font-bold text-slate-800">Commencez ici</h3>
               <p className="text-slate-500">Accédez à votre offre de bienvenue</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs md:text-sm text-amber-900 font-medium leading-relaxed">
                  <span className="font-bold">Attention :</span> Le Palu ne prend pas de vacances. Agissez avant la saison des pluies.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="first_name" className="block text-sm font-bold text-slate-700 pl-1">Ton Prénom</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  required
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all font-medium placeholder:text-slate-400"
                  placeholder="Ex: Moussa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 pl-1">Ton Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all font-medium placeholder:text-slate-400"
                  placeholder="Ex: moussa@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button type="submit" fullWidth pulse className="text-lg shadow-lime-500/40" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Traitement...</span>
                ) : (
                  <>VOIR LA SOLUTION <ChevronRight size={24} /></>
                )}
              </Button>
            </form>

            <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
              🔒 Vos données sont 100% sécurisées.
            </p>

            {/* Testimonials Carousel Section */}
            <div className="mt-8 pt-6 border-t border-slate-100 relative">
              <Quote className="absolute top-4 left-0 text-slate-100 w-8 h-8 -z-10 transform -scale-x-100" />
              <div className="flex justify-center gap-1 mb-3">
                 {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
              </div>
              
              <div className="min-h-[4.5rem] flex items-center justify-center">
                 <p 
                    key={activeTestimonial}
                    className="text-slate-600 text-center text-sm italic leading-relaxed animate-pulse">
                    "{TESTIMONIALS[activeTestimonial].text}"
                 </p>
              </div>

              <div className="text-center mt-3">
                 <p className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                   — {TESTIMONIALS[activeTestimonial].author}, <span className="text-slate-400 font-normal capitalize">{TESTIMONIALS[activeTestimonial].location}</span>
                 </p>
              </div>

              {/* Dots Indicators */}
              <div className="flex justify-center gap-1.5 mt-4">
                 {TESTIMONIALS.map((_, i) => (
                     <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'w-5 bg-lime-500' : 'w-1.5 bg-slate-200'}`}
                        aria-label={`Voir témoignage ${i + 1}`}
                     />
                 ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};