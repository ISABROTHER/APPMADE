import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ParcelSize } from '../config/parcelSizes';
import { DeliveryMethod } from '../config/deliveryMethods';
import { calculateTotalPrice } from '../config/pricing';

export type SenderInfo = {
  phone: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
};

export type RecipientInfo = {
  phone: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
};

type SendParcelContextType = {
  selectedSize: ParcelSize | null;
  selectedDeliveryMethod: DeliveryMethod | null;
  sender: SenderInfo | null;
  recipient: RecipientInfo | null;
  totalPrice: number;
  updateSize: (size: ParcelSize) => void;
  updateDeliveryMethod: (method: DeliveryMethod) => void;
  updateSender: (sender: SenderInfo) => void;
  updateRecipient: (recipient: RecipientInfo) => void;
  reset: () => void;
};

const SendParcelContext = createContext<SendParcelContextType | undefined>(undefined);

export const SendParcelProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSize, setSelectedSize] = useState<ParcelSize | null>(null);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const [sender, setSender] = useState<SenderInfo | null>(null);
  const [recipient, setRecipient] = useState<RecipientInfo | null>(null);

  const totalPrice = calculateTotalPrice(
    selectedSize?.price || 0,
    selectedDeliveryMethod?.additionalCost || 0
  );

  const updateSize = (size: ParcelSize) => {
    setSelectedSize(size);
  };

  const updateDeliveryMethod = (method: DeliveryMethod) => {
    setSelectedDeliveryMethod(method);
  };

  const updateSender = (senderInfo: SenderInfo) => {
    setSender(senderInfo);
  };

  const updateRecipient = (recipientInfo: RecipientInfo) => {
    setRecipient(recipientInfo);
  };

  const reset = () => {
    setSelectedSize(null);
    setSelectedDeliveryMethod(null);
    setSender(null);
    setRecipient(null);
  };

  return (
    <SendParcelContext.Provider
      value={{
        selectedSize,
        selectedDeliveryMethod,
        sender,
        recipient,
        totalPrice,
        updateSize,
        updateDeliveryMethod,
        updateSender,
        updateRecipient,
        reset,
      }}
    >
      {children}
    </SendParcelContext.Provider>
  );
};

export const useSendParcel = () => {
  const context = useContext(SendParcelContext);
  if (!context) {
    throw new Error('useSendParcel must be used within SendParcelProvider');
  }
  return context;
};
