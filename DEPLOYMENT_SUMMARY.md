# GitHub Actions 배포 설정 완료 ✅

npm 자동 배포를 위한 GitHub Actions 워크플로우가 설정되었습니다.

## 📁 생성된 파일

```
.github/
├── workflows/
│   ├── publish.yml      # 태그 push 시 npm 자동 배포
│   ├── test.yml         # PR/Push 시 자동 테스트
│   └── release.yml      # 수동 릴리즈 생성
├── DEPLOYMENT.md        # 상세 배포 가이드
└── QUICKSTART.md        # 빠른 시작 가이드

packages/json-sql-explorer/
└── .npmignore          # npm 배포 시 제외할 파일

루트/
└── .npmignore          # 루트 레벨 제외 파일
```

## 🚀 배포 방법

### 방법 1: GitHub UI 사용 (가장 쉬움)

1. **GitHub 저장소 → Actions 탭**
2. **"Release" 워크플로우 선택**
3. **"Run workflow" 클릭**
4. **버전 타입 선택:**
   - `patch`: 0.1.0 → 0.1.1 (버그 수정)
   - `minor`: 0.1.0 → 0.2.0 (새 기능)
   - `major`: 0.1.0 → 1.0.0 (Breaking changes)
5. **"Run workflow" 버튼 클릭**

→ 자동으로 테스트, 빌드, 버전 업데이트, npm 배포 완료!

### 방법 2: Git 태그 사용

```bash
cd packages/json-sql-explorer
npm version patch        # 버전 업데이트
cd ../..
git push origin main
git push origin --tags   # 태그 push → 자동 배포 시작
```

## ⚙️ 사전 설정 (필수!)

### 1. npm 토큰 생성

1. https://www.npmjs.com 로그인
2. **Settings → Access Tokens**
3. **"Generate New Token" → "Classic Token"**
4. **"Automation" 타입 선택**
5. 토큰 복사 (다시 볼 수 없음!)

### 2. GitHub에 토큰 추가

1. GitHub 저장소 → **Settings**
2. **Secrets and variables → Actions**
3. **"New repository secret"**
4. Name: `NPM_TOKEN`
5. Value: 위에서 복사한 토큰 붙여넣기
6. **"Add secret"** 클릭

### 3. 패키지 이름 변경 (중요!)

충돌 방지를 위해 패키지 이름을 변경하세요:

**packages/json-sql-explorer/package.json:**
```json
{
  "name": "@yourname/json-sql-explorer"
  // 또는
  "name": "your-unique-package-name"
}
```

**apps/demo/package.json:**
```json
{
  "dependencies": {
    "@yourname/json-sql-explorer": "*"
  }
}
```

**README.md 내 모든 예제도 업데이트!**

## 🔄 워크플로우 설명

### `publish.yml` - 자동 배포
- **트리거:** 버전 태그 push (예: `v1.0.0`)
- **동작:**
  1. 코드 체크아웃
  2. 의존성 설치
  3. 테스트 실행
  4. 라이브러리 빌드
  5. **npm에 자동 배포**
  6. GitHub 릴리즈 생성

### `test.yml` - 지속적 통합 (CI)
- **트리거:** main/develop 브랜치에 push 또는 PR
- **동작:**
  1. Node.js 18, 20에서 테스트
  2. Lint 검사
  3. 테스트 실행
  4. 라이브러리 및 데모 앱 빌드

### `release.yml` - 수동 릴리즈
- **트리거:** GitHub Actions UI에서 수동 실행
- **동작:**
  1. 테스트 실행
  2. 빌드
  3. 버전 자동 업데이트
  4. CHANGELOG 업데이트
  5. Git 태그 생성 및 push
  6. publish.yml 자동 트리거

## 📋 배포 체크리스트

배포하기 전에 확인하세요:

- [ ] npm 계정 있음
- [ ] npm 토큰 생성함
- [ ] GitHub Secrets에 `NPM_TOKEN` 추가함
- [ ] 패키지 이름 변경함 (충돌 방지)
- [ ] 로컬 테스트 통과 (`npm test`)
- [ ] 로컬 빌드 성공 (`npm run build`)
- [ ] CHANGELOG.md 업데이트함
- [ ] README.md에 패키지 이름 업데이트함

## 🎯 첫 배포 단계별 가이드

### 1단계: 로컬 테스트
```bash
npm install
npm test
npm run build --workspace=@jql/json-sql-explorer
```

### 2단계: GitHub에 push
```bash
git add .
git commit -m "feat: ready for first release"
git push origin main
```

### 3단계: Actions에서 Release 실행
- GitHub → Actions → Release → Run workflow
- Version type: **patch** 선택
- Run workflow 클릭

### 4단계: 확인
- Actions 탭에서 진행 상황 모니터링
- 완료 후 https://www.npmjs.com/package/YOUR_PACKAGE_NAME 확인

### 5단계: 테스트 설치
```bash
npx create-next-app@latest test-app
cd test-app
npm install YOUR_PACKAGE_NAME
```

## 🔍 트러블슈팅

### "Cannot publish over previously published versions"
이미 해당 버전이 npm에 존재합니다.
```bash
cd packages/json-sql-explorer
npm version patch  # 버전 올리기
git push origin main --tags
```

### "You do not have permission to publish"
- npm 로그인 확인: `npm login`
- 패키지 이름이 이미 사용 중인지 확인
- 스코프 패키지(@yourname/package)의 경우 권한 확인

### Workflow 실패
1. Actions 탭에서 로그 확인
2. `NPM_TOKEN` 시크릿이 올바른지 확인
3. 토큰이 만료되지 않았는지 확인
4. 토큰 타입이 "Automation"인지 확인

## 📚 더 알아보기

- [빠른 시작 가이드](.github/QUICKSTART.md) - 처음 사용자용 단계별 가이드
- [상세 배포 가이드](.github/DEPLOYMENT.md) - 모든 배포 옵션 설명
- [메인 README](README.md) - 프로젝트 전체 문서

## 🎉 다음 단계

배포 후:
1. npm 페이지에서 패키지 확인
2. 실제 프로젝트에서 설치 테스트
3. 사용자 피드백 수집
4. 버그 수정 및 기능 추가
5. 정기적인 업데이트 배포

---

**준비 완료!** 이제 GitHub Actions로 npm 배포를 자동화할 수 있습니다. 🚀
