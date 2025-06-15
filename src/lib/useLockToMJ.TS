"use client";
import { useEffect } from "react";

export function useLockToMJ() {
  useEffect(() => {
    const allowedHosts = ["localhost", "127.0.0.1"];
    if (
      typeof window !== "undefined" &&
      !allowedHosts.includes(window.location.hostname)
    ) {
      window.location.href = "/acces-refuse";
    }
  }, []);
}
