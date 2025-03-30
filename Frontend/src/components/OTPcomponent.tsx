import React, { useRef} from 'react';

interface OTPProps {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
}

const OTPcomponent: React.FC<OTPProps> = ({ otp, setOtp }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, otp.length);
    const pasteArray = paste.split('');
    const newOtp = [...otp];
    pasteArray.forEach((digit, i) => {
      if (i < otp.length && /\d/.test(digit)) {
        newOtp[i] = digit;
        inputRefs.current[i].value = digit;
      }
    });
    setOtp(newOtp);
    const nextIndex = pasteArray.length < otp.length ? pasteArray.length : otp.length - 1;
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex gap-5">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          placeholder='0'
          className="w-14 h-12 text-center  text-black text-xl border-2 border-black rounded"
          ref={(el) => {
            inputRefs.current[index] = el!;
          }}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OTPcomponent;
