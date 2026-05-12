import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { OwlMascot } from "../components/common/OwlMascot";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signup");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("회원가입:", { signupEmail, signupPassword, signupName, signupAge, agreedToTerms });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("로그인:", { loginEmail, loginPassword, rememberMe });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col items-center justify-center px-8 py-12">
      <div className="flex flex-col items-center mb-8">
        <OwlMascot size={72} />
        <h1 className="text-[32px] font-[800] text-[#3B6B4A] mt-4">큐릭</h1>
      </div>

      <div className="w-full max-w-[440px] bg-white border border-[#E5E0D8] rounded-[20px] shadow-lg p-8">
        <div className="flex border-b border-[#E5E0D8] mb-8">
          <AuthTabButton active={activeTab === "signup"} onClick={() => setActiveTab("signup")}>
            회원가입
          </AuthTabButton>
          <AuthTabButton active={activeTab === "login"} onClick={() => setActiveTab("login")}>
            로그인
          </AuthTabButton>
        </div>

        {activeTab === "signup" ? (
          <form onSubmit={handleSignup}>
            <AuthInputField label="이메일" type="email" placeholder="example@email.com" value={signupEmail} onChange={setSignupEmail} />
            <AuthInputField
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={signupPassword}
              onChange={setSignupPassword}
              isPassword
              helperText="8자 이상, 영문+숫자 포함"
            />
            <AuthInputField label="이름" placeholder="이름을 입력하세요" value={signupName} onChange={setSignupName} />
            <FormSelectField
              label="연령대 (선택)"
              value={signupAge}
              onChange={setSignupAge}
              options={["20대", "30대", "40대", "50대", "60대 이상"]}
            />

            <div className="mb-6">
              <CheckField checked={agreedToTerms} onChange={setAgreedToTerms}>
                <span>
                  <a href="#" className="text-[#3B6B4A] underline hover:text-[#2d5438]">
                    서비스 이용약관
                  </a>
                  {" 및 "}
                  <a href="#" className="text-[#3B6B4A] underline hover:text-[#2d5438]">
                    개인정보 처리방침
                  </a>
                  에 동의합니다
                </span>
              </CheckField>
            </div>

            <button
              type="submit"
              disabled={!agreedToTerms}
              className="w-full h-12 bg-[#3B6B4A] text-white rounded-xl text-[15px] font-[600] hover:bg-[#2d5438] transition-colors disabled:bg-[#C0C0C0] disabled:cursor-not-allowed"
            >
              가입하기
            </button>

            <SocialDivider />
            <SocialLoginButtons mode="signup" />
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <AuthInputField label="이메일" type="email" placeholder="example@email.com" value={loginEmail} onChange={setLoginEmail} />
            <AuthInputField label="비밀번호" placeholder="비밀번호를 입력하세요" value={loginPassword} onChange={setLoginPassword} isPassword />

            <div className="mb-6">
              <CheckField checked={rememberMe} onChange={setRememberMe}>로그인 유지</CheckField>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#3B6B4A] text-white rounded-xl text-[15px] font-[600] hover:bg-[#2d5438] transition-colors"
            >
              로그인
            </button>

            <div className="text-center mt-4">
              <a href="#" className="text-[13px] text-[#777777] hover:text-[#3B6B4A] transition-colors">
                비밀번호를 잊으셨나요?
              </a>
            </div>

            <SocialDivider />
            <SocialLoginButtons mode="login" />
          </form>
        )}
      </div>

      <p className="text-[13px] text-[#777777] mt-6 text-center">
        큐릭은 공공 교육 강좌로 맞춤 학습 로드맵을 만들어 드려요
      </p>
    </div>
  );
}

function AuthTabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 pb-3 text-[16px] font-[600] transition-colors relative ${
        active ? "text-[#3B6B4A]" : "text-[#777777] hover:text-[#2C2C2C]"
      }`}
    >
      {children}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B6B4A]" />}
    </button>
  );
}

function AuthInputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  helperText,
  isPassword = false,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  isPassword?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-5">
      <label className="block text-[13px] font-[600] text-[#2C2C2C] mb-2">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E5E0D8] rounded-xl text-[14px] text-[#2C2C2C] placeholder:text-[#AAAAAA] outline-none focus:border-[#3B6B4A] focus:ring-2 focus:ring-[#E8F0EA] transition-all"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#3B6B4A] transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {helperText && <p className="text-[11px] text-[#777777] mt-1.5">{helperText}</p>}
    </div>
  );
}

function FormSelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "선택해주세요",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-5">
      <label className="block text-[13px] font-[600] text-[#2C2C2C] mb-2">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full h-12 px-4 bg-white border border-[#E5E0D8] rounded-xl text-[14px] text-left outline-none focus:border-[#3B6B4A] focus:ring-2 focus:ring-[#E8F0EA] transition-all flex items-center justify-between"
        >
          <span className={value ? "text-[#2C2C2C]" : "text-[#AAAAAA]"}>{value || placeholder}</span>
          <span className="text-[#777777]">▾</span>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-[#E5E0D8] rounded-xl shadow-lg py-2 z-20 max-h-[240px] overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-[14px] hover:bg-[#F8F6F1] transition-colors ${
                    value === option ? "text-[#3B6B4A] font-[600] bg-[#E8F0EA]" : "text-[#2C2C2C]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CheckField({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex-shrink-0 mt-0.5">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <div className="w-5 h-5 border-2 border-[#E5E0D8] rounded-md bg-white peer-checked:bg-[#3B6B4A] peer-checked:border-[#3B6B4A] transition-all group-hover:border-[#3B6B4A]">
          {checked && (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
              <path d="M5 10L8.5 13.5L15 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-[13px] text-[#2C2C2C] leading-relaxed">{children}</span>
    </label>
  );
}

function SocialDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-[#E5E0D8]" />
      <span className="text-[13px] text-[#777777]">또는</span>
      <div className="flex-1 h-px bg-[#E5E0D8]" />
    </div>
  );
}

function SocialLoginButtons({ mode }: { mode: "signup" | "login" }) {
  const suffix = mode === "signup" ? "시작하기" : "계속하기";
  const action = mode === "signup" ? "회원가입" : "로그인";

  return (
    <div className="space-y-3">
      <button type="button" onClick={() => console.log(`카카오 ${action}`)} className="w-full h-12 bg-[#FEE500] text-[#000000] rounded-xl text-[15px] font-[600] hover:bg-[#fdd800] transition-colors flex items-center justify-center gap-2">
        <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
          <path d="M10 0C4.477 0 0 3.372 0 7.532c0 2.753 1.832 5.162 4.575 6.527-.194.714-.744 2.798-.851 3.203 0 0-.055.449.236.617.29.168.63.005.63.005 1.064-.145 4.917-3.162 5.706-3.682.57.078 1.156.12 1.754.12 5.523 0 10-3.372 10-7.532C20 3.372 15.523 0 10 0z" fill="currentColor"/>
        </svg>
        카카오로 {suffix}
      </button>

      <button type="button" onClick={() => console.log(`네이버 ${action}`)} className="w-full h-12 bg-[#03C75A] text-white rounded-xl text-[15px] font-[600] hover:bg-[#02b350] transition-colors flex items-center justify-center gap-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M13.6 10.8L6.2 0H0v20h6.4V9.2L13.8 20H20V0h-6.4v10.8z" fill="white"/>
        </svg>
        네이버로 {suffix}
      </button>

      <button type="button" onClick={() => console.log(`구글 ${action}`)} className="w-full h-12 bg-white border border-[#E5E0D8] text-[#2C2C2C] rounded-xl text-[15px] font-[600] hover:bg-[#F8F6F1] transition-colors flex items-center justify-center gap-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.351z" fill="#4285F4"/>
          <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
          <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
          <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
        </svg>
        구글로 {suffix}
      </button>
    </div>
  );
}
