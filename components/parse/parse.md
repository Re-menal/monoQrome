# パースに関するコンポーネントについて

（まだ荒っぽい記述です。今後追記します。）

`/lib` 内の `parse.md` を先に参照してください。

## メイン処理 - `parse.tsx`

### `Parse` コンポーネント

全体を受け取る。

1. `%++` で `split` して、一番外側の環境で分割する。
2. 1 で得た情報を `getEnvsInfo` 関数に渡して、各環境の環境名・ラベル名・内容・証明を取得。
3. 各環境に対し、内容は `innerParse` に、証明は `proofParse` に（ `isOutermost` を `true` にして）渡す。

## 証明の処理 - `parse-proof.tsx`

### `ProofParse` コンポーネント

`content` , `depth` と、一番外側かどうかを示す `isOutermost` を受け取る。証明全体のパースを行う。

1. `%Step\d` で `split` して、 Step ごとにわける。
2. Step が 1 つなら `isWithTitle` を `false` 、複数なら `true` に設定する。
3. 各 Step について `stepParse` を呼び出す。 `isOutermost` はそのまま渡す。

### `StepParse` コンポーネント

`content` , `depth` , Step 名を付けるかどうかのフラグ `isWithTitle` と、一番外側かどうかを示す `isOutermost` を受け取る。証明の各ステップのパースを行う。 `content` は nested content である。

1. Step 名を付けるなら、その部分を取り出して `title` に設定し、 `content` を調節する。
2. 各 `\begin{oframed}` と `\end{oframed}` の要素ペアに対して、それぞれの位置を `envProperty` 関数を用いて `framedProperty` に記録する。
3. `oframed` 環境の中に存在しない `\par` の位置を `getLocation` 関数を用いて `parLocation` に記録する。
4. `parLocation` と `framedProperty` を `getNestedContents` 関数に渡して情報を `nestedResults` に記録する。

   1. `nestedResults` の第一階層の値は、各 `\par` で区切られた段落（これは flat content ）を `getContents` を用いてパースして得られた情報 `results`（ `Result[]` 型）である。
   2. `results` は flat content だから、focused element と plain element の列からなる。 `results` の各要素 `result` に対して、それが focused なら `proofParse` に渡し、plain なら `InnerParse` に渡す。

   - ここで、 `result.isFocused` が `true` のとき `result.focus.type` は `undefined` 、つまり falsy な値になる。よって、ここで呼び出す `proofParse` の `isOutermost` には `false` が渡されることになる。

5. 結果を `<ol>` で挟み、 `title` と一緒に `<div>` でまとめる。
   - `isOutermost` が `false` の場合、 `<details>` で挟んで返す。
   - `isOutermost` が `true` の場合そのまま返す。

## リストの処理 - `parse-inner.tsx`

### `InnerParse` コンポーネント

`content` , `depth` と `listType` を受け取る。環境内全体のパースを行う。

1. 深さ `depth` に当たる `itemize` 環境と `enumerate` 環境の位置を、 `envProperty` 関数を用いて `listProperty` に記録する。
2. 1 で記録した `itemize` 環境と `enumerate` 環境の中に存在しない `\item` の位置を、 `getLocation` 関数を用いて `itemLocation` に記録する。
3. `itemLocation` の要素数で場合分けする。

   (A) `itemLocation.length == 1` （i.e. 2. で探索した `\item` が見つからなかった）のとき：

   1. このときは (i) 一番外側の文章 か (ii) `\item` の中身の文章 のどちらか。すなわち、 `content` は flat content 。
   2. `getContents` 関数に `content` と `listProperty` を渡してパースし、情報を `results` に格納。ここで、ネストがある可能性があるため、 `needFocusInfo` を `true` にする。
   3. `results` の各要素 `result` に対し、それが focused element なら `innerParse` に渡す。plain element なら `paragraphParse` に渡す。
   4. 結果を `<div>` で包んで返す。

   (B) それ以外のとき：

   1. このときは `itemize` 環境か `enumerate` 環境の中身の文章。すなわち、分離子 `\item` を含む nested content 。
   2. `itemLocation` と `listProperty` を `getNestedContents` に渡して情報を `nestedResults` に格納する。
      1. `proofParse` と同様、 `nestedResults` の各要素 `results` は `\item` 内の flat content の情報である。
      2. よって、 `results` について (A) の 3. と同じ処理をする。
      3. 結果を `listType` で指定されたタグ `<ul>` or `<ol>` で挟んで返す。

## 本文の処理 - `parse-paragraph.tsx`

### `ParagraphParse` コンポーネント

`content` を受け取る。複数の段落からなる文章のパースを行う。

### `SentenceParse` コンポーネント

`content` を受け取る。 1 つの段落内の文章のパースを行う。とくに、 `align` 環境の処理を行う。

1. `align` 環境の位置を、 `envProperty` 関数を用いて `alignProperty` に記録する。
2. `content` は `align` 環境に関する flat content だから、 `getContents` 関数に `alignProperty` を渡し、情報を `results` に格納する。
3. `results` の各要素 `result` が focused なら katex を呼び出す。plain なら `textbfParse` に渡す。

### `TextbfParse` コンポーネント

`content` を受け取る。 `\textbf{}` の処理を行う。

1. `\textbf{}` の位置を、 `pairProperty` 関数を用いて `textbfLocation` に記録する。
2. `content` は flat content だから、 `getContents` 関数に `textbfLocation` を渡し、情報を `results` に格納する。
3. `results` の各要素 `result` が focused なら `inlineParse` に渡したあと `<b>` で囲む。plain ならそのまま `inlineParse` に渡す。

### `InlineParse` コンポーネント

`content` を受け取る。 `$` / `$` の処理を行う。

1. 要素ペア `$` / `$` の位置を `pairProps[]` 型の `inlineLocation` に記録する。
2. `content` は要素ペア `$` / `$` に関する flat content だから、 `getContents` 関数に `inlineLocation` を渡し、情報を `results` に格納する。
3. `results` の各要素 `result` が focused なら katex を呼び出す。plain なら `<span>` に包んで返す。
