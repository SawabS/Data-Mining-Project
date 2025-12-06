import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const IPAD_BREAKPOINT = 1024;
const TABLET_BREAKPOINT = 1280;
const DESKTOP_BREAKPOINT = 1536;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
export function useIsIpad() {
  const [isIpad, setIsIpad] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${IPAD_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsIpad(window.innerWidth < IPAD_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsIpad(window.innerWidth < IPAD_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isIpad;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(
    undefined
  );
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsTablet(window.innerWidth < TABLET_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsTablet(window.innerWidth < TABLET_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isTablet;
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(
    undefined
  );
  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const onChange = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isDesktop;
}
