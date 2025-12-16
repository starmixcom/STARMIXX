import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Moon, 
  Baby, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  Clock, 
  ChevronDown,
  Minus,
  Plus,
  Zap,
  Loader2,
  MapPin
} from 'lucide-react';
import { Button } from '../components/Button';
import { OrderDetails, Variant } from '../types';
import { AB_CONTENT } from '../utils/abTesting';

// ==================================================================================
// CONFIGURATION SYSTEME.IO - ETAPE 2 (VENTE/COMMANDE)
// ==================================================================================
const SYSTEME_IO_SALES_URL = "https://starmix-ia.systeme.io/vente";

// Liste des villes principales pour l'autocomplétion
const MAJOR_CITIES = [
  "Abidjan", "Dakar", "Douala", "Yaoundé", "Libreville", "Bamako", 
  "Ouagadougou", "Conakry", "Cotonou", "Lomé", "Niamey", "Brazzaville",
  "Pointe-Noire", "Bouaké", "Yamoussoukro", "Thiès", "Saint-Louis", 
  "San-Pédro", "Bobo-Dioulasso", "Sikasso", "Koudougou", "Parakou",
  "Porto-Novo", "Kara", "Maradi", "Zinder"
];

interface SalesPageProps {
  onOrder: (details: OrderDetails) => void;
  leadName?: string;
  leadEmail?: string;
  variant: Variant;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onOrder, leadName, leadEmail, variant }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 45, seconds: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<OrderDetails>>({
    name: leadName || '',
    phone: '',
    city: '',
    neighborhood: '',
    quantity: 1
  });

  // États pour l'autocomplétion de la ville
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityInputWrapperRef = useRef<HTMLDivElement>(null);

  // Chargement du contenu spécifique à la variante (A ou B)
  const content = AB_CONTENT[variant];

  // Countdown timer logic for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fermer les suggestions si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityInputWrapperRef.current && !cityInputWrapperRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScrollToOrder = () => {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, city: value }));

    if (value.length > 0) {
      const filtered = MAJOR_CITIES.filter(city => 
        city.toLowerCase().startsWith(value.toLowerCase()) || 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limiter à 5 suggestions
      
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setShowCitySuggestions(false);
    }
  };

  const selectCity = (city: string) => {
    setFormData(prev => ({ ...prev, city: city }));
    setShowCitySuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.city) {
      setIsSubmitting(true);
      
      const orderDetails: OrderDetails = {
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        neighborhood: formData.neighborhood || '',
        quantity: formData.quantity || 1,
        variant: variant // On enregistre la variante qui a converti
      };

      // Envoi des données de commande à Systeme.io
      if (SYSTEME_IO_SALES_URL) {
        try {
          const data = new FormData();
          
          // --- Champs Standards ---
          if (leadEmail) data.append('email', leadEmail);
          data.append('first_name', orderDetails.name);
          data.append('phone_number', orderDetails.phone);
          data.append('city', orderDetails.city);
          data.append('address', `${orderDetails.neighborhood} - ${orderDetails.city}`); 
          
          // --- Tracking A/B & Analytics Robuste ---
          data.append('custom_field_ab_variant', variant); 
          data.append('custom_field_product_qty', orderDetails.quantity.toString());
          data.append('custom_field_funnel_step', 'sales_conversion');
          data.append('custom_field_conversion_date', new Date().toISOString());

          await fetch(SYSTEME_IO_SALES_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: data
          });
          
          console.log(`[Tracking] Conversion réussie - Variante: ${variant} - Qty: ${orderDetails.quantity}`);
        } catch (error) {
          console.error("[Tracking] Erreur critique lors de l'envoi vers Systeme.io:", error);
        }
      }

      // Petit délai pour UX (feedback visuel)
      setTimeout(() => {
        setIsSubmitting(false);
        onOrder(orderDetails);
      }, 800);
    }
  };

  const quantity = formData.quantity || 1;
  const unitPrice = content.price;
  const totalPrice = quantity * unitPrice;
  const realValue = quantity * 30000; // Valeur perçue fixe ou dynamique si besoin

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Sticky Top Bar - Gradient & Urgency */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-white py-3 px-4 shadow-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm md:text-base">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
            </span>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
              OFFRE FLASH 2+1
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <Clock size={14} className="text-lime-400" />
            <span className="font-mono font-bold text-lime-50">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative pt-12 pb-24 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full -z-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-lime-100 mb-8 transform hover:scale-105 transition-transform cursor-default animate-fade-in-up">
             <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
             <span className="text-sm font-bold text-slate-800">N °1 Efficacité Prouvée</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.15] animate-fade-in-up delay-100">
            {content.headline(leadName)} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-600 relative inline-block">
              {content.headlineHighlight}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            {content.subheadline}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
            <Button onClick={handleScrollToOrder} className="text-xl px-10 py-5 animate-cta-attention shadow-lime-500/40">
              {content.heroButton}
            </Button>
            <div className="flex -space-x-3 items-center mt-4 md:mt-0">
               {/* Avatars simulation */}
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                    User
                 </div>
               ))}
               <div className="pl-4 text-sm font-bold text-slate-600">
                 +2000 Familles ravies
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Problem Section */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative animate-float">
             <div className="absolute inset-0 bg-red-100 transform rotate-3 rounded-3xl"></div>
             <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-red-100">
                <h3 className="flex items-center gap-3 font-black text-2xl text-red-600 mb-6">
                  <AlertCircle size={32} />
                  Le Danger est Réel
                </h3>
                <ul className="space-y-4">
                  {[
                    "Le Paludisme est la cause N°1 de mortalité.",
                    "Les sprays chimiques intoxiquent vos enfants.",
                    "Le bruit (Bzzzz) détruit votre sommeil profond."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-700 text-lg">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">✕</div>
                      {item}
                    </li>
                  ))}
                </ul>
             </div>
          </div>
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">
              Ne prenez pas de risques avec la santé de vos proches.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Imaginez une nuit complète, dans le silence, en sachant que vos enfants dorment en sécurité. C'est exactement ce que Starmix vous offre dès la première pulvérisation.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits - Modern Cards */}
      <section className="bg-slate-900 py-20 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="text-lime-400 font-bold tracking-wider uppercase text-sm">La Solution Ultime</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-2">
              {content.benefitsTitle} <span className="text-lime-400 underline decoration-wavy decoration-lime-500/50">{content.benefitsHighlight}</span> ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "Bouclier Total", desc: "Une barrière infranchissable instantanée." },
              { icon: Baby, title: "Sûr pour Bébés", desc: "Formule douce adaptée aux chambres d'enfants." },
              { icon: Moon, title: "Nuits de Rêve", desc: "Fini la moustiquaire qui tient chaud." }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700 hover:border-lime-500/50 transition-all duration-300 hover:-translate-y-2 group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${(i + 1) * 200}ms`, animationFillMode: 'forwards' }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-lime-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-lime-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <feature.icon size={30} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Irresistible Offer */}
      <section id="offer" className="py-24 px-4 bg-lime-50/50">
        <div className="max-w-lg mx-auto">
          {/* Card Container */}
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white ring-4 ring-lime-100 transform transition-transform hover:-translate-y-2">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-lime-500 to-emerald-600 py-6 text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
               <h3 className="text-3xl font-black text-white italic tracking-wide relative z-10">{content.offerTitle}</h3>
               <p className="text-lime-100 font-medium relative z-10 flex justify-center items-center gap-1 mt-1">
                 <Zap size={16} fill="currentColor" /> Stock Limité
               </p>
            </div>
            
            <div className="p-8 md:p-10 text-center">
              <div className="mb-8">
                <span className="text-slate-400 font-medium line-through text-lg block mb-2">Prix standard : {content.crossedPrice.toLocaleString('fr-FR')} FCFA</span>
                <div className="flex items-center justify-center gap-2">
                   <span className="text-6xl font-black text-slate-900 tracking-tight">{content.price.toLocaleString('fr-FR')}</span>
                   <div className="flex flex-col text-left leading-none">
                     <span className="text-xl font-bold text-slate-900">FCFA</span>
                     <span className="text-xs text-slate-500 font-medium">LE PACK</span>
                   </div>
                </div>
                <div className="inline-block bg-lime-100 text-lime-800 font-bold px-4 py-1 rounded-full text-sm mt-4">
                   {content.offerBadge}
                </div>
              </div>

              {/* List features */}
              <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-3 border border-slate-100">
                {[
                  "2 Bouteilles Starmix Achetées",
                  "1 Bouteille OFFERTE (Gratuit)",
                  "Livraison Gratuite (24h)",
                  "Paiement à la livraison"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="text-lime-500 shrink-0" size={20} />
                    <span className={idx === 1 ? "font-bold text-slate-900 uppercase" : "text-slate-700"}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Button onClick={handleScrollToOrder} fullWidth className="text-xl py-5 shadow-lime-500/30 animate-pulse-slow">
                JE COMMANDE MAINTENANT 👉
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Order Form - Hyper Pro */}
      <section id="order-form" className="py-20 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Finaliser ma commande</h2>
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium bg-emerald-50 inline-block px-4 py-1 rounded-full">
               <ShieldCheck size={16} /> Paiement à la livraison - Zéro Risque
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Nom Complet</label>
              <input 
                required
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all font-medium"
                placeholder="Votre nom"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Numéro de Téléphone</label>
              <input 
                required
                type="tel" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all font-medium"
                placeholder="Ex: 07 12 34 56 78"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 relative" ref={cityInputWrapperRef}>
                <label className="text-sm font-bold text-slate-700 ml-1">Ville</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all font-medium"
                    placeholder="Ville..."
                    value={formData.city}
                    onChange={handleCityChange}
                    onFocus={(e) => {
                      if(e.target.value.length > 0) setShowCitySuggestions(true);
                    }}
                    autoComplete="off"
                  />
                  {showCitySuggestions && filteredCities.length > 0 && (
                    <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      {filteredCities.map((city, index) => (
                        <li 
                          key={index}
                          onClick={() => selectCity(city)}
                          className="px-4 py-3 hover:bg-lime-50 cursor-pointer text-slate-700 font-medium border-b border-slate-50 last:border-none flex items-center gap-2"
                        >
                          <MapPin size={14} className="text-lime-500" /> {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Quartier</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all font-medium"
                  placeholder="Votre quartier"
                  value={formData.neighborhood}
                  onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                />
              </div>
            </div>

            {/* Quantity Selector - Enhanced */}
            <div className="pt-6 pb-2">
              <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Choisir la quantité (Promo 2+1)</label>
              <div className="bg-slate-50 rounded-2xl p-2 flex items-center justify-between border border-slate-200">
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, (prev.quantity || 1) - 1) }))}
                  className="w-14 h-14 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:text-red-500 hover:border-red-200 transition-colors active:scale-95"
                >
                  <Minus size={24} />
                </button>
                
                <div className="flex flex-col items-center">
                   <span className="text-3xl font-black text-slate-900">{quantity}</span>
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pack(s)</span>
                </div>

                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, quantity: (prev.quantity || 1) + 1 }))}
                  className="w-14 h-14 rounded-xl bg-lime-500 shadow-lg shadow-lime-500/30 flex items-center justify-center text-white hover:bg-lime-400 transition-colors active:scale-95"
                >
                  <Plus size={24} />
                </button>
              </div>

              {/* Dynamic Price Calculation Display */}
              <div className="mt-4 bg-lime-50 border border-lime-100 rounded-xl p-4 flex flex-col items-center text-center">
                 <p className="text-slate-500 text-sm font-medium mb-1">
                   Vous recevez : <strong className="text-slate-800">{quantity * 3} Bouteilles</strong>
                 </p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 line-through text-lg decoration-red-500/50 decoration-2">
                      {realValue.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className="text-2xl font-black text-emerald-600">
                      {totalPrice.toLocaleString('fr-FR')} FCFA
                    </span>
                 </div>
              </div>
            </div>

            <Button type="submit" fullWidth className="text-xl py-5 mt-4" disabled={isSubmitting}>
               {isSubmitting ? (
                 <span className="flex items-center gap-2">
                   <Loader2 className="animate-spin" /> Validation en cours...
                 </span>
               ) : (
                 "VALIDER MA COMMANDE"
               )}
            </Button>
            
            <p className="text-center text-xs text-slate-400">
              En cliquant, vous confirmez votre commande payable à la livraison.
            </p>
          </form>
        </div>
      </section>

      {/* FAQ Accordion - Polished */}
      <section className="py-12 px-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Questions Fréquentes</h2>
        <div className="space-y-4">
          {[
            { q: "Est-ce dangereux pour les bébés ?", a: "Non, Starmix est formulé pour l'intérieur. Vaporisez simplement 15min avant le coucher." },
            { q: "Combien de temps dure un pack ?", a: "Un pack de 3 bouteilles couvre environ 3 mois de protection complète." },
            { q: "Comment se passe la livraison ?", a: "Nous vous appelons pour confirmer l'adresse. Le livreur passe sous 24h-48h." }
          ].map((item, i) => (
            <details key={i} className="bg-white border border-slate-100 rounded-2xl p-5 group open:shadow-lg transition-all duration-300">
              <summary className="font-bold text-slate-800 cursor-pointer flex justify-between items-center list-none select-none">
                {item.q}
                <ChevronDown className="transition-transform duration-300 group-open:rotate-180 text-lime-500" size={20} />
              </summary>
              <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-all duration-300 ease-in-out">
                 <p className="overflow-hidden text-slate-600 mt-3 leading-relaxed opacity-0 group-open:opacity-100 transition-opacity duration-300 delay-100">
                   {item.a}
                 </p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};