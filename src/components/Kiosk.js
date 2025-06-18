import { ArrowLeft, Check, CreditCard, DollarSign, Loader2, Smartphone, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const PaymentKiosk = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [cardReaderStatus, setCardReaderStatus] = useState('waiting'); // waiting, reading, processing, success, error
  const [paymentProgress, setPaymentProgress] = useState('');
  const [cardType, setCardType] = useState(null); // chip, tap, swipe

  const presetAmounts = [10, 25, 50, 100, 200];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setSelectedAmount(parseFloat(value) || null);
    setError('');
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setCurrentStep('card-reader');
    setCardReaderStatus('waiting');
    setPaymentProgress('');
    if (method === 'chip') {
      setPaymentProgress('Please insert your chip card');
    } else if (method === 'tap') {
      setPaymentProgress('Please tap your card or mobile device');
    }
  };

  const simulateCardReading = () => {
    setCardReaderStatus('reading');
    
    if (paymentMethod === 'chip') {
      setPaymentProgress('Reading chip...');
      setTimeout(() => {
        setPaymentProgress('Please enter your PIN');
        setTimeout(() => {
          setPaymentProgress('Verifying PIN...');
          setTimeout(() => {
            processPayment();
          }, 2000);
        }, 3000);
      }, 2000);
    } else if (paymentMethod === 'tap') {
      setPaymentProgress('Processing contactless payment...');
      setTimeout(() => {
        processPayment();
      }, 2000);
    }
  };

  const processPayment = () => {
    setCurrentStep('processing');
    setCardReaderStatus('processing');
    setPaymentProgress('Processing payment...');
    simulatePayment();
  };

  const simulatePayment = () => {
    setProcessing(true);
    setError('');
    
    // Simulate payment processing
    setTimeout(() => {
      // 90% success rate simulation
      if (Math.random() > 0.1) {
        setProcessing(false);
        setTransactionComplete(true);
        setCurrentStep('success');
        setCardReaderStatus('success');
      } else {
        setProcessing(false);
        setError('Payment failed. Please try again or use a different payment method.');
        setCurrentStep('payment');
        setCardReaderStatus('error');
      }
    }, 3000);
  };

  const resetKiosk = () => {
    setCurrentStep('welcome');
    setSelectedAmount(null);
    setCustomAmount('');
    setPaymentMethod(null);
    setProcessing(false);
    setTransactionComplete(false);
    setError('');
    setTermsAccepted(false);
    setShowTermsModal(false);
    setCardReaderStatus('waiting');
    setPaymentProgress('');
    setCardType(null);
  };

  const goBack = () => {
    if (currentStep === 'amount') {
      setCurrentStep('terms');
    } else if (currentStep === 'payment') {
      setCurrentStep('amount');
      setPaymentMethod(null);
    } else if (currentStep === 'card-reader') {
      setCurrentStep('payment');
      setCardReaderStatus('waiting');
      setPaymentProgress('');
    } else if (currentStep === 'processing') {
      setCurrentStep('payment');
      setProcessing(false);
    }
  };

  // Auto-reset after successful transaction
  useEffect(() => {
    if (transactionComplete) {
      const timer = setTimeout(() => {
        resetKiosk();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [transactionComplete]);

  const WelcomeScreen = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <DollarSign className="w-24 h-24 mx-auto text-green-600" />
        <h1 className="text-4xl font-bold text-gray-800">Payment Kiosk</h1>
        <p className="text-xl text-gray-600">Quick and secure payments</p>
      </div>
      
      <button
        onClick={() => setCurrentStep('terms')}
        className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-semibold py-6 px-12 rounded-xl transition-colors shadow-lg"
      >
        Start Payment
      </button>
    </div>
  );

  const TermsScreen = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Terms & Conditions</h2>
        <p className="text-gray-600">Please review and accept our terms to continue</p>
      </div>

      <div className="bg-gray-50 border rounded-xl p-6 max-h-96 overflow-y-auto">
        <div className="space-y-4 text-sm text-gray-700">
          <h3 className="font-bold text-lg">Payment Terms & Conditions</h3>
          
          <div className="space-y-3">
            <p><strong>1. Payment Processing:</strong> By using this kiosk, you authorize us to process your payment through our secure payment system. All transactions are final and non-refundable unless required by law.</p>
            
            <p><strong>2. Data Collection:</strong> We collect transaction data including payment method, amount, date, and time for processing and record-keeping purposes. Personal information is protected according to our privacy policy.</p>
            
            <p><strong>3. Security:</strong> While we implement security measures to protect your payment information, you acknowledge that no system is 100% secure. Please protect your payment credentials.</p>
            
            <p><strong>4. Service Availability:</strong> Payment services may be temporarily unavailable due to maintenance or technical issues. We are not liable for any inconvenience caused by service interruptions.</p>
            
            <p><strong>5. Disputed Transactions:</strong> For disputed transactions, contact customer service within 30 days. Provide transaction ID and details for investigation.</p>
            
            <p><strong>6. Compliance:</strong> You confirm that this payment is for lawful purposes and complies with all applicable laws and regulations.</p>
            
            <p><strong>7. Limitation of Liability:</strong> Our liability is limited to the transaction amount. We are not responsible for indirect or consequential damages.</p>
            
            <p><strong>8. Updates:</strong> These terms may be updated periodically. Continued use constitutes acceptance of modified terms.</p>
          </div>
          
          <div className="border-t pt-4 mt-6">
            <p className="text-xs text-gray-500">Last updated: June 2025 | Customer Service: 1-800-PAYMENT</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-lg text-gray-700">
            I have read and agree to the Terms & Conditions above
          </span>
        </label>

        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentStep('welcome')}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 text-xl font-semibold py-4 rounded-xl transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={() => setCurrentStep('amount')}
            disabled={!termsAccepted}
            className={`flex-1 text-xl font-semibold py-4 rounded-xl transition-colors ${
              termsAccepted
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  const AmountScreen = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Amount</h2>
        <p className="text-gray-600">Choose a preset amount or enter a custom amount</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handleAmountSelect(amount)}
            className={`p-6 text-2xl font-semibold rounded-xl border-2 transition-all ${
              selectedAmount === amount
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-300 hover:border-blue-400 text-gray-700'
            }`}
          >
            ${amount}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          Custom Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500">$</span>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            placeholder="0.00"
            className="w-full pl-12 pr-4 py-4 text-2xl border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none"
            min="0.01"
            step="0.01"
          />
        </div>
      </div>

      {selectedAmount && (
        <button
          onClick={() => setCurrentStep('payment')}
          className="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-semibold py-4 rounded-xl transition-colors"
        >
          Continue with ${selectedAmount.toFixed(2)}
        </button>
      )}
    </div>
  );

  const PaymentScreen = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Method</h2>
        <p className="text-gray-600">Amount: ${selectedAmount.toFixed(2)}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => handlePaymentMethodSelect('chip')}
          className="flex items-center justify-center space-x-4 p-6 border-2 border-gray-300 hover:border-blue-400 rounded-xl transition-colors"
        >
          <CreditCard className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-semibold">Insert Chip Card</span>
        </button>

        <button
          onClick={() => handlePaymentMethodSelect('tap')}
          className="flex items-center justify-center space-x-4 p-6 border-2 border-gray-300 hover:border-blue-400 rounded-xl transition-colors"
        >
          <Smartphone className="w-8 h-8 text-green-600" />
          <span className="text-xl font-semibold">Tap Card/Mobile Pay</span>
        </button>
      </div>
    </div>
  );

  const CardReaderScreen = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Card Reader</h2>
        <p className="text-gray-600">Amount: ${selectedAmount.toFixed(2)}</p>
      </div>

      {/* Card Reader Visual */}
      <div className="bg-gray-800 rounded-xl p-8 mx-auto max-w-md">
        <div className="space-y-6">
          {/* Chip Card Slot */}
          <div className="relative">
            <div className={`bg-gray-700 h-4 rounded-sm border-2 transition-colors ${
              paymentMethod === 'chip' && cardReaderStatus === 'reading' 
                ? 'border-blue-400 bg-blue-900' 
                : 'border-gray-600'
            }`}>
              {paymentMethod === 'chip' && cardReaderStatus === 'reading' && (
                <div className="absolute -top-8 left-0 right-0">
                  <div className="bg-yellow-400 h-6 w-16 mx-auto rounded-sm shadow-lg">
                    <div className="h-full w-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-sm flex items-center justify-center">
                      <div className="w-8 h-4 bg-yellow-600 rounded-xs"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center mt-2">
              <span className="text-white text-sm">INSERT CHIP CARD</span>
            </div>
          </div>

          {/* Contactless Zone */}
          <div className="relative">
            <div className={`bg-gray-700 rounded-lg h-20 border-2 transition-colors flex items-center justify-center ${
              paymentMethod === 'tap' && cardReaderStatus === 'reading'
                ? 'border-green-400 bg-green-900'
                : 'border-gray-600'
            }`}>
              {paymentMethod === 'tap' && cardReaderStatus === 'reading' ? (
                <div className="animate-pulse">
                  <Smartphone className="w-8 h-8 text-green-400" />
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex justify-center space-x-1 mb-1">
                    <div className="w-2 h-2 bg-white rounded-full opacity-30"></div>
                    <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
                    <div className="w-2 h-2 bg-white rounded-full opacity-90"></div>
                  </div>
                  <Smartphone className="w-6 h-6 text-white mx-auto" />
                </div>
              )}
            </div>
            <div className="text-center mt-2">
              <span className="text-white text-sm">TAP HERE</span>
            </div>
          </div>

          {/* PIN Pad */}
          {paymentMethod === 'chip' && cardReaderStatus === 'reading' && paymentProgress.includes('PIN') && (
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map((num) => (
                <button
                  key={num}
                  className="bg-gray-600 hover:bg-gray-500 text-white p-3 rounded transition-colors"
                  onClick={() => {}} // In real implementation, this would capture PIN
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Display */}
      <div className="text-center space-y-4">
        <div className={`text-2xl font-semibold ${
          cardReaderStatus === 'error' ? 'text-red-600' : 
          cardReaderStatus === 'reading' ? 'text-blue-600' : 'text-gray-600'
        }`}>
          {paymentProgress || 'Waiting for card...'}
        </div>

        {cardReaderStatus === 'waiting' && (
          <button
            onClick={simulateCardReading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-colors"
          >
            Simulate Card {paymentMethod === 'chip' ? 'Insert' : 'Tap'}
          </button>
        )}

        {cardReaderStatus === 'reading' && (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Processing...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
          {error}
        </div>
      )}
    </div>
  );

  const ProcessingScreen = () => (
    <div className="text-center space-y-8">
      <Loader2 className="w-24 h-24 mx-auto text-blue-600 animate-spin" />
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">Processing Payment</h2>
        <p className="text-xl text-gray-600">Amount: ${selectedAmount.toFixed(2)}</p>
        <p className="text-gray-500">Please wait...</p>
      </div>
    </div>
  );

  const SuccessScreen = () => (
    <div className="text-center space-y-8">
      <Check className="w-24 h-24 mx-auto text-green-600" />
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
        <p className="text-xl text-gray-600">Amount: ${selectedAmount.toFixed(2)}</p>
        <p className="text-gray-500">Transaction ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
      </div>
      
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
        Thank you for your payment! Returning to home screen in a few seconds...
      </div>

      <button
        onClick={resetKiosk}
        className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-3 px-8 rounded-xl transition-colors"
      >
        New Transaction
      </button>
    </div>
  );

  const renderScreen = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'terms':
        return <TermsScreen />;
      case 'amount':
        return <AmountScreen />;
      case 'payment':
        return <PaymentScreen />;
      case 'card-reader':
        return <CardReaderScreen />;
      case 'processing':
        return <ProcessingScreen />;
      case 'success':
        return <SuccessScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            {currentStep !== 'welcome' && currentStep !== 'success' && currentStep !== 'processing' && (
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            )}
            
            <div className="flex-1 text-center">
              <div className="text-sm text-gray-500">SecurePay Kiosk</div>
            </div>
            
            {(currentStep === 'terms' || currentStep === 'amount' || currentStep === 'payment' || currentStep === 'card-reader') && (
              <button
                onClick={resetKiosk}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-xl p-8 shadow-lg min-h-96">
          {renderScreen()}
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-gray-500">
          Secure • Fast • Reliable
        </div>
      </div>
    </div>
  );
};

export default PaymentKiosk;