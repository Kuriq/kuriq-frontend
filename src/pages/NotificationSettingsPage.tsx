import { useState, useEffect } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { Navigation } from "../components/layout/Navigation";
import { OwlMascot } from "../components/common/OwlMascot";
import { getNotificationSettings, updateNotificationSettings, type NotificationSettings } from "../api/client";

const DAY_MAP: Record<string, string> = {
  MON: "월요일", TUE: "화요일", WED: "수요일", THU: "목요일",
  FRI: "금요일", SAT: "토요일", SUN: "일요일",
};
const REVERSE_DAY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(DAY_MAP).map(([k, v]) => [v, k])
);

function formatTimeToDisplay(time: string): string {
  // "09:00:00" → "오전 09:00"
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${period} ${String(displayHour).padStart(2, "0")}:${m}`;
}

function formatDisplayToTime(display: string): string {
  // "오전 09:00" → "09:00:00"
  const [period, time] = display.split(" ");
  let [h, m] = time.split(":");
  let hour = parseInt(h, 10);
  if (period === "오후" && hour !== 12) hour += 12;
  if (period === "오전" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${m}:00`;
}

export default function NotificationSettingsPage() {
  const [kakaoEnabled, setKakaoEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [selectedDay, setSelectedDay] = useState("월요일");
  const [selectedTime, setSelectedTime] = useState("오전 09:00");
  const [weeklyStartEnabled, setWeeklyStartEnabled] = useState(true);
  const [incompleteReminderEnabled, setIncompleteReminderEnabled] = useState(true);
  const [inactiveNoticeEnabled, setInactiveNoticeEnabled] = useState(true);
  const [completionCongratEnabled, setCompletionCongratEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
  const times = [
    "오전 06:00", "오전 07:00", "오전 08:00", "오전 09:00", "오전 10:00", "오전 11:00",
    "오후 12:00", "오후 01:00", "오후 02:00", "오후 03:00", "오후 04:00", "오후 05:00",
    "오후 06:00", "오후 07:00", "오후 08:00", "오후 09:00", "오후 10:00",
  ];

  useEffect(() => {
    getNotificationSettings()
      .then((settings: NotificationSettings) => {
        setKakaoEnabled(settings.kakaoEnabled);
        setEmailEnabled(settings.emailEnabled);
        setSelectedDay(DAY_MAP[settings.learningDay] || "월요일");
        setSelectedTime(formatTimeToDisplay(settings.learningTime));
        setWeeklyStartEnabled(settings.weeklyStartAlert);
        setIncompleteReminderEnabled(settings.incompleteReminder);
        setInactiveNoticeEnabled(settings.inactivityAlert);
        setCompletionCongratEnabled(settings.completionAlert);
      })
      .catch(() => setError("설정을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateNotificationSettings({
        kakaoEnabled,
        emailEnabled,
        learningDay: REVERSE_DAY_MAP[selectedDay] || "MON",
        learningTime: formatDisplayToTime(selectedTime),
        weeklyStartAlert: weeklyStartEnabled,
        incompleteReminder: incompleteReminderEnabled,
        inactivityAlert: inactiveNoticeEnabled,
        completionAlert: completionCongratEnabled,
      });
      alert("설정이 저장되었습니다!");
    } catch {
      setError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <Navigation activeMenu="알림 설정" />
        <main className="flex-1 px-8 py-12 flex items-center justify-center">
          <p className="text-[16px] text-[#777777]">설정을 불러오는 중...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="알림 설정" />

      <main className="flex-1 px-8 py-12">
        <div className="max-w-[800px] mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-[28px] font-[800] text-[#2C2C2C]">알림 설정</h1>
              <OwlMascot size={40} />
            </div>
            <p className="text-[14px] text-[#777777]">학습 흐름을 놓치지 않게 큐리가 제때 알려드릴게요.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-[14px]">
              {error}
            </div>
          )}

          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 shadow-sm mb-6">
            <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-6">알림 받을 곳</h2>
            <div className="space-y-4">
              <ChannelRow
                icon={<MessageCircle className="w-6 h-6 text-[#3C1E1E]" />}
                iconBgClassName="bg-[#FEE500]"
                title="카카오톡으로 받기"
                recommended
                enabled={kakaoEnabled}
                onChange={setKakaoEnabled}
              />
              <ChannelRow
                icon={<Mail className="w-6 h-6 text-[#3B6B4A]" />}
                iconBgClassName="bg-[#E8F0EA]"
                title="이메일로 받기"
                enabled={emailEnabled}
                onChange={setEmailEnabled}
              />
            </div>
          </div>

          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 shadow-sm mb-6">
            <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-3">나의 학습 시작 시간</h2>
            <p className="text-[13px] text-[#777777] mb-6">매주 학습을 시작할 요일과 시간을 알려주세요.</p>

            <div className="grid grid-cols-2 gap-4">
              <SimpleSelect label="요일" value={selectedDay} onChange={setSelectedDay} options={days} />
              <SimpleSelect label="시간" value={selectedTime} onChange={setSelectedTime} options={times} />
            </div>
          </div>

          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 shadow-sm mb-8">
            <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-6">이런 알림을 보내드려요</h2>
            <div>
              <NotificationSettingRow
                title="주간 학습 시작"
                description="설정한 시간에 이번 주 학습 시작을 알려드려요"
                enabled={weeklyStartEnabled}
                onChange={setWeeklyStartEnabled}
              />
              <NotificationSettingRow
                title="미완료 리마인드"
                description="주차 종료 2일 전, 남은 강좌가 있다면 알려드려요"
                enabled={incompleteReminderEnabled}
                onChange={setIncompleteReminderEnabled}
              />
              <NotificationSettingRow
                title="장기 미활동 안내"
                description="7일 이상 접속하지 않으면 큐리가 안부를 물어봐요"
                enabled={inactiveNoticeEnabled}
                onChange={setInactiveNoticeEnabled}
              />
              <NotificationSettingRow
                title="로드맵 완료 축하"
                description="모든 과정을 마쳤을 때 축하 메시지와 통계를 보내드려요"
                enabled={completionCongratEnabled}
                onChange={setCompletionCongratEnabled}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3.5 bg-[#3B6B4A] text-white rounded-xl text-[15px] font-[600] hover:bg-[#2d5438] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "저장 중..." : "설정 저장하기"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChannelRow({
  icon,
  iconBgClassName,
  title,
  recommended = false,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  iconBgClassName: string;
  title: string;
  recommended?: boolean;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-5 bg-[#F8F6F1] rounded-xl">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClassName}`}>{icon}</div>
        <div>
          <span className="text-[15px] font-[600] text-[#2C2C2C]">{title}</span>
          {recommended && (
            <span className="ml-2 px-2.5 py-0.5 bg-[#E8F0EA] text-[#3B6B4A] text-[11px] font-[600] rounded-full">추천</span>
          )}
        </div>
      </div>
      <TogglePill enabled={enabled} onChange={onChange} />
    </div>
  );
}

function SimpleSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-5 last:mb-0">
      <label className="block text-[13px] font-[600] text-[#2C2C2C] mb-2">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full h-12 px-4 bg-white border border-[#E5E0D8] rounded-xl text-[14px] text-left outline-none focus:border-[#3B6B4A] focus:ring-2 focus:ring-[#E8F0EA] transition-all flex items-center justify-between"
        >
          <span className="text-[#2C2C2C]">{value}</span>
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

function NotificationSettingRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-5 border-b border-[#E5E0D8] last:border-b-0">
      <div className="flex-1">
        <h4 className="text-[15px] font-[600] text-[#2C2C2C] mb-1.5">{title}</h4>
        <p className="text-[13px] text-[#777777] leading-relaxed">{description}</p>
      </div>
      <div className="flex-shrink-0 pt-0.5">
        <TogglePill enabled={enabled} onChange={onChange} />
      </div>
    </div>
  );
}

function TogglePill({ enabled, onChange }: { enabled: boolean; onChange: (enabled: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3B6B4A] focus:ring-offset-2 ${
        enabled ? "bg-[#3B6B4A]" : "bg-[#CCCCCC]"
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
