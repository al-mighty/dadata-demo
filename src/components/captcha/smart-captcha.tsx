'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Props {
  siteKey: string;
  onToken: (token: string) => void;
}

export function SmartCaptcha({ siteKey, onToken }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<number | null>(null);

  const handleSuccess = useCallback((token: string) => {
    onToken(token);
  }, [onToken]);

  useEffect(() => {
    const scriptId = 'yandex-captcha-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://smartcaptcha.yandexcloud.net/captcha.js?render=onload';
      script.async = true;
      document.head.appendChild(script);
    }

    const interval = setInterval(() => {
      if ((window as any).smartCaptcha && containerRef.current && widgetRef.current === null) {
        widgetRef.current = (window as any).smartCaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: handleSuccess,
        });
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [siteKey, handleSuccess]);

  return <div ref={containerRef} />;
}
