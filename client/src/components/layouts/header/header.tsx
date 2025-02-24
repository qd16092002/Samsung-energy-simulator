import Typography from "@/lib/typography";
import { FontFamily, FontSize, TextColor } from "@/enum/setting";
import { useEffect, useState } from "react";
import storage from "@/services/storage";
import Image from "next/image";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

export default function Header() {
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("/vietnam.png");
  const router = useRouter();

  // Lấy thông tin người dùng
  const fetchUserInfo = () => {
    const userInfo = storage.getUserInfo();
    setUserName(userInfo?.username || "Guest");
    switch (userInfo?.national?.national) {
      case "VN":
        setAvatar("/vietnam.svg");
        break;
      case "THA":
        setAvatar("/thailand.svg");
        break;
      case "IND":
        setAvatar("/india.svg");
        break;
    }
  };

  // Xử lý logout
  const handleLogout = async () => {
    try {
      await api.post("auth/logout");
      storage.clearStorage();
      const locale = Cookie.get("NEXT_LOCALE") || "vi";
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="z-10 md:fixed md:left-0 md:top-0 md:h-screen md:bg-white flex flex-row md:w-[80px]">
      <div className="flex-1 flex flex-row md:flex-col md:items-center justify-between p-5 md:px-[12px]">
        <div className="flex flex-row md:flex-col md:w-[40px] items-center">
          <Image
            className="w-[30px] h-[20px]"
            alt="Logo"
            src={avatar}
            priority
            width={30}
            height={20}
            style={{
              borderRadius: "50%",
            }}
          />
          <Typography
            fontSize={FontSize.SM}
            fontFamily={FontFamily.MEDIUM}
            textColor="#333333"
            className="ml-[6px] md:ml-0 mt-0 md:mt-3 text-ellipsis"
          >
            {userName}
          </Typography>
        </div>
        <Image
          className="size-[24px] cursor-pointer"
          alt="Avatar"
          src="/log-out.svg"
          height={40}
          width={40}
          priority
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}
