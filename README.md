# 게임 소식 알림 신청 — 배포 가이드

마감이 오늘 오후 6시라 최대한 빠르게 끝낼 수 있는 순서로 적었습니다. 순서대로만 따라가면 됩니다.

## 1. Supabase 프로젝트 만들기 (5분)

1. https://supabase.com 에서 무료 계정으로 로그인, "New project" 생성
2. 왼쪽 메뉴 **SQL Editor** 클릭 → `supabase.sql` 파일 내용을 통째로 붙여넣고 실행(Run)
3. 왼쪽 메뉴 **Project Settings > API** 로 이동
   - `Project URL` 복사 → 이게 `SUPABASE_URL`
   - `service_role` 키 복사 → 이게 `SUPABASE_SERVICE_ROLE_KEY` (⚠️ anon 키 아님, service_role 키입니다. 이건 절대 클라이언트 코드에 넣으면 안 되고, 여기서는 Vercel 환경변수로만 씁니다.)

## 2. GitHub에 올리기

이 폴더를 새 GitHub 저장소로 push 하세요. (`.env`는 `.gitignore`에 있어서 실수로 올라가지 않습니다.)

```
git init
git add .
git commit -m "lunaby signup landing"
git branch -M main
git remote add origin <새로 만든 저장소 주소>
git push -u origin main
```

## 3. Vercel에 배포하기 (5분)

1. https://vercel.com 에서 GitHub 로그인 → "Add New Project" → 방금 만든 저장소 선택 → Import
2. Framework Preset은 "Other"로 두고, 빌드 설정은 건드리지 않아도 됩니다(정적 파일 + `/api` 함수 자동 인식)
3. **Environment Variables**에 아래 3개를 등록:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD` (어드민 페이지 비밀번호, 직접 정하기)
4. Deploy 클릭 → 끝나면 `https://프로젝트이름.vercel.app` 같은 주소가 나옵니다.

## 4. GA4 연결하기 (5분)

1. https://analytics.google.com 에서 새 속성(GA4) 만들기 → 웹 데이터 스트림 추가 → 배포한 Vercel 주소 입력
2. 발급된 **측정 ID**(`G-`로 시작) 복사
3. `index.html` 파일에서 `GA_MEASUREMENT_ID`라는 문자열 2곳을 이 측정 ID로 바꿔서 다시 배포(git push)
4. GA 왼쪽 메뉴 "보고서 > 실시간"에서 방문이 잡히는지 확인

## 5. 확인하기

- 배포된 주소로 접속 → 이메일 넣고 신청 → "등록 완료" 화면 뜨는지 확인
- `/admin` 경로(예: `https://프로젝트이름.vercel.app/admin.html`)로 접속 → 3번에서 정한 `ADMIN_PASSWORD` 입력 → 방금 신청한 게 명단에 뜨는지 확인
- 어드민 페이지 상단 **UTM 빌더**에서 기본 URL(배포 주소)을 넣고 `source`(예: threads), `medium`(예: social), `campaign`을 채워서 링크 생성 → "숏튼 만들기"로 짧은 링크까지 확인
- 그 짧은 링크를 실제로 스레드에 올려서 홍보

## 보안 체크리스트 관련 메모 (01-4용)

- 수집 항목(이메일, UTM, 리퍼러)과 랜딩페이지 안내 문구가 일치하도록 되어 있습니다.
- 어드민은 비밀번호 없이는 아무 데이터도 못 봅니다(서버 함수에서 비밀번호 검증 후에만 조회).
- Supabase 키(`service_role`)는 Vercel 환경변수에만 있고, 어떤 코드 파일에도, GitHub에도 올라가지 않습니다.
- Supabase RLS가 켜져 있고, 별도 정책을 만들지 않았기 때문에 `anon` 키로는 읽기·쓰기 모두 불가능합니다(서버의 `service_role` 키만 우회 접근 가능).
- 개인정보 동의(필수)와 마케팅 수신 동의(선택) 체크박스가 분리되어 있습니다.
