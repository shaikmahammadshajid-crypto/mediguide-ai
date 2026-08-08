import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle, 
  MapPin, 
  Phone, 
  User, 
  PackageCheck,
  Printer,
  ShieldCheck,
  Building,
  Sparkles,
  QrCode,
  UploadCloud,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { CartItem, Medicine, Order, UserProfile } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (medId: string, delta: number) => void;
  onRemoveItem: (medId: string) => void;
  onClearCart: () => void;
  userProfile: UserProfile;
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  userProfile,
  onOrderPlaced
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [deliveryAddress, setDeliveryAddress] = useState(userProfile.address || 'Flat 402, Green Park Extension, Hauz Khas, New Delhi - 110016');
  const [phone, setPhone] = useState(userProfile.phoneNumber || '+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState<'UPI (GPay / PhonePe / Paytm)' | 'Net Banking' | 'Credit/Debit Card' | 'Cash on Delivery (COD)'>('UPI (GPay / PhonePe / Paytm)');
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionFileDataUrl, setPrescriptionFileDataUrl] = useState<string | null>(null);
  const [prescriptionError, setPrescriptionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.medicine.estimatedPrice * item.quantity), 0);
  const shippingFee = subtotal > 300 ? 0 : 35.00;
  const tax = subtotal * 0.05; // 5% GST on pharmaceutical products in India
  const totalAmount = subtotal + shippingFee + tax;
  const prescriptionRequiredForOrder = cartItems.some((item) => item.medicine.prescriptionRequired || item.medicine.dosageForm === 'Tablet');
  const allowedPrescriptionTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const handlePrescriptionSelect = async (file: File | null) => {
    setPrescriptionError('');
    setPrescriptionFile(null);
    setPrescriptionFileDataUrl(null);

    if (!file) return;

    if (!allowedPrescriptionTypes.includes(file.type)) {
      setPrescriptionError('Upload a valid prescription file: PDF, PNG, JPG, or WEBP.');
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setPrescriptionError('Prescription file must be under 2.5 MB.');
      return;
    }

    setPrescriptionFile(file);
    setPrescriptionFileDataUrl(await readFileAsDataUrl(file));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prescriptionRequiredForOrder && !prescriptionFile) {
      setPrescriptionError('Upload the doctor-prescribed prescription before booking tablets or Rx medicines.');
      setStep('checkout');
      return;
    }

    setIsSubmitting(true);
    setPrescriptionError('');

    setTimeout(() => {
      const newOrder: Order = {
        id: 'ORD-IND-' + Math.floor(10000 + Math.random() * 90000),
        userId: userProfile.uid,
        userName: userProfile.fullName,
        userPhone: phone,
        items: [...cartItems],
        subtotal,
        shippingFee,
        tax,
        totalAmount,
        deliveryAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery (COD)' ? 'Pending' : 'Paid',
        orderStatus: 'Placed',
        trackingNumber: 'TRK-IND-' + Date.now().toString().slice(-7),
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
        prescriptionRequired: prescriptionRequiredForOrder,
        prescriptionFileName: prescriptionFile?.name,
        prescriptionFileSize: prescriptionFile ? formatFileSize(prescriptionFile.size) : undefined,
        prescriptionFileDataUrl: prescriptionFileDataUrl || undefined,
        prescriptionUploadedAt: prescriptionFile ? new Date().toISOString() : undefined
      };

      setPlacedOrder(newOrder);
      onOrderPlaced(newOrder);
      onClearCart();
      setPrescriptionFile(null);
      setPrescriptionFileDataUrl(null);
      setIsSubmitting(false);
      setStep('confirmation');
    }, 1200);
  };

  const prescriptionUploadBox = prescriptionRequiredForOrder ? (
    <div className="space-y-2">
      <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
        <UploadCloud className="w-4 h-4 text-teal-500" /> Doctor Prescription Upload
      </h4>
      <label className={`block p-3 rounded-xl border border-dashed cursor-pointer transition ${
        prescriptionFile
          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
          : 'border-amber-300 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
      }`}>
        <input
          type="file"
          required={prescriptionRequiredForOrder}
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={(e) => handlePrescriptionSelect(e.target.files?.[0] || null)}
          className="sr-only"
        />
        <span className="font-bold block">
          {prescriptionFile ? `${prescriptionFile.name} (${formatFileSize(prescriptionFile.size)})` : 'Choose prescription PDF or image'}
        </span>
        <span className="text-[10px] block mt-0.5">
          Required before booking tablets and prescription medicines.
        </span>
      </label>
      {prescriptionError && (
        <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {prescriptionError}
        </p>
      )}
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-700">
        
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-teal-400" />
            <span className="font-extrabold text-sm">
              {step === 'cart' && `Pharmacy Cart (${cartItems.length} items)`}
              {step === 'checkout' && 'Secure Doorstep Checkout (India Delivery)'}
              {step === 'confirmation' && 'Order Placed Successfully!'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">Your cart is currently empty</p>
                  <p className="text-slate-400 text-[11px]">Explore our certified medicine catalog to add items.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div 
                      key={item.medicine.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center space-x-3"
                    >
                      <img
                        src={item.medicine.image}
                        alt={item.medicine.brandName}
                        className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white block truncate">
                          {item.medicine.brandName}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {item.medicine.dosageForm} • {item.medicine.strength}
                        </span>
                        {(item.medicine.prescriptionRequired || item.medicine.dosageForm === 'Tablet') && (
                          <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-1.5 py-0.5 inline-flex items-center gap-1 mt-1">
                            <FileCheck className="w-2.5 h-2.5" /> Prescription needed
                          </span>
                        )}
                        <span className="font-extrabold text-teal-600 dark:text-teal-400 block mt-1">
                          ₹{(item.medicine.estimatedPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                          <button 
                            onClick={() => onUpdateQuantity(item.medicine.id, -1)}
                            className="px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 py-0.5 font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.medicine.id, 1)}
                            className="px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button 
                          onClick={() => onRemoveItem(item.medicine.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {prescriptionUploadBox}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-500" /> Delivery Address (India)
                </h4>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-xs"
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-teal-500" /> Mobile Number
                </h4>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-teal-500" /> Payment Option
                </h4>
                <div className="space-y-2">
                  {[
                    'UPI (GPay / PhonePe / Paytm)',
                    'Net Banking',
                    'Credit/Debit Card',
                    'Cash on Delivery (COD)'
                  ].map((method) => (
                    <label 
                      key={method}
                      className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                        paymentMethod === method 
                          ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-bold' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method as any)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {prescriptionUploadBox}
            </form>
          )}

          {step === 'confirmation' && placedOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Order Confirmed!</h3>
                <p className="text-slate-400 text-xs">Order ID: <span className="font-mono text-teal-600 font-bold">{placedOrder.id}</span></p>
                <p className="text-slate-400 text-xs">AWB Tracking: <span className="font-mono font-bold">{placedOrder.trackingNumber}</span></p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left space-y-2">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>Total Amount Paid:</span>
                  <span className="text-teal-600">₹{placedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Estimated Delivery: <span className="font-bold text-slate-800 dark:text-slate-200">{placedOrder.estimatedDelivery}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Delivery Address: {placedOrder.deliveryAddress}
                </div>
                {placedOrder.prescriptionRequired && (
                  <div className="text-[11px] text-slate-500">
                    Prescription: <span className="font-bold text-emerald-700 dark:text-emerald-300">{placedOrder.prescriptionFileName}</span>
                    {placedOrder.prescriptionFileSize && <span> ({placedOrder.prescriptionFileSize})</span>}
                  </div>
                )}
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print GST Tax Invoice
              </button>
            </div>
          )}

        </div>

        {/* Drawer Footer Price Summary */}
        {cartItems.length > 0 && step !== 'confirmation' && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Shipping:</span>
                <span>{shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE (Orders &gt; ₹300)</span> : `₹${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t font-extrabold text-sm text-slate-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-teal-600">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {step === 'cart' && (
              <button
                onClick={() => {
                  if (prescriptionRequiredForOrder && !prescriptionFile) {
                    setPrescriptionError('Upload the doctor-prescribed prescription before continuing.');
                    return;
                  }
                  setStep('checkout');
                }}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition"
              >
                Proceed to Checkout (₹{totalAmount.toFixed(2)})
              </button>
            )}

            {step === 'checkout' && (
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={handleCheckoutSubmit}
                  disabled={isSubmitting || (prescriptionRequiredForOrder && !prescriptionFile)}
                  className="w-2/3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Place Order (₹{totalAmount.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
