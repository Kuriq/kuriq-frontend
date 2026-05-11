# 큐릭 (Kuriq) — Frontend

> AI 기반 평생교육 커리큘럼 추천 웹 서비스

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

<br/>

## 서비스 소개

큐릭은 사용자가 자연어로 학습 목표를 입력하면 K-MOOC, KOCW, 서울시 평생학습포털 등 공공 교육 플랫폼의 강의 데이터를 분석하여 개인 맞춤형 주차별 학습 로드맵을 자동으로 생성해주는 웹 서비스입니다.

- **자연어 기반 로드맵 생성** — "3개월 안에 데이터 분석 자격증을 따고 싶어"처럼 자유롭게 입력
- **공공 교육 데이터 통합** — 여러 플랫폼의 무료 강의를 한곳에서
- **학습 진도 트래킹** — 주차별 체크리스트와 영양소 갭 분석
- **리마인드 알림** — 이메일 / 카카오톡으로 학습 일정 알림

<br/>

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 18 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI / shadcn/ui |
| Routing | React Router 7 |
| Form | React Hook Form |
| Icons | Lucide React, MUI Icons |
| Package Manager | npm |

<br/>

## 시작하기

```bash
# 레포지토리 클론
git clone https://github.com/your-org/kuriq-frontend.git
cd kuriq-frontend

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local

# 개발 서버 실행
npm run dev
```

### 환경변수

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_KAKAO_MAP_KEY=your_kakao_map_key
```

<br/>

## 프로젝트 구조

```
src/
├── assets/          # 이미지, 폰트 등 정적 파일
├── components/      # 공통 컴포넌트
│   ├── common/      # Button, Input, Card 등 재사용 컴포넌트
│   │   └── ui/      # shadcn/ui 기반 기본 컴포넌트
│   └── layout/      # Navigation 등 레이아웃 컴포넌트
├── pages/           # 페이지 컴포넌트
│   ├── Home/
│   ├── Auth/
│   ├── Roadmap/
│   ├── Dashboard/
│   ├── Search/
│   ├── MyPage/
│   ├── Quiz/
│   ├── LearningSpaces/
│   ├── AIReviewNote/
│   └── NotificationSettings/
├── hooks/           # 커스텀 훅
├── services/        # API 호출 함수
├── store/           # 전역 상태 관리
├── styles/          # 전역 스타일
└── utils/           # 유틸리티 함수
```

<br/>

## 브랜치 전략

`GitHub Flow` 기반으로 운영합니다.

```
main
└── develop
    ├── feature/login
    ├── feature/roadmap-result
    ├── fix/dashboard-bug
    └── chore/update-deps
```

| 브랜치 | 설명 |
|--------|------|
| `main` | 배포 브랜치. 직접 커밋 금지, PR로만 병합 |
| `develop` | 개발 통합 브랜치. 기능 개발의 기준 브랜치 |
| `feature/*` | 기능 개발 브랜치. develop에서 분기 |
| `fix/*` | 버그 수정 브랜치 |
| `chore/*` | 설정, 의존성 등 코드 외 변경 |
| `hotfix/*` | main 브랜치 긴급 수정 |

### 브랜치 네이밍 규칙

```
feature/기능명        # feature/roadmap-generate
fix/이슈내용          # fix/login-redirect-error
chore/작업내용        # chore/tailwind-config
hotfix/이슈내용       # hotfix/api-timeout
```

<br/>

## 커밋 컨벤션

`Conventional Commits` 스펙을 따릅니다.

```
<type>: <subject>

<body> (선택)
```

### 타입

| 타입 | 설명 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `style` | 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음) |
| `refactor` | 코드 리팩토링 |
| `chore` | 빌드 설정, 패키지 업데이트 등 |
| `docs` | 문서 수정 |
| `test` | 테스트 코드 추가/수정 |
| `design` | UI/스타일 변경 |
| `rename` | 파일/폴더명 변경 |
| `remove` | 파일 삭제 |

### 커밋 예시

```bash
feat: 로드맵 결과 페이지 강의 카드 컴포넌트 추가
fix: 대시보드 진행률 계산 오류 수정
chore: 패키지 버전 업데이트
design: 랜딩 페이지 히어로 섹션 레이아웃 수정
```

### 규칙

- 제목은 50자 이내로 작성
- 제목 끝에 마침표 붙이지 않기
- 제목은 명령문으로 작성 ("추가했다" X → "추가" O)
- 본문이 필요한 경우 제목과 한 줄 띄어서 작성

<br/>

## PR 규칙

### PR 생성 규칙

- `develop` 브랜치를 대상으로 PR을 생성합니다
- `main` 브랜치 직접 PR은 팀장만 가능합니다
- PR 제목은 커밋 컨벤션과 동일한 형식으로 작성합니다
- PR 생성 전 로컬에서 빌드 에러 여부를 확인합니다

### PR 템플릿

```markdown
## 작업 내용
<!-- 어떤 작업을 했는지 간략히 설명 -->

## 변경 사항
- [ ] 변경 사항 1
- [ ] 변경 사항 2

## 스크린샷 (UI 변경 시 첨부)

## 참고 사항
<!-- 리뷰어가 알아야 할 내용 -->

## 관련 이슈
closes #이슈번호
```

### 코드 리뷰 규칙

- PR은 최소 **1명** 이상의 Approve를 받아야 병합 가능합니다
- 리뷰는 PR 생성 후 **24시간 이내**에 완료합니다
- `Approve` — 이상 없음, 병합 가능
- `Request Changes` — 수정 필요, 재요청 필수
- 리뷰 코멘트는 `[P1]`, `[P2]`, `[P3]` 우선순위 태그를 붙입니다
  - `[P1]` — 반드시 수정 (버그, 로직 오류)
  - `[P2]` — 수정 권장 (코드 품질)
  - `[P3]` — 선택 사항 (스타일, 네이밍 의견)

### 병합 규칙

- Squash and Merge를 기본으로 사용합니다
- 병합 후 작업 브랜치는 즉시 삭제합니다

<br/>

## 이슈 컨벤션

```
[feat] 로드맵 결과 페이지 구현
[fix] 로그인 후 리다이렉트 오류
[design] 대시보드 UI 개선
[chore] ESLint 설정 추가
```

<br/>

## 팀원

| 이름 | 역할 | GitHub |
|------|------|--------|
| - | Frontend | - |
| - | Frontend | - |

<br/>

## 관련 레포지토리

- [kuriq-backend](https://github.com/your-org/kuriq-backend) — Spring Boot 백엔드
- [kuriq-ai](https://github.com/your-org/kuriq-ai) — FastAPI AI 레이어
