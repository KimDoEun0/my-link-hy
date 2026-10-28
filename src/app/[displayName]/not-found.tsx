import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// 개인 페이지 404: 해당 이름의 유저가 없을 때
export default function PersonalPageNotFound() {
  return (
    <div className="min-h-screen bg-white px-4 flex flex-col items-center justify-center text-center">
      <p className="text-[48px] font-extrabold tracking-tight text-[#191F28]">404</p>
      <h1 className="mt-2 text-[20px] font-bold text-[#191F28]">페이지를 찾을 수 없어요</h1>
      <p className="mt-2 text-[15px] text-[#4E5968] break-keep">
        주소의 이름을 가진 사용자가 없어요.
        <br />
        이름이 바뀌었거나 잘못 입력된 주소일 수 있어요.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-6" })}>
        MyLink 홈으로
      </Link>
    </div>
  );
}
