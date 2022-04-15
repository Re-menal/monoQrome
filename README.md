# monoQrome

## TeX ファイルの記述法

### プリアンブル

`slug` , `id` , `title` , `date` の情報を TeX のプリアンブルに記述します。まず、各々の項目の内容・記述法は以下の通りです：

- `slug` : 記事の識別子です。URL は `/category/slug` という形になります。
- `id` : 記事の節番号です。記事が何章目かを `CN` 、 `CN` 章の何節目かを `SN` としたとき、 `CN.SN` という形で記述します。
- `title` : 記事のタイトルです。
- `date` : 記事の更新日時です。 `YYYY-MM-DD` という形で記述します。

そして、上の情報を TeX ファイルのプリアンブルの任意の場所に次のように記述します：

```LaTeX
%##
%slug:test
%id:1.1
%title:TEST PAGE
%date:2022-04-14
%##
```

この記述の前に、ファイル中に `%##` が含まれると処理が正常に行われません。

### 環境

証明を除く、定義、命題、補題、系などの定理環境は、間を `%++` によって区切る必要があります。それ以外の場所に `%++` が含まれると処理が正常に行われません。

- 例： 2 つの環境 `env1` , `env2` に対して次のようになります :

  ```LaTeX
  \begin{env1}
  hoge
  \end{env1}
  %++
  \begin{env2}
  fuga
  \end{env2}
  ```

証明 `proof` は例外となります。これは次のように記述します : 考えている証明 `proof` が定理環境 `env` に付随するものであるとき、

```LaTeX
\begin{env}
hoge
\end{env}
%--
\begin{proof}
fuga
\end{proof}
```

と記述します。これら以外の場所に `%--` が含まれると処理が正常に行われません。また、現在、 1 つの定理環境について 2 つ以上の証明 `proof` を処理することはできません。

次に、 itemize 環境と enumerate 環境についてです。これらを **リスト環境** と呼ぶことにします。 **リスト環境** の記述法は次の通りです：

- リスト環境 `list` が内側にいかなるリスト環境も含まない場合 : 通常通り記述します。
- リスト環境 `list` が内側に 1 つ以上リスト環境を含む場合 : まず、 `\begin{list}` と `\end{list}` の右側に `%1` を記述します。そして、 `list` の内側の各リスト環境 `listN` に対して、 `listN` が `list` を基準にして **深さ** `n` である場合、 `\begin{listN}` と `\end{end}` の右側に `%n` と記述します。

  - 例 1 :

    ```LaTeX
    \begin{list}%1
    \item \begin{list2}%2
          \item hoge
          \end{list2}%2
    \end{list}%1
    ```

  - 例 2 :

    ```LaTeX
    \begin{list}%1
    \item \begin{list2a}%2
          \item hoge
          \end{list2a}%2
    \item \begin{list2b}%2
          \item fuga
          \end{list2b}%2
    \end{list}%1
    ```

最後に `oframed` 環境についてです。これは証明 `proof` 内において、細部を折りたたみ要素 `<details>` 内に記述したい場合に用います。記述法はリスト環境の場合と同様です。すなわち：

- `oframed` 環境が内側にいかなる `oframed` 環境も含まない場合：通常通り記述します。
- `oframed` 環境が内側に 1 つ以上 `oframed` 環境を含む場合：まず、一番外側の `\begin{oframed}` と `\end{oframed}` の右側に `%1` を記述します。そして、その内側の各 `oframed` 環境に対して、それが一番外側を基準にして **深さ** `n` である場合、 `\begin{oframed}` と `\end{oframed}` の右側に `%n` と記述します。

  - 例 1 :

    ```LaTeX
    \begin{oframed}%1
      \begin{oframed}%2
      hoge
      \end{oframed}%2
    \end{oframed}%1
    ```

  - 例 2 :

    ```LaTeX
    \begin{oframed}%1
      \begin{oframed}%2
      hoge
      \end{oframed}%2
      \begin{oframed}%2
      fuga
      \end{oframed}%2
    \end{oframed}%1
    ```

### 証明環境

意味段落で分けて書きます。段落の間は `\par` で区切ります。

- 例 :

  ```LaTeX
  \begin{proof}
  hoge
  \par
  fuga
  \par
  foo
  \end{proof}
  ```

2 つ以上のステップからなる証明を記述する場合、次のように書きます：

```LaTeX
\begin{proof}
%Step1
ステップ 1 の名前
\par
hoge
\par
%Step2
ステップ 2 の名前
\par
fuga
\end{proof}
```

## TeX ファイルのパース

TeX ファイルのパース処理に関連するソースファイルは、 `/components/parse` 内のすべての `tsx` ファイルと `/lib` 内の `getProperty.ts` , `getContents.ts` , `getEnvInfo.ts` です。以降、パース処理の概略を説明します。

### 用語

いくつかの用語を導入します。ただし、あくまでも以降の説明の簡略化が目的であるため、すべてが厳密な定義であるとは限りません。

- 環境 `env` に対する `\begin{env}` / `\end{env}` や `\textbf{` / `}` 、 `$` / `$` など、ある 2 つの文字列の対になっている TeX の要素を **要素ペア** と呼びます。
- `\begin{env}` や `\textbf{` などの、要素ペアの左側の文字列のことを **begin 文字列** 、 `\end{hoge}` や `}` など要素ペアの右側の文字列のことを **end 文字列** と呼びます。

  - 例 1 : 環境 `env` の場合、要素ペアは `\begin{env}` / `\end{env}` です。よって、 `\begin{env}` は begin 文字列、 `\end{env}` は end 文字列です。

  - 例 2 : 太字 `\textbf{}` の場合、 `\textbf{` が begin 文字列、 `}` が end 文字列です。

- `\par` と `\item` を **分離子** と呼びます。
- ある要素ペア `[Begin]` / `[End]` に注目しているとします。文字列 `content` が `[hoge][Begin][fuga][End][hoge]…[hoge][Begin][fuga][End][hoge]` という形のとき、 `content` を **要素ペア `[Begin]` / `[End]` に関する** **flat content** と呼びます。

  - また、 `[foo]` に当たる部分を **注目外要素** （または **plain element** ）、 `[bar]` （場合によっては `[L][bar][R]` ）に当たる部分を **注目要素** （または **focused element** ）と呼びます。

  - 注目外要素を `[PE]` （plain element）、注目要素を `[FE]` （focused element）で表します。

- ある分離子 `[Sep]` と、ある要素ペア `[Begin]` , `[End]` に注目しているとする。文字列 `content` が `([Sep])[hoge][Sep]…[Sep][hoge]` という形かつ、各 `[hoge]` が要素ペア `[Begin]` / `[End]` に関する flat content であるとき、 `content` を **nested content** と呼びます。

### パース処理の概略

まず、次が前処理です：

1. プリアンブル内の情報と、 `document` 環境内の文字列 `content` を取り出します（ `separate.ts` ）。
2. `content` を定理環境ごとに分割します。また、定理環境が証明付きの場合、定理環境部分と証明部分で分割します（前者は `parse.tsx` 、後者は `getEnvInfo.ts` ）

以上の処理により、定理環境（と証明）ごとに考えればよいです。ただし、証明についてはステップごとに分ける処理が追加で必要になります。

具体的なパースについては、 flat content の処理が基本になります。 nested content は、それを分離子で分割することで flat content の列とみなせます。具体的には、次のような処理をすればよいです（ `getContents.ts` 内の `getNestedContents` 関数）：

1. nested content `content = ([Sep])[hoge][Sep]…[Sep][hoge]` を考えます。
2. `content` 内のすべての分離子 `[Sep]` の位置を記録します（ `getProperty.ts` 内の `getLocation` 関数を利用します）。
3. 上で得た情報を利用して `content` を分割します。

よって、 flat content の処理に帰着されました。 flat content の処理は次のようにします（ `getContents.ts` 内の `getContents` 関数）：

1. 要素ペア `[Begin]` / `[End]` に関する flat content `content = [hoge][Begin][fuga][End][hoge]…[hoge][Begin][fuga][End][hoge]` を考えます。
2. `content` 内のすべての要素ペア `[Begin]` / `[End]` の位置を記録します（ `getProperty.ts` 内の `getEnvProperty` 関数）。

   - ただし、実際には位置以外の情報も必要になります。詳細は `/lib` 内の `parse.md` を参照してください。

3. 上で得た情報を利用して、 `content` を注目要素と注目外要素に分割します。そして、それらを注目要素かそうでないかを示すフラグとともに配列に記録します。

以上の処理により、結果が格納された配列から順番に要素を取り出し、それが focused であるかどうかによって、例えば `<b></b>` で挟むかどうかを条件分岐する処理が可能になります。

### パースに関するコンポーネント

`/components/parse` 内のそれぞれファイルの役割の概要を述べます。詳細は先のディレクトリ内の `parse.md` を参照してください。

- `parse.tsx` : `document` 環境内の文字列全体を受け取り、処理の最終結果を返す、メインのコンポーネント `Parse` を含みます。後者は各ステップの処理、すなわち `oframed` 環境の部分を担当します。
- `parse-proof.tsx` : 証明のパースに関するコンポーネント `ProofParse` と `StepParse` を含みます。前者によって証明環境内の処理の最終結果が返されます。
- `parse-inner.tsx` : 各定理環境内の文章の処理の最終結果を返すコンポーネント `InnerParse` を含みます。これは特に、リスト環境の処理部分を担当します。
- `parse-paragraph.tsx` : 複数の段落からなる文章の処理の最終結果を返すコンポーネント `ParagraphParse` を提供します。これには、ディスプレイ数式の部分を担当する `SentenceParse` 、太字部分を担当する `TextbfParse` 、インライン数式の部分を担当する `InlineParse` が含まれます。
