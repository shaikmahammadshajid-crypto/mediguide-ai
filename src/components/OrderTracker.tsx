import React, { useState } from 'react';
import { 
  PackageCheck, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Printer, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerProps {
  orders: Order[];
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ orders }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders[0]?.id || null);

  const statusSteps: Order['orderStatus'][] = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStepIndex = (status: Order['orderStatus']) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <PackageCheck className="w-4 h-4" />
            <span>Order Fulfillment Tracking</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Pharmacy Orders & Tracking History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track real-time courier status and download official tax invoices.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl border border-slate-200 text-center space-y-3">
          <PackageCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No pharmacy orders placed yet</h3>
          <p className="text-xs text-slate-400">Order medicines from our certified pharmacy section to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const currentStepIdx = getStepIndex(order.orderStatus);

            return (
              <div 
                key={order.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden"
              >
                {/* Order Summary Header Bar */}
                <div 
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                        {order.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Items • Tracking #{order.trackingNumber}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="font-extrabold text-base text-slate-900 dark:text-white block">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 block">
                        {order.paymentStatus}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-700 space-y-6 text-xs bg-slate-50/50 dark:bg-slate-900/30">
                    
                    {/* Status Progress Timeline */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider">
                        Delivery Timeline Progress
                      </h4>

                      <div className="grid grid-cols-5 gap-2 pt-2 text-center">
                        {statusSteps.map((step, idx) => {
                          const isDone = idx <= currentStepIdx;
                          return (
                            <div key={step} className="space-y-1.5 flex flex-col items-center">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
                                isDone 
                                  ? 'bg-teal-600 text-white shadow-xs' 
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                              }`}>
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                              <span className={`text-[10px] font-semibold ${isDone ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400'}`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider">
                        Prescription Items In Order
                      </h4>
                      <div className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                        {order.items.map((it) => (
                          <div key={it.medicine.id} className="py-2 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img src={it.medicine.image} alt={it.medicine.brandName} className="w-10 h-10 object-cover rounded-lg border" />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">{it.medicine.brandName}</span>
                                <span className="text-[10px] text-slate-400">{it.medicine.dosageForm} • Qty: {it.quantity}</span>
                              </div>
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              ₹{(it.medicine.estimatedPrice * it.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address & Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                      <div className="text-slate-500">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">Delivery Address:</span>
                        <span>{order.deliveryAddress}</span>
                      </div>

                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 transition flex items-center gap-1.5"
                      >
                        <Printer className="w-4 h-4" /> Download Official Invoice
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
