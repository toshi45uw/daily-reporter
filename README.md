# 日報アシスタント

Google Workspaceの情報をもとに日報ドラフトを3ステップで作成するWebアプリです。

## 機能

- Googleアカウントでログイン
- 今日のGoogleカレンダー予定を取得・表示
- 活動カードを日報に含める/除外する選択
- 各カードに補足メモを入力
- 手動で活動カードを追加
- 日報ドラフトの自動生成
- ネクストアクション・業務効率化ヒントの表示
- 日報をクリップボードにコピー
- モックデータでのUI確認（Google APIなしでも動作）

---

## セットアップ

### 1. Google Cloud Console でプロジェクトを作成する

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 画面上部の「プロジェクトを選択」→「新しいプロジェクト」をクリック
3. プロジェクト名を入力して「作成」

### 2. Google Calendar API を有効化する

1. 左メニュー「APIとサービス」→「ライブラリ」を開く
2. 検索ボックスに `Google Calendar API` と入力
3. 「Google Calendar API」をクリックして「有効にする」

### 3. OAuth 同意画面を設定する

1. 左メニュー「APIとサービス」→「OAuth同意画面」を開く
2. ユーザーの種類は「外部」を選択して「作成」
3. 必須項目（アプリ名、サポートメールアドレス、デベロッパーの連絡先）を入力して保存
4. 「スコープ」タブで以下を追加:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/calendar.readonly`
5. 「テストユーザー」タブで自分のGoogleアカウントのメールアドレスを追加

> **注意**: 本番公開する場合は「アプリを確認」の申請が必要です。開発中はテストユーザーに追加したアカウントのみ利用できます。

### 4. OAuth クライアント ID を作成する

1. 左メニュー「APIとサービス」→「認証情報」を開く
2. 「認証情報を作成」→「OAuth クライアント ID」をクリック
3. アプリケーションの種類: **ウェブアプリケーション**
4. 名前を入力（例: `日報アシスタント開発`）

### 5. 承認済みリダイレクト URI を設定する

「承認済みのリダイレクト URI」に以下を追加:

```
http://localhost:3000/api/auth/callback/google
```

本番環境にデプロイする場合は、本番ドメインのURIも追加してください。

「作成」ボタンを押すと、**クライアントID** と **クライアントシークレット**が表示されます。コピーして控えておいてください。

### 6. `.env.local` に認証情報を設定する

プロジェクトルートに `.env.local` ファイルを作成します:

```bash
cp .env.local.example .env.local
```

`.env.local` を編集して値を入力します:

```env
GOOGLE_CLIENT_ID=取得したクライアントID
GOOGLE_CLIENT_SECRET=取得したクライアントシークレット
NEXTAUTH_SECRET=ランダムな秘密鍵
NEXTAUTH_URL=http://localhost:3000
```

`NEXTAUTH_SECRET` は以下のコマンドで生成できます:

```bash
openssl rand -base64 32
```

> **注意**: `.env.local` は `.gitignore` に含まれており、Gitにコミットされません。

### 7. 依存パッケージをインストールして開発サーバーを起動する

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### 8. Googleログインしてカレンダー予定取得を確認する

1. ホーム画面で「Googleでログイン」をクリック
2. Googleアカウントを選択し、カレンダー読み取り権限を許可
3. ホーム画面に戻り「Google Calendarから取得」をクリック
4. 今日のカレンダー予定がActivityCardとして表示されることを確認

---

## 環境変数一覧

| 変数名 | 説明 |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth クライアントID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth クライアントシークレット |
| `NEXTAUTH_SECRET` | NextAuth.js のセッション署名用シークレット |
| `NEXTAUTH_URL` | アプリのベースURL（本番では実際のURLに変更） |

---

## 技術スタック

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **NextAuth.js v4** (Google OAuth)
- **googleapis** (Google Calendar API)
- **Zustand** (状態管理)

## ディレクトリ構成

```
daily-reporter/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth ハンドラ
│   │   └── google/calendar/route.ts      # Calendar API エンドポイント
│   ├── activities/page.tsx               # Step 2: 活動カード確認
│   ├── report/page.tsx                   # Step 3: 日報プレビュー
│   ├── layout.tsx
│   └── page.tsx                          # Step 1: ホーム
├── components/
│   ├── ActivityCardItem.tsx
│   ├── LoginButton.tsx
│   ├── ManualCardForm.tsx
│   ├── Providers.tsx
│   ├── ReportPreview.tsx
│   └── StepIndicator.tsx
├── lib/
│   ├── auth.ts                           # NextAuth 設定
│   ├── google/
│   │   └── calendar.ts                   # Calendar API 取得・変換
│   ├── ai-generator.ts                   # AI生成抽象層（モック）
│   ├── google-workspace.ts               # Workspace抽象層（モック）
│   ├── mock-data.ts
│   └── types.ts
├── store/
│   └── report-store.ts                   # Zustand グローバルストア
└── types/
    └── next-auth.d.ts                    # NextAuth 型拡張
```

## 今後の実装予定

- Gmail API 連携（送受信メールの件名取得）
- Google Drive API 連携（編集ファイルの取得）
- AI API 連携（Claude による日報文章生成）
- Firestore によるデータ保存
