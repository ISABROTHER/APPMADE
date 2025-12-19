import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SendParcelProvider } from './send/context/SendParcelContext';
import { ProgressBar } from './send/components/ProgressBar';
import { Step1Size } from './send/steps/Step1Size';
import { Step2DeliveryMethod } from './send/steps/Step2DeliveryMethod';
import { Step3Sender } from './send/steps/Step3Sender';
import { Step4Recipient } from './send/steps/Step4Recipient';
import { Step5Summary } from './send/steps/Step5Summary';

const BG = '#F2F2F7';

export default function SendScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Size onNext={handleNext} />;
      case 2:
        return <Step2DeliveryMethod onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3Sender onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <Step4Recipient onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <Step5Summary onBack={handleBack} />;
      default:
        return <Step1Size onNext={handleNext} />;
    }
  };

  return (
    <SendParcelProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <View style={styles.content}>{renderStep()}</View>
      </SafeAreaView>
    </SendParcelProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    flex: 1,
  },
});
