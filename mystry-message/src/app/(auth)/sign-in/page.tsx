"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceValue } from "usehooks-ts";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [issubmitting,setissubmitting]=useState(false)

  return (
    <div>page</div>
  );
};

export default Page;