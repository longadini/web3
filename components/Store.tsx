'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Package, CreditCard, CheckCircle2, X } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ product, onComplete, onCancel }: { product: any, onComplete: () => void, onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price, address }),
      });
      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (result.paymentIntent?.status === 'succeeded') {
        await updateDoc(doc(db, 'products', product.id), { stock: increment(-1) });
        onComplete();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Checkout</h3>
            <p className="text-sm text-zinc-500">{product.name}</p>
          </div>
        </div>

        <div className="mb-8 p-4 bg-zinc-800/50 rounded-xl border border-white/5">
          <div className="flex justify-between mb-2">
            <span className="text-zinc-400">Price</span>
            <span className="font-medium">${product.price}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-indigo-400">${product.price}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 bg-zinc-800 rounded-xl border border-white/10 mb-6">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#fff',
                  '::placeholder': { color: '#71717a' },
                },
              },
            }} />
          </div>
          
          <button 
            disabled={loading || !stripe}
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={18} />
                Confirm Payment
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export function Store() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleComplete = () => {
    setSelectedProduct(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, idx) => (
          <motion.div 
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="group p-6 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="w-full aspect-square bg-zinc-800 rounded-xl mb-6 flex items-center justify-center text-zinc-700 group-hover:text-indigo-500/20 transition-colors overflow-hidden relative">
              <Package size={64} strokeWidth={1} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs font-mono text-white/60">ID: {p.id.slice(0, 8)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{p.name}</h3>
              <span className="text-lg font-mono text-indigo-400">${p.price}</span>
            </div>
            
            <p className="text-zinc-500 text-sm mb-6">
              Exclusive digital asset with limited supply. Verified on-chain.
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                {p.stock} in stock
              </div>
              
              <button 
                onClick={() => setSelectedProduct(p)} 
                disabled={p.stock <= 0}
                className="bg-white text-black hover:bg-indigo-500 hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 flex items-center gap-2"
              >
                <ShoppingCart size={16} />
                Buy Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <CheckoutForm 
            product={selectedProduct} 
            onComplete={handleComplete}
            onCancel={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <CheckCircle2 size={24} />
            <div className="font-bold">Purchase Successful!</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Elements>
  );
}

