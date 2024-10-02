# CardCheckR

CardCheckR は、クレジットカードや ID カードを画像から処理し、Google Cloud Vision API を使用して情報を抽出する Web アプリケーションです。アプリはフロントエンドとバックエンドの 2 つの部分から構成されており、それぞれのセットアップ方法や使用方法について説明します。

## プロジェクト構成

- **frontend**: React ベースのユーザーインターフェース。
- **backend**: Node.js と Express で構築された API サーバー。Google Cloud Vision API を使用してカードの情報を抽出します。

---

## 目次

- [必要要件](#必要要件)
- [セットアップ](#セットアップ)
  - [フロントエンドのセットアップ](#フロントエンドのセットアップ)
  - [バックエンドのセットアップ](#バックエンドのセットアップ)
- [環境変数の設定](#環境変数の設定)
- [使用方法](#使用方法)
- [ライセンス](#ライセンス)

---

## 必要要件

このプロジェクトを動作させるには、以下が必要です。

- [Node.js](https://nodejs.org/)（推奨バージョン: 14.x またはそれ以上）
- Google Cloud Vision API のサービスアカウントキー（`service-account-key.json`）

---

## セットアップ

### フロントエンドのセットアップ

1. **フロントエンドのディレクトリに移動**

   ```bash
   cd frontend
   ```

2. **依存関係をインストール**

   ```bash
   npm install
   ```

3. **フロントエンドサーバーを起動**

   ```bash
   npm start
   ```

   フロントエンドは通常、`http://localhost:3000` で起動されます。

### バックエンドのセットアップ

1. **バックエンドのディレクトリに移動**

   ```bash
   cd backend
   ```

2. **依存関係をインストール**

   ```bash
   npm install
   ```

3. **Google Cloud Vision API のサービスアカウントキーを配置**

   - `backend` フォルダに、Google Cloud Vision API のサービスアカウントキーを `service-account-key.json` という名前で配置します。

4. **バックエンドサーバーを起動**

   ```bash
   npm start
   ```

   バックエンドは通常、`http://localhost:8080` で起動されます。

---

## 環境変数の設定

プロジェクトのルートに `.env` ファイルを作成し、以下の環境変数を設定してください。

```plaintext
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
PORT=8080
```

`GOOGLE_APPLICATION_CREDENTIALS` は、Google Cloud Vision API のサービスアカウントキーのパスを指定します。

---

## 使用方法

1. **カードの処理**:

   - フロントエンドで「Capture Card」ボタンを押してカメラを起動し、クレジットカードや ID カードをキャプチャします。
   - その後、画像を送信してカードの情報を自動的に抽出します。

2. **API エンドポイント**:

   - `POST /process-credit-card`: クレジットカードの画像を処理します。
   - `POST /process-id-card`: ID カードの画像を処理します。

---

## ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) のもとで公開されています。
