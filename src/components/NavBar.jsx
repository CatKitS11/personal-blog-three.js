import React from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VectorIcon from "../assets/Vector.png";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Logo */}
      <a
        href="/"
        className="text-2xl font-bold text-gray-800 mx-16 max-md:mx-2"
      >
        hh.
      </a>

      {/* Navigation Buttons */}
      <div className="flex max-xs:hidden items-center gap-4 mx-16">
        <Link to="/login">
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-50 rounded-full"
          >
            Log in
          </Button>
        </Link>
        <Link to="/signup">
          <Button className="bg-gray-800 text-white hover:bg-gray-700 rounded-full">
            Sign up
          </Button>
        </Link>
      </div>
      <div className="hidden max-xs:block">
        <Select onValueChange={(v) => v === "signup" && navigate("/signup")}>
          <SelectTrigger className="w-[40px] [&>svg]:hidden border-none">
            <SelectValue
              placeholder={
                <img src={VectorIcon} alt="Menu" className="w-6 h-3" />
              }
            />
          </SelectTrigger>
          <SelectContent className="flex flex-col gap-6 bg-white w-80 border-none shadow-none">
            <SelectItem value="login" className="justify-center">
              Log in
            </SelectItem>
            <SelectItem value="signup" className="justify-center">
              Sign up
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
};

export default NavBar;
