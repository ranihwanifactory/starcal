import { MonthData } from './types';

export const CALENDAR_DATA: MonthData[] = [
  {
    month: 1,
    monthName: "1월",
    season: "Winter",
    objects: [
      { id: "orion", name: "오리온자리", type: "Constellation", description: "겨울철 밤하늘의 왕, 베텔게우스와 리겔이 빛나는 별자리", imagePlaceholder: "https://picsum.photos/400/300?grayscale" },
      { id: "taurus", name: "황소자리", type: "Constellation", description: "붉은 별 알데바란과 플레이아데스 성단을 품은 별자리", imagePlaceholder: "https://picsum.photos/400/301?grayscale" }
    ]
  },
  {
    month: 2,
    monthName: "2월",
    season: "Winter",
    objects: [
      { id: "gemini", name: "쌍둥이자리", type: "Constellation", description: "카스토르와 폴룩스, 두 형제의 우애가 빛나는 별자리", imagePlaceholder: "https://picsum.photos/400/302?grayscale" },
      { id: "canis_major", name: "큰개자리", type: "Constellation", description: "밤하늘에서 가장 밝은 별 시리우스가 있는 별자리", imagePlaceholder: "https://picsum.photos/400/303?grayscale" }
    ]
  },
  {
    month: 3,
    monthName: "3월",
    season: "Spring",
    objects: [
      { id: "cancer", name: "게자리", type: "Constellation", description: "희미하지만 프레세페 성단을 품고 있는 봄의 전령", imagePlaceholder: "https://picsum.photos/400/304?grayscale" },
      { id: "leo", name: "사자자리", type: "Constellation", description: "봄철 밤하늘의 제왕, 레굴루스가 빛나는 별자리", imagePlaceholder: "https://picsum.photos/400/305?grayscale" }
    ]
  },
  {
    month: 4,
    monthName: "4월",
    season: "Spring",
    objects: [
      { id: "virgo", name: "처녀자리", type: "Constellation", description: "봄의 대곡선을 이루는 스피카가 있는 거대한 별자리", imagePlaceholder: "https://picsum.photos/400/306?grayscale" },
      { id: "ursa_major", name: "북두칠성(큰곰)", type: "Constellation", description: "북쪽 하늘의 길잡이, 1년 내내 볼 수 있는 별자리", imagePlaceholder: "https://picsum.photos/400/307?grayscale" }
    ]
  },
  {
    month: 5,
    monthName: "5월",
    season: "Spring",
    objects: [
      { id: "bootes", name: "목동자리", type: "Constellation", description: "주황색 거성 아크투루스가 밝게 빛나는 별자리", imagePlaceholder: "https://picsum.photos/400/308?grayscale" },
      { id: "coma_berenices", name: "머리털자리", type: "Constellation", description: "수많은 은하들이 모여 있는 은하단의 고향", imagePlaceholder: "https://picsum.photos/400/309?grayscale" }
    ]
  },
  {
    month: 6,
    monthName: "6월",
    season: "Summer",
    objects: [
      { id: "hercules", name: "헤라클레스자리", type: "Constellation", description: "M13 구상성단이 숨어 있는 영웅의 별자리", imagePlaceholder: "https://picsum.photos/400/310?grayscale" },
      { id: "libra", name: "천칭자리", type: "Constellation", description: "황도 12궁 중 하나로 정의를 상징하는 별자리", imagePlaceholder: "https://picsum.photos/400/311?grayscale" }
    ]
  },
  {
    month: 7,
    monthName: "7월",
    season: "Summer",
    objects: [
      { id: "scorpius", name: "전갈자리", type: "Constellation", description: "여름철 남쪽 하늘의 S라인, 붉은 심장 안타레스", imagePlaceholder: "https://picsum.photos/400/312?grayscale" },
      { id: "ophiuchus", name: "땅꾼자리", type: "Constellation", description: "전갈을 밟고 뱀을 쥐고 있는 의술의 신", imagePlaceholder: "https://picsum.photos/400/313?grayscale" }
    ]
  },
  {
    month: 8,
    monthName: "8월",
    season: "Summer",
    objects: [
      { id: "cygnus", name: "백조자리", type: "Constellation", description: "은하수 위를 나는 백조, 데네브와 알비레오", imagePlaceholder: "https://picsum.photos/400/314?grayscale" },
      { id: "lyra", name: "거문고자리", type: "Constellation", description: "여름의 대삼각형을 이루는 직녀성 베가가 있는 곳", imagePlaceholder: "https://picsum.photos/400/315?grayscale" }
    ]
  },
  {
    month: 9,
    monthName: "9월",
    season: "Autumn",
    objects: [
      { id: "pegasus", name: "페가수스자리", type: "Constellation", description: "가을의 대사각형을 이루는 천마의 별자리", imagePlaceholder: "https://picsum.photos/400/316?grayscale" },
      { id: "aquarius", name: "물병자리", type: "Constellation", description: "가을 밤하늘의 넓은 영역을 차지하는 별자리", imagePlaceholder: "https://picsum.photos/400/317?grayscale" }
    ]
  },
  {
    month: 10,
    monthName: "10월",
    season: "Autumn",
    objects: [
      { id: "andromeda", name: "안드로메다자리", type: "Constellation", description: "우리 은하의 이웃, 안드로메다 은하를 볼 수 있는 곳", imagePlaceholder: "https://picsum.photos/400/318?grayscale" },
      { id: "cassiopeia", name: "카시오페이아", type: "Constellation", description: "W자 모양으로 북극성을 찾는 길잡이", imagePlaceholder: "https://picsum.photos/400/319?grayscale" }
    ]
  },
  {
    month: 11,
    monthName: "11월",
    season: "Autumn",
    objects: [
      { id: "pisces", name: "물고기자리", type: "Constellation", description: "두 마리 물고기가 끈으로 묶인 모습의 별자리", imagePlaceholder: "https://picsum.photos/400/320?grayscale" },
      { id: "perseus", name: "페르세우스자리", type: "Constellation", description: "이중성단과 변광성 알골이 유명한 영웅의 별자리", imagePlaceholder: "https://picsum.photos/400/321?grayscale" }
    ]
  },
  {
    month: 12,
    monthName: "12월",
    season: "Winter",
    objects: [
      { id: "auriga", name: "마차부자리", type: "Constellation", description: "오각형 모양과 밝은 별 카펠라가 특징", imagePlaceholder: "https://picsum.photos/400/322?grayscale" },
      { id: "pleiades", name: "플레이아데스", type: "Cluster", description: "맨눈으로도 볼 수 있는 아름다운 산개성단 (좀생이별)", imagePlaceholder: "https://picsum.photos/400/323?grayscale" }
    ]
  }
];
