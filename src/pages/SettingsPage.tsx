import { useEffect, useMemo, useState } from "react";
import { Bell, Palette, Save, UserRound } from "lucide-react";
import { Navigation } from "../components/layout/Navigation";
import { getNotificationSettings, getProfile, updateNotificationSettings, updateProfile, type NotificationSettings, type UserProfile } from "../api/client";
import { OwlMascot } from "../components/common/OwlMascot";

const DAY_MAP: Record<string, string> = {
  MON: "월요일", TUE: "화요일", WED: "수요일", THU: "목요일",
  FRI: "금요일", SAT: "토요일", SUN: "일요일",
};
const REVERSE_DAY_MAP: Record<string, string> = Object.fromEntries(Object.entries(DAY_MAP).map(([k, v]) => [v, k]));
const PROFILE_ICONS = ["🦉", "🌱", "📚", "🔥", "✨", "🧠", "🌿", "🚀"];
const PROFILE_COLORS = ["#3B6B4A", "#4F7D5C", "#6B8E23", "#E8985E", "#C75B7A", "#5B6CFA", "#9C27B0", "#2F855A"];

function formatTimeToDisplay(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${period} ${String(displayHour).padStart(2, "0")}:${m}`;
}

function formatDisplayToTime(display: string): string {
  const [period, time] = display.split(" ");
  let [h, m] = time.split(":");
  let hour = parseInt(h, 10);
  if (period === "오후" && hour !== 12) hour += 12;
  if (period === "오전" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${m}:00`;
}

type SettingsTab = "profile" | "notifications";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileIcon, setProfileIcon] = useState("🦉");
  const [profileColor, setProfileColor] = useState("#3B6B4A");

  const [kakaoEnabled, setKakaoEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [selectedDay, setSelectedDay] = useState("월요일");
  const [selectedTime, setSelectedTime] = useState("오전 09:00");
  const [weeklyStartEnabled, setWeeklyStartEnabled] = useState(true);
  const [incompleteReminderEnabled, setIncompleteReminderEnabled] = useState(true);
  const [inactiveNoticeEnabled, setInactiveNoticeEnabled] = useState(true);
  const [completionCongratEnabled, setCompletionCongratEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
  const times = [
    "오전 06:00", "오전 07:00", "오전 08:00", "오전 09:00", "오전 10:00", "오전 11:00",
    "오후 12:00", "오후 01:00", "오후 02:00", "오후 03:00", "오후 04:00", "오후 05:00",
    "오후 06:00", "오후 07:00", "오후 08:00", "오후 09:00", "오후 10:00",
  ];

  useEffect(() => {
    Promise.all([getProfile(), getNotificationSettings()])
      .then(([profileData, settings]) => {
        setProfile(profileData);
        setProfileName(profileData.name ?? "");
        setProfileIcon(profileData.profileIcon || "🦉");
        setProfileColor(profileData.profileColor || "#3B6B4A");

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

  const hasProfileChanges = useMemo(() => {
    if (!profile) return false;
    return profileName !== profile.name || profileIcon !== (profile.profileIcon || "🦉") || profileColor !== (profile.profileColor || "#3B6B4A");
  }, [profile, profileColor, profileIcon, profileName]);

  const handleProfileSave = async () => {
    try {
      setProfileSaving(true);
      setError(null);
      const nextProfile = await updateProfile({ name: profileName.trim(), profileIcon, profileColor });
      setProfile(nextProfile);
      setProfileName(nextProfile.name);
      setProfileIcon(nextProfile.profileIcon || "🦉");
      setProfileColor(nextProfile.profileColor || "#3B6B4A");
      alert("내 설정이 저장되었습니다!");
    } catch {
      setError("내 설정 저장에 실패했습니다.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleNotificationSave = async () => {
    try {
      setNotificationSaving(true);
      setError(null);
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
      alert("알림 설정이 저장되었습니다!");
    } catch {
      setError("알림 설정 저장에 실패했습니다.");
    } finally {
      setNotificationSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <Navigation activeMenu="설정" />
        <main className="flex-1 px-8 py-12 flex items-center justify-center">
          <p className="text-[16px] text-[#777777]">설정을 불러오는 중...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="설정" />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[980px]">
          <div className="mb-8 flex flex-col gap-4 rounded-[24px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-[28px] font-[800] text-[#2C2C2C]">설정</h1>
                <OwlMascot size={40} variant="winking" />
              </div>
              <p className="text-[14px] text-[#777777]">내 설정과 알림 설정을 한 곳에서 관리할 수 있어요.</p>
            </div>
          </div>

          <div className="mb-6 flex gap-3">
            <SettingsTabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<UserRound className="h-4 w-4" />} label="내 설정" />
            <SettingsTabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={<Bell className="h-4 w-4" />} label="알림 설정" />
          </div>

          {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] text-red-700">{error}</div> : null}

          {activeTab === "profile" ? (
            <section className="space-y-6">
              <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-[18px] font-[800] text-[#2C2C2C]">프로필 미리보기</h2>
                <div className="flex items-center gap-4 rounded-2xl bg-[#F8F6F1] p-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full text-[28px] text-white shadow-sm" style={{ backgroundColor: profileColor }}>
                    {profileIcon}
                  </div>
                  <div>
                    <p className="text-[18px] font-[800] text-[#2C2C2C]">{profileName || "닉네임을 입력해 주세요"}</p>
                    <p className="text-[13px] text-[#777777]">{profile?.email}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-sm">
                <label className="mb-2 block text-[14px] font-[700] text-[#2C2C2C]">닉네임</label>
                <input
                  value={profileName}
                  onChange={(event) => setProfileName(event.target.value.slice(0, 20))}
                  className="h-12 w-full rounded-xl border border-[#E5E0D8] px-4 text-[14px] outline-none focus:border-[#3B6B4A]"
                  placeholder="닉네임을 입력해 주세요"
                />
                <p className="mt-2 text-right text-[12px] text-[#999999]">{profileName.length}/20</p>

                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Palette className="h-4 w-4 text-[#3B6B4A]" />
                    <p className="text-[14px] font-[700] text-[#2C2C2C]">프로필 아이콘</p>
                  </div>
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                    {PROFILE_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setProfileIcon(icon)}
                        className={`flex h-12 items-center justify-center rounded-xl border text-[22px] transition-colors ${profileIcon === icon ? "border-[#3B6B4A] bg-[#E8F0EA]" : "border-[#E5E0D8] bg-white"}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-[14px] font-[700] text-[#2C2C2C]">프로필 색상</p>
                  <div className="flex flex-wrap gap-3">
                    {PROFILE_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setProfileColor(color)}
                        className={`h-10 w-10 rounded-full border-4 transition-transform ${profileColor === color ? "border-[#2C2C2C] scale-110" : "border-white"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleProfileSave}
                  disabled={!profileName.trim() || !hasProfileChanges || profileSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3B6B4A] px-6 py-3 text-[14px] font-[700] text-white hover:bg-[#2d5438] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Save className="h-4 w-4" />
                  {profileSaving ? "저장 중..." : "내 설정 저장"}
                </button>
              </div>
            </section>
          ) : (
            <NotificationSection
              kakaoEnabled={kakaoEnabled}
              setKakaoEnabled={setKakaoEnabled}
              emailEnabled={emailEnabled}
              setEmailEnabled={setEmailEnabled}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              weeklyStartEnabled={weeklyStartEnabled}
              setWeeklyStartEnabled={setWeeklyStartEnabled}
              incompleteReminderEnabled={incompleteReminderEnabled}
              setIncompleteReminderEnabled={setIncompleteReminderEnabled}
              inactiveNoticeEnabled={inactiveNoticeEnabled}
              setInactiveNoticeEnabled={setInactiveNoticeEnabled}
              completionCongratEnabled={completionCongratEnabled}
              setCompletionCongratEnabled={setCompletionCongratEnabled}
              days={days}
              times={times}
              saving={notificationSaving}
              onSave={handleNotificationSave}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function NotificationSection(props: {
  kakaoEnabled: boolean; setKakaoEnabled: (value: boolean) => void;
  emailEnabled: boolean; setEmailEnabled: (value: boolean) => void;
  selectedDay: string; setSelectedDay: (value: string) => void;
  selectedTime: string; setSelectedTime: (value: string) => void;
  weeklyStartEnabled: boolean; setWeeklyStartEnabled: (value: boolean) => void;
  incompleteReminderEnabled: boolean; setIncompleteReminderEnabled: (value: boolean) => void;
  inactiveNoticeEnabled: boolean; setInactiveNoticeEnabled: (value: boolean) => void;
  completionCongratEnabled: boolean; setCompletionCongratEnabled: (value: boolean) => void;
  days: string[]; times: string[]; saving: boolean; onSave: () => void;
}) {
  const { kakaoEnabled, setKakaoEnabled, emailEnabled, setEmailEnabled, selectedDay, setSelectedDay, selectedTime, setSelectedTime, weeklyStartEnabled, setWeeklyStartEnabled, incompleteReminderEnabled, setIncompleteReminderEnabled, inactiveNoticeEnabled, setInactiveNoticeEnabled, completionCongratEnabled, setCompletionCongratEnabled, days, times, saving, onSave } = props;
  return (
    <section>
      <div className="rounded-2xl border border-[#E5E0D8] bg-white p-8 shadow-sm mb-6">
        <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-6">알림 받을 곳</h2>
        <div className="space-y-4">
          <ChannelRow icon={<Bell className="w-6 h-6 text-[#3C1E1E]" />} iconBgClassName="bg-[#FEE500]" title="카카오톡으로 받기" recommended enabled={kakaoEnabled} onChange={setKakaoEnabled} />
          <ChannelRow icon={<Bell className="w-6 h-6 text-[#3B6B4A]" />} iconBgClassName="bg-[#E8F0EA]" title="이메일로 받기" enabled={emailEnabled} onChange={setEmailEnabled} />
        </div>
      </div>
      <div className="rounded-2xl border border-[#E5E0D8] bg-white p-8 shadow-sm mb-6">
        <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-3">나의 학습 시작 시간</h2>
        <p className="text-[13px] text-[#777777] mb-6">매주 학습을 시작할 요일과 시간을 알려주세요.</p>
        <div className="grid grid-cols-2 gap-4">
          <SimpleSelect label="요일" value={selectedDay} onChange={setSelectedDay} options={days} />
          <SimpleSelect label="시간" value={selectedTime} onChange={setSelectedTime} options={times} />
        </div>
      </div>
      <div className="rounded-2xl border border-[#E5E0D8] bg-white p-8 shadow-sm mb-8">
        <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-6">이런 알림을 보내드려요</h2>
        <NotificationSettingRow title="주간 학습 시작" description="설정한 시간에 이번 주 학습 시작을 알려드려요" enabled={weeklyStartEnabled} onChange={setWeeklyStartEnabled} />
        <NotificationSettingRow title="미완료 리마인드" description="주차 종료 2일 전, 남은 강좌가 있다면 알려드려요" enabled={incompleteReminderEnabled} onChange={setIncompleteReminderEnabled} />
        <NotificationSettingRow title="장기 미활동 안내" description="7일 이상 접속하지 않으면 큐리가 안부를 물어봐요" enabled={inactiveNoticeEnabled} onChange={setInactiveNoticeEnabled} />
        <NotificationSettingRow title="로드맵 완료 축하" description="모든 과정을 마쳤을 때 축하 메시지와 통계를 보내드려요" enabled={completionCongratEnabled} onChange={setCompletionCongratEnabled} />
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={onSave} disabled={saving} className="px-8 py-3.5 bg-[#3B6B4A] text-white rounded-xl text-[15px] font-[600] hover:bg-[#2d5438] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? "저장 중..." : "알림 설정 저장"}
        </button>
      </div>
    </section>
  );
}

function SettingsTabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-[700] transition-colors ${active ? "bg-[#3B6B4A] text-white" : "bg-white text-[#666666] border border-[#E5E0D8]"}`}>
      {icon}
      {label}
    </button>
  );
}

function ChannelRow({ icon, iconBgClassName, title, recommended = false, enabled, onChange }: { icon: React.ReactNode; iconBgClassName: string; title: string; recommended?: boolean; enabled: boolean; onChange: (enabled: boolean) => void; }) {
  return (
    <div className="flex items-center justify-between p-5 bg-[#F8F6F1] rounded-xl">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClassName}`}>{icon}</div>
        <div>
          <span className="text-[15px] font-[600] text-[#2C2C2C]">{title}</span>
          {recommended ? <span className="ml-2 px-2.5 py-0.5 bg-[#E8F0EA] text-[#3B6B4A] text-[11px] font-[600] rounded-full">추천</span> : null}
        </div>
      </div>
      <TogglePill enabled={enabled} onChange={onChange} />
    </div>
  );
}

function SimpleSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[]; }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-5 last:mb-0">
      <label className="block text-[13px] font-[600] text-[#2C2C2C] mb-2">{label}</label>
      <div className="relative">
        <button type="button" onClick={() => setIsOpen((prev) => !prev)} className="w-full h-12 px-4 bg-white border border-[#E5E0D8] rounded-xl text-[14px] text-left outline-none focus:border-[#3B6B4A] flex items-center justify-between">
          <span className="text-[#2C2C2C]">{value}</span>
          <span className="text-[#777777]">▾</span>
        </button>
        {isOpen ? (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-[#E5E0D8] rounded-xl shadow-lg py-2 z-20 max-h-[240px] overflow-y-auto">
              {options.map((option) => (
                <button key={option} type="button" onClick={() => { onChange(option); setIsOpen(false); }} className={`w-full px-4 py-2.5 text-left text-[14px] hover:bg-[#F8F6F1] ${value === option ? "text-[#3B6B4A] font-[600] bg-[#E8F0EA]" : "text-[#2C2C2C]"}`}>
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function NotificationSettingRow({ title, description, enabled, onChange }: { title: string; description: string; enabled: boolean; onChange: (enabled: boolean) => void; }) {
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
    <button type="button" onClick={() => onChange(!enabled)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${enabled ? "bg-[#3B6B4A]" : "bg-[#CCCCCC]"}`}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}
