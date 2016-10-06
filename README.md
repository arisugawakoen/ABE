# ABE
Ancient Bulletin-board Experience

## Description

フロントエンドをRiot.js,サーバサイドにNode.js + Expressを使用して懐かしい掲示板システムを作成しました。

## Demo

[実働環境](http://aliceriverpark.pw/article.html)

## Requirement

Node.jsが動作する環境が必要です。  
デフォルトのRDBはPostgreSQLですが、少しの修正でMySQL/MariaDBでも動作すると思います。  
[実働環境](http://aliceriverpark.pw/article.html)は[h2o](https://h2o.examp1e.net)をリバースプロキシとしていますが、動作させるだけなら特に必須ではありません。  

## Usage

#### 新規投稿

投稿一覧ページのフォームから投稿  

#### 返信

* 個別投稿ページのフォームから投稿
* 投稿一覧ページのフォームからでも、<<{:id}(idは自然数)を文中に含めれば返信できる

#### ハッシュタグ

*{英数字}を文中に含めるとハッシュタグとなる

## Install

    git clone
    cd ABE
    npm install
    node bin/sync
    cd public/js/tag
    ./compile.sh

## Contribution

1. Fork it ( http://github.com/arisugawakoen/ABE/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request

## Licence
[GPL-3.0](http://www.gnu.org/licenses/gpl-3.0.txt)

## Author
[arisugawakoen](http://aliceriverpark.pw)
