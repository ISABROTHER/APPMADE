import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { calculateTotalPrice } from '../config/pricing';
import type { DeliveryMethod } from '../config/deliveryMethods';

export type ParcelDetails = {
  size: 'small' | 'medium' | 'large';
  weightRange: string;
  category?: string;
};

export type SenderInfo = {
  name: string;
  phone: string;
};

export type RecipientInfo = {
  name: string;
  phone: string;
  landmark?: string;
};

export type Location = {
  region: string;
  cityTown: string;
  landmark?: string;
  gps?: { latitude: number; longitude: number };
};

export type Route = {
  origin: Location;
  destination: Location;
};

export type HandoverMethod = 'DROPOFF' | 'PICKUP';

export type PickupDetails = {
  landmark: string;
  phone: string;
  timing: 'ASAP' | 'TODAY' | 'SCHEDULE';
};

export type Agent = {
  id: string;
  name: string;
  distanceKm?: number;
  hours: string;
  addressText: string;
  region: string;
  cityTown: string;
  landmark?: string;
  canPickup: boolean;
  canDropoff: boolean;
};

export type Handover = {
  method: HandoverMethod;
  pickupDetails?: PickupDetails;
  selectedAgent?: Agent;
};

export type Security = {
  shipmentCode: string;
  senderPin: string;
  trackingId: string;
};

type SendParcelContextType = {
  parcel: ParcelDetails | null;

  // Keep these for future expansion (route/handover are referenced in your Summary file)
  route: Route | null;
  handover: Handover | null;
  security: Security | null;

  // Current flow uses deliveryMethods
  selectedDeliveryMethod: DeliveryMethod | null;

  sender: SenderInfo | null;
  recipient: RecipientInfo | null;

  totalPrice: number;
  basePrice: number;

  // "pickupFee" is used in your UI; here it represents total extra fees (delivery method add-on + pickup if you later enable it)
  pickupFee: number;

  updateParcel: (parcel: ParcelDetails) => void;
  updateRoute: (route: Route) => void;
  updateHandover: (handover: Handover) => void;
  updateDeliveryMethod: (method: DeliveryMethod) => void;

  updateSender: (sender: SenderInfo) => void;
  updateRecipient: (recipient: RecipientInfo) => void;
  updateSecurity: (security: Security) => void;

  reset: () => void;
};

const SendParcelContext = createContext<SendParcelContextType | undefined>(undefined);

export const SendParcelProvider = ({ children }: { children: ReactNode }) => {
  const [parcel, setParcel] = useState<ParcelDetails | null>(null);

  // keep for future (your repo has steps for these)
  const [route, setRoute] = useState<Route | null>(null);
  const [handover, setHandover] = useState<Handover | null>(null);
  const [security, setSecurity] = useState<Security | null>(null);

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethod | null>(null);

  const [sender, setSender] = useState<SenderInfo | null>(null);
  const [recipient, setRecipient] = useState<RecipientInfo | null>(null);

  const basePrice = parcel ? getPriceForParcel(parcel.size, parcel.weightRange) : 0;

  const deliveryFee = selectedDeliveryMethod?.additionalCost ?? 0;
  const handoverPickupFee = handover?.method === 'PICKUP' ? 15 : 0;

  const pickupFee = deliveryFee + handoverPickupFee;
  const totalPrice = calculateTotalPrice(basePrice, pickupFee);

  const updateParcel = (p: ParcelDetails) => setParcel(p);
  const updateRoute = (r: Route) => setRoute(r);
  const updateHandover = (h: Handover) => setHandover(h);
  const updateDeliveryMethod = (m: DeliveryMethod) => setSelectedDeliveryMethod(m);

  const updateSender = (s: SenderInfo) => setSender(s);
  const updateRecipient = (r: RecipientInfo) => setRecipient(r);
  const updateSecurity = (s: Security) => setSecurity(s);

  const reset = () => {
    setParcel(null);
    setRoute(null);
    setHandover(null);
    setSender(null);
    setRecipient(null);
    setSecurity(null);
    setSelectedDeliveryMethod(null);
  };

  return (
    <SendParcelContext.Provider
      value={{
        parcel,
        route,
        handover,
        security,
        selectedDeliveryMethod,
        sender,
        recipient,
        totalPrice,
        basePrice,
        pickupFee,
        updateParcel,
        updateRoute,
        updateHandover,
        updateDeliveryMethod,
        updateSender,
        updateRecipient,
        updateSecurity,
        reset,
      }}
    >
      {children}
    </SendParcelContext.Provider>
  );
};

export const useSendParcel = () => {
  const context = useContext(SendParcelContext);
  if (!context) throw new Error('useSendParcel must be used within SendParcelProvider');
  return context;
};

function getPriceForParcel(size: string, weightRange: string): number {
  const basePrices: Record<string, number> = {
    small: 25,
    medium: 45,
    large: 75,
  };

  const weightMultipliers: Record<string, number> = {
    '0-1kg': 1.0,
    '1-5kg': 1.2,
    '5-10kg': 1.5,
    '10-25kg': 2.0,
  };

  const base = basePrices[size] || 25;
  const multiplier = weightMultipliers[weightRange] || 1.0;

  return Math.round(base * multiplier);
}
