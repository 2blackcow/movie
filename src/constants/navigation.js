import { IoHome } from "react-icons/io5";
import { MdLiveTv } from "react-icons/md";
import { TbMovie } from "react-icons/tb";
import { MdOutlineSearch } from "react-icons/md";

export const navigation = [

    { label: "TV Shows", href: "tv", icon:<MdLiveTv/> },
    { label: "Movies", href: "movie", icon:<TbMovie/> },
  ];
  
  export const mobileNavigation = [{
    label : "Home",
    href : "/",
    icon : <IoHome/>
  },
    ...navigation,
    {
        label : "search",
        href : "/search",
        icon : <MdOutlineSearch/>
    }
  ]
