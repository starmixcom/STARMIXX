import React, { useEffect } from 'react';
import { CheckCircle, Phone, Share2, Package, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { OrderDetails } from '../types';
import { AB_CONTENT } from '../utils/abTesting';

// ==================================================================================
// CONFIGURATION SYSTEME.IO - ETAPE 3 (REMERCIEMENT)
// ==================================================================================
const SYSTEME_IO_THANK_YOU_URL = "https://starmix-ia.systeme.io/merci0";

interface ThankYouPageProps {
  order: OrderDetails | null;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ order }) => {
  const quantity = order?.quantity || 1;
  // Récupérer le prix unitaire basé sur la variante de la commande, sinon par défaut A
  const unitPrice = order?.variant ? AB_CONTENT[order.variant].price : 10000;
  const totalPrice = quantity * unitPrice;

  // Tracking : Simuler une visite sur la page officielle Systeme.io pour les stats du funnel
  useEffect(() => {
    if (SYSTEME_IO_THANK_YOU_URL) {
      fetch(SYSTEME_IO_THANK_YOU_URL, { mode: 'no-cors' })
        .then(() => console.log("Tracking Thank You Page hit"))
        .catch(e => console.error("Tracking Error", e));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background confetti decoration (CSS only) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-4 h-4 bg-lime-400 rounded-full animate-bounce delay-100"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-emerald-400 rounded-sm animate-ping delay-700"></div>
          <div className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-yellow-400 rounded-full opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-lg w-full">
        <div className="w-28 h-28 bg-gradient-to-tr from-lime-100 to-emerald-100 rounded-full flex items-center justify-center mb-8 mx-auto shadow-xl shadow-lime-500/20 animate-bounce-subtle">
          <CheckCircle className="text-emerald-500 w-14 h-14" strokeWidth={3} />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Bravo {order?.name?.split(' ')[0]} ! 🥳
        </h1>
        
        <p className="text-lg text-slate-600 mb-10">
          Votre commande est confirmée. Préparez-vous à dormir tranquille !
        </p>

        {/* Receipt Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-10 text-left relative overflow-hidden shadow-sm">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-500 to-emerald-500"></div>
          <h3 className="font-bold text-slate-900 mb-6 text-lg flex items-center gap-2">
            <Package size={20} className="text-slate-400"/> Récapitulatif
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
               <span className="text-slate-600">Article</span>
               <span className="font-bold text-slate-900 text-right">{quantity}x Pack Starmix <br/><span className="text-xs font-normal text-slate-500">({quantity * 3} bouteilles)</span></span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
               <span className="text-slate-600">Lieu</span>
               <span className="font-bold text-slate-900">{order?.city}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
               <span className="text-slate-800 font-bold text-lg">Total à payer</span>
               <span className="font-black text-emerald-600 text-2xl">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            fullWidth 
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white border-none shadow-lg shadow-green-500/30"
            onClick={() => window.open(`https://wa.me/?text=J'ai commandé mon pack Starmix !`, '_blank')}
          >
            <Phone size={20} /> CONTACTER SUR WHATSAPP
          </Button>

          {/* Option de redirection explicite si besoin */}
          {SYSTEME_IO_THANK_YOU_URL && (
             <p className="text-xs text-slate-300 mt-4">
               ID Transaction: #{Math.floor(Math.random() * 1000000)}
             </p>
          )}

          <div className="pt-8 border-t border-slate-100 mt-8">
             <p className="text-sm text-slate-400 mb-4">
               Vous avez aimé l'expérience ?
             </p>
             <button className="flex items-center justify-center gap-2 text-slate-800 font-bold hover:text-lime-600 transition-colors mx-auto px-6 py-3 rounded-full hover:bg-slate-50">
               <Share2 size={18} /> Partager à un ami
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};