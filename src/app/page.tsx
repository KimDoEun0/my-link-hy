export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-zinc-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg transition-all dark:bg-zinc-800 dark:shadow-zinc-950/50 text-center">
        {/* 프로필 이미지 / 아바타 */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner dark:bg-blue-900/40 dark:text-blue-300">
          <span className="text-3xl font-bold">홍</span>
        </div>

        {/* 프로필 정보 */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            홍길동
          </h1>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            주니어 소프트웨어 개발자
          </p>
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed pt-2">
            안녕하세요! 코드로 아이디어를 현실로 구현하며 성장하는 개발자입니다. 지속적인 학습을 통해 더 나은 사용자 경험과 가치 있는 서비스를 만들어갑니다.
          </p>
        </div>
      </div>
    </div>
  );
}

