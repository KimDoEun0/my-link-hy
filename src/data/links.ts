export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
}

export const links: LinkItem[] = [
  {
    id: "1",
    title: "GitHub 저장소",
    url: "https://github.com",
    description: "개인 프로젝트 및 오픈소스 기여 내역",
  },
  {
    id: "2",
    title: "기술 블로그",
    url: "https://velog.io",
    description: "개발 트러블슈팅과 학습 기록",
  },
  {
    id: "3",
    title: "LinkedIn 프로필",
    url: "https://linkedin.com",
    description: "경력 사항 및 비즈니스 네트워킹",
  },
  {
    id: "4",
    title: "포트폴리오 (Notion)",
    url: "https://notion.so",
    description: "주요 프로젝트 상세 소개서",
  },
  {
    id: "5",
    title: "YouTube 채널",
    url: "https://youtube.com",
    description: "코딩 강의 및 개발 일상 브이로그",
  },
];
