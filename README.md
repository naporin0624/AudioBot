# Discord Audio Player

## 使い方

### モジュールをインストール

```shell
npm install
```

or

```shell
yarn install
```

### 開発環境用にnodemonを入れると楽かも

```shell
npm install --save nodemon
```

or 

```shell
yarn global add nodemon
```

### コンフィグファイルを作る

```javascript
export default {
  token: "YOUR-BOT-TOKEN",
  niconico: {
    email: "YOUR-EMAIL",
    password: "YOUR-PASSWORD"
  }
}
```

### ビルド

```shell
npm run build
```

or 

```shell
yarn build
```

### run bot

```shell
node dist/app.js
```

## コマンド

### play

playコマンドを使うごとにリストに音楽がキューイングされます

```shell
play youtubeURL or niconicoURL or .mp3で終わるURL
```

### stop

再生中の音楽を止めてキューを削除します

```shell
stop
```

### pause

再生中の音楽を一時停止します

```shell
pause
```

### resume

一時停止した音楽を再生します

```shell
resume
```

おわり
