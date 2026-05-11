import { useState } from "react";
import { OwlMascot } from "../../components/common/OwlMascot";
import { FormInput } from "../../components/common/FormInput";
import { FormDropdown } from "../../components/common/FormDropdown";
import { FormCheckbox } from "../../components/common/FormCheckbox";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("회원가입:", { signupEmail, signupPassword, signupName, signupAge, agreedToTerms });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인:", { loginEmail, loginPassword, rememberMe });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col items-center justify-center px-8 py-12">
      {/* Logo and mascot */}
      <div className="flex flex-col items-center mb-8">
        <OwlMascot size={72} />
        <h1 className="text-[32px] font-[800] text-[#3B6B4A] mt-4">
          큐릭
        </h1>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-[440px] bg-white border border-[#E5E0D8] rounded-[20px] shadow-lg p-8">
        {/* Tab selector */}
        <div className="flex border-b border-[#E5E0D8] mb-8">
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 pb-3 text-[16px] font-[600] transition-colors relative ${
              activeTab === "signup"
                ? "text-[#3B6B4A]"
                : "text-[#777777] hover:text-[#2C2C2C]"
            }`}
          >
            회원가입
            {activeTab === "signup" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B6B4A]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 pb-3 text-[16px] font-[600] transition-colors relative ${
              activeTab === "login"
                ? "text-[#3B6B4A]"
                : "text-[#777777] hover:text-[#2C2C2C]"
            }`}
          >
            로그인
            {activeTab === "login" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B6B4A]" />
            )}
          </button>
        </div>

        {/* Signup form */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignup}>
            <FormInput
              label="이메일"
              type="email"
              placeholder="example@email.com"
              value={signupEmail}
              onChange={setSignupEmail}
            />
            <FormInput
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={signupPassword}
              onChange={setSignupPassword}
              isPassword
              helperText="8자 이상, 영문+숫자 포함"
            />
            <FormInput
              label="이름"
              placeholder="이름을 입력하세요"
              value={signupName}
              onChange={setSignupName}
            />
            <FormDropdown
              label="연령대 (선택)"
              value={signupAge}
              onChange={setSignupAge}
              options={["20대", "30대", "40대", "50대", "60대 이상"]}
            />

            <div className="mb-6">
              <FormCheckbox
                checked={agreedToTerms}
                onChange={setAgreedToTerms}
                label={
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
                }
              />
            </div>

            <button
              type="submit"
              disabled={!agreedToTerms}
              className="w-full h-12 bg-[#3B6B4A] text-white rounded-xl text-[15px] font-[600] hover:bg-[#2d5438] transition-colors disabled:bg-[#C0C0C0] disabled:cursor-not-allowed"
            >
              가입하기
            </button>
          </form>
        )}

        {/* Login form */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <FormInput
              label="이메일"
              type="email"
              placeholder="example@email.com"
              value={loginEmail}
              onChange={setLoginEmail}
            />
            <FormInput
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={loginPassword}
              onChange={setLoginPassword}
              isPassword
            />

            <div className="mb-6">
              <FormCheckbox
                checked={rememberMe}
                onChange={setRememberMe}
                label="로그인 유지"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#3B6B4A] text-white rounded-xl text-[15px] font-[600] hover:bg-[#2d5438] transition-colors"
            >
              로그인
            </button>

            <div className="text-center mt-4">
              <a
                href="#"
                className="text-[13px] text-[#777777] hover:text-[#3B6B4A] transition-colors"
              >
                비밀번호를 잊으셨나요?
              </a>
            </div>
          </form>
        )}
      </div>

      {/* Footer text */}
      <p className="text-[13px] text-[#777777] mt-6 text-center">
        큐릭은 공공 교육 강좌로 맞춤 학습 로드맵을 만들어 드려요
      </p>
    </div>
  );
}
