# パースに関する処理

`getProperty.ts` , `getContents.ts` , `getEnvInfo.ts` の処理について記述します。

（まだ荒っぽい記述です。今後追記します。）

## 要素ペアの情報の記録 - `getProperty.ts`

### `pairProps` 型

- `begin` は要素ペアの begin 文字列についての情報。
  - `location` は begin の `content` 内の index
  - `str` は begin 文字列の内容
- `end` は要素ペアの end 文字列についての情報。 `begin` と同様。
- `nextDepth` は、 `innerParse` や `stepParse` 内で再帰呼び出しを行う際に、それに渡すべき `depth` の値。
- `pairType` は `proofParse` と `innerParse` で用いる。
  - 前者においては、考えている部分が一番外側のものかどうかを示す（ `undefined` のみしか返されない）
  - 後者においては、リストが `<ul>` か `<ol>` かを示す。

### `getProperty` 関数

指定された要素ペアに対して、 `pairProps` 型のデータのなす配列を返す。

引数について：

- `content` はデータ。 `pairs` は探索を行う要素ペアの配列。
- `isNested` はネストがあるかどうかで、 `true` なら `nextDepth` に `depth + 1` が格納される。
- `bracket` は `pairs` で指定された要素ペアが `\textbf{` と `}` の対のようになっているかどうか。
  - `{}` は通常の文の中でも用いられるから、その分を考慮して探索する必要がある。 `findBracket` 関数を用いる。

処理について：

- `pairType` は、 `pairs` で 2 つ以上指定された時に格納し、見つかったものが `pairs` で指定された要素ペアのうち何番目であるかを示す。1 つの場合は `undefined` 。

### `getEnvProperty` 関数

要素ペアのうち特に環境であるものについて、 `pairProps` 型のデータのなす配列を返す。

引数について：

- `envNames` で探索する環境名を指定する。

処理について：

- ネストがあるものとないもの両方について、 `getPairProperty` に値を渡して探索し、結果を連結して、最後に `begin.location` の順でソートする。
- 値を渡す際、 `getPairProperty` 内では正規表現オブジェクトが用いられているから、エスケープを注意する必要がある。

### `getLocation` 関数

指定された分離子の位置を返す（ `number` 型の配列）。ここで、 `avoid` で指定された範囲は避ける。

引数について：

- `str` は探索する分離子の名前。
- `avoid` は避ける範囲からなる配列。 `left` が区間の左端、 `right` が右端を示す。
  - データの形から、区間が左端・右端が開か閉かは関係しない。

処理について：

- `avoid` が空ならそのまま記録していく。空でないなら、区間を避けながら記録。

## content のパース - `getContents.ts`

### `Result` 型

flat content を分割したときに得られた 1 つの要素の情報を格納する。

- `content` ：分割した要素
- `isFocused` ： `true` ならこの要素が注目要素であること、 `false` なら注目外要素であることを示す。
- `focus` ：注目要素の情報
  - `depth` は depth
  - `type` は (i) リストが `<ul>` か `<ol>` か or (ii) `isOutermost` に用いる値 を示す。

### `getContents` 関数

flat content を受け取り、 `Result` 型のデータからなる配列を返す。

引数について：

- `property` は注目要素に関する `pairProps[]` 型のデータ。
- `isContainEnvName` は、注目要素と注目外要素で `content` を分割する際、 注目要素に begin 文字列と end 文字列を含めるかどうかを示す。
  - `align` 環境を考えるときは `true` 、それ以外は `false` になる。
- `needFocusInfo` は注目要素の情報を格納するかどうか。

処理について：

- 引数 `property` の情報を使うことで `content` を `([PE][FE])×n+[PE]` という形に分解できる。

### `getNestedContents` 関数

nested content を受け取り、 `Result[]` 型のデータからなる配列を返す。

引数について：

- `location` は分離子の位置。
- `sep` は分離子名。
- `property` ： `location` を得る際に `getLocation` に渡した、注目要素に関する `pairProps[]` 型のデータ。

処理について：

- `content` は `([sep])[FC][sep][FC]…[sep][FC]` （各 `[FC]` は flat content ）という形。 `[FC][sep]` のまとまりごとに考える。

  1. 考えている `C = [FC][sep]` 内に存在する注目要素の部分だけ `property` からとりだす。
  2. `C` の `[FC]` の部分をとりだして `flat` とおく。 `flat` は flat content であるから関数 `getContents` が適用できる。
  3. しかし、1. で取得した `property` の部分配列の `begin.location` と `end.location` プロパティは `content` における index である。よって、 `flat` における index に修正する必要がある。
  4. 以上のことを考慮して、 `Result[]` 型の変数 `result` に `C` に関する情報を格納する。

- 上で得た各情報をさらに配列に格納することで `Result[][]` 型のデータを返す。

## 定理環境の情報の取得 - `getEnvInfo.ts`

### `Info` 型

- `name` : 定理環境の名前（ `definition` , `proposition` , ...）
- `id` : ラベル名（ `\label{}` 内の文字列）
- `main` : 定理環境内の文字列
- `proof` : 証明環境内の文字列

### `getEnvInfo` 関数

定理環境をうけとり、 `Info` 型のデータからなる配列を返す。
