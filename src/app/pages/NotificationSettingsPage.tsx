import { useState } from "react";
import { Navigation } from "../components/Navigation";
import { OwlMascot } from "../components/OwlMascot";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { FormDropdown } from "../components/FormDropdown";
import { NotificationItem } from "../components/NotificationItem";
import { MessageCircle, Mail } from "lucide-react";

export default function NotificationSettingsPage() {
  // Notification channels
  const [kakaoEnabled, setKakaoEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  // Learning schedule
  const [selectedDay, setSelectedDay] = useState("월요일");
  const [selectedTime, setSelectedTime] = useState("오전 09:00");

  // Notification types
  const [weeklyStartEnabled, setWeeklyStartEnabled] = useState(true);
  const [incompleteReminderEnabled, setIncompleteReminderEnabled] = useState(true);
  const [inactiveNoticeEnabled, setInactiveNoticeEnabled] = useState(true);
  const [completionCongratEnabled, setCompletionCongratEnabled] = useState(true);

  const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
  const times = [
    "오전 06:00", "오전 07:00", "오전 08:00", "오전 09:00", "오전 10:00", "오전 11:00",
    "오후 12:00", "오후 01:00", "오후 02:00", "오후 03:00", "오후 04:00", "오후 05:00",
    "오후 06:00", "오후 07:00", "오후 08:00", "오후 09:00", "오후 10:00"
  ];

  const handleSave = () => {
    console.log("Settings saved:", {
      kakaoEnabled,
      emailEnabled,
      selectedDay,
      selectedTime,
      weeklyStartEnabled,
      incompleteReminderEnabled,
      inactiveNoticeEnabled,
      completionCongratEnabled,
    });
    alert("설정이 저장되었습니다!");
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      {/* Navigation */}
      <Navigation activeMenu="마이페이지" />

      {/* Main content */}
      <main className="flex-1 px-8 py-12">
        <div className="max-w-[800px] mx-auto">
          {/* Page header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-[28px] font-[800] text-[#2C2C2C]">
                알림 설정
              </h1>
              <OwlMascot size={40} />
            </div>
            <p className="text-[14px] text-[#777777]">
              학습 흐름을 놓치지 않게 큐리가 제때 알려드릴게요.
            </p>
          </div>

          {/* Section 1: Notification Channels */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 shadow-sm mb-6">
            <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-6">
              알림 받을 곳
            </h2>
            
            <div className="space-y-4">
              {/* KakaoTalk */}
              <div className="flex items-center justify-between p-5 bg-[#F8F6F1] rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FEE500] rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-[#3C1E1E]" />
                  </div>
                  <div>
                    <span className="text-[15px] font-[600] text-[#2C2C2C]">
                      카카오톡으로 받기
                    </span>
                    <span className="ml-2 px-2.5 py-0.5 bg-[#E8F0EA] text-[#3B6B4A] text-[11px] font-[600] rounded-full">
                      추천
                    </span>
                  </div>
                </div>
                <ToggleSwitch enabled={kakaoEnabled} onChange={setKakaoEnabled} />
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-5 bg-[#F8F6F1] rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E8F0EA] rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#3B6B4A]" />
                  </div>
                  <span className="text-[15px] font-[600] text-[#2C2C2C]">
                    이메일로 받기
                  </span>
                </div>
                <ToggleSwitch enabled={emailEnabled} onChange={setEmailEnabled} />
              </div>
            </div>
          </div>

          {/* Section 2: Learning Schedule */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 shadow-sm mb-6">
            <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-3">
              나의 학습 시작 시간
            </h2>
            <p className="text-[13px] text-[#777777] mb-6">
              매주 학습을 시작할 요일과 시간을 알려주세요.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FormDropdown
                label="요일"
                value={selectedDay}
                onChange={setSelectedDay}
                options={days}
              />
              <FormDropdown
                label="시간"
                value={selectedTime}
                onChange={setSelectedTime}
                options={times}
              />
            </div>
          </div>

          {/* Section 3: Notification Types */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 shadow-sm mb-8">
            <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-6">
              이런 알림을 보내드려요
            </h2>

            <div>
              <NotificationItem
                title="주간 학습 시작"
                description="설정한 시간에 이번 주 학습 시작을 알려드려요"
                enabled={weeklyStartEnabled}
                onChange={setWeeklyStartEnabled}
              />
              <NotificationItem
                title="미완료 리마인드"
                description="주차 종료 2일 전, 남은 강좌가 있다면 알려드려요"
                enabled={incompleteReminderEnabled}
                onChange={setIncompleteReminderEnabled}
              />
              <NotificationItem
                title="장기 미활동 안내"
                description="7일 이상 접속하지 않으면 큐리가 안부를 물어봐요"
                enabled={inactiveNoticeEnabled}
                onChange={setInactiveNoticeEnabled}
              />
              <NotificationItem
                title="로드맵 완료 축하"
                description="모든 과정을 마쳤을 때 축하 메시지와 통계를 보내드려요"
                enabled={completionCongratEnabled}
                onChange={setCompletionCongratEnabled}
              />
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-8 py-3.5 bg-[#3B6B4A] text-white rounded-xl text-[15px] font-[600] hover:bg-[#2d5438] transition-colors shadow-sm"
            >
              설정 저장하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
