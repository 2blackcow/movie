import { IoHome } from "react-icons/io5";
import { MdLocalFireDepartment, MdFavorite, MdSearch } from "react-icons/md";

export const navigation = [
  {
    label: "홈",
    href: "/",  // 루트 경로 유지
    icon: <IoHome size={20} />
  },
  {
    label: "대세 콘텐츠",
    href: "/popular",
    icon: <MdLocalFireDepartment size={20} />
  },
  {
    label: "찜한 리스트",
    href: "/wishlist",
    icon: <MdFavorite size={20} />
  },
  {
    label: "찾아보기",
    href: "/browse",
    icon: <MdSearch size={20} />
  }
];

export const mobileNavigation = [
  ...navigation
];