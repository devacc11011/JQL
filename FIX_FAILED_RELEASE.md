# 실패한 릴리즈 정리 가이드

GitHub Actions에서 release workflow가 실패했을 때 정리하는 방법입니다.

## 🔍 문제 확인

현재 상황:
- ✅ 커밋 생성됨: `chore: bump version to @jql/json-sql-explorer v1.0.0`
- ❌ git push 실패
- ❌ 태그가 GitHub에 push 안 됨 (또는 잘못된 형식)

## 🧹 로컬 정리

### 1. 현재 상태 확인

```bash
# 로컬 태그 확인
git tag

# 최근 커밋 확인
git log --oneline -5

# 리모트와 비교
git status
```

### 2. 로컬 태그 삭제 (있다면)

```bash
# v1.0.0 태그 삭제
git tag -d v1.0.0

# @jql/json-sql-explorer로 시작하는 모든 태그 확인
git tag | grep jql

# 잘못된 태그 삭제
git tag -d "@jql/json-sql-explorer v1.0.0"  # 공백이 있는 경우
```

### 3. 리모트 태그 삭제 (이미 push된 경우)

```bash
# GitHub의 태그 확인
git ls-remote --tags origin

# 리모트 태그 삭제
git push origin --delete v1.0.0

# 또는 여러 개 한 번에
git push origin --delete v1.0.0 v0.1.0
```

### 4. 잘못된 커밋 되돌리기

**방법 A: 커밋 취소 (권장 - 이미 push되지 않은 경우)**
```bash
# 최근 1개 커밋 취소 (변경사항은 유지)
git reset --soft HEAD~1

# 또는 완전히 제거
git reset --hard HEAD~1
```

**방법 B: Revert (이미 push된 경우)**
```bash
# 커밋 취소하는 새로운 커밋 생성
git revert HEAD

# Push
git push origin main
```

## 🔄 올바른 재시도

### 방법 1: GitHub Actions 다시 실행 (추천)

1. 위에서 태그/커밋 정리 완료
2. GitHub → Actions → Release workflow
3. "Run workflow" 다시 클릭
4. 이번엔 성공할 것입니다!

### 방법 2: 수동으로 태그 생성

```bash
# 1. 버전 업데이트
cd packages/json-sql-explorer
npm version patch  # 또는 minor, major

# 2. 커밋
cd ../..
git add .
git commit -m "chore: release v1.0.0"

# 3. 태그 생성
git tag v1.0.0

# 4. Push (커밋과 태그 모두)
git push origin main
git push origin v1.0.0
```

## 📝 체크리스트

정리 전:
- [ ] 로컬 태그 확인 및 삭제
- [ ] 리모트 태그 확인 및 삭제
- [ ] 잘못된 커밋 되돌리기
- [ ] git status로 깨끗한 상태 확인

재시도 전:
- [ ] GitHub Actions workflow 수정 확인 (이미 수정됨!)
- [ ] NPM_TOKEN 시크릿 설정 확인
- [ ] package.json 버전 확인
- [ ] 테스트 통과 확인 (`npm test`)

## 🚀 수정된 Workflow

이제 workflow가 수정되어 다음 문제들이 해결되었습니다:

✅ **수정 전 문제:**
- git push 명령어에 인자가 너무 많음
- GitHub Output 포맷 오류
- 변수 인용 부호 누락

✅ **수정 후:**
- 단계별로 명령어 분리
- 올바른 변수 인용
- 상세한 로그 출력
- Job Summary 추가

## 💡 팁

### 빠른 정리 명령어

```bash
# 모든 로컬 태그 보기
git tag

# v로 시작하는 로컬 태그만 삭제
git tag -d $(git tag -l "v*")

# 리모트 태그 동기화
git fetch --prune --prune-tags

# 마지막 커밋 취소
git reset --soft HEAD~1
```

### 안전하게 테스트

release workflow를 실행하기 전에:

```bash
# 로컬에서 먼저 테스트
cd packages/json-sql-explorer
npm version patch --no-git-tag-version
echo "v$(node -p "require('./package.json').version")"

# 정상적으로 v1.0.1 같은 형식으로 나오는지 확인
```

## ⚠️ 주의사항

1. **이미 npm에 배포된 버전은 삭제 불가**
   - npm에 한 번 배포된 버전은 영구적
   - 문제가 있으면 새 버전 배포 필요

2. **태그 삭제는 신중하게**
   - 다른 사람이 이미 pull 받았을 수 있음
   - 팀과 협의 후 진행

3. **main 브랜치 보호 규칙**
   - 브랜치 보호가 활성화되어 있으면 force push 불가
   - Settings에서 임시로 해제 필요할 수 있음

## 📞 여전히 문제가 있나요?

1. GitHub Actions 로그 전체 확인
2. package.json의 version 필드 확인
3. NPM_TOKEN 시크릿 재설정
4. workflow 파일 문법 검사: https://www.yamllint.com/

---

**이제 준비 완료!** 다시 release workflow를 실행하세요! 🚀
