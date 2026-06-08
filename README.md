# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 🚀 주요 기능

### 노트 에디터
- 마크다운 기반 노트 작성
- 3 초 자동 저장
- AI 노트 정리 (키워드 추출, 구조화 요약, 학습 제안)
- 노트 기반 퀴즈 생성 및 채점
- RAG 기반 AI 채팅 (노트 내용 참조)

### 강좌 검색
- chromaDB 벡터 검색 연동
- 플랫폼, 카테고리, 난이도 필터
- 자연어 검색 지원

### 로드맵 생성
- AI 기반 학습 로드맵 생성
- chromaDB 에서 강좌 추천
- 주별 학습 계획 자동 구성
