import { IoHome } from "react-icons/io5";
import { MdOutlineSearch, MdLocalFireDepartment, MdFavorite, MdSearch } from "react-icons/md";

// 헤더에 표시될 메인 네비게이션
export const navigation = [
  {
    label: "홈",
    href: "/",
    icon: <IoHome size={20} />
  },
  {
    label: "대세 콘텐츠",
    href: "/trending",
    icon: <MdLocalFireDepartment size={20} />  // MdTrending 대신 MdLocalFireDepartment 사용
  },
  {
    label: "찜한 리스트",
    href: "/my-list",
    icon: <MdFavorite size={20} />
  },

  {
    label: "찾아보기",
    href: "/browse",
    icon: <MdSearch size={20} />
  }
];

// 모바일 하단 네비게이션
export const mobileNavigation = [
  ...navigation,
  {
    label: "검색",
    href: "/search",
    icon: <MdOutlineSearch size={20} />
  }
];