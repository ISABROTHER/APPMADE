import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SendParcelProvider, useSendParcel } from './context/SendParcelContext';
import { ProgressBar } from './components/ProgressBar';
import { Step1Size } from './steps/Step1Size';
import { Step2DeliveryMethod } from './steps/Step2DeliveryMethod';
import { Step3Sender } from './steps/Step3Sender';
import { Step4Recipient } from './steps/Step4Recipient';
import { Step5Summary } from './steps/Step5Summary';
import { X } from 'lucide-react-native';

const TOTAL_STEPS = 5;

const SendParcelFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { reset } = useSendParcel();

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    reset();
    router.back();
  };

  const handleClose = () => {
    reset();
    router.back();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Size onNext={handleNext} />;
      case 2:
        return <Step2DeliveryMethod onNext={handleNext} />;
      case 3:
        return <Step3Sender onNext={handleNext} />;
      case 4:
        return <Step4Recipient onNext={handleNext} />;
      case 5:
        return <Step5Summary onComplete={handleComplete} />;
      default:
        return <Step1Size onNext={handleNext} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleClose} style={styles.closeButton} hitSlop={10}>
          <X size={24} color="#0B1220" />
        </Pressable>
      </View>

      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <View style={styles.stepContainer}>{renderStep()}</View>
    </SafeAreaView>
  );
};

export default function SendParcelScreen() {
  return (
    <SendParcelProvider>
      <SendParcelFlow />
    </SendParcelProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9EDF2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    flex: 1,
  },
});
