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
      script.src = 'https://smartcaptcha.yandexcloud.net/captcha.js';
      script.async = true;
      script.onload = () => console.log('[SmartCaptcha] Script loaded');
      script.onerror = (e) => console.error('[SmartCaptcha] Script failed to load', e);
      document.head.appendChild(script);
    }

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const sc = (window as any).smartCaptcha;
      if (sc && containerRef.current && widgetRef.current === null) {
        try {
          widgetRef.current = sc.render(containerRef.current, {
            sitekey: siteKey,
            callback: handleSuccess,
          });
          console.log('[SmartCaptcha] Rendered, widget:', widgetRef.current);
        } catch (e) {
          console.error('[SmartCaptcha] Render error:', e);
        }
        clearInterval(interval);
      }
      if (attempts > 50) {
        console.error('[SmartCaptcha] Timeout - window.smartCaptcha not available');
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [siteKey, handleSuccess]);

  if (!siteKey) {
    return <div className="text-xs text-red-400 p-3 bg-red-500/10 rounded-lg">SmartCaptcha: ключ не задан (NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY)</div>;
  }

  return <div ref={containerRef} className="min-h-[100px]" />;
}
