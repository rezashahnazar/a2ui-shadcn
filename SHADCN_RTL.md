---
title: January 2026 - RTL Support
description: The shadcn CLI now supports RTL (right-to-left) layouts by automatically converting physical CSS classes to logical equivalents.
date: 2026-01-28
---

shadcn/ui now has first-class support for right-to-left (RTL) layouts. Your components automatically adapt for languages like Arabic, Hebrew, and Persian.

**This works with the [shadcn/ui components](/docs/components) as well as any component distributed on the shadcn registry.**

```tsx
"use client"

import * as React from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/examples/base/ui-rtl/alert"
import { CheckCircle2Icon, InfoIcon } from "lucide-react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      paymentTitle: "Payment successful",
      paymentDescription:
        "Your payment of $29.99 has been processed. A receipt has been sent to your email address.",
      featureTitle: "New feature available",
      featureDescription:
        "We've added dark mode support. You can enable it in your account settings.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      paymentTitle: "تم الدفع بنجاح",
      paymentDescription:
        "تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك الإلكتروني.",
      featureTitle: "ميزة جديدة متاحة",
      featureDescription:
        "لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      paymentTitle: "התשלום בוצע בהצלחה",
      paymentDescription:
        "התשלום שלך בסך 29.99 דולר עובד. קבלה נשלחה לכתובת האימייל שלך.",
      featureTitle: "תכונה חדשה זמינה",
      featureDescription:
        "הוספנו תמיכה במצב כהה. אתה יכול להפעיל אותו בהגדרות החשבון שלך.",
    },
  },
}

const alerts = [
  {
    icon: CheckCircle2Icon,
    titleKey: "paymentTitle" as const,
    descriptionKey: "paymentDescription" as const,
  },
  {
    icon: InfoIcon,
    titleKey: "featureTitle" as const,
    descriptionKey: "featureDescription" as const,
  },
] as const

export function AlertRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="grid w-full max-w-md items-start gap-4" dir={dir}>
      {alerts.map((alert, index) => {
        const Icon = alert.icon
        return (
          <Alert key={index}>
            <Icon />
            <AlertTitle>{t[alert.titleKey]}</AlertTitle>
            <AlertDescription>{t[alert.descriptionKey]}</AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}

```

### Our approach to RTL

Traditionally, component libraries that support RTL ship with logical classes baked in. This means everyone has to work with classes like `ms-4` and `start-2`, even if they're only building for LTR layouts.

We took a different approach. The shadcn CLI transforms classes at install time, so you only see logical classes when you actually need them. If you're not building for RTL, you work with familiar classes like `ml-4` and `left-2`. When you enable RTL, the CLI handles the conversion for you.

**You don't have to learn RTL until you need it.**

### How it works

When you add components with `rtl: true` set in your `components.json`, the CLI automatically converts physical CSS classes like `ml-4` and `text-left` to their logical equivalents like `ms-4` and `text-start`.

- Physical positioning classes like `left-*` and `right-*` become `start-*` and `end-*`.
- Margin and padding classes like `ml-*` and `pr-*` become `ms-*` and `pe-*`.
- Text alignment classes like `text-left` become `text-start`.
- Directional props are updated to use logical values.
- Supported icons are automatically flipped using `rtl:rotate-180`.
- Animations like `slide-in-from-left` become `slide-in-from-start`.

### RTL examples for every component

We've added RTL examples for every component. You'll find live previews and code on each [component page](/docs/components).

```tsx
"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui-rtl/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/examples/base/ui-rtl/card"
import { Input } from "@/examples/base/ui-rtl/input"
import { Label } from "@/examples/base/ui-rtl/label"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Login to your account",
      description: "Enter your email below to login to your account",
      signUp: "Sign Up",
      email: "Email",
      emailPlaceholder: "m@example.com",
      password: "Password",
      forgotPassword: "Forgot your password?",
      login: "Login",
      loginWithGoogle: "Login with Google",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "تسجيل الدخول إلى حسابك",
      description: "أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك",
      signUp: "إنشاء حساب",
      email: "البريد الإلكتروني",
      emailPlaceholder: "m@example.com",
      password: "كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      login: "تسجيل الدخول",
      loginWithGoogle: "تسجيل الدخول باستخدام Google",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "התחבר לחשבון שלך",
      description: "הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך",
      signUp: "הירשם",
      email: "אימייל",
      emailPlaceholder: "m@example.com",
      password: "סיסמה",
      forgotPassword: "שכחת את הסיסמה?",
      login: "התחבר",
      loginWithGoogle: "התחבר עם Google",
    },
  },
}

export function CardRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Card className="w-full max-w-sm" dir={dir}>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
        <CardAction>
          <Button variant="link">{t.signUp}</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email-rtl">{t.email}</Label>
              <Input
                id="email-rtl"
                type="email"
                placeholder={t.emailPlaceholder}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password-rtl">{t.password}</Label>
                <a
                  href="#"
                  className="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  {t.forgotPassword}
                </a>
              </div>
              <Input id="password-rtl" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          {t.login}
        </Button>
        <Button variant="outline" className="w-full">
          {t.loginWithGoogle}
        </Button>
      </CardFooter>
    </Card>
  )
}

```

### CLI updates

**New projects**: Use the `--rtl` flag with `init` or `create` to enable RTL from the start.

```bash
npx shadcn@latest init --rtl
```

```bash
npx shadcn@latest create --rtl
```

**Existing projects**: Migrate your components with the `migrate rtl` command.

```bash
npx shadcn@latest migrate rtl
```

This transforms all components in your `ui` directory to use logical classes. You can also pass a specific path or glob pattern.

## Try it out

Click the link below to open a Next.js project with RTL support in v0.

[![Open in v0](https://v0.app/chat-static/button.svg)](https://v0.app/chat/api/open?url=https://github.com/shadcn-ui/next-template-rtl)

### Links

- [RTL Documentation](/docs/rtl)
- [Font Recommendations](/docs/rtl#font-recommendations)
- [Animations](/docs/rtl#animations)
- [Migrating Existing Components](/docs/rtl#migrating-existing-components)
- [Next.js Setup](/docs/rtl/next)
- [Vite Setup](/docs/rtl/vite)
- [TanStack Start Setup](/docs/rtl/start)