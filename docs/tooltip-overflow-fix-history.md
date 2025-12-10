# 효율 그래프 툴팁 overflow 해결 히스토리

## 문제 상황

효율 그래프에서 툴팁이 컨테이너 밖으로 나갈 때 잘리는 문제 발생

- 상단으로 펼쳐지는 툴팁이 위쪽에서 잘림
- 좌우 양 끝 바의 툴팁이 옆으로 잘림
- 가로 스크롤과 세로 overflow를 동시에 처리해야 하는 상황

## 시도한 해결 방법들

### 1차 시도: `overflow: visible` 적용

```scss
.graphContainer {
  overflow: visible;
}
.chartArea {
  overflow: visible;
}
```

**결과**: 가로 스크롤이 필요할 때 그래프가 컨테이너를 벗어남 ❌

### 2차 시도: `overflow-x: auto`, `overflow-y: visible` 분리

```scss
.graphContainer {
  overflow-x: auto;
  overflow-y: visible;
}
```

**결과**: 브라우저가 자동으로 두 속성을 모두 `auto`로 변경해버려서 툴팁 여전히 잘림 ❌
(CSS 명세상 `overflow-x`와 `overflow-y`를 다르게 설정하면 `visible`이 `auto`로 변환됨)

### 3차 시도: 툴팁을 `.bar` 위에서 펼치기

```scss
.tooltip {
  bottom: calc(100% + 10px); // 바 위에서 펼침
}
```

**결과**: 높은 바에서 툴팁이 스크롤 영역 밖으로 나가서 잘림 ❌

### 4차 시도: 툴팁을 `.bar` 안에서 아래로 펼치기

```scss
.tooltip {
  top: 100%;
  margin-top: 10px;
}
```

**결과**: 바 높이마다 툴팁 위치가 달라져서 일관성 없음 ❌

### 5차 시도: 툴팁을 `.bar` 밖으로 이동

**HTML 구조 변경**: 툴팁을 `.bar` 자식에서 `.barWrapper` 직접 자식으로 이동

```tsx
<div className={styles.barWrapper}>
  <div className={styles.bar} />
  <div className={styles.tooltip}>...</div> {/* bar 밖으로 이동 */}
</div>
```

```scss
.tooltip {
  bottom: 50px; // barWrapper 기준, 라벨 위에서 시작
}
```

**결과**: 모든 바에서 같은 위치에서 툴팁 시작 ✅, 하지만 좌우 끝에서 잘림 ❌

---

## 최종 해결책: padding + negative margin 조합

```scss
.scrollWrapper {
  overflow-x: auto; // 가로 스크롤
  padding-top: 250px; // 툴팁 상단 공간
  padding-bottom: 50px; // 라벨 하단 공간
  padding-left: 120px; // 왼쪽 툴팁 잘림 방지
  padding-right: 120px; // 오른쪽 툴팁 잘림 방지
  margin-top: -230px; // 상단 공간 시각적 제거
  margin-left: -120px; // 좌우 패딩 시각적 보정
  margin-right: -120px;
}

.tooltip {
  position: absolute;
  bottom: 50px; // barWrapper 맨 아래 (라벨 높이만큼 위)에서 시작
  left: 50%;
  transform: translateX(-50%);
}
```

**결과**:

- ✅ 툴팁이 스크롤 영역 내부에 위치하여 상하 잘림 없음
- ✅ 좌우 패딩으로 양 끝 툴팁 잘림 방지
- ✅ negative margin으로 시각적 레이아웃 정상 유지
- ✅ 가로 스크롤 정상 작동
- ✅ 모든 바에서 일관된 툴팁 위치

## 핵심 교훈

1. `overflow-x`와 `overflow-y`를 다르게 설정하는 것은 CSS에서 불가능
2. padding + negative margin 조합으로 overflow 영역을 확장하면서 시각적으로는 원래 크기 유지 가능
3. 동적 높이 요소(바) 안에 툴팁을 넣으면 위치가 불안정해지므로, 고정 높이 부모에 배치하는 것이 좋음
