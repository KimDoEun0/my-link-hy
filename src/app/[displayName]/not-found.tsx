// 개인 페이지 404: 해당 이름의 유저가 없을 때
// "404 | This page could not be found."
// - 라이트 모드: 흰 배경 + 검정 글씨
// - 다크 모드(기기 설정): 검정 배경 + 흰 글씨
//   (프로젝트의 dark: 변형은 .dark 클래스 기준이라 기기 설정을 직접 확인하는 미디어 쿼리 사용)
export default function PersonalPageNotFound() {
  return (
    <div className="min-h-screen px-4 flex items-center justify-center bg-white text-black [@media(prefers-color-scheme:dark)]:bg-black [@media(prefers-color-scheme:dark)]:text-white">
      <div className="flex items-center">
        <h1 className="pr-6 mr-5 border-r border-black/30 [@media(prefers-color-scheme:dark)]:border-white/30 text-[24px] font-medium leading-[49px]">
          404
        </h1>
        <h2 className="text-[14px] font-normal leading-[49px]">This page could not be found.</h2>
      </div>
    </div>
  );
}
